"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type ResultPayload = {
  done: true;
  sessionId: string;
  progress: { answered: number; total: number };
  result: {
    championId: string;
    name: string;
    title: string;
    blurb: string;
    version: string;
    imageUrl: string;
    reason: string;
  };
};

export default function ResultPage() {
  const [result] = useState<ResultPayload | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }
    const raw = localStorage.getItem("lol_quiz_result");
    return raw ? (JSON.parse(raw) as ResultPayload) : null;
  });

  if (!result) {
    return (
      <main className="container">
        <p className="eyebrow">Aucun oracle actif</p>
        <h1>Resultat</h1>
        <p>Aucun resultat trouve. Lance un quiz d abord.</p>
        <Link href="/" className="button-link">
          Commencer
        </Link>
      </main>
    );
  }

  return (
    <main className="container">
      <p className="eyebrow">Verdict de Runeterra</p>
      <h1>Ton champion est {result.result.name}</h1>
      <div className="result-hero">
        <Image
          src={result.result.imageUrl}
          alt={result.result.name}
          width={120}
          height={120}
          className="champion-icon"
          unoptimized
        />
        <div>
          <p className="subtitle">{result.result.title}</p>
          <p>{result.result.reason}</p>
        </div>
      </div>
      <p className="blurb">{result.result.blurb}</p>
      <p className="subtitle">Data Dragon version: {result.result.version}</p>
      <Link href="/" className="button-link">
        Refaire le quiz
      </Link>
    </main>
  );
}
