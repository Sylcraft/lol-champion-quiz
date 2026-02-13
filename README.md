# LoL Champion Quiz (V2)

Quiz personnalite League of Legends avec selection adaptative, archetypes et partage social.

## Stack

- Next.js (App Router) + TypeScript + ESLint
- API routes server-side (`/api/quiz/start`, `/api/quiz/answer`)
- Supabase PostgreSQL (schema `lol_quiz` + migration SQL)
- Data Dragon pour version/champions/images (sans cle API)
- Validation Zod cote API

## Prerequis

- Node.js >= 20
- npm
- Supabase projet configure

Le repo inclut `.nvmrc` avec `22`.

## Setup

1. Installer les deps: `npm install`
2. Creer `.env.local` (voir variables ci-dessous)
3. Appliquer la migration SQL `supabase/migrations/202602130001_init_lol_quiz.sql`
4. Lancer: `npm run dev`

## Fonctionnalites V2

- Banque de 20 questions personnalite (2 a 4 choix par question)
- Run court: 10 questions max par partie
- Selection adaptative des questions (incertitude par axe + bonus axes dominants)
- Resultat enrichi:
  - archetype (nom + description)
  - 3 raisons personnalisees
  - 1 champion principal + 2 alternatives
- Partage social:
  - Web Share API (mobile)
  - fallback copie lien + liens X/WhatsApp/Reddit
  - URL partageable: `/result?champion=...&arch=...&version=...`

## Variables d environnement

Creer `.env.local`:

```env
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

Important: `SUPABASE_SERVICE_ROLE_KEY` reste uniquement cote serveur (routes API), jamais exposee au navigateur.

## Data Dragon

Version la plus recente:

- `https://ddragon.leagueoflegends.com/api/versions.json`

Icone champion:

- `https://ddragon.leagueoflegends.com/cdn/{version}/img/champion/{ChampionId}.png`

Liste champions (utilisee pour le cache):

- `https://ddragon.leagueoflegends.com/cdn/{version}/data/en_US/champion.json`

## Flux API

- `POST /api/quiz/start`
- Cree une session dans `lol_quiz.sessions`
- Recupere la version Data Dragon
- Remplit `lol_quiz.champions_cache` si necessaire
- Retourne la premiere question

- `POST /api/quiz/answer`
- Valide la reponse avec zod
- Met a jour le score
- Choisit la question suivante de maniere adaptative
- Retourne le resultat enrichi apres 10 questions
