import {
  createFile,
  deletFile,
  getFiles,
  updateFile,
  getFilesDetails,
} from "@/lib/supabase/queries";
import { File } from "@/lib/supabase/supabase.types";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const fileApi = createApi({
  reducerPath: "fileApi",
  tagTypes: ["File"],
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    // Fetch files in a folder
    getFiles: builder.query({
      queryFn: async (folderId: string) => {
        const { data, error } = await getFiles(folderId);
        if (error) return { error: { message: error } }; // Handle errors properly
        return { data };
      },
      providesTags: ["File"],
    }),

    // Fetch details of a specific file
    getFilesDetails: builder.query({
      keepUnusedDataFor: 1000,
      queryFn: async (fileId: string) => {
        const { data, error } = await getFilesDetails(fileId);
        if (error) return { error: { message: error } }; // Handle errors properly
        return { data };
      },
      onQueryStarted: async (fileId, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          if (data && data.folderId) {
            dispatch(
              fileApi.util.updateQueryData(
                "getFiles",
                data.folderId,
                (draftFile) => {
                  if (!draftFile) return [];
                  const index = draftFile.findIndex(
                    (file) => file.id === fileId
                  );
                  if (index !== -1) {
                    draftFile[index] = { ...draftFile[index] };
                  }
                }
              )
            );
          }
          return;
        } catch (error) {}
      },
      providesTags: ["File"],
    }),

    // Create a new file with optimistic updates
    createFile: builder.mutation({
      queryFn: async (newFile: File) => {
        const { data, error } = await createFile(newFile);
        if (error) return { error: { message: error } }; // Handle errors properly
        return { data }; // Return the created file
      },
      onQueryStarted: async (file, { dispatch, queryFulfilled }) => {
        if (!file.folderId || !file) return;

        // Optimistically update the files in the cache for the relevant folder
        const patchResult = dispatch(
          fileApi.util.updateQueryData(
            "getFiles",
            file.folderId,
            (draftFiles) => {
              draftFiles?.push(file); // Add the new file optimistically
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo(); // Rollback if mutation fails
        }
      },
      invalidatesTags: ["File"], // Invalidate file list to refresh after mutation
    }),
    deleteFile: builder.mutation({
      queryFn: async (fileId: string) => {
        const { data, error } = await deletFile(fileId);
        return { data };
      },
      onQueryStarted: async (fileId, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          fileApi.util.updateQueryData("getFiles", fileId, (draftFiles) => {
            return draftFiles?.filter((file) => file.id !== fileId);
          })
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
        }
      },
    }),
    updateFile: builder.mutation({
      queryFn: async ({
        updatedData,
        fileId,
      }: {
        updatedData: { folderId: string } & Omit<Partial<File>, "id">;
        fileId: string;
      }) => {
        const { data } = await updateFile(updatedData, fileId);
        return { data };
      },
      onQueryStarted: async (
        { fileId, updatedData },
        { dispatch, queryFulfilled }
      ) => {
        if (!updatedData.folderId) {
          return;
        }
        const patchResult = dispatch(
          fileApi.util.updateQueryData(
            "getFiles",
            updatedData.folderId,
            (draftFile) => {
              if (!draftFile) return [];
              const index = draftFile.findIndex((file) => file.id == fileId);
              if (index !== -1) {
                draftFile[index] = { ...draftFile[index], ...updatedData };
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
    }),
  }),
});

export const {
  useGetFilesQuery,
  useLazyGetFilesDetailsQuery,
  useGetFilesDetailsQuery,
  useCreateFileMutation,
  useDeleteFileMutation,
  useUpdateFileMutation,
} = fileApi;
