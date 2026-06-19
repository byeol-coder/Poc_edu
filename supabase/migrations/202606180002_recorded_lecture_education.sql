-- Recorded Lecture / Tactile World Education extension

alter table public.learning_events
  drop constraint if exists learning_events_event_type_check;

alter table public.learning_events
  add constraint learning_events_event_type_check check (
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
      'function_key_pressed',
      'recorded_mode_opened',
      'video_marker_selected',
      'video_playback_toggled',
      'lecture_scene_generated',
      'lecture_tab_viewed',
      'lecture_quiz_answered',
      'lecture_pack_saved'
    )
  );

alter table public.learning_events
  drop constraint if exists learning_events_demo_step_check;

alter table public.learning_events
  add constraint learning_events_demo_step_check
  check (demo_step between 1 and 8);

create table if not exists public.recorded_lectures (
  id text primary key,
  lesson_id text not null references public.science_lessons(id),
  title text not null,
  subject text not null default 'Science',
  grade text not null,
  duration_seconds integer not null check (duration_seconds > 0),
  source_filename text,
  locale text not null default 'pt-BR',
  timeline_markers jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.recorded_lecture_scenes (
  id bigint generated always as identity primary key,
  client_event_id uuid not null unique,
  session_id uuid not null references public.demo_sessions(id) on delete cascade,
  lecture_id text not null references public.recorded_lectures(id),
  marker_id text not null,
  marker_title text,
  video_seconds integer not null default 0,
  tactile_title text,
  audio_description text,
  scene_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists recorded_lecture_scenes_timeline_idx
  on public.recorded_lecture_scenes(lecture_id, video_seconds);

create table if not exists public.education_lecture_packs (
  id uuid primary key default gen_random_uuid(),
  lecture_id text not null references public.recorded_lectures(id),
  lesson_id text not null references public.science_lessons(id),
  version text not null default 'v1.0',
  title text not null,
  original_ufit_title text not null,
  subject text not null default 'Science',
  grade text not null,
  duration_seconds integer not null,
  tactile_scene_count integer not null default 0,
  quiz_moment_count integer not null default 0,
  captions_ready boolean not null default false,
  dotpad_ready boolean not null default false,
  teacher_review_status text not null check (
    teacher_review_status in ('Draft', 'In Review', 'Ready')
  ),
  student_accessibility_modes text[] not null default '{}',
  generated_from_session uuid references public.demo_sessions(id) on delete set null,
  package_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (lecture_id, version)
);

insert into public.recorded_lectures (
  id,
  lesson_id,
  title,
  grade,
  duration_seconds,
  source_filename,
  timeline_markers,
  metadata
)
values
  (
    'plant-structure-recorded',
    'plant',
    'Plant Structure - Grade 5 Science',
    'Grade 5',
    258,
    'Inclusive Education Strategies in Brazil.mp4',
    '[
      {"time":"00:15","seconds":15,"title":"Introduction"},
      {"time":"01:20","seconds":80,"title":"Plant Structure Diagram"},
      {"time":"02:10","seconds":130,"title":"Root Function"},
      {"time":"03:00","seconds":180,"title":"Quiz Moment"}
    ]'::jsonb,
    '{"analysis_mode":"mock","captions":"pt-BR","libras_ready":true}'::jsonb
  ),
  (
    'solar-system-recorded',
    'solar',
    'Solar System - Grade 6 Science',
    'Grade 6',
    402,
    null,
    '[]'::jsonb,
    '{"analysis_mode":"mock","captions":"pt-BR"}'::jsonb
  ),
  (
    'water-cycle-recorded',
    'water',
    'Water Cycle - Grade 5 Science',
    'Grade 5',
    325,
    null,
    '[]'::jsonb,
    '{"analysis_mode":"mock","captions":"pt-BR"}'::jsonb
  )
on conflict (id) do update set
  title = excluded.title,
  grade = excluded.grade,
  duration_seconds = excluded.duration_seconds,
  source_filename = excluded.source_filename,
  timeline_markers = excluded.timeline_markers,
  metadata = excluded.metadata,
  updated_at = now();

insert into public.education_lecture_packs (
  lecture_id,
  lesson_id,
  version,
  title,
  original_ufit_title,
  grade,
  duration_seconds,
  tactile_scene_count,
  quiz_moment_count,
  captions_ready,
  dotpad_ready,
  teacher_review_status,
  student_accessibility_modes,
  package_payload
)
values
  (
    'plant-structure-recorded',
    'plant',
    'v1.0',
    'Plant Structure Video Lesson',
    'Plant Structure - Grade 5 Science',
    'Grade 5',
    258,
    4,
    1,
    true,
    true,
    'In Review',
    array['blind_low_vision', 'deaf_hard_of_hearing'],
    '{"captions":"pt-BR","summaries":true,"teacher_review":true}'::jsonb
  ),
  (
    'solar-system-recorded',
    'solar',
    'v1.0',
    'Solar System Video Lesson',
    'Solar System - Grade 6 Science',
    'Grade 6',
    402,
    6,
    2,
    true,
    true,
    'Draft',
    array['blind_low_vision', 'deaf_hard_of_hearing'],
    '{"captions":"pt-BR","summaries":true}'::jsonb
  ),
  (
    'water-cycle-recorded',
    'water',
    'v1.0',
    'Water Cycle Video Lesson',
    'Water Cycle - Grade 5 Science',
    'Grade 5',
    325,
    5,
    1,
    true,
    true,
    'Ready',
    array['blind_low_vision', 'deaf_hard_of_hearing'],
    '{"captions":"pt-BR","summaries":true}'::jsonb
  )
on conflict (lecture_id, version) do update set
  title = excluded.title,
  grade = excluded.grade,
  duration_seconds = excluded.duration_seconds,
  tactile_scene_count = excluded.tactile_scene_count,
  quiz_moment_count = excluded.quiz_moment_count,
  captions_ready = excluded.captions_ready,
  dotpad_ready = excluded.dotpad_ready,
  teacher_review_status = excluded.teacher_review_status,
  student_accessibility_modes = excluded.student_accessibility_modes,
  package_payload = excluded.package_payload,
  updated_at = now();

alter table public.recorded_lectures enable row level security;
alter table public.recorded_lecture_scenes enable row level security;
alter table public.education_lecture_packs enable row level security;

drop policy if exists "recorded lectures are publicly readable"
  on public.recorded_lectures;
create policy "recorded lectures are publicly readable"
  on public.recorded_lectures
  for select
  to anon, authenticated
  using (true);

drop policy if exists "education lecture packs are publicly readable"
  on public.education_lecture_packs;
create policy "education lecture packs are publicly readable"
  on public.education_lecture_packs
  for select
  to anon, authenticated
  using (true);

grant select on public.recorded_lectures to anon, authenticated;
grant select on public.education_lecture_packs to anon, authenticated;

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
    'function_key_pressed',
    'recorded_mode_opened',
    'video_marker_selected',
    'video_playback_toggled',
    'lecture_scene_generated',
    'lecture_tab_viewed',
    'lecture_quiz_answered',
    'lecture_pack_saved'
  ];
begin
  if not (p_event_type = any(v_allowed_events)) then
    raise exception 'Unsupported Dot Lens event type: %', p_event_type;
  end if;

  if p_demo_step < 1 or p_demo_step > 8 then
    raise exception 'Demo step must be between 1 and 8';
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
      'accessibility_poc', true,
      'experience_mode',
      case when p_demo_step >= 7 then 'recorded_lecture' else 'live_classroom' end
    )
  )
  on conflict (id) do update set
    lesson_id = excluded.lesson_id,
    last_event_at = greatest(public.demo_sessions.last_event_at, excluded.last_event_at),
    metadata = public.demo_sessions.metadata || excluded.metadata;

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
  elsif p_event_type in ('quiz_answered', 'lecture_quiz_answered') then
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
  elsif p_event_type = 'lecture_scene_generated' then
    insert into public.recorded_lecture_scenes (
      client_event_id,
      session_id,
      lecture_id,
      marker_id,
      marker_title,
      video_seconds,
      tactile_title,
      audio_description,
      scene_payload
    )
    values (
      p_client_event_id,
      p_session_id,
      coalesce(p_payload->>'lecture_id', 'plant-structure-recorded'),
      coalesce(p_payload->>'marker_id', 'untitled-scene'),
      p_payload->>'marker_title',
      coalesce((p_payload->>'video_seconds')::integer, 0),
      p_payload->>'tactile_title',
      p_payload->>'audio_description',
      p_payload
    );
  elsif p_event_type = 'lecture_pack_saved' then
    insert into public.education_lecture_packs (
      lecture_id,
      lesson_id,
      version,
      title,
      original_ufit_title,
      subject,
      grade,
      duration_seconds,
      tactile_scene_count,
      quiz_moment_count,
      captions_ready,
      dotpad_ready,
      teacher_review_status,
      student_accessibility_modes,
      generated_from_session,
      package_payload,
      updated_at
    )
    values (
      coalesce(p_payload->>'lecture_id', 'plant-structure-recorded'),
      p_lesson_id,
      coalesce(p_payload->>'version', 'v1.0'),
      coalesce(p_payload->>'title', 'Untitled recorded lecture pack'),
      coalesce(p_payload->>'original_ufit_title', 'Untitled UFIT lecture'),
      coalesce(p_payload->>'subject', 'Science'),
      coalesce(p_payload->>'grade', 'Grade 5'),
      coalesce((p_payload->>'duration_seconds')::integer, 1),
      coalesce((p_payload->>'tactile_scenes')::integer, 0),
      coalesce((p_payload->>'quiz_moments')::integer, 0),
      coalesce((p_payload->>'captions_ready')::boolean, false),
      coalesce((p_payload->>'dotpad_ready')::boolean, false),
      coalesce(p_payload->>'teacher_review_status', 'Draft'),
      coalesce(
        array(select jsonb_array_elements_text(coalesce(p_payload->'student_accessibility_modes', '[]'::jsonb))),
        '{}'
      ),
      p_session_id,
      p_payload,
      now()
    )
    on conflict (lecture_id, version) do update set
      title = excluded.title,
      original_ufit_title = excluded.original_ufit_title,
      subject = excluded.subject,
      grade = excluded.grade,
      duration_seconds = excluded.duration_seconds,
      tactile_scene_count = excluded.tactile_scene_count,
      quiz_moment_count = excluded.quiz_moment_count,
      captions_ready = excluded.captions_ready,
      dotpad_ready = excluded.dotpad_ready,
      teacher_review_status = excluded.teacher_review_status,
      student_accessibility_modes = excluded.student_accessibility_modes,
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
