# Dot Lens for UFIT Science Accessibility

React + TypeScript + Vite PoC showing how UFIT science lessons can be
converted into DotPad tactile graphics, audio descriptions, captions,
summaries, and accessible quizzes.

The prototype has two connected experiences:

- **Live Classroom** — real-time UFIT smart-board recognition and accessible
  student outputs.
- **Recorded Lecture** — timeline-aware video analysis, synchronized tactile
  scenes, captions, summaries, lecture quizzes, and Tactile World - Education
  lecture packs.

The recorded prototype uses the included
`public/inclusive-education-brazil.mp4` as authorized PoC media. Scene
recognition remains a clearly labelled mock.

## Design system

- Google Fonts: **Manrope** for display typography and **Inter** for interface
  text and data.
- Lucide icons with shared control sizing, focus states, status colors, and
  card surfaces.
- A consistent EdTech SaaS visual system across Live Classroom and Recorded
  Lecture modes.

## Run locally

```bash
npm install
npm run dev
```

Production check:

```bash
npm run build
```

## Connect the Supabase project

The project URL is already configured as:

```text
https://fwcriutfmorbukfmxfwr.supabase.co
```

1. Open the Supabase project SQL Editor.
2. Run
   [`supabase/migrations/202606180001_dot_lens_learning_data.sql`](./supabase/migrations/202606180001_dot_lens_learning_data.sql).
3. In Supabase, open **Connect** or **Settings → API Keys** and copy the
   client-side Publishable Key (`sb_publishable_...`).
4. Create `.env.local`:

```bash
cp .env.example .env.local
```

5. Replace the placeholder:

```text
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_real_key
```

6. Restart `npm run dev`.

Never place a Supabase Secret Key or legacy `service_role` key in a Vite
environment variable. Vite client variables are visible in the browser.

## Data collected

The PoC stores non-personal interaction and generated accessibility data:

- `science_lessons`: lesson catalog and science topics
- `demo_sessions`: one accessibility demo session per lesson selection
- `learning_events`: the complete six-step event stream
- `recognition_runs`: recognized objects, OCR blocks, confidence, latency
- `accessible_outputs`: tactile/audio, captions/summary, and quiz packages
- `quiz_attempts`: answer, correctness, and response time
- `tactile_library_assets`: reusable Tactile World lesson packages
- `recorded_lectures`: lecture source metadata and timeline markers
- `recorded_lecture_scenes`: generated timeline-synchronized tactile scenes
- `education_lecture_packs`: Tactile World - Education lesson packages

Writes use the restricted `record_dot_lens_event` RPC. Direct anonymous writes
to the tables remain disabled by Row Level Security. If the network is offline
or Supabase is not configured, up to 250 events are held in the browser queue
and retried later.
