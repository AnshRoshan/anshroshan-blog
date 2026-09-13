# DESIGN.md — Depot Blind

<!-- impeccable:design-schema 1 -->

## World

**A monitoring surface built as a depot destination blind.** The blog is a
signal board in a dim depot: deep depot-green ground, backlit
chrome-yellow display type, calico panels for long-form reading, and the
dashed **seam** (two half-legends meeting across a cut) as the section
device. Every essay is a "course" with a plate code (NX-01, NX-02 …).
Confident, industrial, backlit — unmistakably different from the
portfolio's cinematic ink.

## Tone

Industrial confidence. Dispatched, not whispered. Everything reads like
it is lit from behind.

## Palette

| Token | Day board (light) | Night board (dark) |
|---|---|---|
| `--ground` | calico `#f3efe6` | depot green `#0c211a` |
| `--panel` | `#fbf9f3` | `#17332a` |
| `--ink` | depot green `#14382b` | calico `#f3efe6` |
| `--ink-soft` | `#3f5c50` | calico 66% |
| `--chrome` | `#a87600` (darkened) | chrome yellow `#f5b700` |
| `--chrome-strong` | `#f5b700` (fills only) | `#f5b700` |
| `--seam` | green 30% dashed | chrome 40% dashed |

The essay code specimen is always calico-backlit (green ink on calico)
with a soft chrome glow — the signature "lit blind" moment.

## Type

- **Anton** — display voice, uppercase, tight leading. Masthead, course
  titles, essay headings, drop cap.
- **Archivo** — reading voice, 400/500/600.
- **IBM Plex Mono** — data voice: plate codes (NX-01), dates, read times,
  destination chips, code blocks.

## Composition

- Masthead: thin rail with a bordered wordmark plate, mono nav, theme
  toggle; a dashed seam closes it.
- Homepage: the newest essay is a **backlit lead panel** — plate code,
  Anton title, deck, destination chips, chrome ADVANCE button, cover
  image split to the side. Earlier essays are **course rows** (code,
  title, deck, date/read time). Topics render as destination chips.
- Essay page: header (code plate, Anton title, deck, chips), calico
  reading panel with drop cap, Anton section heads with dashed seam
  underlines, backlit code specimens, callout signal plates,
  prev/next course nav, author plate.
- Tags: destination board grid, numbered, with counts.

## Motion

One authored entrance: panels roll in with stagger (roll-in). Hover:
chrome borders + text transitions. `prefers-reduced-motion` disables.

## States

Hover: borders and titles to chrome. Focus: 2px chrome outline.
Selection: chrome fill with green text. Empty states speak depot.

## Ban compliance

No eyebrows above headings (seam labels are full-width section
dividers, not kickers), no gradient text, no card-grid monotony (lead
panel + course rows + numbered board), mono only for data.
