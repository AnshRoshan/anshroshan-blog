# Sanity CMS setup & runbook

How this portfolio's content (blog + projects) is powered by Sanity, and the
exact steps to reconnect it to a **new** Sanity project from scratch. Follow top
to bottom; it takes about 10 minutes.

> TL;DR for a fresh project: create project + public `production` dataset, add a
> CORS origin, set 3 env vars, (optionally) run the seed script with a temporary
> Editor token, then add a publish-only webhook. Content is editable at `/studio`.

---

## 0. What you get

- One admin UI at **`/studio`** that manages **blog posts** and **projects**.
- A **Featured** toggle on projects controls the homepage "Selected work" top 3.
- **Case-study** fields on projects fill the `/projects/[slug]` detail pages.
- **Drafts never appear** on the live site (only published docs).
- **Publishing updates the live site in seconds** (webhook), with a long
  time-based fallback so content is never stale even if the webhook fails.
- If Sanity is not configured, the site falls back to `src/data/projects.ts`, so
  it always builds and runs.

---

## 1. Create the Sanity project + dataset

1. Go to <https://www.sanity.io/manage> and sign in (free tier is fine).
2. **Create new project** → note the **Project ID** (looks like `497efmiy`).
3. Open the project → **Datasets** → create a dataset named exactly
   **`production`**.
4. Set the dataset **Visibility = Public**.
   - Public means the site can read content without a token. A **private**
     dataset returns `Dataset not found` to anonymous reads (see Troubleshooting).

---

## 2. Add a CORS origin (so `/studio` can log in)

In **Manage → API → CORS origins → Add origin**:

- `http://localhost:3000` (local dev), tick **Allow credentials**.
- Add your production URL too, e.g. `https://your-domain.com`, allow credentials.

Without this, the embedded Studio at `/studio` fails to authenticate.

---

## 3. Environment variables

Copy `.env.local.example` to `.env.local` and fill it in:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=<your-project-id>
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-10-01

# Webhook shared secret. Generate a random one:
#   node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"
SANITY_REVALIDATE_SECRET=<random-string>
MY_SECRET_TOKEN=<same-or-another-random-string>
```

**On your deploy host (Vercel, etc.) set the SAME variables** in the project's
environment settings. If `SANITY_REVALIDATE_SECRET` is missing in production, the
revalidate endpoint returns `401` and the webhook does nothing.

Restart `bun dev` after editing env vars.

While `NEXT_PUBLIC_SANITY_PROJECT_ID` is empty, the site uses the local fallback
content and never calls Sanity.

---

## 4. Use the Studio

Open **`http://localhost:3000/studio`** and log in.

**Project** fields:
- title, slug (auto from title), category, description, tags
- coverImage (drag-drop upload, stored on Sanity's CDN)
- liveUrl, githubUrl, year
- **featured** (boolean) -> shows on homepage top 3
- **order** (number, lower = first)
- Case study (all optional): **problem**, **approach**, **outcome**,
  **metrics** (value + label pairs), **gallery** (images), **body** (rich text).
  Any you fill appear on `/projects/[slug]`.

**Post** (blog) fields: title, slug, description, publishedAt, published toggle,
coverImage, tags, body (rich text).

Publish a document to make it live.

---

## 5. (Optional) Seed starter content

Instead of retyping existing projects, import them with the script.

1. **Manage → API → Tokens → Add API token** → name `seed`, permission
   **Editor** (NOT Viewer; Viewer cannot create documents). Copy it.
2. Add it to `.env.local` temporarily:
   ```bash
   SANITY_API_WRITE_TOKEN=<editor-token>
   ```
3. Run:
   ```bash
   node --env-file=.env.local scripts/seed-sanity.mjs
   ```
   This uploads the project images from `public/projects/`, creates the projects
   (with tags, links, years, featured, order), and a couple of starter blog
   posts. It uses `createOrReplace` with deterministic ids, so it is safe to
   re-run.
4. **Delete the Editor token** in Manage when done, and remove
   `SANITY_API_WRITE_TOKEN` from `.env.local`. (Reads never need a token.)

Edit `scripts/seed-sanity.mjs` to change what gets seeded.

---

## 6. Instant publishing: the revalidate webhook

The site statically caches content in production. The webhook tells it to
refresh the moment you publish. It is sent from Sanity's cloud, so it only works
against a **publicly reachable URL** (your deployed site, not `localhost`).

**Manage → API → Webhooks → Create webhook:**

| Field | Value |
|---|---|
| Name | `Revalidate Next.js` |
| URL | `https://YOUR-DOMAIN/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>` |
| Dataset | `production` |
| Trigger on | Create, Update, Delete |
| Filter | `(_type == "post" \|\| _type == "project") && !(_id in path("drafts.**"))` |
| Projection | `{_type}` |
| HTTP method | `POST` |
| Enabled | yes |

Why the **Filter** matters:
- `!(_id in path("drafts.**"))` excludes drafts. Sanity autosaves drafts as you
  type; without this the webhook would fire on every keystroke-save. With it, the
  webhook fires **only when you actually Publish** (which writes the non-draft
  document).
- So: editing several drafts triggers nothing; publishing one fires the webhook
  once and revalidates only that content type.

The `{_type}` projection puts `_type` in the request body so the endpoint knows
whether a post or a project changed (see `src/app/api/revalidate/route.ts`).

**Verify:** publish something, then in Manage open the webhook's delivery log and
confirm a `200` response. The deployed page updates within seconds.

---

## 7. Caching model (how freshness works)

Two independent mechanisms keep content fresh in production:

1. **Time-based ISR (fallback).** Every Sanity read uses a default
   `revalidate` window (`DEFAULT_REVALIDATE` in `src/sanity/lib/fetch.ts`,
   currently 1 hour). This is NOT a background timer; it only refetches when a
   request arrives after the window has elapsed. No visitors means no fetches.
2. **Webhook (instant).** On publish, the webhook busts the cache immediately.

With the webhook in place, the time-based window is just a safety net, so it can
be long (e.g. 12 hours = `43200`, or a day = `86400`). Set it in `fetch.ts`.

In **development** (`bun dev`) there is no caching at all, so content always
shows on refresh and no webhook is needed locally.

**Drafts** never reach the live site because the client uses
`perspective: "published"` (`src/sanity/lib/client.ts`).

---

## 8. Key files (for reference / re-implementation)

| File | Role |
|---|---|
| `src/sanity/env.ts` | Reads env vars; `isSanityConfigured` gate |
| `src/sanity/lib/client.ts` | Sanity client (`perspective: "published"`, `useCdn: true`) |
| `src/sanity/lib/fetch.ts` | Cached read with ISR + tags; `DEFAULT_REVALIDATE` |
| `src/sanity/lib/queries.ts` | GROQ for posts + projects (list, by-slug, slugs) |
| `src/sanity/lib/projects.ts` | Maps Sanity docs to UI types; local fallback |
| `src/sanity/schemaTypes/post.ts` | Blog schema |
| `src/sanity/schemaTypes/project.ts` | Project schema (incl. case-study fields) |
| `src/app/studio/[[...tool]]/` | Embedded Studio at `/studio` |
| `src/app/api/revalidate/route.ts` | Webhook target; revalidates tags + paths |
| `src/app/projects/[slug]/page.tsx` | Case-study detail page |
| `src/data/projects.ts` | Local fallback content + shared types |
| `scripts/seed-sanity.mjs` | One-off content importer |
| `.env.local` | Local secrets (gitignored) |

---

## 9. Troubleshooting

| Symptom (in logs / UI) | Cause | Fix |
|---|---|---|
| `[sanity] fetch failed: Dataset not found` | Dataset is **private** or misnamed | Set dataset Visibility = Public, or correct `NEXT_PUBLIC_SANITY_DATASET` |
| Site shows old/local content after configuring | `NEXT_PUBLIC_SANITY_PROJECT_ID` not set, or dev not restarted | Set the ID, restart `bun dev` |
| Seed: `Insufficient permissions; permission "create" required` | Token is **Viewer** | Create an **Editor** token |
| `/studio` login fails (CORS error) | Missing CORS origin | Add the origin in Manage → API → CORS, allow credentials |
| Webhook does nothing / `401` in delivery log | Secret mismatch, or `SANITY_REVALIDATE_SECRET` not set on host | Make the `?secret=` in the URL match the host's env var |
| Webhook fires on every draft edit | Filter missing the draft exclusion | Use the Filter from section 6 |
| Drafts showing on the live site | Client not using published perspective | Confirm `perspective: "published"` in `client.ts` |

---

## 10. Moving to a brand-new Sanity project (checklist)

1. Create project + public `production` dataset (section 1).
2. Add CORS origins (section 2).
3. Update `NEXT_PUBLIC_SANITY_PROJECT_ID` (and secret) in `.env.local` and on the
   host (section 3).
4. Restart dev / redeploy.
5. (Optional) Seed with a temporary Editor token, then delete the token
   (section 5).
6. Recreate the webhook against the new project, with the draft-excluding filter
   (section 6).
7. Add content in `/studio` and publish.

That's it. No code changes are required to switch projects, only env vars and the
Manage-side configuration above.
