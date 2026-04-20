# superlabs

A clickable, static prototype of the **Superlabs** desktop app — a non-invasive floating window that teaches itself repetitive, multi-tool workflows by watching a user do them once.

The prototype walks through one concrete scenario: **Maria, an accountant**, automates how she processes AI-tool invoices that colleagues share in Slack (Slack → Excel → QuickBooks).

> Everything is faked: no real screen recording, no backend, no auth. The "recording" is a scripted animation. See [PROTOTYPE_SPEC.md](./PROTOTYPE_SPEC.md) for the full brief.

## Tech stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router) + React 19 + TypeScript
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with custom design tokens in `app/globals.css`
- **Flowchart:** [`reactflow`](https://reactflow.dev/)
- **Animations:** [`framer-motion`](https://www.framer.com/motion/) (drag, AnimatePresence, layout transitions)
- **Icons:** [`lucide-react`](https://lucide.dev/)
- **Package manager:** npm

Design tokens are sourced from [`superlabs-design-system.md`](./superlabs-design-system.md); the Fluent/Mica glass aesthetic and brand hex (`#8539FF`) come from [`PROTOTYPE_SPEC.md`](./PROTOTYPE_SPEC.md).

## Getting started

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>. The dev server runs on port 3000 by default.

Other scripts:

```bash
npm run build   # production build
npm run lint    # eslint
npm start       # serve the production build
```

## The six-screen flow

A single `useState<ScreenId>` drives which screen renders inside the floating window. A small prototype-only navigation pill at the bottom of the viewport lets you jump forward/back through the screens for review.

| # | Screen         | Window size  | What happens |
|---|----------------|-------------|--------------|
| 1 | Launcher       | hidden       | Menu-bar logo pulses; after 2 s, a "Click to open" tooltip appears. Clicking the logo opens the window. |
| 2 | Home           | 480 × 640    | Greeting + four automation cards. First card is badged "Recommended". |
| 3 | Input method   | 480 × 640    | Three ways to teach Superlabs. "Record your screen" is recommended (hover the badge for the reason). |
| 4 | Preparation    | 480 × 640    | Privacy + safety info; ready checkbox gates the gradient "Start recording" CTA. |
| 5 | Recording      | 800 × 640    | Split view: scripted reactflow diagram builds on the left (one step every ~3 s) while Superlabs asks timed clarifying questions on the right. A Review button appears when the timeline finishes. |
| 6 | Review         | 900 × 680    | Editable reactflow on the left (click a node to rename, toggle manual/automated, or delete). Context chat on the right with two follow-up questions and a free-text field. Step 7 is pre-flagged as "Manual step" because it submits to QuickBooks. Save → toast → Home. |

## Architecture

```text
app/
  layout.tsx          # <html data-theme="light">, loads globals
  page.tsx            # screen switcher + review nav + <ToastProvider>
  globals.css         # design tokens, glass/gradient utilities, reactflow overrides
components/
  DesktopFrame.tsx    # wallpaper gradient + simulated desktop icons
  MenuBar.tsx         # Mac-style top bar (logo, fake system icons, time)
  FloatingWindow.tsx  # draggable glass window (framer-motion drag controls)
  screens/
    LauncherScreen.tsx
    HomeScreen.tsx
    InputMethodScreen.tsx
    PreparationScreen.tsx
    RecordingScreen.tsx
    ReviewScreen.tsx
  ui/
    GlassCard.tsx
    GradientButton.tsx
    AutomationCard.tsx
    RecommendedBadge.tsx
    FlowchartNode.tsx
    NodeEditPanel.tsx
    ChatMessage.tsx
    ChatQuestionInput.tsx
    Toast.tsx
    nodeIcons.tsx     # lucide icon map for flowchart steps
lib/
  scriptedRecording.ts     # timeline data (nodes, edges, messages)
  useScriptedRecording.ts  # hook that advances the visible set by wall-clock time
  reviewStore.tsx          # ReviewContext + reducer for edits on Screen 6
public/
  superlabs-logo.svg       # full wordmark
  superlabs-mark.svg       # symbol-only mark (menu bar, window chrome, chat avatar)
```

### Design notes

- **Don't overwhelm.** Every screen keeps chrome minimal. Badges ("Recommended", "Manual step") replace explanatory paragraphs.
- **Non-invasive.** The app is always a floating glass window on top of a simulated desktop — never full-screen.
- **Progressive disclosure.** Accuracy stats, detailed tooltips, and follow-up questions appear only where they help the decision at hand.
- **Accessibility.** All interactive elements have `:focus-visible` outlines, the edit toggle is `role="switch"` with `aria-checked`, toasts use `role="status"`/`alert`, and a `prefers-reduced-motion` block collapses animations (including the recording timeline).

## Scripted recording timeline

Driven by `lib/useScriptedRecording.ts`, which polls a single wall-clock timer and exposes `{ visibleNodeIds, visibleMessageIds, isComplete, progress }`.

| t (s) | Event |
|------:|-------|
| 0.0   | node: *Open Slack* + intro message |
| 3.0   | node: *Download invoice attachment* |
| 4.0   | question: "Do these invoices always come from the same Slack channel?" |
| 6.0   | node: *Log in Excel* |
| 7.0   | question: "Is there a specific Excel sheet I should use every time?" |
| 9.0   | node: *Mark paid / unpaid* |
| 10.0  | question: "How do you decide whether something is paid vs unpaid?" |
| 12.0  | node: *Attach image to record* |
| 15.0  | node: *Open Intuit QuickBooks* |
| 16.0  | question: "Are there any invoices I shouldn't auto-create in QuickBooks?" |
| 18.0  | node: *Create invoice entry* |
| 19.0  | outro message + **Review** CTA |

## Environment variables

None currently required. `.env.example` is kept as a pattern template only.

## License

Private prototype — no license file.
