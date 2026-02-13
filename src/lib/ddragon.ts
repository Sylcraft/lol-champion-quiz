import { z } from "zod";

const versionsSchema = z.array(z.string().min(1));

const championSchema = z.object({
  id: z.string(),
  name: z.string(),
  title: z.string(),
  blurb: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const championsResponseSchema = z.object({
  data: z.record(z.string(), championSchema),
});

export async function fetchLatestDDragonVersion(): Promise<string> {
  const response = await fetch("https://ddragon.leagueoflegends.com/api/versions.json", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Unable to fetch Data Dragon versions (${response.status})`);
  }

  const parsed = versionsSchema.safeParse(await response.json());
  if (!parsed.success || parsed.data.length === 0) {
    throw new Error("Unexpected Data Dragon versions payload");
  }

  return parsed.data[0];
}

export async function fetchChampionsForVersion(version: string) {
  const response = await fetch(
    `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error(`Unable to fetch champion list (${response.status})`);
  }

  const parsed = championsResponseSchema.safeParse(await response.json());
  if (!parsed.success) {
    throw new Error("Unexpected Data Dragon champions payload");
  }

  return Object.values(parsed.data.data).map((champion) => ({
    champion_id: champion.id,
    version,
    payload: champion,
  }));
}

export function championIconUrl(version: string, championId: string): string {
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championId}.png`;
}
