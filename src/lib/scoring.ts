import { AXES, QUESTION_BY_ID, QUESTIONS, type Axis, type QuizQuestion } from "@/lib/questions";

export const TOTAL_QUESTIONS = 10;

export type AxisScores = Record<Axis, number>;

export type QuizState = {
  asked: string[];
  scores: AxisScores;
};

export type PublicQuestion = {
  id: string;
  prompt: string;
  options: Array<{ id: string; text: string }>;
};

export function createEmptyScores(): AxisScores {
  return {
    audace: 0,
    lead: 0,
    social: 0,
    patience: 0,
    creativity: 0,
    calm: 0,
    ambition: 0,
    empathy: 0,
  };
}

export function sanitizeScores(value: unknown): AxisScores {
  const safe = createEmptyScores();
  if (!value || typeof value !== "object") {
    return safe;
  }

  for (const axis of AXES) {
    const raw = (value as Record<string, unknown>)[axis];
    if (typeof raw === "number" && Number.isFinite(raw)) {
      safe[axis] = raw;
    }
  }
  return safe;
}

export function mergeScores(base: AxisScores, delta: Partial<Record<Axis, number>>): AxisScores {
  const next = { ...base };
  for (const axis of AXES) {
    next[axis] += delta[axis] ?? 0;
  }
  return next;
}

export function getQuestionById(id: string): QuizQuestion | null {
  return QUESTION_BY_ID.get(id) ?? null;
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

function topAxes(scores: AxisScores, count: number): Axis[] {
  return [...AXES].sort((a, b) => scores[b] - scores[a]).slice(0, count);
}

export function chooseNextQuestion(state: QuizState, questions: QuizQuestion[] = QUESTIONS): QuizQuestion | null {
  const unanswered = questions.filter((question) => !state.asked.includes(question.id));
  if (unanswered.length === 0) {
    return null;
  }

  const uncertainty: Record<Axis, number> = Object.fromEntries(
    AXES.map((axis) => [axis, 1 / (1 + Math.abs(state.scores[axis]))]),
  ) as Record<Axis, number>;

  const dominant = new Set(topAxes(state.scores, 2));
  const ranked = unanswered
    .map((question) => {
      const uncertaintyScore = question.tags.reduce((sum, axis) => sum + uncertainty[axis], 0);
      const dominantBonus = question.tags.reduce((sum, axis) => sum + (dominant.has(axis) ? 0.2 : 0), 0);
      return {
        question,
        score: uncertaintyScore + dominantBonus,
      };
    })
    .sort((a, b) => b.score - a.score);

  const topCandidates = ranked.slice(0, 3).map((item) => item.question);
  return randomPick(topCandidates);
}
