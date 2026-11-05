# Cynote

A real-time, collaborative note-taking workspace with a built-in AI writing assistant. It's a Notion-style app built as a portfolio project.

## Features

- **Workspaces, folders and files**: organise notes the way you think, with emoji icons and cover images.
- **Real-time collaboration**: invite people to a workspace and edit the same document together, with live cursors and presence avatars.
- **AI editor**: improve writing, fix spelling, simplify, translate, make text informal, or ask the AI anything, right inside the editor. Every suggestion can be accepted or reverted.
- **Ask this document**: chat with any document ("What are the action items?"); answers come from that document only, and follow-up questions keep context.
- **⌘K / Ctrl K search**: jump to any folder or file in the workspace from anywhere.
- **One-click live demo**: "Try the live demo" creates a private, throwaway account with a sample workspace, no sign-up form.
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
| AI | BlockNote AI (`@blocknote/xl-ai`) → the Cynote AI worker (Cloudflare Workers + Azure OpenAI) |

## Getting started

### 1. Install

```bash
npm install
```

### 2. Environment

```bash
cp .env.example .env
```

Fill in the values. [`.env.example`](.env.example) explains where each one comes from. On Vercel, add the same variables under Project → Settings → Environment Variables. The two `NEXT_PUBLIC_SUPABASE_*` values must be set before the build runs.

### 3. Database

On a fresh Supabase project:

1. Create the tables: `npx drizzle-kit migrate`
2. Run [`supabase/setup.sql`](supabase/setup.sql) in the Supabase SQL editor. It adds the pieces Drizzle doesn't manage: the new-user trigger, storage buckets, row-level security, and the per-user tag constraints.

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). To use the AI features locally, also run the Cynote AI worker (`npm run dev` in its repo).

## Security notes

- Every server action checks that the caller owns, or collaborates on, the workspace behind the id it receives.
- Row-level security is enabled on every public table with no policies, so the public anon key can't read or write data through Supabase's REST API. The app reaches the database only through server-side Drizzle queries.
- Liveblocks room tokens are only issued to the workspace owner and its collaborators.

## Author

**Priyanshu Singh Pawar**: [GitHub @priyanshuspawar](https://github.com/priyanshuspawar)

## License

[MIT](LICENSE) © 2026 Priyanshu Singh Pawar
