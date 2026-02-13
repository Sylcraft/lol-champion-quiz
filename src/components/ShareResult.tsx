"use client";

import { useMemo, useState } from "react";

type ShareResultProps = {
  title: string;
  text: string;
  url: string;
};

export default function ShareResult({ title, text, url }: ShareResultProps) {
  const [copied, setCopied] = useState(false);
  const canWebShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  const encodedText = useMemo(() => encodeURIComponent(text), [text]);
  const encodedUrl = useMemo(() => encodeURIComponent(url), [url]);
  const encodedTitle = useMemo(() => encodeURIComponent(title), [title]);

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
  const redditUrl = `https://www.reddit.com/submit?title=${encodedTitle}&url=${encodedUrl}`;

  const onShare = async () => {
    if (!canWebShare) {
      return;
    }
    await navigator.share({ title, text, url });
  };

  const onCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="share-box">
      <p className="subtitle">Partager ton resultat</p>
      <div className="share-actions">
        {canWebShare ? (
          <button className="button" onClick={onShare}>
            Partager
          </button>
        ) : null}
        <button className="button secondary compact" onClick={onCopy}>
          {copied ? "Lien copie" : "Copier le lien"}
        </button>
        <a className="button secondary compact" href={twitterUrl} target="_blank" rel="noopener noreferrer">
          X/Twitter
        </a>
        <a className="button secondary compact" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          WhatsApp
        </a>
        <a className="button secondary compact" href={redditUrl} target="_blank" rel="noopener noreferrer">
          Reddit
        </a>
      </div>
    </section>
  );
}
