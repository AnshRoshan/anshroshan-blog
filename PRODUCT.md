# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro 7 static output. Content from Sanity CMS at build time via
`@sanity/client`; Portable Text rendered with `@portabletext/to-html`;
Tailwind v4 via `@tailwindcss/vite`. Zero client-side JavaScript shipped.
Deployed as a static site (Vercel/Netlify/Cloudflare) at
`blog.anshroshan.com`.

## Users

Primary: recruiters and hiring managers evaluating Ansh Roshan for Gen
AI / AI-engineering roles. They arrive from the portfolio
(anshroshan.com), LinkedIn, or a shared post link, skim 1–3 pages for a
few minutes, and need to answer "does this person deeply understand
building and shipping LLM systems, and can they write?" Secondary:
developer peers who read the full posts and subscribe via RSS.

## Product Purpose

Ansh Roshan's writing site: essays and notes on Gen AI, agentic systems,
RAG, and shipping LLM software to production. Success = a recruiter
finishes with high confidence in the author's expertise and
communication, and clicks through to the portfolio or contact.

## Positioning

Practitioner's notes from someone who ships agentic AI end to end — not
a content-marketing blog. The writing itself is the credibility signal;
the design must present it with authority and never get in its way.

## Operating Context

Content authored in Sanity Studio (studio/ folder in this repo).
Publishing triggers a rebuild via webhook. Posts are Portable Text with
code blocks (read on desktop, mostly), cover images, tags. Two current
posts: agentic system architecture, RAG in production.

## Capabilities and Constraints

- Fully static: every page pre-rendered; zero client-side JS is a hard
  constraint (performance is part of the credibility signal).
- Pages: writing index (/), posts (/blog/[slug]), tag archives
  (/tags, /tags/[tag]), RSS (/rss.xml), 404.
- Same Sanity dataset as before; post URL shape
  /blog/[slug]/ must be preserved.
- Links to the portfolio site (anshroshan.com) are cross-domain.

## Brand Commitments

Personal name "Ansh Roshan". The user explicitly chose an **independent
visual world** for the blog — the portfolio's Cool Ink + Mint palette is
NOT binding here and was explicitly released.

## Evidence on Hand

- 2 real published posts (Sanity dataset 497efmiy, production).
- Portfolio at anshroshan.com with contact page for CTAs.
- No logos, testimonials, or photography beyond post cover images.
  Do not fabricate any.

## Product Principles

1. The writing is the product; typography and reading comfort outrank
   decoration.
2. Authority through restraint: precision and craft signal expertise
   better than effects.
3. Skim-friendly credibility: a recruiter should grasp "who is this and
   is he credible" in 10 seconds without reading a post.
4. Zero-JS performance is a feature, not a limitation.

## Accessibility & Inclusion

No specific requirements recorded. Standard web a11y applies: visible
focus, semantic HTML, readable contrast, reduced-motion respected.
