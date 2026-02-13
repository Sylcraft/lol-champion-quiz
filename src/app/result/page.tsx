"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import ShareResult from "@/components/ShareResult";
import { ARCHETYPES } from "@/lib/archetypes";
import { championIconUrl } from "@/lib/ddragon";

type ResultPayload = {
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

function fromQueryParams(): ResultPayload | null {
  if (typeof window === "undefined") {
    return null;
  }

  const params = new URLSearchParams(window.location.search);
  const champion = params.get("champion");
  const arch = params.get("arch");
  const version = params.get("version");
  const sessionId = params.get("sessionId") ?? "shared";
  if (!champion || !arch || !version) {
    return null;
  }

  const archetype = ARCHETYPES.find((item) => item.slug === arch);
  if (!archetype) {
    return null;
  }

  return {
    done: true,
    sessionId,
    progress: { answered: 10, total: 10 },
    result: {
      version,
      archetype: {
        slug: archetype.slug,
        name: archetype.name,
        description: archetype.description,
        why: archetype.why,
      },
      dominantAxes: ["audace", "lead"],
      weakestAxis: "patience",
      summary: `Profil partage: ${archetype.name}.`,
      strengths: "Profil recupere via lien partage.",
      weakness: "Relance le quiz pour un diagnostic complet personnalise.",
      bullets: [...archetype.why],
      mainChampion: {
        id: champion,
        name: champion,
        title: "Champion de Runeterra",
        blurb: "",
        imageUrl: championIconUrl(version, champion),
      },
      alternatives: [
        {
          id: archetype.champions[1],
          name: archetype.champions[1],
          title: "Alternative",
          blurb: "",
          imageUrl: championIconUrl(version, archetype.champions[1]),
        },
        {
          id: archetype.champions[2],
          name: archetype.champions[2],
          title: "Alternative",
          blurb: "",
          imageUrl: championIconUrl(version, archetype.champions[2]),
        },
      ],
    },
  };
}

export default function ResultPage() {
  const [result] = useState<ResultPayload | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }
    const raw = localStorage.getItem("lol_quiz_result");
    if (raw) {
      return JSON.parse(raw) as ResultPayload;
    }
    return fromQueryParams();
  });

  const shareUrl = useMemo(() => {
    if (!result || typeof window === "undefined") {
      return "";
    }
    const params = new URLSearchParams({
      champion: result.result.mainChampion.id,
      arch: result.result.archetype.slug,
      version: result.result.version,
      sessionId: result.sessionId,
    });
    return `${window.location.origin}/result?${params.toString()}`;
  }, [result]);

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
      <h1>{result.result.archetype.name}</h1>
      <p className="subtitle">{result.result.archetype.description}</p>

      <p>{result.result.summary}</p>
      <p>{result.result.strengths}</p>
      <p>{result.result.weakness}</p>

      <ul className="result-list">
        {result.result.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>

      <div className="champ-grid">
        <article className="champ-card main">
          <Image
            src={result.result.mainChampion.imageUrl}
            alt={result.result.mainChampion.name}
            width={96}
            height={96}
            className="champion-icon"
            unoptimized
          />
          <h2>{result.result.mainChampion.name}</h2>
          <p className="subtitle">{result.result.mainChampion.title}</p>
        </article>

        {result.result.alternatives.map((champ) => (
          <article className="champ-card" key={champ.id}>
            <Image src={champ.imageUrl} alt={champ.name} width={80} height={80} className="champion-icon" unoptimized />
            <h2>{champ.name}</h2>
            <p className="subtitle">{champ.title}</p>
          </article>
        ))}
      </div>

      {shareUrl ? (
        <ShareResult
          title={`Mon archetype LoL: ${result.result.archetype.name}`}
          text={`Je suis ${result.result.archetype.name} avec ${result.result.mainChampion.name} en champion principal.`}
          url={shareUrl}
        />
      ) : null}

      <p className="subtitle">Data Dragon version: {result.result.version}</p>
      <Link href="/" className="button-link">
        Refaire le quiz
      </Link>
    </main>
  );
}
