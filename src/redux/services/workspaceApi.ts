import {
  createWorkspace,
  getAllWorkspacesOfUser,
  getCollaboratingWorkspaces,
  getPrivateWorkspaces,
  getSharedWorkspaces,
  updateWorkspace,
  deleteWorkspace,
  getCollaborators,
} from "@/lib/supabase/queries";
import { workspace } from "@/lib/supabase/supabase.types";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export type CollabUser = {
  id: string;

  fullName: string | null;
  avatarUrl: string | null;
  email: string | null;
  joinedAt: string;
};

export const workspaceApi = createApi({
  reducerPath: "workspaceApi",
  tagTypes: ["Workspace"],
  baseQuery: fakeBaseQuery(),
  keepUnusedDataFor: 60 * 5,
  endpoints: (builder) => ({
    getAllWorkspacesOfUser: builder.query({
      queryFn: async () => {
        const data = await getAllWorkspacesOfUser();
        return { data: { ...data } };
      },
      keepUnusedDataFor: 1200,
      providesTags: ["Workspace"],
    }),
    getPrivateWorkspaces: builder.query({
      keepUnusedDataFor: 1200,
      queryFn: async () => {
        const data = await getPrivateWorkspaces();
        return { data };
      },
      providesTags: ["Workspace"],
    }),
    getCollaboratingWorkspaces: builder.query({
      queryFn: async () => {
        const data = await getCollaboratingWorkspaces();
        return { data };
      },
      providesTags: ["Workspace"],
    }),
    getSharedWorkspaces: builder.query({
      queryFn: async () => {
        const data = await getSharedWorkspaces();
        return { data };
      },
      providesTags: ["Workspace"],
    }),

    // Create Workspace Mutation with Optimistic Update
    createWorkspace: builder.mutation({
      queryFn: async ({ workspace }: { workspace: workspace }) => {
        const { data, error } = await createWorkspace(workspace);
        if (error) return { error: { message: "Could not create workspace" } };
        return { data: {} };
      },
      onQueryStarted: async ({ workspace }, { dispatch, queryFulfilled }) => {
        // Optimistically add the new workspace
        const patchResult = dispatch(
          workspaceApi.util.updateQueryData(
            "getPrivateWorkspaces",
            null,
            (draftWorkspaces) => {
              draftWorkspaces.push({
                ...workspace,
              });
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          // Rollback if the mutation fails
          patchResult.undo();
        }
      },
      invalidatesTags: ["Workspace"],
    }),

    // Update Workspace Mutation with Optimistic Update
    updateWorkspace: builder.mutation({
      queryFn: async ({
        workspace,
        workspaceId,
      }: {
        workspace: Partial<workspace>;
        workspaceId: string;
      }) => {
        const { data, error } = await updateWorkspace(workspace, workspaceId);
        if (error) return { error: { message: "Could not update workspace" } };
        return { data: {} };
      },
      onQueryStarted: async (
        { workspace: updatedWorkspace, workspaceId },
        { dispatch, queryFulfilled }
      ) => {
        // Optimistically update the workspace
        const patchResult = dispatch(
          workspaceApi.util.updateQueryData(
            "getPrivateWorkspaces",
            null,
            (draftWorkspaces) => {
              return draftWorkspaces.map((workspace) => {
                if (workspace.id === workspaceId) {
                  return { ...workspace, ...updatedWorkspace };
                }
                return workspace;
              });
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          // Rollback if the mutation fails
          patchResult.undo();
        }
      },
      invalidatesTags: ["Workspace"],
    }),

    // Delete Workspace Mutation with Optimistic Update
    deleteWorkspace: builder.mutation({
      queryFn: async ({ workspaceId }: { workspaceId: string }) => {
        const { data, error } = await deleteWorkspace(workspaceId);
        if (error) return { error: { message: "Could not delete workspace" } };
        return { data: {} };
      },
      onQueryStarted: async ({ workspaceId }, { dispatch, queryFulfilled }) => {
        // Optimistically remove the workspace
        const patchResult = dispatch(
          workspaceApi.util.updateQueryData(
            "getPrivateWorkspaces",
            null,
            (draftWorkspaces) => {
              const index = draftWorkspaces.findIndex(
                (w) => w.id === workspaceId
              );
              if (index !== -1) {
                draftWorkspaces.splice(index, 1);
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          // Rollback if the mutation fails
          patchResult.undo();
        }
      },
      invalidatesTags: ["Workspace"],
    }),
    getCollaboratorOfWorkspace: builder.query<
      CollabUser[],
      { workspaceId: string }
    >({
      queryFn: async ({ workspaceId }) => {
        try {
          const response = await getCollaborators(workspaceId);
          return { data: response };
        } catch {
          return { error: "Error" };
        }
      },
    }),
  }),
});

export const {
  useGetAllWorkspacesOfUserQuery,
  useGetPrivateWorkspacesQuery,
  useGetCollaboratingWorkspacesQuery,
  useGetSharedWorkspacesQuery,
  useLazyGetPrivateWorkspacesQuery,
  useCreateWorkspaceMutation,
  useUpdateWorkspaceMutation,
  useDeleteWorkspaceMutation,
  useGetCollaboratorOfWorkspaceQuery,
} = workspaceApi;
