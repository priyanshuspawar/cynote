import {
  applyTagsToFile,
  createTag,
  deleteTag,
  fetchTags,
  getTagsByFile,
  removeTagsFromFile,
  updateTag,
} from "@/lib/supabase/queries";
import { Tag } from "@/lib/supabase/supabase.types";
import { createApi } from "@reduxjs/toolkit/query/react";
import { use } from "react";
import { fileApi } from "./fileApi";

export const tagApi = createApi({
  reducerPath: "tagsApi",
  tagTypes: ["Tag"],
  baseQuery: async () => {
    // Implement your base query logic here
    return { data: [] } as { data: Tag[] }; // Placeholder for actual data fetching logic
  },
  endpoints: (builder) => ({
    getTags: builder.query({
      queryFn: async () => {
        const { data, error } = await fetchTags(); // Replace with actual fetch function
        if (error) return { error: { message: error } };
        return { data };
      },
      providesTags: ["Tag"],
    }),
    createTag: builder.mutation({
      queryFn: async (newTag) => {
        const { data, error } = await createTag(newTag); // Replace with actual create function
        if (error) return { error: { message: error } };
        return { data };
      },
      onQueryStarted: async (newTag, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          tagApi.util.updateQueryData("getTags", undefined, (draftTags) => {
            if (!draftTags) {
              return [];
            }
            draftTags.push(newTag);
          })
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
        }
      },
      invalidatesTags: ["Tag"],
    }),
    updateTag: builder.mutation({
      queryFn: async (
        updatedTag: { id: Tag["id"] } & Partial<Omit<Tag, "id">>
      ) => {
        const { data, error } = await updateTag(updatedTag); // Replace with actual create function
        if (error) return { error: { message: error } };
        return { data };
      },
      onQueryStarted: async (updatedTag, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          tagApi.util.updateQueryData("getTags", undefined, (draftTags) => {
            if (!draftTags) return [];
            const index = draftTags.findIndex(
              (tag) => tag.id === updatedTag.id
            );
            if (index !== -1) {
              draftTags[index] = { ...draftTags[index], ...updatedTag };
            }
          })
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
        }
      },
      invalidatesTags: ["Tag"],
    }),
    deleteTag: builder.mutation({
      queryFn: async (tagId: string) => {
        const { data, error } = await deleteTag(tagId); // Replace with actual delete function
        if (error) return { error: { message: error } };
        return { data };
      },
      onQueryStarted: async (tagId, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          tagApi.util.updateQueryData("getTags", undefined, (draftTags) => {
            if (!draftTags) return [];
            const index = draftTags.findIndex((tag) => tag.id === tagId);
            if (index !== -1) {
              draftTags.splice(index, 1);
            }
          })
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
        }
      },
      invalidatesTags: ["Tag"],
    }),
    getTagsByFile: builder.query({
      queryFn: async (fileId: string) => {
        if (!fileId) {
          return { data: [] };
        }
        const { data, error } = await getTagsByFile(fileId); // Replace with actual fetch function
        if (error) return { error: { message: error } };
        return { data };
      },
      providesTags: (result, error, fileId) => [{ type: "Tag", id: fileId }],
    }),
    applyTagsToFile: builder.mutation({
      queryFn: async ({ fileId, tags }: { fileId: string; tags: Tag[] }) => {
        const { data, error } = await applyTagsToFile(
          fileId,
          tags.map((tag) => tag.id)
        ); // Replace with actual apply function
        if (error) return { error: { message: error } };
        return { data: "Tag applied successfully" };
      },
      onQueryStarted: async (
        { fileId, tags },
        { dispatch, queryFulfilled }
      ) => {
        const patchResult = dispatch(
          tagApi.util.updateQueryData("getTagsByFile", fileId, (draftTags) => {
            if (!draftTags) return [];
            draftTags = [
              ...draftTags,
              ...tags.map((tag) => ({ fileId, tagId: tag.id })),
            ]; // Assuming Tag has name and color properties
            return draftTags;
          })
        );

        const patchResultFile = dispatch(
          fileApi.util.updateQueryData("getFiles", fileId, (draftTags) => {
            return draftTags.map((file) =>
              file.id === fileId
                ? { ...file, tags: [...file.tags, ...tags] }
                : file
            );
          })
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
          patchResultFile.undo();
        }
      },
      invalidatesTags: (result, error, { fileId }) => [
        { type: "Tag", id: fileId },
      ],
    }),
    removeTagsFromFile: builder.mutation({
      queryFn: async ({ fileId, tags }: { fileId: string; tags: string[] }) => {
        const { data, error } = await removeTagsFromFile(fileId, tags); // Replace with actual remove function
        if (error) return { error: { message: error } };
        return { data: "Tag removed successfully" };
      },
      onQueryStarted: async (
        { fileId, tags },
        { dispatch, queryFulfilled }
      ) => {
        const patchResult = dispatch(
          tagApi.util.updateQueryData("getTagsByFile", fileId, (draftTags) => {
            if (!draftTags) return [];
            draftTags = draftTags.filter((tag) => !tags.includes(tag.tagId));
            return draftTags;
          })
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, { fileId }) => [
        { type: "Tag", id: fileId },
      ],
    }),
  }),
});

export const {
  useGetTagsQuery,
  useCreateTagMutation,
  useDeleteTagMutation,
  useUpdateTagMutation,
  useGetTagsByFileQuery,
  useApplyTagsToFileMutation,
  useRemoveTagsFromFileMutation,
} = tagApi;
