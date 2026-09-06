# DESIGN.md — Print Journal

<!-- impeccable:design-schema 1 -->

## World

**A small serious print journal that publishes working software essays.**
The visitor is holding a well-made quarterly: warm paper, confident serif
display, hairline rules that organize without decorating, one restrained
vermilion accent doing editorial work (issue marks, active states, the
contents marker). Everything signals "this text was set by someone who
cares" — authority through typographic craft, not effects.

## Tone

Quiet authority. Literate, precise, warm. The design recedes for reading
and asserts itself in the frame: masthead, rules, marginalia.

## Palette

Warm paper world. All neutrals snap to a fixed ramp (raise: Exposure
Record); no ad-hoc grays.

| Token | Value | Use |
|---|---|---|
| `--paper` | `#faf7f1` | page ground |
| `--paper-deep` | `#f1ede4` | panels, code ground |
| `--ink` | `#1c1917` | text, display |
| `--ink-soft` | `#57534e` | secondary text (≥4.5:1 on paper) |
| `--ink-faint` | `#847f78` | hairline-adjacent metadata only |
| `--rule` | `rgba(28,25,23,.18)` | hairlines |
| `--rule-strong` | `rgba(28,25,23,.65)` | masthead double rules |
| `--vermilion` | `#b4371a` | ONE accent: contents marker, active states, links' underline bloom. Never body text, never large fills |
| `--night` | `#15130f` | night-edition ground (dark via media query) |

Night edition: `@media (prefers-color-scheme: dark)` swaps the ramp to
deep warm ink with cream type, same vermilion lifted to `#e05a35` for
contrast. Pure CSS, no toggle script (zero-JS holds).

## Type

Google Fonts, self-declared character (no Inter, no system display):

- **Playfair Display** — display voice. Headlines, masthead, wordmark.
  Weights 500–600, true italic, high-contrast Didone — the editorial
  masthead register. Tight tracking (−0.02em), `text-wrap: balance`.
- **Newsreader** — reading voice. Body, decks, captions; true italics
  for captions. Measure 65–72ch, line-height 1.7.
- **IBM Plex Mono** — data voice. Dates, tags, index numbers, page
  furniture. Small caps/uppercase tracking +0.08em at 11–12px.

Scale (desktop): masthead wordmark 1.4rem; essay display 2.6–3.4rem;
deck 1.25rem; body 1.125rem; furniture 0.75rem.

## Composition

Asymmetric editorial grid, not centered columns:

- Masthead: double rule under a wordmark line with issue metadata
  justified between edges — newspaper front-page gesture.
- Essay index: running entries separated by hairlines; large serif
  titles left, metadata in a narrow mono marginalia column right
  (desktop) / inline (mobile). The newest essay opens the page at
  display size with deck and first-line pull — the issue's lead.
- Essay page: display headline, italic deck, byline rule, drop cap on
  the first paragraph; prose set in Newsreader; code specimens on
  `--paper-deep` with mono; images as numbered plates (`Fig. 1`) with
  italic captions.
- Colophon footer: small-caps furniture, links set as text with
  vermilion underline bloom.

## Motion

CSS only, restrained (dial ≈4): one authored moment — the lead essay
block and masthead settle in with a single staggered fade-rise on load;
link underlines bloom from `text-decoration-thickness`; `scroll-behavior:
smooth`. `prefers-reduced-motion` disables all.

## States

Hover: titles shift to vermilion with underline bloom; hairlines
darken. Focus: 2px vermilion outline offset 2. Active nav page marked
by a vermilion contents-dot (raise: Cutting Bench — accent only marks
selection/current). Empty states set as a centered italic line.

## Browser surfaces

Selection: vermilion at 18% over paper. Caret, scrollbars, focus rings
themed to the ramp. Tabular figures for dates via Plex Mono. Underline
offset 0.12em on all text links.

## Bans honored

No eyebrows/kickers above headings, no gradient text, no cards-with-
borders grid, no section numbers, no mono as costume (mono only for
dates/counts/code), no dark-section-in-light jumps (single world +
media-query night edition).
