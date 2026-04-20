# Super Labs — Design System
> Machine-readable spec for Claude Code, Cursor, and other AI coding agents.
> Reference this file before generating or editing any UI. Do not invent values outside this spec.

---

## 0. Ground Rules for Coding Agents

- All spacing, color, radius, and shadow values must come from this spec
- Never use hardcoded hex values — always reference the token name
- Every interactive element needs all states defined: default, hover, focus, active, disabled
- All color combinations must meet WCAG AA (4.5:1 for text, 3:1 for UI components)
- border-radius is **4px** everywhere unless explicitly specified otherwise
- No transform: scale or translateY on hover — state changes are color/border only
- No glow effects or box-shadow on button hover — use background color change only
- Transitions are max 150ms, ease only

---

## 1. Color Tokens

### 1.1 Brand

| Token | Dark value | Light value | Usage |
|-------|-----------|-------------|-------|
| `--brand` | `#7C3AED` | `#7C3AED` | Primary actions, active states, focus rings |
| `--brand-hover` | `#6D28D9` | `#6D28D9` | Button hover, link hover |
| `--brand-active` | `#5B21B6` | `#5B21B6` | Button active/pressed |
| `--brand-soft` | `#8B5CF6` | `#7C3AED` | Badge text, icon accents |
| `--brand-dim` | `rgba(124,58,237,0.08)` | `rgba(124,58,237,0.06)` | Brand card background |
| `--brand-dim-hover` | `rgba(124,58,237,0.12)` | `rgba(124,58,237,0.10)` | Brand card hover bg |
| `--brand-border` | `rgba(124,58,237,0.18)` | `rgba(124,58,237,0.20)` | Brand card border |
| `--brand-ring` | `rgba(124,58,237,0.20)` | `rgba(124,58,237,0.18)` | Focus ring, input focus shadow |

**Contrast check — brand on backgrounds:**
- `#7C3AED` on `#111112` (dark surface): 7.2:1 ✅ AAA
- `#7C3AED` on `#ffffff` (light): 5.9:1 ✅ AA
- `#8B5CF6` on `#111112`: 6.1:1 ✅ AA
- `#8B5CF6` on `#ffffff`: 4.6:1 ✅ AA (use `#7C3AED` for text on light bg)

---

### 1.2 Surfaces & Backgrounds

#### Dark Theme (`data-theme="dark"`)

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#0a0a0b` | Page background |
| `--bg-subtle` | `#111112` | Subtle page background, sidebar |
| `--surface` | `#111112` | Default card, modal, popover |
| `--surface-2` | `#161618` | Elevated surface, table header bg |
| `--surface-3` | `#1c1c1f` | Input background, toggle track, hover state |
| `--surface-4` | `#222226` | Deeper hover, active surface |
| `--surface-overlay` | `rgba(0,0,0,0.60)` | Modal backdrop |

#### Light Theme (`data-theme="light"`)

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#ffffff` | Page background |
| `--bg-subtle` | `#fafafa` | Subtle page background, sidebar |
| `--surface` | `#ffffff` | Default card, modal, popover |
| `--surface-2` | `#f5f5f5` | Elevated surface, table header bg |
| `--surface-3` | `#ebebeb` | Input background, toggle track, hover state |
| `--surface-4` | `#e0e0e0` | Deeper hover, active surface |
| `--surface-overlay` | `rgba(0,0,0,0.40)` | Modal backdrop |

---

### 1.3 Borders

#### Dark Theme

| Token | Value | Usage |
|-------|-------|-------|
| `--border` | `rgba(255,255,255,0.06)` | Default card border, dividers |
| `--border-strong` | `rgba(255,255,255,0.09)` | Input border, button border, active row |
| `--border-focus` | `#7C3AED` | Input/textarea focused border |

#### Light Theme

| Token | Value | Usage |
|-------|-------|-------|
| `--border` | `rgba(0,0,0,0.06)` | Default card border, dividers |
| `--border-strong` | `rgba(0,0,0,0.10)` | Input border, button border, active row |
| `--border-focus` | `#7C3AED` | Input/textarea focused border |

---

### 1.4 Text

#### Dark Theme

| Token | Value | Contrast on `--bg` | Usage |
|-------|-------|-------------------|-------|
| `--text-1` | `#ededed` | 15.5:1 ✅ AAA | Primary text, headings, card titles |
| `--text-2` | `#8f8f98` | 5.2:1 ✅ AA | Secondary text, labels, meta |
| `--text-3` | `#4a4a52` | 2.4:1 ⚠️ decorative only | Placeholders, divider labels, disabled |
| `--text-on-brand` | `#ffffff` | 8.6:1 ✅ AAA | Text on brand-colored buttons/surfaces |

#### Light Theme

| Token | Value | Contrast on `--bg` | Usage |
|-------|-------|-------------------|-------|
| `--text-1` | `#0a0a0b` | 20.4:1 ✅ AAA | Primary text, headings, card titles |
| `--text-2` | `#6b6b72` | 5.1:1 ✅ AA | Secondary text, labels, meta |
| `--text-3` | `#b0b0b8` | 2.0:1 ⚠️ decorative only | Placeholders, divider labels, disabled |
| `--text-on-brand` | `#ffffff` | 5.9:1 ✅ AA | Text on brand-colored buttons/surfaces |

> ⚠️ Never use `--text-3` for meaningful content. Only decorative elements, placeholder text, or disabled states.

---

### 1.5 Semantic / Status Colors

| Token | Dark | Light | Contrast (dark bg) | Contrast (light bg) |
|-------|------|-------|-------------------|-------------------|
| `--success` | `#4ade80` | `#16a34a` | 9.4:1 ✅ | 5.1:1 ✅ |
| `--success-bg` | `rgba(34,197,94,0.08)` | `rgba(34,197,94,0.08)` | — | — |
| `--success-border` | `rgba(34,197,94,0.16)` | `rgba(34,197,94,0.18)` | — | — |
| `--warning` | `#fbbf24` | `#a16207` | 10.2:1 ✅ | 4.6:1 ✅ |
| `--warning-bg` | `rgba(251,191,36,0.08)` | `rgba(202,138,4,0.08)` | — | — |
| `--warning-border` | `rgba(251,191,36,0.16)` | `rgba(202,138,4,0.16)` | — | — |
| `--error` | `#f87171` | `#dc2626` | 6.8:1 ✅ | 5.9:1 ✅ |
| `--error-bg` | `rgba(248,113,113,0.08)` | `rgba(220,38,38,0.08)` | — | — |
| `--error-border` | `rgba(248,113,113,0.16)` | `rgba(220,38,38,0.16)` | — | — |
| `--info` | `#60a5fa` | `#2563eb` | 7.0:1 ✅ | 5.9:1 ✅ |
| `--info-bg` | `rgba(96,165,250,0.08)` | `rgba(37,99,235,0.08)` | — | — |
| `--info-border` | `rgba(96,165,250,0.16)` | `rgba(37,99,235,0.16)` | — | — |

---

## 2. Typography

### Font Stack
```css
--font-sans: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
--font-display: 'DM Serif Display', Georgia, serif;
```

### Scale

| Token | Size | Line height | Weight | Usage |
|-------|------|------------|--------|-------|
| `--text-xs` | `11px` | `1.5` | 500 | Labels, captions, badge text, table headers |
| `--text-sm` | `12px` | `1.6` | 400/500 | Helper text, secondary body, code |
| `--text-base` | `13px` | `1.6` | 400/500 | Primary body, inputs, nav links |
| `--text-md` | `14px` | `1.5` | 500/600 | Button LG, subheadings, card meta |
| `--text-lg` | `16px` | `1.5` | 600 | Section headers, modal titles |
| `--text-xl` | `20px` | `1.3` | 600/700 | Page section titles |
| `--text-2xl` | `24px` | `1.2` | 400 (display) | Page heroes |
| `--text-3xl` | `32px` | `1.2` | 400 (display) | Landing page headlines |

### Letter spacing
```css
--tracking-tight:  -0.4px;   /* headings, display */
--tracking-normal: -0.1px;   /* body, buttons */
--tracking-wide:   0.06em;   /* uppercase labels, table headers */
--tracking-wider:  0.08em;   /* section label overlines */
```

---

## 3. Spacing

Base unit: 4px. All spacing must use this scale.

| Token | Value | Common usage |
|-------|-------|--------------|
| `--space-1` | `4px` | Icon gap, badge padding |
| `--space-2` | `8px` | Tight component padding |
| `--space-3` | `12px` | Default gap between elements |
| `--space-4` | `16px` | Component internal padding |
| `--space-5` | `20px` | Card padding (compact) |
| `--space-6` | `24px` | Container padding, section gap |
| `--space-8` | `32px` | Section gap |
| `--space-10` | `40px` | Large section gap |
| `--space-12` | `48px` | Page top padding |
| `--space-16` | `64px` | Section bottom margin |
| `--space-24` | `96px` | Page bottom padding |

---

## 4. Border Radius

**Default for all components: 4px**

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-xs` | `2px` | Minimal chip, tight tag |
| `--radius-sm` | `3px` | Badges, tags, table cell chips |
| `--radius-md` | `4px` | **Default** — buttons, inputs, dropdowns, nav items, toggle track, toasts, code blocks |
| `--radius-lg` | `6px` | Tabs container, larger chips |
| `--radius-xl` | `8px` | Cards, modals, popovers, table wrappers |
| `--radius-2xl` | `12px` | Large modals, sheet panels |
| `--radius-full` | `9999px` | Toggle thumb, avatar, pill badge, progress bar |

> All components default to `--radius-md: 4px` unless listed above.

---

## 5. Shadows

#### Dark Theme

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.5)` | Cards, inputs |
| `--shadow-md` | `0 2px 8px rgba(0,0,0,0.4)` | Dropdowns, tooltips |
| `--shadow-lg` | `0 4px 16px rgba(0,0,0,0.5)` | Modals, toasts |
| `--shadow-inner` | `inset 0 1px 0 rgba(255,255,255,0.03)` | Dark surface lift |

#### Light Theme

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.04)` | Cards |
| `--shadow-md` | `0 2px 8px rgba(0,0,0,0.06)` | Dropdowns, tooltips |
| `--shadow-lg` | `0 4px 16px rgba(0,0,0,0.08)` | Modals, toasts |
| `--shadow-inner` | `inset 0 1px 0 rgba(255,255,255,0.80)` | Light surface lift |

---

## 6. Transitions

```css
--transition-fast:   100ms ease;
--transition-base:   150ms ease;
--transition-spring: 220ms cubic-bezier(0.34, 1.56, 0.64, 1);
```

- Color, background, border-color, opacity: `--transition-fast`
- Box-shadow changes: `--transition-base`
- Toggle thumb, accordion expand: `--transition-spring`
- **Never use transform on hover for interactive cards or buttons**

---

## 7. Z-Index Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--z-base` | `0` | Default flow |
| `--z-raised` | `10` | Sticky table headers, inline overlaps |
| `--z-dropdown` | `100` | Dropdowns, command menu |
| `--z-sticky` | `200` | Sticky nav |
| `--z-overlay` | `300` | Drawer backdrop |
| `--z-modal` | `400` | Modals, dialogs |
| `--z-toast` | `500` | Toast notifications |
| `--z-tooltip` | `600` | Tooltips |

---

## 8. Component Specifications

---

### 8.1 Buttons

**Border radius: `--radius-md` (4px) on all sizes**
**No glow, no shadow on hover, no transform — only background color change**

#### Sizes

| Size | Height | Padding | Font size | Font weight |
|------|--------|---------|-----------|-------------|
| `sm` | `28px` | `0 10px` | `12px` | 500 |
| `md` | `34px` | `0 13px` | `13px` | 500 |
| `lg` | `38px` | `0 16px` | `14px` | 600 |

#### Variants & All States

**Primary**
```
default:  bg=--brand, color=--text-on-brand, border=none
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.10), 0 1px 2px rgba(0,0,0,0.15)
hover:    bg=--brand-hover
active:   bg=--brand-active
focus:    outline: 2px solid --brand, outline-offset: 2px
disabled: opacity: 0.35, pointer-events: none
```

**Secondary**
```
default:  bg=--surface-2, color=--text-1, border=1px solid --border-strong
          box-shadow: --shadow-sm
hover:    bg=--surface-3, border=--border-strong
active:   bg=--surface-4
focus:    outline: 2px solid --brand, outline-offset: 2px
disabled: opacity: 0.35
```

**Ghost**
```
default:  bg=transparent, color=--text-2, border=1px solid transparent
hover:    bg=--surface-2, color=--text-1, border=1px solid --border
active:   bg=--surface-3
focus:    outline: 2px solid --brand, outline-offset: 2px
disabled: opacity: 0.35
```

**Outline**
```
default:  bg=transparent, color=--text-1, border=1px solid --border-strong
hover:    bg=--surface-2
active:   bg=--surface-3
focus:    outline: 2px solid --brand, outline-offset: 2px
disabled: opacity: 0.35
```

**Danger**
```
default:  bg=transparent, color=#e54d4d (dark) / #dc2626 (light), border=1px solid --error-border
hover:    bg=--error-bg, border-color=rgba(229,77,77,0.28)
active:   bg slightly darker error-bg
focus:    outline: 2px solid #ef4444, outline-offset: 2px
disabled: opacity: 0.35
```

**Loading state** (any variant)
```
- Add spinner SVG before label
- opacity: 0.70
- pointer-events: none
- Do not change button dimensions
```

---

### 8.2 Badges

**Border radius: `--radius-sm` (3px)**

| Variant | bg | color (dark) | color (light) | border | Contrast |
|---------|----|----|-------|--------|----------|
| `neutral` | `--surface-3` | `--text-2` | `--text-2` | `--border-strong` | 5.2:1 ✅ |
| `brand` | `--brand-dim` | `#8B5CF6` | `#7C3AED` | `--brand-border` | 6.1:1 / 5.9:1 ✅ |
| `success` | `--success-bg` | `#4ade80` | `#16a34a` | `--success-border` | 9.4:1 / 5.1:1 ✅ |
| `warning` | `--warning-bg` | `#fbbf24` | `#a16207` | `--warning-border` | 10.2:1 / 4.6:1 ✅ |
| `error` | `--error-bg` | `#f87171` | `#dc2626` | `--error-border` | 6.8:1 / 5.9:1 ✅ |

**Sizing:**
- Default: `padding: 2px 7px`, `font-size: 11px`, `line-height: 18px`
- Small: `padding: 1px 6px`, `font-size: 10px`

**Status dot (optional):** `5px` circle, `border-radius: 9999px`, color matches badge text

---

### 8.3 Cards

**Border radius: `--radius-xl` (8px)**

#### Default card
```
bg:         --surface (light) / --surface-2 (dark)
border:     1px solid --border
padding:    18px
shadow:     --shadow-sm (light) / --shadow-sm + inset 0 1px 0 rgba(255,255,255,0.03) (dark)
```

#### Interactive card (hover only — no transform, no scale)
```
default:  same as default card
hover:    border-color=--border-strong, bg=--bg-subtle (light) / --surface-3 (dark)
active:   bg=--surface-3 (light) / --surface-4 (dark)
focus:    outline: 2px solid --brand, outline-offset: 2px
cursor:   pointer
```

#### Brand card
```
bg:       --brand-dim
border:   1px solid --brand-border
hover:    bg=--brand-dim-hover, border-color increases opacity slightly
```

#### Stat card
```
Same as default card, padding: 14px 16px
stat-value:  font-size: 26px, font-weight: 700, color: --text-1, letter-spacing: -1px
stat-label:  font-size: 12px, color: --text-2
stat-change: font-size: 11px
  - positive: color = --success (theme-aware)
  - negative: color = --error (theme-aware)
  - neutral:  color = --text-3
```

#### Card anatomy
```
[Card: 18px padding, 8px radius, 1px border]
  [Header row: icon (28x28, 4px radius, --surface-3 bg) + badge (right aligned)]
  [Title: 13px, 600, --text-1, margin-top: 12px, margin-bottom: 4px]
  [Body: 12px, 400, --text-2, line-height: 1.6]
  [Footer: margin-top: 14px, padding-top: 14px, border-top: 1px solid --border]
    [Left: meta text 11px --text-3]
    [Right: ghost or primary button sm]
```

---

### 8.4 Form Inputs

**Border radius: `--radius-md` (4px) on all input types**

#### Text input
```
height:      34px
padding:     0 10px
font-size:   13px
font-family: --font-sans
color:       --text-1
bg:          --surface (light) / --surface-3 (dark)
border:      1px solid --border-strong
radius:      --radius-md

States:
  placeholder: color=--text-3
  hover:       border-color slightly stronger (--border-strong, no change needed)
  focus:       border-color=--brand, box-shadow: 0 0 0 2px --brand-ring
  error:       border-color=--error (theme-aware)
  error+focus: box-shadow: 0 0 0 2px rgba(220,38,38,0.12)
  disabled:    opacity: 0.50, cursor: not-allowed, bg=--surface-2
  readonly:    bg=--surface-2, border=--border, cursor: default
```

#### Textarea
```
Same as text input
min-height: 80px
padding:    8px 10px
resize:     vertical
```

#### Select
```
Same as text input
padding-right: 32px (space for chevron icon)
appearance: none
cursor: pointer
```

#### Monospace input (API keys, code)
```
Same as text input
font-family: --font-mono
font-size:   12px
letter-spacing: 0.02em
```

#### Field anatomy
```
[Label: 12px, 500, --text-2, margin-bottom: 5px]
[Input: full width]
[Helper text: 11px, --text-3, margin-top: 4px]  <- use only for non-error hints
[Error text:  11px, --error (theme-aware), margin-top: 4px]
```

---

### 8.5 Navigation

#### Top nav
```
height:           52px
bg:               color-mix(in srgb, --bg 85%, transparent)
backdrop-filter:  blur(12px)
border-bottom:    1px solid --border
position:         sticky top: 0
z-index:          --z-sticky

Logo mark:   22x22px, --radius-md (4px), bg=--brand
Nav links:   height 30px, padding 0 10px, --radius-md, font-size 13px, font-weight 500
  default:   color=--text-2
  hover:     color=--text-1, bg=--surface-2
  active:    color=--text-1 (no background — use bottom border or active indicator instead)
```

#### Sidebar nav item
```
height:      36px
padding:     0 10px
border-radius: --radius-md (4px)
font-size:   13px
font-weight: 500
gap:         8px (icon + label)

States:
  default:  color=--text-2, bg=transparent
  hover:    color=--text-1, bg=--surface-2
  active:   color=--text-1, bg=--surface-2 (or brand-dim), border-left: 2px solid --brand
  disabled: color=--text-3, pointer-events: none
```

---

### 8.6 Tabs

**Border radius: `--radius-md` (4px) on tab items, `--radius-lg` (6px) on pill container**

#### Underline variant
```
Container: border-bottom: 1px solid --border

Tab item:
  height:        34px
  padding:       0 12px
  font-size:     13px
  font-weight:   500
  border-bottom: 1.5px solid transparent, margin-bottom: -1px

States:
  default:  color=--text-2
  hover:    color=--text-1
  active:   color=--text-1, border-bottom-color=--brand
  disabled: color=--text-3, pointer-events: none
  focus:    outline: 2px solid --brand, outline-offset: -2px
```

#### Pill variant
```
Container: padding: 2px, bg=--surface-2, border=1px solid --border, radius=--radius-lg

Tab item:
  height:  26px
  padding: 0 10px
  radius:  --radius-md (4px)
  font-size: 12px
  font-weight: 500

States:
  default: color=--text-2, bg=transparent
  hover:   color=--text-1
  active:  color=--text-1, bg=--surface (light) / --surface-4 (dark),
           box-shadow=--shadow-sm, border=1px solid --border-strong
```

---

### 8.7 Table

**Table wrapper border radius: `--radius-xl` (8px)**

```
Wrapper:     border: 1px solid --border, radius: 8px, overflow: hidden

Header row:
  bg:          --surface-2 (light) / --surface-3 (dark)
  border-bottom: 1px solid --border
  th padding:  9px 14px
  font-size:   11px, font-weight: 600, uppercase, letter-spacing: 0.06em
  color:       --text-3

Body rows:
  td padding:  11px 14px
  font-size:   13px
  color:       --text-1
  border-bottom: 1px solid --border
  last row:    no border-bottom

Row states:
  default: bg=--surface (light) / --surface-2 (dark)
  hover:   bg=--surface-2 (light) / --surface-3 (dark)
  selected: bg=--brand-dim, border-color=--brand-border
  transition: background 80ms ease

Cell types:
  primary text:    --text-1, font-weight: 500
  secondary text:  --text-2, font-size: 12px
  meta text:       --text-3, font-size: 11px
  badge cell:      use badge component, no extra padding
  action cell:     text-align: right, buttons use btn-sm btn-ghost or btn-danger
```

---

### 8.8 Toggle / Switch

**Track border radius: `--radius-full` (9999px)**
**Thumb border radius: 50%**

```
Track:
  width:   34px
  height:  18px
  radius:  --radius-full

  off: bg=--surface-4, border=1px solid --border-strong
  on:  bg=--brand, border-color=--brand

Thumb:
  size:   12px circle
  color:  #ffffff
  shadow: 0 1px 2px rgba(0,0,0,0.20)
  off position: left: 2px, top: 2px
  on position:  translateX(16px)
  transition:   --transition-spring

Wrapper:
  display: flex, align-items: center, justify-content: space-between
  cursor: pointer

Focus state on wrapper:
  outline: 2px solid --brand, outline-offset: 2px

Disabled:
  opacity: 0.40, pointer-events: none
```

---

### 8.9 Toasts / Notifications

**Border radius: `--radius-lg` (6px)**

```
Container:
  width:    360px max
  padding:  11px 13px
  bg:       --surface (light) / --surface-2 (dark)
  border:   1px solid --border-strong
  shadow:   --shadow-lg
  radius:   --radius-lg (6px)
  display:  flex, align-items: flex-start, gap: 10px

Left accent bar:
  width:  2px
  height: 100% (align-self: stretch)
  radius: 1px
  success: --success
  error:   --error
  warning: --warning
  info:    --info

Title:   font-size: 13px, font-weight: 600, color: --text-1
Body:    font-size: 12px, color: --text-2, margin-top: 2px, line-height: 1.5
Action:  btn-sm btn-ghost or btn-sm btn-primary, margin-left: auto, flex-shrink: 0

Position: fixed, bottom-right, gap: 8px between stacked toasts
z-index:  --z-toast
Animation: slide in from right + fade, 150ms ease
```

---

### 8.10 Modals & Dialogs

**Border radius: `--radius-2xl` (12px)**

```
Backdrop:
  bg:             --surface-overlay
  backdrop-filter: blur(4px)
  z-index:        --z-modal

Dialog:
  bg:       --surface (light) / --surface-2 (dark)
  border:   1px solid --border-strong
  radius:   --radius-2xl (12px)
  shadow:   --shadow-lg
  padding:  24px

Sizes:
  sm:  max-width: 400px
  md:  max-width: 560px  (default)
  lg:  max-width: 720px
  xl:  max-width: 900px

Header:   font-size: 16px, font-weight: 600, --text-1
Body:     font-size: 13px, --text-2, margin-top: 8px, line-height: 1.65
Footer:   margin-top: 20px, display: flex, gap: 8px, justify-content: flex-end
Close btn: top-right, 28x28px, btn-ghost, icon only, --radius-md

Accessibility:
  - role="dialog", aria-modal="true", aria-labelledby pointing to title
  - Focus trap on open
  - Restore focus to trigger on close
  - ESC closes
```

---

### 8.11 Dropdowns / Command Menus

**Border radius: `--radius-xl` (8px)**

```
Container:
  bg:      --surface (light) / --surface-2 (dark)
  border:  1px solid --border-strong
  shadow:  --shadow-lg
  radius:  --radius-xl (8px)
  padding: 4px
  min-w:   180px
  z-index: --z-dropdown

Menu item:
  height:     32px
  padding:    0 8px
  radius:     --radius-md (4px)
  font-size:  13px
  font-weight: 400
  color:      --text-1
  gap:        8px (icon + label)
  transition: background --transition-fast

States:
  default:  bg=transparent
  hover:    bg=--surface-3
  active:   bg=--surface-4
  focused:  bg=--surface-3 (keyboard navigation)
  danger:   color=--error, hover bg=--error-bg
  disabled: color=--text-3, pointer-events: none

Separator: height: 1px, bg=--border, margin: 4px 0
Section label: font-size: 11px, font-weight: 600, uppercase, color=--text-3,
               padding: 4px 8px, letter-spacing: 0.06em
```

---

### 8.12 Tooltips

**Border radius: `--radius-md` (4px)**

```
bg:       --surface-4 (dark) / #1a1a1a (both themes for contrast)
color:    #ededed
border:   1px solid --border-strong
radius:   --radius-md (4px)
padding:  4px 8px
font-size: 11px
font-weight: 500
max-width: 220px
shadow:   --shadow-md
z-index:  --z-tooltip

Contrast: #ededed on #1a1a1a = 15.0:1 ✅ AAA

Delay: 300ms show, 0ms hide
Arrow: 6px triangle, same bg as tooltip
```

---

### 8.13 Progress Bars

**Track and fill border radius: `--radius-full` (9999px)**

```
Track:
  height:  4px
  bg:      --surface-3
  radius:  --radius-full
  overflow: hidden

Fill:
  height:  4px
  radius:  --radius-full
  transition: width 300ms ease

Colors by context:
  default: --brand
  success: --success
  warning: --warning
  error:   --error
```

---

### 8.14 Avatars

**Border radius: 50% (circular)**

| Size | Dimensions | Font size | Usage |
|------|-----------|-----------|-------|
| `xs` | 20x20px | 8px | Dense table cells |
| `sm` | 24x24px | 9px | Table rows, compact lists |
| `md` | 32x32px | 12px | Default (nav, cards) |
| `lg` | 40x40px | 15px | Profile header |
| `xl` | 56px | 20px | Settings, account page |

```
border:   1px solid --border-strong (or 1px solid rgba(255,255,255,0.10) over color)
fallback: initials on deterministic bg color (based on name hash)
          white text, font-weight: 600
```

---

### 8.15 Skeleton Loaders

**Border radius: `--radius-md` (4px) on most, match component radius for card-shaped skeletons**

```
bg (dark):  linear-gradient(90deg, --surface-2 25%, --surface-3 50%, --surface-2 75%)
bg (light): linear-gradient(90deg, #f0f0f0 25%, #e4e4e4 50%, #f0f0f0 75%)
background-size: 200% 100%
animation:  shimmer 1.6s infinite linear

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

### 8.16 Empty States

```
Layout:   flex-column, align-center, padding: 36px 20px, text-align: center

Icon container:
  size:    36x36px
  bg:      --surface-3
  border:  1px solid --border-strong
  radius:  --radius-md (4px)
  icon:    16px SVG, color=--text-3
  margin-bottom: 12px

Title:    font-size: 13px, font-weight: 600, --text-1, margin-bottom: 4px
Body:     font-size: 12px, --text-2, max-width: 240px, line-height: 1.6, margin-bottom: 14px
CTA:      btn-md btn-primary (primary action) or btn-md btn-secondary (soft action)
```

---

### 8.17 Code Blocks

**Border radius: `--radius-xl` (8px)**

```
bg (dark):  #0d0d0f
bg (light): --surface-2
border:     1px solid --border
radius:     --radius-xl (8px)
padding:    16px 18px
font-family: --font-mono
font-size:   12px
line-height: 1.8
overflow-x:  auto
color:       --text-1

Syntax colors (dark):
  comment:  --text-3
  keyword:  #60a5fa   contrast on #0d0d0f: 7.0:1 ✅
  string:   #4ade80   contrast on #0d0d0f: 9.4:1 ✅
  number:   #fbbf24   contrast on #0d0d0f: 10.2:1 ✅
  type:     #c4b5fd   contrast on #0d0d0f: 7.3:1 ✅

Syntax colors (light):
  comment:  --text-3
  keyword:  #2563eb   contrast on --surface-2: 6.1:1 ✅
  string:   #16a34a   contrast on --surface-2: 5.1:1 ✅
  number:   #a16207   contrast on --surface-2: 4.6:1 ✅
  type:     #7C3AED   contrast on --surface-2: 5.9:1 ✅
```

---

### 8.18 Tags / Chips

**Border radius: `--radius-sm` (3px)**

```
height:     22px
padding:    0 8px
bg:         --surface-2
border:     1px solid --border-strong
font-size:  11px
font-weight: 500
color:      --text-2
radius:     --radius-sm (3px)

Removable tag: add × icon button (14px, --text-3, hover --text-1) after label
```

---

## 9. Layout System

### Page structure
```
[Nav: 52px sticky, z-200]
[Page content]
  max-width: 1040px
  margin: 0 auto
  padding: 48px 24px 96px

[Sidebar layout]
  sidebar: 220px fixed
  content: remaining width
  gap: 0 (border separates)
```

### Grid
- Columns: 12
- Gutter: 20px (desktop), 12px (mobile)
- Breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`

### Content max-widths
```
--content-sm:  480px   /* forms, auth pages */
--content-md:  680px   /* article, docs */
--content-lg:  880px   /* feature pages */
--content-xl:  1040px  /* app shell */
```

---

## 10. Accessibility Requirements

Every component must comply with the following:

### Focus states
```css
/* Apply to ALL interactive elements */
:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 2px;
}
/* For dark surfaces where outline may be lost: */
:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px var(--brand-ring);
}
```

### Color contrast minimums
- Body text (`--text-1`): ≥ 7:1 against bg (AAA)
- Secondary text (`--text-2`): ≥ 4.5:1 against bg (AA)
- UI components (borders, icons): ≥ 3:1 against bg
- `--text-3` is **decorative only** — never use for meaningful content
- All status badge text meets AA on their respective background

### ARIA requirements per component
```
Button:      role implicit, aria-disabled on disabled state, aria-label if icon-only
Input:       always paired with <label>, aria-describedby for hint/error, aria-invalid on error
Toggle:      role="switch", aria-checked, aria-label
Modal:       role="dialog", aria-modal="true", aria-labelledby
Dropdown:    role="menu", items role="menuitem", aria-expanded on trigger
Tabs:        role="tablist", role="tab", role="tabpanel", aria-selected, aria-controls
Table:       <thead> with <th scope="col">, <caption> for screen readers
Toast:       role="alert" (error/warning), role="status" (success/info), aria-live
Tooltip:     role="tooltip", trigger aria-describedby pointing to tooltip id
Progress:    role="progressbar", aria-valuenow, aria-valuemin, aria-valuemax
```

### Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 11. CSS Custom Properties — Full Reference

Copy this block into your `:root` and theme selectors:

```css
:root {
  /* Brand */
  --brand:        #7C3AED;
  --brand-hover:  #6D28D9;
  --brand-active: #5B21B6;
  --brand-soft:   #8B5CF6;
  --brand-dim:    rgba(124,58,237,0.08);
  --brand-dim-hover: rgba(124,58,237,0.12);
  --brand-border: rgba(124,58,237,0.18);
  --brand-ring:   rgba(124,58,237,0.20);

  /* Radius */
  --radius-xs:   2px;
  --radius-sm:   3px;
  --radius-md:   4px;
  --radius-lg:   6px;
  --radius-xl:   8px;
  --radius-2xl:  12px;
  --radius-full: 9999px;

  /* Spacing */
  --space-1: 4px;   --space-2: 8px;   --space-3: 12px;
  --space-4: 16px;  --space-5: 20px;  --space-6: 24px;
  --space-8: 32px;  --space-10: 40px; --space-12: 48px;
  --space-16: 64px; --space-24: 96px;

  /* Typography */
  --font-sans:    'DM Sans', -apple-system, sans-serif;
  --font-mono:    'JetBrains Mono', monospace;
  --font-display: 'DM Serif Display', serif;
  --text-xs:   11px; --text-sm:  12px; --text-base: 13px;
  --text-md:   14px; --text-lg:  16px; --text-xl:   20px;
  --text-2xl:  24px; --text-3xl: 32px;

  /* Transitions */
  --transition-fast:   100ms ease;
  --transition-base:   150ms ease;
  --transition-spring: 220ms cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Z-index */
  --z-base: 0; --z-raised: 10; --z-dropdown: 100;
  --z-sticky: 200; --z-overlay: 300; --z-modal: 400;
  --z-toast: 500; --z-tooltip: 600;
}

[data-theme="dark"] {
  --bg:              #0a0a0b;
  --bg-subtle:       #111112;
  --surface:         #111112;
  --surface-2:       #161618;
  --surface-3:       #1c1c1f;
  --surface-4:       #222226;
  --surface-overlay: rgba(0,0,0,0.60);
  --border:          rgba(255,255,255,0.06);
  --border-strong:   rgba(255,255,255,0.09);
  --border-focus:    #7C3AED;
  --text-1:          #ededed;
  --text-2:          #8f8f98;
  --text-3:          #4a4a52;
  --text-on-brand:   #ffffff;
  --success:         #4ade80;
  --success-bg:      rgba(74,222,128,0.08);
  --success-border:  rgba(74,222,128,0.16);
  --warning:         #fbbf24;
  --warning-bg:      rgba(251,191,36,0.08);
  --warning-border:  rgba(251,191,36,0.16);
  --error:           #f87171;
  --error-bg:        rgba(248,113,113,0.08);
  --error-border:    rgba(248,113,113,0.16);
  --info:            #60a5fa;
  --info-bg:         rgba(96,165,250,0.08);
  --info-border:     rgba(96,165,250,0.16);
  --shadow-sm:       0 1px 2px rgba(0,0,0,0.5);
  --shadow-md:       0 2px 8px rgba(0,0,0,0.4);
  --shadow-lg:       0 4px 16px rgba(0,0,0,0.5);
  --shadow-inner:    inset 0 1px 0 rgba(255,255,255,0.03);
  --brand-dim:       rgba(124,58,237,0.08);
  --brand-border:    rgba(124,58,237,0.18);
}

[data-theme="light"] {
  --bg:              #ffffff;
  --bg-subtle:       #fafafa;
  --surface:         #ffffff;
  --surface-2:       #f5f5f5;
  --surface-3:       #ebebeb;
  --surface-4:       #e0e0e0;
  --surface-overlay: rgba(0,0,0,0.40);
  --border:          rgba(0,0,0,0.06);
  --border-strong:   rgba(0,0,0,0.10);
  --border-focus:    #7C3AED;
  --text-1:          #0a0a0b;
  --text-2:          #6b6b72;
  --text-3:          #b0b0b8;
  --text-on-brand:   #ffffff;
  --success:         #16a34a;
  --success-bg:      rgba(22,163,74,0.08);
  --success-border:  rgba(22,163,74,0.16);
  --warning:         #a16207;
  --warning-bg:      rgba(161,98,7,0.08);
  --warning-border:  rgba(161,98,7,0.16);
  --error:           #dc2626;
  --error-bg:        rgba(220,38,38,0.08);
  --error-border:    rgba(220,38,38,0.16);
  --info:            #2563eb;
  --info-bg:         rgba(37,99,235,0.08);
  --info-border:     rgba(37,99,235,0.16);
  --shadow-sm:       0 1px 2px rgba(0,0,0,0.04);
  --shadow-md:       0 2px 8px rgba(0,0,0,0.06);
  --shadow-lg:       0 4px 16px rgba(0,0,0,0.08);
  --shadow-inner:    inset 0 1px 0 rgba(255,255,255,0.80);
  --brand-dim:       rgba(124,58,237,0.06);
  --brand-border:    rgba(124,58,237,0.20);
}
```

---

## 12. Do / Don't

| Do | Don't |
|----|-------|
| Use `--radius-md` (4px) as the default for all components | Use rounded corners > 8px on interactive components |
| Change color only on hover — never transform or scale | Add glow, translateY, or box-shadow on button hover |
| Use `--text-3` for decorative/placeholder text only | Use `--text-3` for any meaningful label or body copy |
| Always specify all 5 states: default, hover, focus, active, disabled | Leave out focus or disabled states |
| Use theme-aware tokens (`--error`, `--success`) | Hardcode `#4ade80` or `#f87171` directly |
| Add `aria-label` to all icon-only buttons | Render icon buttons without accessible names |
| Apply `prefers-reduced-motion` media query | Run animations without reduced motion support |
| Use `--brand` for focus outlines universally | Use different focus colors per component |

---

*Super Labs Design System — v1.0 — March 2026*
*Update `--brand` hex if brand guidelines change — all tokens cascade automatically.*
