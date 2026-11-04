# Saino

A real-time, collaborative note-taking workspace with a built-in AI writing assistant. It's a Notion-style app built as a portfolio project.

## Features

- **Workspaces, folders and files**: organise notes the way you think, with emoji icons and cover images.
- **Real-time collaboration**: invite people to a workspace and edit the same document together, with live cursors and presence avatars.
- **AI editor**: improve writing, fix spelling, simplify, translate, make text informal, or ask the AI anything, right inside the editor. Every suggestion can be accepted or reverted.
- **Tags**: create your own coloured tags and apply them to files.
- **Trash**: restore trashed folders and files, or delete them forever.
- **Plans**: Pro features are free during the beta. Every account starts with a 15-day Pro trial label; there are no payments yet.

> AI calls go through a Cloudflare Worker with a small daily token budget, so anyone can try the public demo without running up costs.

## Tech stack

| Area | Tech |
| --- | --- |
| App | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, shadcn/ui |
| State | Redux Toolkit + RTK Query, with Next.js server actions as the data layer |
| Database & auth | Supabase (Postgres, Auth, Storage), Drizzle ORM |
| Editor & realtime | BlockNote, Yjs, Liveblocks |
| AI | BlockNote AI (`@blocknote/xl-ai`) → the Saino AI worker (Cloudflare Workers + Azure OpenAI) |

## Getting started

### 1. Install

```bash
npm install
```

### 2. Environment

Create a `.env` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase anon key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase → Connect → Transaction pooler (port 6543)
DATABASE_URL=postgresql://postgres.<project-ref>:<password>@<region>.pooler.supabase.com:6543/postgres

# Saino AI worker (local: http://127.0.0.1:8787)
NEXT_PUBLIC_EDITOR_GPT_URL=https://saino-ai-worker.<your-subdomain>.workers.dev

NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=<liveblocks public key>
LIVEBLOCKS_PRIVATE_KEY=<liveblocks secret key>
```

### 3. Database

On a fresh Supabase project:

1. Create the tables: `npx drizzle-kit migrate`
2. Run [`supabase/setup.sql`](supabase/setup.sql) in the Supabase SQL editor. It adds the pieces Drizzle doesn't manage: the new-user trigger, storage buckets, row-level security, and the per-user tag constraints.

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). To use the AI features locally, also run the Saino AI worker (`npm run dev` in its repo).

## Security notes

- Every server action checks that the caller owns, or collaborates on, the workspace behind the id it receives.
- Row-level security is enabled on every public table with no policies, so the public anon key can't read or write data through Supabase's REST API. The app reaches the database only through server-side Drizzle queries.
- Liveblocks room tokens are only issued to the workspace owner and its collaborators.

## Author

**Priyanshu Singh Pawar**: [GitHub @priyanshuspawar](https://github.com/priyanshuspawar)

## License

[MIT](LICENSE) © 2026 Priyanshu Singh Pawar
