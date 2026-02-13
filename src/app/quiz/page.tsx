"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type QuizQuestion = {
  id: string;
  prompt: string;
  options: Array<{ id: string; text: string }>;
};

type QuizState = {
  sessionId: string;
  question: QuizQuestion;
  progress: { answered: number; total: number };
};

type AnswerResponse =
  | {
      done: false;
      sessionId: string;
      progress: { answered: number; total: number };
      question: QuizQuestion;
    }
  | {
      done: true;
      sessionId: string;
      progress: { answered: number; total: number };
      result: {
        version: string;
        archetype: {
          slug: string;
          name: string;
          description: string;
          why: [string, string, string];
        };
        dominantAxes: [string, string];
        weakestAxis: string;
        summary: string;
        strengths: string;
        weakness: string;
        bullets: [string, string, string];
        mainChampion: {
          id: string;
          name: string;
          title: string;
          blurb: string;
          imageUrl: string;
        };
        alternatives: [
          { id: string; name: string; title: string; blurb: string; imageUrl: string },
          { id: string; name: string; title: string; blurb: string; imageUrl: string },
        ];
      };
    };

export default function QuizPage() {
  const router = useRouter();

  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const expectedSessionId = new URLSearchParams(window.location.search).get("sessionId");
    const raw = localStorage.getItem("lol_quiz_bootstrap");
    if (!raw) {
      setError("Session introuvable. Redemarre le quiz.");
      return;
    }

    const parsed = JSON.parse(raw) as QuizState;
    if (expectedSessionId && parsed.sessionId !== expectedSessionId) {
      setError("Session invalide.");
      return;
    }

    setQuizState(parsed);
  }, []);

  const progressText = useMemo(() => {
    if (!quizState) {
      return "";
    }
    return `${quizState.progress.answered}/${quizState.progress.total}`;
  }, [quizState]);

  const progressPercent = useMemo(() => {
    if (!quizState || quizState.progress.total === 0) {
      return 0;
    }
    return Math.round((quizState.progress.answered / quizState.progress.total) * 100);
  }, [quizState]);

  const submitAnswer = async (answerIndex: number) => {
    if (!quizState) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/quiz/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: quizState.sessionId, answerIndex }),
      });

      const payload = (await response.json()) as AnswerResponse | { error: unknown };
      if (!response.ok || !("done" in payload)) {
        throw new Error("Reponse invalide");
      }

      if (payload.done) {
        localStorage.setItem("lol_quiz_result", JSON.stringify(payload));
        localStorage.removeItem("lol_quiz_bootstrap");
        const params = new URLSearchParams({
          sessionId: payload.sessionId,
          champion: payload.result.mainChampion.id,
          arch: payload.result.archetype.slug,
          version: payload.result.version,
        });
        router.push(`/result?${params.toString()}`);
        return;
      }

      const nextState: QuizState = {
        sessionId: payload.sessionId,
        question: payload.question,
        progress: payload.progress,
      };

      setQuizState(nextState);
      localStorage.setItem("lol_quiz_bootstrap", JSON.stringify(nextState));
    } catch {
      setError("Impossible d envoyer la reponse.");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <main className="container">
        <p className="eyebrow">Session interrompue</p>
        <h1>Quiz</h1>
        <p className="error">{error}</p>
        <Link href="/" className="button-link">
          Revenir au depart
        </Link>
      </main>
    );
  }

  if (!quizState) {
    return (
      <main className="container">
        <p>Chargement de la session...</p>
      </main>
    );
  }

  return (
    <main className="container">
      <p className="eyebrow">Epreuve en cours</p>
      <h1>Quiz Champion</h1>
      <p className="subtitle">Progression: {progressText}</p>
      <div className="progress-shell" aria-hidden="true">
        <div className="progress-bar" style={{ width: `${progressPercent}%` }} />
      </div>
      <h2 className="question">{quizState.question.prompt}</h2>
      <div className="choices">
        {quizState.question.options.map((option, index) => (
          <button
            key={option.id}
            className="button secondary"
            disabled={loading}
            onClick={() => submitAnswer(index)}
          >
            {option.text}
          </button>
        ))}
      </div>
      {error ? <p className="error">{error}</p> : null}
    </main>
  );
}
