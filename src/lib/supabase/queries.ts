"use server";
import { and, eq, notExists, inArray } from "drizzle-orm";
import {
  files,
  fileTags,
  folders,
  tags,
  users,
  workspaces,
} from "../../../migrations/schema";
import db from "./db";
import { validate } from "uuid";
import {
  Folder,
  Subscription,
  workspace,
  File,
  User,
  Tag,
} from "./supabase.types";
import { collaborators } from "./schema";
import { createClient } from "./helpers/server";

const getUserServer = async () => {
  const supabaseServer = createClient();
  const { data, error } = await supabaseServer.auth.getUser();
  if (error || !data.user.id) {
    return null;
  }
  return data.user.id;
};

export const getUserSubscriptionStatus = async (userId: string) => {
  try {
    const data = await db.query.subscriptions.findFirst({
      where: (table, { eq }) => eq(table.userId, userId),
    });
    if (data) return { data: data as Subscription, error: null };
    else return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: `Error` };
  }
};

export const createWorkspace = async (workspace: workspace) => {
  try {
    const response = await db.insert(workspaces).values(workspace);
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: `Error` };
  }
};

export const deleteWorkspace = async (workspaceId: string) => {
  if (!workspaceId) return { error: "Workspace not found" };
  try {
    await db.delete(workspaces).where(eq(workspaces.id, workspaceId));
    return { data: "workspace deleted successfully" };
  } catch (error) {
    return { error };
  }
};

export const getFolders = async (workspaceId: string) => {
  const isValid = validate(workspaceId);
  if (!isValid)
    return {
      data: null,
      error: "Error",
    };
  try {
    const results: Folder[] | [] = await db
      .select()
      .from(folders)
      .orderBy(folders.createdAt)
      .where(eq(folders.workspaceId, workspaceId));
    return { data: results, error: null };
  } catch (error) {
    return { data: null, error: "Error" };
  }
};

export const getWorkspaceDetails = async (workspaceId: string) => {
  const isValid = validate(workspaceId);
  if (!isValid)
    return {
      data: [],
      error: "Error",
    };
  try {
    const response = (await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, workspaceId))) as workspace[];
    return { data: response, error: null };
  } catch (error) {
    return { data: [], error: null };
  }
};

export const getFilesDetails = async (fileId: string) => {
  const isValid = validate(fileId);
  if (!isValid)
    return {
      data: null,
      error: "Error",
    };
  try {
    const response = await db.query.files.findFirst({
      where: (table, { eq }) => eq(table.id, fileId),
      with: {
        tags: true, // Include tags in the results
      },
    });
    return { data: response, error: null };
  } catch (error) {
    console.log("🔴Error", error);
    return { data: null, error: "Error" };
  }
};

export const deletFile = async (fileId: string) => {
  if (!fileId) return { error: "Error" };
  try {
    await db.delete(files).where(eq(files.id, fileId));
    return { data: "deleted successfully" };
  } catch (err) {
    return { error: "Error" };
  }
};

export const deleteFolder = async (folderId: string) => {
  if (!folderId) return { error: "Folder not found" };
  try {
    await db.delete(folders).where(eq(folders.id, folderId));
    return { data: "Folder deleted successfully" };
  } catch (error) {
    return { error };
  }
};

export const getFolderDetails = async (folderId: string) => {
  const isValid = validate(folderId);
  if (!isValid)
    return {
      data: [],
      error: "Error",
    };
  try {
    const response = (await db
      .select()
      .from(folders)
      .where(eq(folders.id, folderId))
      .limit(1)) as Folder[];
    return { data: response, error: null };
  } catch (error) {
    return { data: [], error: "Error" };
  }
};

export const getAllWorkspacesOfUser = async () => {
  const userId = await getUserServer();
  if (!userId) return {};
  const privateWorkspaces = (await db
    .select({
      id: workspaces.id,
      createdAt: workspaces.createdAt,
      workspaceOwner: workspaces.workspaceOwner,
      title: workspaces.title,
      iconId: workspaces.iconId,
      data: workspaces.data,
      inTrash: workspaces.inTrash,
      logo: workspaces.logo,
      bannerUrl: workspaces.bannerUrl,
    })
    .from(workspaces)
    .where(
      and(
        notExists(
          db
            .select()
            .from(collaborators)
            .where(eq(collaborators.workspaceId, workspaces.id))
        ),
        eq(workspaces.workspaceOwner, userId)
      )
    )) as workspace[];
  const collaborativeWorkspaces = (await db
    .select({
      id: workspaces.id,
      createdAt: workspaces.createdAt,
      workspaceOwner: workspaces.workspaceOwner,
      title: workspaces.title,
      iconId: workspaces.iconId,
      data: workspaces.data,
      inTrash: workspaces.inTrash,
      logo: workspaces.logo,
      bannerUrl: workspaces.bannerUrl,
    })
    .from(users)
    .innerJoin(collaborators, eq(users.id, collaborators.userId))
    .innerJoin(workspaces, eq(collaborators.workspaceId, workspaces.id))
    .where(eq(users.id, userId))) as workspace[];
  const sharedWorkspaces = (await db
    .selectDistinct({
      id: workspaces.id,
      createdAt: workspaces.createdAt,
      workspaceOwner: workspaces.workspaceOwner,
      title: workspaces.title,
      iconId: workspaces.iconId,
      data: workspaces.data,
      inTrash: workspaces.inTrash,
      logo: workspaces.logo,
      bannerUrl: workspaces.bannerUrl,
    })
    .from(workspaces)
    .orderBy(workspaces.createdAt)
    .innerJoin(collaborators, eq(workspaces.id, collaborators.workspaceId))
    .where(eq(workspaces.workspaceOwner, userId))) as workspace[];
  return {
    private: privateWorkspaces,
    collaborative: collaborativeWorkspaces,
    shared: sharedWorkspaces,
  };
};

export const getPrivateWorkspaces = async () => {
  const userId = await getUserServer();
  if (!userId) return [];
  const privateWorkspaces = (await db
    .select({
      id: workspaces.id,
      createdAt: workspaces.createdAt,
      workspaceOwner: workspaces.workspaceOwner,
      title: workspaces.title,
      iconId: workspaces.iconId,
      data: workspaces.data,
      inTrash: workspaces.inTrash,
      logo: workspaces.logo,
      bannerUrl: workspaces.bannerUrl,
    })
    .from(workspaces)
    .where(
      and(
        notExists(
          db
            .select()
            .from(collaborators)
            .where(eq(collaborators.workspaceId, workspaces.id))
        ),
        eq(workspaces.workspaceOwner, userId)
      )
    )) as workspace[];
  return privateWorkspaces;
};

export const getCollaboratingWorkspaces = async () => {
  const userId = await getUserServer();
  if (!userId) return [];
  const collaborativeWorkspaces = (await db
    .select({
      id: workspaces.id,
      createdAt: workspaces.createdAt,
      workspaceOwner: workspaces.workspaceOwner,
      title: workspaces.title,
      iconId: workspaces.iconId,
      data: workspaces.data,
      inTrash: workspaces.inTrash,
      logo: workspaces.logo,
      bannerUrl: workspaces.bannerUrl,
    })
    .from(users)
    .innerJoin(collaborators, eq(users.id, collaborators.userId))
    .innerJoin(workspaces, eq(collaborators.workspaceId, workspaces.id))
    .where(eq(users.id, userId))) as workspace[];
  return collaborativeWorkspaces;
};

export const getSharedWorkspaces = async () => {
  const userId = await getUserServer();
  if (!userId) return [];
  const sharedWorkspaces = (await db
    .selectDistinct({
      id: workspaces.id,
      createdAt: workspaces.createdAt,
      workspaceOwner: workspaces.workspaceOwner,
      title: workspaces.title,
      iconId: workspaces.iconId,
      data: workspaces.data,
      inTrash: workspaces.inTrash,
      logo: workspaces.logo,
      bannerUrl: workspaces.bannerUrl,
    })
    .from(workspaces)
    .orderBy(workspaces.createdAt)
    .innerJoin(collaborators, eq(workspaces.id, collaborators.workspaceId))
    .where(eq(workspaces.workspaceOwner, userId))) as [workspace];
  return sharedWorkspaces;
};

export const addCollaborators = async (users: User[], workspaceId: string) => {
  const response = users.forEach(async (user: User) => {
    const userExists = await db.query.collaborators.findFirst({
      where: (table, { eq }) =>
        and(eq(table.userId, user.id), eq(table.workspaceId, workspaceId)),
    });
    if (!userExists)
      await db.insert(collaborators).values({ workspaceId, userId: user.id });
  });
};

export const getUsersFromSearch = async (email: string) => {
  if (!email) return [];
  const accounts = await db.query.users.findMany({
    where: (fields, { ilike }) => ilike(fields.email, `%${email}%`),
  });
  return accounts;
};

export const createFolder = async (folder: Folder) => {
  try {
    const results = await db.insert(folders).values(folder);
    return { data: null, error: null };
  } catch (error) {
    console.error(error);
    return { data: null, error: "Error" };
  }
};

export const updateFolder = async (
  folder: Partial<Folder>,
  folderId: string
) => {
  try {
    await db.update(folders).set(folder).where(eq(folders.id, folderId));
    return { data: null, error: null };
  } catch (error) {
    console.error(error);
    return { data: null, error: "error" };
  }
};

export const getFiles = async (folderId: string, skip?: number) => {
  const isValid = validate(folderId);
  if (!isValid) return { data: [], error: "Error" }; // Return empty array on validation failure
  skip = skip || 0; // Default to 0 if skip is not provided
  try {
    const results = await db.query.files.findMany({
      where: (table, { eq }) => eq(table.folderId, folderId),
      orderBy: (table, { asc }) => asc(table.createdAt),
      with: {
        tags: {
          with: {
            tag: true, // Include tag details
          },
        },
      },
      limit: 20,
      offset: skip,
    });
    let data = results.map((file) => ({
      ...file,
      tags: file.tags.map((item) => item.tag),
    }));
    return { data, error: null }; // Ensure data is always an array
  } catch (error) {
    console.log(error);
    return { data: [], error: "Error" }; // Return empty array on error
  }
};

export const getFilesForFolderPage = async (
  folderId: string,
  skip?: number
) => {
  const isValid = validate(folderId);
  if (!isValid) return { data: [], error: "Error" }; // Return empty array on validation failure
  skip = skip || 0; // Default to 0 if skip is not provided
  try {
    const results = await db.query.files.findMany({
      where: (table, { eq }) => eq(table.folderId, folderId),
      orderBy: (table, { asc }) => asc(table.createdAt),
      with: {
        tags: true, // Include tags in the results
      },
      limit: 20,
      offset: skip,
    });

    return { data: results, error: null }; // Ensure data is always an array
  } catch (error) {
    return { data: [], error: "Error" }; // Return empty array on error
  }
};

export const createFile = async (file: File) => {
  try {
    const results = await db.insert(files).values(file).returning(); // Return the inserted file data
    return { data: results[0], error: null }; // Return the created file's data
  } catch (error) {
    console.error(error);
    return { data: null, error: "Error" };
  }
};

export const updateFile = async (file: Partial<File>, fileId: string) => {
  try {
    const results = await db
      .update(files)
      .set(file)
      .where(eq(files.id, fileId));
    return { data: null, error: null };
  } catch (error) {
    console.error(error);
    return { data: null, error: "error" };
  }
};

export const getCollaborators = async (workspaceId: string) => {
  const response = await db
    .select()
    .from(collaborators)
    .where(eq(collaborators.workspaceId, workspaceId));
  if (!response.length) return [];
  const userInformation: Promise<User | undefined>[] = response.map(
    async (user) => {
      const exists = await db.query.users.findFirst({
        where: (u, { eq }) => eq(u.id, user.userId),
      });
      return exists;
    }
  );
  const resolvedUsers = await Promise.all(userInformation);
  return resolvedUsers.filter(Boolean) as User[];
};

export const updateWorkspace = async (
  workspace: Partial<workspace>,
  workspaceId: string
) => {
  try {
    const response = await db
      .update(workspaces)
      .set(workspace)
      .where(eq(workspaces.id, workspaceId));
    return { data: null, error: null };
  } catch (error) {
    console.error(error);
    return { data: null, error: "Error" };
  }
};

export const removeCollaborators = async (
  users: User[],
  workspaceId: string
) => {
  const response = users.forEach(async (user: User) => {
    const userExists = await db.query.collaborators.findFirst({
      where: (u, { eq }) =>
        and(eq(u.userId, user.id), eq(u.workspaceId, workspaceId)),
    });

    if (userExists) {
      await db
        .delete(collaborators)
        .where(
          and(
            eq(collaborators.workspaceId, workspaceId),
            eq(collaborators.userId, user.id)
          )
        );
    }
  });
};

export const fetchTags = async () => {
  try {
    const results = await db.query.tags.findMany({
      orderBy: (table, { asc }) => asc(table.createdAt),
    });
    return { data: results, error: null };
  } catch (error) {
    return { data: [], error: "Error fetching tags" };
  }
};

export const createTag = async (newTag: { name: string; color?: string }) => {
  try {
    const user = await getUserServer();
    if (!user) {
      return { data: null, error: "User not authenticated" };
    }
    const insertData: { name: string; createdBy: string; color?: string } = {
      name: newTag.name,
      createdBy: user,
    };
    if (newTag.color !== undefined) {
      insertData.color = newTag.color;
    }
    const results = await db.insert(tags).values(insertData).returning();
    return { data: results[0], error: null };
  } catch (error) {
    return { data: null, error: "Error creating tag" };
  }
};

export const updateTag = async (
  updatedTag: { id: string } & Partial<Omit<Tag, "id">>
) => {
  try {
    const user = await getUserServer();
    if (!user) {
      return { data: null, error: "User not authenticated" };
    }
    await db
      .update(tags)
      .set(updatedTag)
      .where(and(eq(tags.id, updatedTag.id), eq(tags.createdBy, user)));
    return { data: null, error: null };
  } catch (error) {
    console.error(error);
    return { data: null, error: "Error updating tag" };
  }
};

export const deleteTag = async (tagId: string) => {
  if (!tagId) return { error: "Tag not found" };
  try {
    const user = await getUserServer();
    if (!user) {
      return { data: null, error: "User not authenticated" };
    }
    await db
      .delete(tags)
      .where(and(eq(tags.id, tagId), eq(tags.createdBy, user)));
    return { data: "Tag deleted successfully" };
  } catch (error) {
    return { error: "Error deleting tag" };
  }
};

export const applyTagsToFile = async (fileId: string, tags: string[]) => {
  if (!fileId || !tags.length) return { error: "File or Tag not found" };
  try {
    await db.insert(fileTags).values(tags.map((tagId) => ({ fileId, tagId })));
    return { data: "Tags applied successfully" };
  } catch (error) {
    return { error: "Error applying tags to file" };
  }
};
export const removeTagsFromFile = async (fileId: string, tags: string[]) => {
  if (!fileId || !tags.length) return { error: "File or Tag not found" };
  try {
    const userId = await getUserServer();
    if (!userId) return { error: "User not authenticated" };
    const file = await db.query.files.findFirst({
      where: (table, { eq }) => eq(table.id, fileId),
    });
    if (!file) return { error: "File not found" };
    const workspace = await db.query.workspaces.findFirst({
      where: (table, { eq }) => eq(table.id, file.workspaceId),
    });
    if (!workspace) {
      return { error: "Not found workspace" };
    }
    if (workspace.workspaceOwner !== userId) {
      const collaborators = await db.query.collaborators.findMany({
        where: (table, { eq }) => eq(table.workspaceId, file.workspaceId),
      });
      const isUserCollaborator = collaborators.some(
        (collaborator) => collaborator.userId === userId
      );
      if (!isUserCollaborator) {
        return { error: "User not authorized to remove tags from this file" };
      }
    }

    await db
      .delete(fileTags)
      .where(and(eq(fileTags.fileId, fileId), inArray(fileTags.tagId, tags)));
    return { data: "Tags unassigned successfully" };
  } catch (error) {
    return { error: "Error removing tags to file" };
  }
};

export const getTagsByFile = async (fileId: string) => {
  const isValid = validate(fileId);
  if (!isValid) return { data: [], error: "Error" };
  try {
    const results = await db.query.fileTags.findMany({
      where: (table, { eq }) => eq(table.fileId, fileId),
    });
    return { data: results, error: null };
  } catch (error) {
    console.error(error);
    return { data: [], error: "Error fetching tags for file" };
  }
};
