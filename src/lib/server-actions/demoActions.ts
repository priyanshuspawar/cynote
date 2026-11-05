"use server";

import { v4 } from "uuid";
import { createClient } from "../supabase/helpers/server";
import db from "../supabase/db";
import { files, folders, workspaces } from "../../../migrations/schema";

// Sample documents are stored as Markdown in files.data; the editor turns them
// into blocks the first time each (empty) document is opened. No top-level
// heading: the page header already shows the file title and icon.
const WELCOME = `Cynote is a real-time, collaborative notes workspace with an AI writing assistant built in. This is your own private demo workspace, so feel free to edit anything.

## Try these in 60 seconds

- **AI on any text:** select a sentence, click the ✨ button in the toolbar, and pick *Improve Writing*, *Fix Spelling*, *Translate*, *Simplify* or *Make Informal*.
- **AI that writes:** on an empty line, type \`/ai\` and choose *Continue Writing* or *Summarize*.
- **Ask this document:** click **Ask this document** (bottom right) and ask "What are the action items?"
- **Jump anywhere:** press **Ctrl K** (or ⌘K) to search every folder and file.
- **Real-time collaboration:** open this page in a second browser window and watch edits and cursors sync live.

## Fix my spelling

Select this paragraph and run *Fix Spelling*: Teh team recieved alot of usefull feedbak on the new feautre and we definately want to adress it soon.

> This demo account is temporary. Create a free account to keep your notes.`;

const MEETING = `**Date:** Monday · **Attendees:** Priya, Alex, Sam, Jordan

## Agenda

1. Launch readiness review
2. Customer feedback from the beta
3. Hiring update

## Notes

- The beta has 240 active users; retention after week one is 62%.
- The most requested feature is offline mode, followed by better mobile editing.
- Sam flagged that onboarding emails are landing in spam for some Gmail users.
- The design review for the new dashboard is scheduled for Thursday.

## Action items

- [ ] Alex: investigate the email deliverability issue by Wednesday
- [ ] Jordan: draft the offline-mode technical proposal
- [ ] Priya: share the beta retention report with the leadership team
- [ ] Sam: schedule interviews for the two frontend roles`;

const LAUNCH = `## Goal

Launch Cynote 1.0 publicly and reach **1,000 sign-ups** in the first month.

## Timeline

| Week | Milestone |
| --- | --- |
| 1 | Final QA and bug bash |
| 2 | Landing page and launch video |
| 3 | Launch on Product Hunt and Hacker News |
| 4 | Follow-up content and user interviews |

## Risks

- Server costs could spike on launch day; AI usage is capped per user per day.
- Onboarding needs to work for people who never read documentation.

## Open questions

- Should the free plan include AI features, or only a trial?
- Which integrations matter most for the first release?`;

export async function actionStartDemo() {
  const supabase = createClient();
  const id = v4();
  const { data, error } = await supabase.auth.signUp({
    email: `demo-${id.slice(0, 8)}@demo.cynote.test`,
    password: `${v4()}Aa1!`, // random and never shown: the account is throwaway
  });
  if (error || !data.user || !data.session) {
    return { error: error?.message ?? "The demo is unavailable right now. Please sign up instead." };
  }
  const owner = data.user.id;
  const now = new Date().toISOString();
  const workspaceId = v4();
  const gettingStarted = v4();
  const projects = v4();

  await db.insert(workspaces).values({
    id: workspaceId,
    workspaceOwner: owner,
    title: "Demo Workspace",
    iconId: "✨",
    bannerUrl: "",
    createdAt: now,
  });
  await db.insert(folders).values([
    { id: gettingStarted, workspaceId, title: "Getting Started", iconId: "🚀", createdAt: now, updatedAt: now },
    { id: projects, workspaceId, title: "Projects", iconId: "📁", createdAt: now, updatedAt: now },
  ]);
  const welcomeId = v4();
  await db.insert(files).values([
    { id: welcomeId, workspaceId, folderId: gettingStarted, title: "Welcome to Cynote", iconId: "👋", data: WELCOME, bannerUrl: "/banners/cover4.jpg", createdAt: now, updatedAt: now },
    { id: v4(), workspaceId, folderId: projects, title: "Weekly Product Sync", iconId: "📅", data: MEETING, bannerUrl: "/banners/cover3.jpg", createdAt: now, updatedAt: now },
    { id: v4(), workspaceId, folderId: projects, title: "Product Launch Plan", iconId: "🚀", data: LAUNCH, bannerUrl: "/banners/cover9.jpg", createdAt: now, updatedAt: now },
  ]);

  return {
    error: null,
    href: `/dashboard/${workspaceId}/${gettingStarted}/${gettingStarted}folder${welcomeId}`,
  };
}
