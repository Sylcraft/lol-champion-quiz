import { z } from "zod";

export const startQuizBodySchema = z.object({
  playerName: z.string().trim().min(1).max(32).optional(),
});

export const answerQuizBodySchema = z.object({
  sessionId: z.string().uuid(),
  answerIndex: z.number().int().min(0).max(3),
});
