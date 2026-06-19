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

## Connect a real DotPad (hardware output)

The blind / low-vision view can push the on-screen 60 × 40 tactile scene to a
physical DotPad over **Web Bluetooth** or **Web Serial (USB)** using the bundled
`DotPadSDK 3.0.0`. The on-screen preview and the hardware output read from the
exact same scene matrix ([`src/lib/dotpad/sceneMatrix.ts`](./src/lib/dotpad/sceneMatrix.ts)),
so what a sighted reviewer sees is what the student feels.

1. Use **Chrome** or **Edge** over `https://` (or `http://localhost`). Web
   Bluetooth / Web Serial are not available in Safari/Firefox.
2. In **Live Classroom** advance to *Step 3* (or open the **Recorded Lecture**
   blind tab), then click **Connect DotPad (Bluetooth)** or **USB** and pick the
   device in the browser chooser.
3. Once the status reads **DOTPAD LIVE / CONNECTED**, press **Send scene to
   DotPad**. The active scene is encoded and displayed on the device.
4. Without a device connected the button stays in preview-only mode — nothing
   breaks, it simply renders on screen.

### How the encoding works

- 60 × 40 pins = 30 × 10 cells of 2 × 4 dots = 300 bytes = 600 hex chars.
- [`src/lib/dotpad/encode.ts`](./src/lib/dotpad/encode.ts) packs each cell in the
  SDK's native **GraphicMode** bit order (`bit = column * 4 + row`), derived by
  inverting the SDK's own `brailleToGraphic` transform, and the result is sent
  with `DotPadSDK.displayGraphicData(hex, device, GraphicMode)`.
- Tracking events now record `delivered_to_hardware`, `device_name`,
  `transport`, and `raised_pins` so a demo can distinguish real output from a
  preview.

> The included `DotPadSDK-3_0_0.js` is the vendor SDK. Connection and key events
> are wired through [`src/lib/dotpad/useDotPad.ts`](./src/lib/dotpad/useDotPad.ts).
> The encoder is verified against the SDK transform; confirm dot orientation on
> real hardware and flip the bit order in `encode.ts` if a unit's mapping differs.

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
