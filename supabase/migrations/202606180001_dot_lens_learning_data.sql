-- Dot Lens for UFIT Science Accessibility
-- Run this migration in the Supabase SQL Editor for project:
-- https://fwcriutfmorbukfmxfwr.supabase.co

create extension if not exists pgcrypto;

create table if not exists public.science_lessons (
  id text primary key,
  title text not null,
  subtitle text not null,
  grade text not null,
  locale text not null default 'pt-BR',
  duration_minutes integer not null check (duration_minutes > 0),
  lesson_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.demo_sessions (
  id uuid primary key,
  lesson_id text not null references public.science_lessons(id),
  source text not null default 'ufit-smart-board',
  application_version text not null default 'poc-0.2',
  browser_locale text,
  started_at timestamptz not null default now(),
  last_event_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.learning_events (
  id bigint generated always as identity primary key,
  client_event_id uuid not null unique,
  session_id uuid not null references public.demo_sessions(id) on delete cascade,
  lesson_id text not null references public.science_lessons(id),
  event_type text not null check (
    event_type in (
      'session_started',
      'lesson_selected',
      'lesson_shown',
      'recognition_completed',
      'tactile_generated',
      'captions_enabled',
      'quiz_started',
      'quiz_answered',
      'library_saved',
      'audio_played',
      'function_key_pressed'
    )
  ),
  demo_step integer not null check (demo_step between 1 and 6),
  payload jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  received_at timestamptz not null default now()
);

create index if not exists learning_events_session_idx
  on public.learning_events(session_id, occurred_at desc);
create index if not exists learning_events_lesson_type_idx
  on public.learning_events(lesson_id, event_type, occurred_at desc);

create table if not exists public.recognition_runs (
  id bigint generated always as identity primary key,
  client_event_id uuid not null unique,
  session_id uuid not null references public.demo_sessions(id) on delete cascade,
  lesson_id text not null references public.science_lessons(id),
  model_name text not null default 'dot-lens-multimodal-poc',
  confidence numeric(5,2),
  detected_objects text[] not null default '{}',
  text_blocks integer not null default 0,
  quiz_items integer not null default 0,
  processing_ms integer,
  result_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.accessible_outputs (
  id bigint generated always as identity primary key,
  client_event_id uuid not null unique,
  session_id uuid not null references public.demo_sessions(id) on delete cascade,
  lesson_id text not null references public.science_lessons(id),
  output_type text not null check (
    output_type in ('tactile_audio', 'captions_summary', 'accessible_quiz')
  ),
  locale text not null default 'pt-BR',
  generation_ms integer,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.quiz_attempts (
  id bigint generated always as identity primary key,
  client_event_id uuid not null unique,
  session_id uuid not null references public.demo_sessions(id) on delete cascade,
  lesson_id text not null references public.science_lessons(id),
  question text not null,
  selected_index integer not null,
  correct_index integer not null,
  is_correct boolean not null,
  response_ms integer,
  answer_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.tactile_library_assets (
  id uuid primary key default gen_random_uuid(),
  lesson_id text not null references public.science_lessons(id),
  title text not null,
  version text not null,
  grade text,
  locale text not null default 'pt-BR',
  tactile_pages integer not null default 1,
  tags text[] not null default '{}',
  generated_from_session uuid references public.demo_sessions(id) on delete set null,
  package_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (lesson_id, version)
);

insert into public.science_lessons (
  id,
  title,
  subtitle,
  grade,
  duration_minutes,
  lesson_data
)
values
  (
    'plant',
    'Plant Structure',
    'Estrutura das plantas',
    'Grade 5',
    12,
    '{"subject":"Biology","unit":"02","topics":["roots","stem","leaves","flower"]}'::jsonb
  ),
  (
    'solar',
    'Solar System',
    'O sistema solar',
    'Grade 6',
    15,
    '{"subject":"Astronomy","unit":"05","topics":["sun","orbits","planets","earth"]}'::jsonb
  ),
  (
    'water',
    'Water Cycle',
    'O ciclo da água',
    'Grade 5',
    11,
    '{"subject":"Earth Science","unit":"03","topics":["evaporation","condensation","precipitation","collection"]}'::jsonb
  )
on conflict (id) do update set
  title = excluded.title,
  subtitle = excluded.subtitle,
  grade = excluded.grade,
  duration_minutes = excluded.duration_minutes,
  lesson_data = excluded.lesson_data,
  updated_at = now();

alter table public.science_lessons enable row level security;
alter table public.demo_sessions enable row level security;
alter table public.learning_events enable row level security;
alter table public.recognition_runs enable row level security;
alter table public.accessible_outputs enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.tactile_library_assets enable row level security;

drop policy if exists "science lessons are publicly readable" on public.science_lessons;
create policy "science lessons are publicly readable"
  on public.science_lessons
  for select
  to anon, authenticated
  using (true);

drop policy if exists "library assets are publicly readable" on public.tactile_library_assets;
create policy "library assets are publicly readable"
  on public.tactile_library_assets
  for select
  to anon, authenticated
  using (true);

grant select on public.science_lessons to anon, authenticated;
grant select on public.tactile_library_assets to anon, authenticated;

-- All telemetry writes go through this constrained RPC.
-- This keeps direct insert/update access to the data tables closed.
create or replace function public.record_dot_lens_event(
  p_client_event_id uuid,
  p_session_id uuid,
  p_lesson_id text,
  p_event_type text,
  p_demo_step integer,
  p_payload jsonb default '{}'::jsonb,
  p_occurred_at timestamptz default now()
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_inserted_id bigint;
  v_allowed_events constant text[] := array[
    'session_started',
    'lesson_selected',
    'lesson_shown',
    'recognition_completed',
    'tactile_generated',
    'captions_enabled',
    'quiz_started',
    'quiz_answered',
    'library_saved',
    'audio_played',
    'function_key_pressed'
  ];
begin
  if not (p_event_type = any(v_allowed_events)) then
    raise exception 'Unsupported Dot Lens event type: %', p_event_type;
  end if;

  if p_demo_step < 1 or p_demo_step > 6 then
    raise exception 'Demo step must be between 1 and 6';
  end if;

  if not exists (
    select 1 from public.science_lessons where id = p_lesson_id
  ) then
    raise exception 'Unknown lesson: %', p_lesson_id;
  end if;

  insert into public.demo_sessions (
    id,
    lesson_id,
    browser_locale,
    started_at,
    last_event_at,
    metadata
  )
  values (
    p_session_id,
    p_lesson_id,
    nullif(p_payload->>'browser_locale', ''),
    p_occurred_at,
    p_occurred_at,
    jsonb_build_object(
      'viewport', coalesce(p_payload->'viewport', '{}'::jsonb),
      'accessibility_poc', true
    )
  )
  on conflict (id) do update set
    lesson_id = excluded.lesson_id,
    last_event_at = greatest(public.demo_sessions.last_event_at, excluded.last_event_at);

  insert into public.learning_events (
    client_event_id,
    session_id,
    lesson_id,
    event_type,
    demo_step,
    payload,
    occurred_at
  )
  values (
    p_client_event_id,
    p_session_id,
    p_lesson_id,
    p_event_type,
    p_demo_step,
    coalesce(p_payload, '{}'::jsonb),
    p_occurred_at
  )
  on conflict (client_event_id) do nothing
  returning id into v_inserted_id;

  if v_inserted_id is null then
    return jsonb_build_object('stored', false, 'duplicate', true);
  end if;

  if p_event_type = 'recognition_completed' then
    insert into public.recognition_runs (
      client_event_id,
      session_id,
      lesson_id,
      confidence,
      detected_objects,
      text_blocks,
      quiz_items,
      processing_ms,
      result_payload
    )
    values (
      p_client_event_id,
      p_session_id,
      p_lesson_id,
      nullif(p_payload->>'confidence', '')::numeric,
      coalesce(
        array(select jsonb_array_elements_text(coalesce(p_payload->'detected_objects', '[]'::jsonb))),
        '{}'
      ),
      coalesce((p_payload->>'text_blocks')::integer, 0),
      coalesce((p_payload->>'quiz_items')::integer, 0),
      nullif(p_payload->>'processing_ms', '')::integer,
      p_payload
    );
  elsif p_event_type in ('tactile_generated', 'captions_enabled', 'quiz_started') then
    insert into public.accessible_outputs (
      client_event_id,
      session_id,
      lesson_id,
      output_type,
      locale,
      generation_ms,
      content
    )
    values (
      p_client_event_id,
      p_session_id,
      p_lesson_id,
      case p_event_type
        when 'tactile_generated' then 'tactile_audio'
        when 'captions_enabled' then 'captions_summary'
        else 'accessible_quiz'
      end,
      coalesce(nullif(p_payload->>'locale', ''), 'pt-BR'),
      nullif(p_payload->>'generation_ms', '')::integer,
      p_payload
    );
  elsif p_event_type = 'quiz_answered' then
    insert into public.quiz_attempts (
      client_event_id,
      session_id,
      lesson_id,
      question,
      selected_index,
      correct_index,
      is_correct,
      response_ms,
      answer_payload
    )
    values (
      p_client_event_id,
      p_session_id,
      p_lesson_id,
      coalesce(p_payload->>'question', 'Untitled quiz question'),
      (p_payload->>'selected_index')::integer,
      (p_payload->>'correct_index')::integer,
      (p_payload->>'is_correct')::boolean,
      nullif(p_payload->>'response_ms', '')::integer,
      p_payload
    );
  elsif p_event_type = 'library_saved' then
    insert into public.tactile_library_assets (
      lesson_id,
      title,
      version,
      grade,
      locale,
      tactile_pages,
      tags,
      generated_from_session,
      package_payload,
      updated_at
    )
    values (
      p_lesson_id,
      coalesce(p_payload->>'title', 'Untitled tactile package'),
      coalesce(p_payload->>'version', 'v1.0'),
      p_payload->>'grade',
      coalesce(nullif(p_payload->>'locale', ''), 'pt-BR'),
      coalesce((p_payload->>'tactile_pages')::integer, 1),
      coalesce(
        array(select jsonb_array_elements_text(coalesce(p_payload->'tags', '[]'::jsonb))),
        '{}'
      ),
      p_session_id,
      p_payload,
      now()
    )
    on conflict (lesson_id, version) do update set
      title = excluded.title,
      grade = excluded.grade,
      locale = excluded.locale,
      tactile_pages = excluded.tactile_pages,
      tags = excluded.tags,
      generated_from_session = excluded.generated_from_session,
      package_payload = excluded.package_payload,
      updated_at = now();
  end if;

  return jsonb_build_object(
    'stored', true,
    'event_id', v_inserted_id,
    'event_type', p_event_type
  );
end;
$$;

revoke all on function public.record_dot_lens_event(
  uuid,
  uuid,
  text,
  text,
  integer,
  jsonb,
  timestamptz
) from public;

grant execute on function public.record_dot_lens_event(
  uuid,
  uuid,
  text,
  text,
  integer,
  jsonb,
  timestamptz
) to anon, authenticated;

create or replace view public.dot_lens_learning_summary
with (security_invoker = true)
as
select
  l.id as lesson_id,
  l.title,
  count(distinct s.id) as demo_sessions,
  count(e.id) as total_events,
  count(q.id) as quiz_attempts,
  count(q.id) filter (where q.is_correct) as correct_quiz_attempts,
  max(e.occurred_at) as last_activity_at
from public.science_lessons l
left join public.demo_sessions s on s.lesson_id = l.id
left join public.learning_events e on e.session_id = s.id
left join public.quiz_attempts q on q.session_id = s.id
group by l.id, l.title;

comment on function public.record_dot_lens_event is
  'Atomically records validated anonymous PoC learning events and specialized accessibility data.';
