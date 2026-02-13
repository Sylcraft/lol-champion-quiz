"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type StartResponse = {
  sessionId: string;
  question: {
    id: string;
    prompt: string;
    options: Array<{ id: string; text: string }>;
  };
  progress: { answered: number; total: number };
};

export default function StartPage() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startQuiz = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/quiz/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName: playerName.trim() || undefined }),
      });

      const payload = (await response.json()) as StartResponse | { error: unknown };
      if (!response.ok || !("sessionId" in payload)) {
        throw new Error("Impossible de demarrer le quiz");
      }

      localStorage.setItem("lol_quiz_bootstrap", JSON.stringify(payload));
      localStorage.removeItem("lol_quiz_result");
      router.push(`/quiz?sessionId=${payload.sessionId}`);
    } catch {
      setError("Erreur au demarrage. Verifie ta config Supabase.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <p className="eyebrow">Runeterra personality scan</p>
      <h1>Quel champion LoL suis-je ?</h1>
      <p className="subtitle">10 questions adaptatives pour capturer ton temperament.</p>
      <label htmlFor="playerName">Pseudo (optionnel)</label>
      <input
        id="playerName"
        className="input"
        placeholder="Ex: MidDiff97"
        value={playerName}
        onChange={(event) => setPlayerName(event.target.value)}
      />
      <button className="button" onClick={startQuiz} disabled={loading}>
        {loading ? "Ouverture du portail..." : "Entrer dans le quiz"}
      </button>
      {error ? <p className="error">{error}</p> : null}
    </main>
  );
}
