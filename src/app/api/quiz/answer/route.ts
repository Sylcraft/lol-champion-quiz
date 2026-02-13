import { NextResponse } from "next/server";
import { answerQuizBodySchema } from "@/lib/api-schemas";
import { championIconUrl, fetchChampionsForVersion } from "@/lib/ddragon";
import {
  championReason,
  createEmptyScores,
  getQuestionById,
  mergeScores,
  pickChampion,
  pickNextQuestion,
  sanitizeScores,
  toPublicQuestion,
  TOTAL_QUESTIONS,
  type ChampionCacheRow,
} from "@/lib/quiz-engine";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

async function getChampions(version: string): Promise<ChampionCacheRow[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .schema("lol_quiz")
    .from("champions_cache")
    .select("champion_id, version, payload")
    .eq("version", version);

  if (error) {
    throw error;
  }

  if ((data ?? []).length > 0) {
    return data as ChampionCacheRow[];
  }

  const fresh = await fetchChampionsForVersion(version);
  const { error: upsertError } = await supabase
    .schema("lol_quiz")
    .from("champions_cache")
    .upsert(fresh, { onConflict: "champion_id" });

  if (upsertError) {
    throw upsertError;
  }

  return fresh;
}

export async function POST(request: Request) {
  try {
    const parsedBody = answerQuizBodySchema.safeParse(await request.json());
    if (!parsedBody.success) {
      return NextResponse.json({ error: parsedBody.error.flatten() }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data: session, error: readError } = await supabase
      .schema("lol_quiz")
      .from("sessions")
      .select("id, ddragon_version, current_question_id, asked_question_ids, scores, answers_count, completed")
      .eq("id", parsedBody.data.sessionId)
      .single();

    if (readError || !session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (session.completed) {
      return NextResponse.json({ error: "Session already completed" }, { status: 409 });
    }

    const currentQuestion = getQuestionById(session.current_question_id);
    if (!currentQuestion) {
      return NextResponse.json({ error: "Invalid session state" }, { status: 500 });
    }

    const selectedOption = currentQuestion.options[parsedBody.data.answerIndex];
    if (!selectedOption) {
      return NextResponse.json({ error: "Invalid answer index for this question" }, { status: 400 });
    }

    const currentScores = sanitizeScores(session.scores ?? createEmptyScores());
    const nextScores = mergeScores(currentScores, selectedOption.scores);
    const askedQuestionIds = Array.from(new Set([...(session.asked_question_ids ?? []), currentQuestion.id]));
    const answersCount = Number(session.answers_count ?? 0) + 1;

    if (answersCount >= TOTAL_QUESTIONS) {
      const champions = await getChampions(session.ddragon_version);
      const champion = pickChampion(champions, nextScores);

      if (!champion) {
        return NextResponse.json({ error: "Champion pool unavailable" }, { status: 500 });
      }

      const { error: updateError } = await supabase
        .schema("lol_quiz")
        .from("sessions")
        .update({
          asked_question_ids: askedQuestionIds,
          scores: nextScores,
          answers_count: answersCount,
          current_question_id: null,
          completed: true,
          result_champion_id: champion.champion_id,
        })
        .eq("id", session.id);

      if (updateError) {
        throw updateError;
      }

      return NextResponse.json({
        done: true,
        sessionId: session.id,
        progress: { answered: answersCount, total: TOTAL_QUESTIONS },
        result: {
          championId: champion.champion_id,
          name: champion.payload.name,
          title: champion.payload.title,
          blurb: champion.payload.blurb ?? "",
          version: champion.version,
          imageUrl: championIconUrl(champion.version, champion.champion_id),
          reason: championReason(champion.payload.name, nextScores),
        },
      });
    }

    const nextQuestion = pickNextQuestion(askedQuestionIds, nextScores);
    if (!nextQuestion) {
      return NextResponse.json({ error: "No next question available" }, { status: 500 });
    }

    const { error: updateError } = await supabase
      .schema("lol_quiz")
      .from("sessions")
      .update({
        asked_question_ids: askedQuestionIds,
        scores: nextScores,
        answers_count: answersCount,
        current_question_id: nextQuestion.id,
      })
      .eq("id", session.id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      done: false,
      sessionId: session.id,
      progress: { answered: answersCount, total: TOTAL_QUESTIONS },
      question: toPublicQuestion(nextQuestion),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
