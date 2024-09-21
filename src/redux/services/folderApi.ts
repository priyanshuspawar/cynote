import {
  createFolder,
  getFolderDetails,
  getFolders,
  deleteFolder,
  updateFolder,
} from "@/lib/supabase/queries";
import { Folder } from "@/lib/supabase/supabase.types";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const folderApi = createApi({
  reducerPath: "folderApi",
  tagTypes: ["Folder"],
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    // Fetch all folders in a workspace
    getFolders: builder.query({
      queryFn: async (workspaceId: string) => {
        const { data } = await getFolders(workspaceId);
        return { data };
      },
      providesTags: ["Folder"],
    }),

    // Fetch details of a specific folder
    getFolderDetails: builder.query({
      queryFn: async (folderId: string) => {
        const { data } = await getFolderDetails(folderId);
        return { data };
      },
      providesTags: ["Folder"],
    }),

    // Create a new folder with optimistic updates
    createFolder: builder.mutation({
      queryFn: async (folder: Folder) => {
        const { data } = await createFolder(folder);
        return { data };
      },
      onQueryStarted: async (folder, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          folderApi.util.updateQueryData(
            "getFolders",
            folder.workspaceId,
            (draftFolders) => {
              if (!draftFolders) {
                return [];
              }
              draftFolders.push({
                ...folder,
              });
            }
          )
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
        }
      },
      invalidatesTags: ["Folder"],
    }),

    // Update a folder with optimistic updates
    updateFolder: builder.mutation({
      queryFn: async ({
        folderId,
        updatedData,
      }: {
        folderId: string;
        updatedData: { workspaceId: string } & Omit<Partial<Folder>, "id">;
      }) => {
        const { data } = await updateFolder(updatedData, folderId);
        return { data };
      },
      onQueryStarted: async (
        { folderId, updatedData },
        { dispatch, queryFulfilled }
      ) => {
        if (!updatedData.workspaceId) {
          return;
        }
        const patchResult = dispatch(
          folderApi.util.updateQueryData(
            "getFolders",
            updatedData.workspaceId,
            (draftFolders) => {
              if (!draftFolders) return [];
              const index = draftFolders.findIndex(
                (folder) => folder.id == folderId
              );
              if (index !== -1) {
                draftFolders[index] = {
                  ...draftFolders[index],
                  ...updatedData,
                };
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
        }
      },
      invalidatesTags: ["Folder"],
    }),

    // Delete a folder with optimistic updates
    deleteFolder: builder.mutation({
      queryFn: async (folderId: string) => {
        const { data } = await deleteFolder(folderId);
        return { data };
      },
      onQueryStarted: async (folderId, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          folderApi.util.updateQueryData("getFolders", "", (draftFolders) => {
            return draftFolders?.filter((folder) => folder.id !== folderId);
          })
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
        }
      },
      invalidatesTags: ["Folder"],
    }),
  }),
});

export const {
  useGetFoldersQuery,
  useGetFolderDetailsQuery,
  useCreateFolderMutation,
  useUpdateFolderMutation,
  useDeleteFolderMutation,
} = folderApi;
