import {
  createFile,
  deletFile,
  getFiles,
  updateFile,
  getFilesDetails,
} from "@/lib/supabase/queries";
import { File, Tag } from "@/lib/supabase/supabase.types";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

type FileWithTag = File & {
  tags: Tag[];
};

export const fileApi = createApi({
  reducerPath: "fileApi",
  tagTypes: ["File"],
  baseQuery: fakeBaseQuery(),
  keepUnusedDataFor: 60 * 5,
  refetchOnFocus: false,

  endpoints: (builder) => ({
    // Fetch files in a folder
    getFiles: builder.query<FileWithTag[], string>({
      queryFn: async (folderId: string) => {
        const { data, error } = await getFiles(folderId);
        if (error) return { error: { message: error } };

        return { data: data as FileWithTag[] };
      },
      providesTags: (result, error, folderId) => [
        { type: "File", id: `folder-${folderId}` },
      ],
      keepUnusedDataFor: 60 * 10,
    }),

    // Fetch details of a specific file
    getFileDetails: builder.query<FileWithTag, string>({
      queryFn: async (fileId: string) => {
        const { data, error } = await getFilesDetails(fileId);
        if (error) return { error: { message: error } };
        if (!data) {
          return {
            error: { message: "File not found" },
          };
        }
        // Ensure the result is an array of FileWithTag

        return { data: data as unknown as FileWithTag };
      },
      providesTags: (result, error, fileId) => [{ type: "File", id: fileId }],
      keepUnusedDataFor: 1000,
    }),

    // Create a new file with optimistic updates
    createFile: builder.mutation<FileWithTag, File>({
      queryFn: async (newFile: File) => {
        const { data, error } = await createFile(newFile);
        if (error || !data)
          return { error: { message: error || "No data returned" } };

        // Transform the returned File to FileWithTag by adding empty tags array
        const fileWithTag: FileWithTag = {
          ...data,
          tags: [], // Add empty tags array since newly created files don't have tags
        };

        return { data: fileWithTag };
      },
      onQueryStarted: async (file, { dispatch, queryFulfilled }) => {
        if (!file.folderId || !file) return;

        // Optimistically update the files in the cache for the relevant folder
        const patchResult = dispatch(
          fileApi.util.updateQueryData(
            "getFiles",
            file.folderId,
            (draftFiles) => {
              if (draftFiles) {
                draftFiles.push({
                  ...file,
                  tags: [], // Add empty tags array for FileWithTag type
                });
              }
            }
          )
        );

        try {
          const { data } = await queryFulfilled;
          // Update the optimistic entry with the actual server response
          dispatch(
            fileApi.util.updateQueryData(
              "getFiles",
              file.folderId,
              (draftFiles) => {
                if (draftFiles) {
                  const index = draftFiles.findIndex((f) => f.id === file.id);
                  if (index !== -1) {
                    draftFiles[index] = data; // data is already FileWithTag
                  }
                }
              }
            )
          );
        } catch (error) {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, file) => [
        { type: "File", id: `folder-${file.folderId}` },
      ],
    }),

    // Delete a file
    deleteFile: builder.mutation<string, string>({
      queryFn: async (fileId: string) => {
        const { data, error } = await deletFile(fileId);
        if (error) return { error: { message: error } };
        return { data };
      },
      onQueryStarted: async (
        fileId,
        { dispatch, queryFulfilled, getState }
      ) => {
        // We need to find which folder this file belongs to for optimistic updates
        const state = getState() as any;
        const fileApiState = state.fileApi;

        // Find the folder that contains this file
        let targetFolderId: string | null = null;
        Object.entries(fileApiState.queries).forEach(
          ([key, query]: [string, any]) => {
            if (key.startsWith("getFiles(") && query.data) {
              const files = query.data as FileWithTag[];
              if (files.some((file) => file.id === fileId)) {
                // Extract folderId from the query key
                const match = key.match(/getFiles\("([^"]+)"\)/);
                if (match) {
                  targetFolderId = match[1];
                }
              }
            }
          }
        );

        let patchResult: any;
        if (targetFolderId) {
          patchResult = dispatch(
            fileApi.util.updateQueryData(
              "getFiles",
              targetFolderId,
              (draftFiles) => {
                if (draftFiles) {
                  return draftFiles.filter((file) => file.id !== fileId);
                }
                return draftFiles;
              }
            )
          );
        }

        try {
          await queryFulfilled;
        } catch (error) {
          if (patchResult) {
            patchResult.undo();
          }
        }
      },
      invalidatesTags: (result, error, fileId) => [
        { type: "File", id: fileId },
      ],
    }),

    // Update a file
    updateFile: builder.mutation<
      null, // Changed return type to FileWithTag for consistency
      {
        updatedData: Partial<File>;
        fileId: string;
      }
    >({
      queryFn: async ({
        updatedData,
        fileId,
      }: {
        updatedData: Partial<File>;
        fileId: string;
      }) => {
        const { data, error } = await updateFile(updatedData, fileId);
        if (error) {
          return { error: { message: error } };
        }
        return { data: null };
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
            (draftFiles) => {
              if (!draftFiles) return;
              const index = draftFiles.findIndex((file) => file.id === fileId);
              if (index !== -1) {
                draftFiles[index] = { ...draftFiles[index], ...updatedData };
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
      invalidatesTags: (result, error, { fileId, updatedData }) => [
        { type: "File", id: fileId },
        { type: "File", id: `folder-${updatedData.folderId}` },
      ],
    }),
  }),
});

export const {
  useGetFilesQuery,
  useGetFileDetailsQuery,
  useCreateFileMutation,
  useDeleteFileMutation,
  useUpdateFileMutation,
} = fileApi;
