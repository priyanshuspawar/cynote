import { configureStore } from "@reduxjs/toolkit";
import { workspaceApi } from "./services/workspaceApi";
import selectedEntitiesReducer from "./features/selectedSlice";
import { folderApi } from "./services/folderApi";
import { fileApi } from "./services/fileApi";
import { tagApi } from "./services/tagsApi";

export const store = configureStore({
  reducer: {
    selectedEntities: selectedEntitiesReducer,
    [workspaceApi.reducerPath]: workspaceApi.reducer,
    [folderApi.reducerPath]: folderApi.reducer,
    [fileApi.reducerPath]: fileApi.reducer,
    [tagApi.reducerPath]: tagApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      workspaceApi.middleware,
      fileApi.middleware,
      folderApi.middleware,
      tagApi.middleware,
    ]),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
