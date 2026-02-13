import { NextResponse } from "next/server";
import { startQuizBodySchema } from "@/lib/api-schemas";
import { fetchChampionsForVersion, fetchLatestDDragonVersion } from "@/lib/ddragon";
import { chooseNextQuestion, createEmptyScores, toPublicQuestion, TOTAL_QUESTIONS } from "@/lib/scoring";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

async function ensureChampionCache(version: string) {
  const supabase = getSupabaseAdmin();
  const { data: existing, error: readError } = await supabase
    .schema("lol_quiz")
    .from("champions_cache")
    .select("champion_id")
    .eq("version", version)
    .limit(1);

  if (readError) {
    throw readError;
  }

  if ((existing ?? []).length > 0) {
    return;
  }

  const champions = await fetchChampionsForVersion(version);
  const { error: upsertError } = await supabase
    .schema("lol_quiz")
    .from("champions_cache")
    .upsert(champions, { onConflict: "champion_id" });

  if (upsertError) {
    throw upsertError;
  }
}

export async function POST(request: Request) {
  try {
    const parsedBody = startQuizBodySchema.safeParse(await request.json().catch(() => ({})));
    if (!parsedBody.success) {
      return NextResponse.json({ error: parsedBody.error.flatten() }, { status: 400 });
    }

    const version = await fetchLatestDDragonVersion();
    await ensureChampionCache(version);

    const firstQuestion = chooseNextQuestion({
      asked: [],
      scores: createEmptyScores(),
    });
    if (!firstQuestion) {
      return NextResponse.json({ error: "No quiz question available" }, { status: 500 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .schema("lol_quiz")
      .from("sessions")
      .insert({
        player_name: parsedBody.data.playerName ?? null,
        ddragon_version: version,
        current_question_id: firstQuestion.id,
        scores: createEmptyScores(),
      })
      .select("id")
      .single();

    if (error || !data) {
      throw error ?? new Error("Unable to create session");
    }

    return NextResponse.json({
      sessionId: data.id,
      question: toPublicQuestion(firstQuestion),
      progress: { answered: 0, total: TOTAL_QUESTIONS },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
