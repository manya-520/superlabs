# Superlabs Desktop Prototype — Build Spec (v2)

This document is the source of truth for building the Superlabs desktop prototype. Read this whole file before writing code. When in doubt, follow this spec over your own instincts.

## Core design principle: don't overwhelm

The user is a **non-technical person** (an accountant). Every screen must feel calm, minimal, and approachable. Favor progressive disclosure over dumping information. If a piece of information isn't essential to the decision on the current screen, leave it out or tuck it behind a tooltip/hover. When in doubt: show less.

Visual labels like "Recommended" beat long explanatory sentences. Icons beat walls of text. Trust the user to explore when they want more.

## What we're building

A **clickable, static prototype** of the Superlabs desktop application. No real backend, no real screen recording — all data and interactions are faked and scripted. The goal is to walk a user through a flow that demonstrates how a non-technical person would teach Superlabs to automate a repetitive task.

**The user:** Maria, an accountant/bookkeeper.

**The concrete scenario the prototype demonstrates:** Maria receives invoices for AI tools (Cursor, Claude, etc.) from colleagues via Slack. Her current manual workflow:
1. Open Slack
2. Download the invoice attachment
3. Log the invoice in Excel
4. Mark it paid or unpaid
5. Attach the image to the record
6. Open Intuit QuickBooks and create an invoice entry

This is a tedious multi-step process across multiple tools. This is what's being automated.

## Tech stack

- **Framework:** Next.js (App Router) + TypeScript + Tailwind CSS
- **Flowchart library:** `reactflow`
- **Icons:** `lucide-react`
- **Animations:** `framer-motion`
- **Package manager:** npm

Even though this is a "desktop app," build it as a Next.js web app styled to **feel** desktop-native. No Electron for this prototype.

## Project setup

1. Initialize Next.js in the current directory (`~/superlabs`) without overwriting existing files (`.gitignore`, `README.md`, `.cursorrules`, `.env.example`, this spec, `superlabs-design-system.md`, `superlabs-preview.html`, or the logo).
2. Install dependencies: `reactflow`, `lucide-react`, `framer-motion`.
3. Configure Tailwind with a custom theme including Microsoft Fluent-inspired gradient and glass/mica utilities.
4. Place the Superlabs logo SVG in `/public/superlabs-logo.svg`.
5. Start the dev server on port 3000.

## Design language

Two influences, blended:

- **Base tokens** from `superlabs-design-system.md` if present (colors, spacing, type scale). Primary brand purple is `#8539FF`.
- **Microsoft Fluent / Mica aesthetic** layered on top: soft translucent gradients, frosted glass surfaces (`backdrop-blur`), subtle depth, rounded corners (8–12px), generous whitespace.

**Gradient palette for backgrounds:**
- Soft lavender-to-blue: `from-purple-50 via-blue-50 to-indigo-100`
- Glass surfaces: white with 65–72% opacity, `backdrop-blur-xl`, thin white border (`border-white/40`)
- Accent gradient (buttons, recommended badges): `from-[#8539FF] to-[#B57FFF]`

**Typography:** System font stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI'`). Clean, readable.

**Interactions:** Smooth transitions (200–300ms), subtle hover lifts, no harsh animations.

## Global layout: the desktop frame + floating window

This is critical. Superlabs is **non-invasive**, like Wispr Flow or Grammarly's desktop app.

**Desktop frame (always visible):**
- Wallpaper gradient fills the entire browser viewport
- Mac-style top menu bar fixed to top. Left: Superlabs logo + "Superlabs" text. Right: fake time/date, fake system icons. Height ~28px, dark semi-transparent with blur.
- A subtle simulated "desktop" behind the app — a few placeholder app icons or a soft pattern — so the floating window looks like it's hovering over a real desktop environment. Keep this quiet; it's backdrop, not content.

**Floating Superlabs window (the actual app):**
- Default dimensions: **480px wide × 640px tall**
- Positioned center-right of the screen by default
- Draggable by its header bar (use `framer-motion` drag)
- Glass surface, rounded corners (12px), soft shadow
- Header bar: small Superlabs logo, app name, non-functional window controls (close/minimize as visual only)
- **All screen content renders inside this floating window** — never full-screen

Screen 1 is the exception: the window is collapsed/hidden. Clicking the logo in the menu bar animates the window expanding into view → transitions to Screen 2.

Screens 5 and 6 may expand the window to a wider size (see each screen spec).

## The screens

Use a single `useState` for the current screen name, not separate routes. Add forward/back navigation buttons for review purposes.

### Screen 1: Launcher

- Wallpaper + top menu bar only, no floating window visible
- Superlabs logo in the menu bar pulses subtly
- After 2s, a small tooltip appears near the logo: "Click to open"
- Clicking the logo animates the floating window expanding into place → Screen 2

### Screen 2: Home (inside floating window, 480×640)

- **Greeting:** "Hey Maria 👋" — large friendly type
- **Prompt:** "Let's automate something." — lighter weight
- **Automation suggestion cards** — 4 cards stacked vertically (the window is narrow, so vertical rows work better than a grid):
  1. **Process AI tool invoices from Slack** — icon: `MessageSquare`, subtitle: "Log, file, and enter in QuickBooks" — marked **"Recommended"** with a small pill badge
  2. **Categorize expenses** — icon: `Wallet`, subtitle: "Tag expenses by category"
  3. **Reconcile receipts** — icon: `Receipt`, subtitle: "Match receipts to transactions"
  4. **Generate expense reports** — icon: `BarChart3`, subtitle: "Monthly expense summaries"
- Each card: clean row layout, icon on left, title + subtitle, soft hover highlight
- Clicking the first card advances to Screen 3
- Do NOT show accuracy percentages here — save that for where it matters

### Screen 3: Input method (inside floating window, 480×640)

- Header: "How would you like to teach Superlabs?"
- No subheader — let the options speak for themselves
- **Three option cards** stacked vertically:
  1. **Record your screen** — icon: `Video`, short line: "Show us by doing it once" — marked **"Recommended"** with a small pill badge (no percentage, just the label)
  2. **Describe in text** — icon: `Type`, short line: "Write out the steps"
  3. **Upload screenshots** — icon: `Image`, short line: "Walk through with images"
- Hovering the "Recommended" badge shows a small tooltip: "Recording captures the most detail"
- Clicking "Record your screen" advances to Screen 4
- Other options show a small "Coming soon" toast

### Screen 4: Preparation (inside floating window, 480×640)

- Header: "Before we start"
- Two info cards stacked:
  1. **Privacy callout** (icon: `Shield`, soft green accent):
     - "Your recording stays private"
     - One line: "Only used to build your automation. Not stored long-term."
  2. **Safety note** (icon: `AlertCircle`, soft amber accent):
     - "Watch what's on screen"
     - One line: "Close anything sensitive before recording."
- Checkbox: "I'm ready"
- CTA button: "Start recording" (disabled until checked, gradient fill when active)
- Clicking advances to Screen 5

### Screen 5: Recording + live flowchart

**Window expands to 800px wide × 640px tall** for this screen. Still floating, still draggable.

**Split layout, 55/45:**

**Left panel — Flowchart (reactflow):**
- Starts empty
- As the "recording" progresses (scripted, timer-based), nodes appear one by one with fade/slide-in
- Nodes represent Maria's Slack-invoice scenario:
  1. Open Slack
  2. Download invoice attachment
  3. Log in Excel
  4. Mark paid/unpaid
  5. Attach image to record
  6. Open Intuit QuickBooks
  7. Create invoice entry
- Nodes connected with smooth edges, vertical flow
- Small "Recording..." indicator at top with red pulse dot

**Right panel — Superlabs chat:**
- Chat interface, Superlabs messages on left with small logo avatar
- Superlabs does NOT narrate Maria's actions (it can't know). Instead, it asks **clarifying questions about the rules** behind the task, timed between node creations:
  1. (at start) "I'll follow along while you show me. I'll ask a few questions as you go."
  2. (after node 2) "Do these invoices always come from the same Slack channel?"
  3. (after node 3) "Is there a specific Excel sheet I should use every time?"
  4. (after node 4) "How do you decide whether something is paid vs unpaid?"
  5. (after node 6) "Are there any invoices I shouldn't auto-create in QuickBooks?"
  6. (after node 7) "Looks like you're done. Want to review what I've got?" with button "Review"
- Each question has a text input below where Maria can type a quick answer (fake — stored in local state only)
- Skipping a question doesn't block progress

**Scripted sequence timing:**
- Node creation every ~3 seconds
- Questions appear ~1 second after their corresponding node
- Total "recording time" ~24 seconds before the Review button appears

### Screen 6: Review / Edit

**Window expands to 900px wide × 680px tall** for this screen. Still floating.

**Layout: 60/40 split** (flowchart left, context panel right)

**Left — Flowchart:**
- All nodes from Screen 5, now fully editable (rename, reconnect, delete, drag)
- **Auto-flagged "manual steps"** — Superlabs has pre-marked certain sensitive steps that need human action. These show a **lock icon + "Manual step" label** on the node. Pre-flagged:
  - "Create invoice entry" (node 7) — auto-flagged because it submits to external system (QuickBooks)
- **Node editing:** clicking any node opens a small edit panel (can be a modal or popover) with:
  - Rename field
  - Toggle: "Automate this step" ↔ "I'll do this myself" — when toggled off, node gets the lock icon + "Manual step" label
  - Delete button
  - Save / Cancel

**Right — Context panel (chat-style):**
- At top, Superlabs message: "I've marked one step as manual because it submits data externally. You can adjust any step the same way."
- **Specific follow-up questions** (Superlabs asks, Maria can answer or skip):
  - "Any deadline these usually need to be paid by?"
  - "Any amount threshold I should flag for your review?"
- **Free-text field** at the bottom: "Anything else I should know?" with Send button
- Each answered question collapses into a small "✓ Answered" state so the panel doesn't grow endlessly

**Header:**
- Title: "Review your automation"
- Subheader: one line, "Click any step to edit."

**Bottom action bar (inside window):**
- "Back" (ghost button)
- "Save automation" (primary gradient button)
- Clicking Save → success toast ("Automation saved ✓") → returns to Screen 2

## Component structure

Suggested file layout:

```
app/
  layout.tsx
  page.tsx              # holds screen state + active screen render
  globals.css           # Tailwind + glass/gradient utilities
components/
  DesktopFrame.tsx      # wallpaper + top menu bar + simulated desktop backdrop
  MenuBar.tsx
  FloatingWindow.tsx    # draggable glass window, handles width/height variants
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
    FlowchartNode.tsx      # custom reactflow node (supports manual-step flag)
    NodeEditPanel.tsx      # the modal/popover for editing a node
    ChatMessage.tsx
    ChatQuestionInput.tsx
    Toast.tsx
lib/
  scriptedRecording.ts  # timed sequence data for Screen 5
public/
  superlabs-logo.svg
```

## Styling specifics

Add these custom utilities in `globals.css`:

```css
.glass {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
}

.glass-dark {
  background: rgba(20, 20, 30, 0.5);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.wallpaper-gradient {
  background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 50%, #a6b9f7 100%);
  background-attachment: fixed;
}

.recommended-badge {
  background: linear-gradient(135deg, #8539FF, #B57FFF);
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 999px;
  letter-spacing: 0.02em;
}

.manual-step-badge {
  background: rgba(251, 191, 36, 0.15);
  color: #92400e;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid rgba(251, 191, 36, 0.3);
}
```

## Important constraints

- **No real functionality** — everything is faked and scripted
- **No screen recording API** — the "recording" is pure animation
- **Client-side only** — no API routes, no databases, no auth
- **Non-invasive** — Superlabs is always a floating window, never full screen
- **Minimal chrome** — don't cover the screen with instructions, stats, or decorations
- **Don't overwhelm** — favor progressive disclosure, recommended labels over stats, icons over paragraphs
- **Accessibility:** keyboard-navigable, proper focus states, reasonable contrast

## When you're done

1. `npm run dev` works and all 6 screens flow correctly
2. Window drag works on all screens
3. Forward/back navigation works for review
4. Update the README to reflect what was built
5. Commit all changes: `feat: initial 6-screen clickable prototype`
6. Push to `origin main`

## Ask first if

- You need to make a significant architectural decision not covered here
- A specific interaction is ambiguous
- You hit a dependency conflict during install
- You're unsure whether something would violate the "don't overwhelm" principle — err on the side of less
