import { QUESTIONS, QUESTION_BY_ID, ROLES, type QuizQuestion, type Role } from "@/lib/questions";

export const TOTAL_QUESTIONS = 10;

export type RoleScores = Record<Role, number>;

export type PublicQuestion = {
  id: string;
  prompt: string;
  options: Array<{ id: string; text: string }>;
};

type ChampionPayload = {
  id: string;
  name: string;
  title: string;
  blurb?: string;
  tags?: string[];
};

export type ChampionCacheRow = {
  champion_id: string;
  version: string;
  payload: ChampionPayload;
};

export function createEmptyScores(): RoleScores {
  return {
    Fighter: 0,
    Tank: 0,
    Mage: 0,
    Assassin: 0,
    Support: 0,
    Marksman: 0,
  };
}

export function mergeScores(base: RoleScores, delta: Partial<Record<Role, number>>): RoleScores {
  const next = { ...base };
  for (const role of ROLES) {
    next[role] += delta[role] ?? 0;
  }
  return next;
}

export function sanitizeScores(value: unknown): RoleScores {
  const safe = createEmptyScores();
  if (!value || typeof value !== "object") {
    return safe;
  }

  for (const role of ROLES) {
    const raw = (value as Record<string, unknown>)[role];
    if (typeof raw === "number" && Number.isFinite(raw)) {
      safe[role] = raw;
    }
  }

  return safe;
}

export function toPublicQuestion(question: QuizQuestion): PublicQuestion {
  return {
    id: question.id,
    prompt: question.prompt,
    options: question.options.map((option) => ({ id: option.id, text: option.text })),
  };
}

function randomPick<T>(items: T[]): T | null {
  if (items.length === 0) {
    return null;
  }
  return items[Math.floor(Math.random() * items.length)] ?? null;
}

export function getQuestionById(id: string): QuizQuestion | null {
  return QUESTION_BY_ID.get(id) ?? null;
}

export function pickNextQuestion(askedQuestionIds: string[], scores: RoleScores): QuizQuestion | null {
  const unanswered = QUESTIONS.filter((question) => !askedQuestionIds.includes(question.id));
  if (unanswered.length === 0) {
    return null;
  }

  if (askedQuestionIds.length === 0) {
    return randomPick(unanswered);
  }

  const ranked = [...ROLES].sort((a, b) => scores[b] - scores[a]);
  const top = ranked[0];
  const second = ranked[1];
  const closeMatch = Math.abs(scores[top] - scores[second]) <= 2;

  const preferred = unanswered.filter((question) => {
    if (closeMatch) {
      return question.focusRoles.includes(top) && question.focusRoles.includes(second);
    }
    return question.focusRoles.includes(top);
  });

  return randomPick(preferred.length > 0 ? preferred : unanswered);
}

function bestRole(scores: RoleScores): Role {
  return [...ROLES].sort((a, b) => scores[b] - scores[a])[0];
}

export function championReason(championName: string, scores: RoleScores): string {
  const ranked = [...ROLES].sort((a, b) => scores[b] - scores[a]);
  const top = ranked[0];
  const second = ranked[1];
  return `${championName} match ton style ${top.toLowerCase()} avec une touche ${second.toLowerCase()}.`;
}

export function pickChampion(champions: ChampionCacheRow[], scores: RoleScores): ChampionCacheRow | null {
  if (champions.length === 0) {
    return null;
  }

  const topRole = bestRole(scores);
  const tagged = champions.filter((champion) =>
    (champion.payload.tags ?? []).some((tag) => tag.toLowerCase() === topRole.toLowerCase()),
  );

  if (tagged.length > 0) {
    return randomPick(tagged);
  }

  return randomPick(champions);
}
