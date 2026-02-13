import { championIconUrl, type ChampionCacheRow } from "@/lib/ddragon";
import { AXES, type Axis } from "@/lib/questions";
import { type AxisScores } from "@/lib/scoring";

type Archetype = {
  slug: string;
  name: string;
  description: string;
  why: [string, string, string];
  champions: [string, string, string];
  profile: Record<Axis, number>;
};

const baseProfile = (): Record<Axis, number> => ({
  audace: 0,
  lead: 0,
  social: 0,
  patience: 0,
  creativity: 0,
  calm: 0,
  ambition: 0,
  empathy: 0,
});

export const ARCHETYPES: Archetype[] = [
  {
    slug: "protecteur",
    name: "Protecteur",
    description:
      "Tu stabilises les situations tendues et tu securises les autres. Ton impact vient de ta constance et de ta fiabilite.",
    why: ["Tu gardes ton calme quand ca chauffe.", "Tu privilegies la cohesion.", "Tu construis sur le long terme."],
    champions: ["Braum", "Shen", "Taric"],
    profile: { ...baseProfile(), empathy: 3, calm: 3, patience: 3, social: 2, lead: 1 },
  },
  {
    slug: "playmaker",
    name: "Playmaker",
    description:
      "Tu aimes ouvrir des opportunites et creer le momentum. Tu combines initiative et lecture rapide du contexte.",
    why: ["Tu sais provoquer le bon declic.", "Tu assumes les decisions difficiles.", "Tu energises ton equipe."],
    champions: ["Rakan", "LeeSin", "Ahri"],
    profile: { ...baseProfile(), audace: 3, lead: 2, social: 2, creativity: 2, ambition: 1 },
  },
  {
    slug: "stratege",
    name: "Stratege",
    description:
      "Tu vois les patterns avant les autres et tu structures des plans robustes. Tu preferes les victoires propres aux coups de poker.",
    why: ["Tu analyses finement les options.", "Tu optimises chaque etape.", "Tu imposes une vision claire."],
    champions: ["Orianna", "Azir", "TwistedFate"],
    profile: { ...baseProfile(), calm: 3, patience: 2, creativity: 2, lead: 2, ambition: 1 },
  },
  {
    slug: "trickster",
    name: "Trickster",
    description:
      "Tu adores surprendre, contourner les attentes et trouver l angle inattendu. Tu transformes le chaos en opportunite.",
    why: ["Tu improvises tres vite.", "Tu as un fort instinct tactique.", "Tu n as pas peur d oser."],
    champions: ["LeBlanc", "Shaco", "Ekko"],
    profile: { ...baseProfile(), audace: 3, creativity: 3, ambition: 2, calm: 1 },
  },
  {
    slug: "competiteur",
    name: "Competiteur",
    description:
      "Tu es anime par la performance et la progression continue. Tu te fixes des standards eleves et tu tires le niveau vers le haut.",
    why: ["Tu recherches l excellence.", "Tu gardes une forte discipline.", "Tu avances meme sous pression."],
    champions: ["Vayne", "Draven", "Riven"],
    profile: { ...baseProfile(), ambition: 3, audace: 2, lead: 1, patience: 1, calm: 1 },
  },
  {
    slug: "zen-support",
    name: "Zen Support",
    description:
      "Tu apportes de la clarte et de l equilibre autour de toi. Tu eleves le collectif en restant ancre et attentif aux autres.",
    why: ["Tu fais redescendre la pression.", "Tu ecoutes vraiment.", "Tu facilites la collaboration."],
    champions: ["Janna", "Soraka", "Nami"],
    profile: { ...baseProfile(), empathy: 3, social: 2, calm: 3, patience: 2 },
  },
  {
    slug: "visionnaire",
    name: "Visionnaire",
    description:
      "Tu penses loin et tu imagines des approches nouvelles. Tu combines curiosite, sens du concept et execution concrete.",
    why: [
      "Tu relies les idees entre elles.",
      "Tu proposes des solutions originales.",
      "Tu donnes du sens a l action.",
    ],
    champions: ["Heimerdinger", "Zilean", "Hwei"],
    profile: { ...baseProfile(), creativity: 3, lead: 1, calm: 1, ambition: 2, social: 1 },
  },
  {
    slug: "catalyseur",
    name: "Catalyseur",
    description:
      "Tu acceleres les dynamiques de groupe et tu transformes l energie en action. Tu crées un elan qui embarque les autres.",
    why: ["Tu mets de l intensite positive.", "Tu prends des initiatives visibles.", "Tu rends les autres plus audacieux."],
    champions: ["Vi", "Samira", "Kayn"],
    profile: { ...baseProfile(), social: 2, audace: 2, ambition: 2, lead: 2 },
  },
];

type ChampionCard = {
  id: string;
  name: string;
  title: string;
  blurb: string;
  imageUrl: string;
};

export type QuizResult = {
  archetype: {
    slug: string;
    name: string;
    description: string;
    why: [string, string, string];
  };
  dominantAxes: [Axis, Axis];
  weakestAxis: Axis;
  summary: string;
  strengths: string;
  weakness: string;
  bullets: [string, string, string];
  mainChampion: ChampionCard;
  alternatives: [ChampionCard, ChampionCard];
};

function rankAxes(scores: AxisScores): Axis[] {
  return [...AXES].sort((a, b) => scores[b] - scores[a]);
}

function axisLabel(axis: Axis): string {
  return axis;
}

function championCard(champion: ChampionCacheRow, version: string): ChampionCard {
  return {
    id: champion.champion_id,
    name: champion.payload.name,
    title: champion.payload.title,
    blurb: champion.payload.blurb ?? "",
    imageUrl: championIconUrl(version, champion.champion_id),
  };
}

function fallbackChampion(id: string, version: string): ChampionCard {
  return {
    id,
    name: id,
    title: "Champion de Runeterra",
    blurb: "",
    imageUrl: championIconUrl(version, id),
  };
}

function scoreArchetype(scores: AxisScores, archetype: Archetype): number {
  return AXES.reduce((sum, axis) => sum + scores[axis] * archetype.profile[axis], 0);
}

function pickArchetype(scores: AxisScores): Archetype {
  return [...ARCHETYPES].sort((a, b) => scoreArchetype(scores, b) - scoreArchetype(scores, a))[0];
}

export function computeResult(scores: AxisScores, champions: ChampionCacheRow[], version: string): QuizResult {
  const orderedAxes = rankAxes(scores);
  const dominantAxes: [Axis, Axis] = [orderedAxes[0], orderedAxes[1]];
  const weakestAxis = orderedAxes[orderedAxes.length - 1];
  const archetype = pickArchetype(scores);

  const byId = new Map(champions.map((champion) => [champion.champion_id, champion]));
  const [mainId, alt1Id, alt2Id] = archetype.champions;

  const mainChampion = byId.has(mainId)
    ? championCard(byId.get(mainId) as ChampionCacheRow, version)
    : fallbackChampion(mainId, version);
  const alt1 = byId.has(alt1Id)
    ? championCard(byId.get(alt1Id) as ChampionCacheRow, version)
    : fallbackChampion(alt1Id, version);
  const alt2 = byId.has(alt2Id)
    ? championCard(byId.get(alt2Id) as ChampionCacheRow, version)
    : fallbackChampion(alt2Id, version);

  const summary = `Profil ${archetype.name}: tu combines surtout ${axisLabel(dominantAxes[0])} et ${axisLabel(
    dominantAxes[1],
  )}, avec une approche plus discrete sur ${axisLabel(weakestAxis)}.`;

  const strengths = `Tes points forts: ${axisLabel(dominantAxes[0])}, ${axisLabel(dominantAxes[1])}. Tu sais transformer ces qualites en impact concret.`;
  const weakness = `Point a travailler: ${axisLabel(weakestAxis)}. Le renforcer peut rendre ton style encore plus complet.`;

  const bullets: [string, string, string] = [
    `Tu performes mieux quand tu peux exprimer ${axisLabel(dominantAxes[0])}.`,
    `Ton style gagne en valeur des que ${axisLabel(dominantAxes[1])} est sollicite.`,
    `Un petit travail sur ${axisLabel(weakestAxis)} te fera passer un cap.`,
  ];

  return {
    archetype: {
      slug: archetype.slug,
      name: archetype.name,
      description: archetype.description,
      why: archetype.why,
    },
    dominantAxes,
    weakestAxis,
    summary,
    strengths,
    weakness,
    bullets,
    mainChampion,
    alternatives: [alt1, alt2],
  };
}
