create extension if not exists pgcrypto;

create schema if not exists lol_quiz;

create or replace function lol_quiz.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists lol_quiz.sessions (
  id uuid primary key default gen_random_uuid(),
  player_name text,
  ddragon_version text not null,
  asked_question_ids text[] not null default '{}',
  current_question_id text,
  scores jsonb not null default '{}'::jsonb,
  answers_count integer not null default 0,
  completed boolean not null default false,
  result_champion_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists lol_quiz.champions_cache (
  champion_id text primary key,
  version text not null,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_sessions_updated_at
before update on lol_quiz.sessions
for each row
execute function lol_quiz.set_updated_at();

create trigger trg_champions_cache_updated_at
before update on lol_quiz.champions_cache
for each row
execute function lol_quiz.set_updated_at();
