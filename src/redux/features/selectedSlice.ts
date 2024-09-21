import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define types for Workspace, Folder, and File
interface Workspace {
  id: string;
  // Add other properties as necessary
}

interface Folder {
  id: string;
  // Add other properties as necessary
}

interface File {
  id: string;
  // Add other properties as necessary
}

// Define the state shape for selected entities
interface SelectedEntitiesState {
  workspaceId: string | null;
  folderId: string | null;
  fileId: string | null;
  selectedWorkspace: Workspace | null;
  selectedFolder: Folder | null;
  selectedFile: File | null;
}

// Initial state
const initialState: SelectedEntitiesState = {
  workspaceId: null,
  folderId: null,
  fileId: null,
  selectedWorkspace: null,
  selectedFolder: null,
  selectedFile: null,
};

// Create the slice
const selectedEntitiesSlice = createSlice({
  name: "selectedEntities",
  initialState,
  reducers: {
    setSelectedWorkspaceId: (state, action: PayloadAction<string>) => {
      state.workspaceId = action.payload;
    },
    setSelectedFolderId: (state, action: PayloadAction<string>) => {
      state.folderId = action.payload;
    },
    setSelectedFileId: (state, action: PayloadAction<string>) => {
      state.fileId = action.payload;
    },
    setSelectedWorkspace: (state, action: PayloadAction<Workspace | null>) => {
      state.selectedWorkspace = action.payload;
      // Optionally reset folder and file when workspace changes
      state.selectedFolder = null;
      state.selectedFile = null;
    },
    setSelectedFolder: (state, action: PayloadAction<Folder | null>) => {
      state.selectedFolder = action.payload;
      // Optionally reset file when folder changes
      state.selectedFile = null;
    },
    setSelectedFile: (state, action: PayloadAction<File | null>) => {
      state.selectedFile = action.payload;
    },
    clearSelections: (state) => {
      state.selectedWorkspace = null;
      state.selectedFolder = null;
      state.selectedFile = null;
    },
  },
});

// Export actions
export const {
  setSelectedWorkspace,
  setSelectedFolder,
  setSelectedFile,
  setSelectedFolderId,
  setSelectedFileId,
  setSelectedWorkspaceId,
  clearSelections,
} = selectedEntitiesSlice.actions;

// Export the reducer
export default selectedEntitiesSlice.reducer;
