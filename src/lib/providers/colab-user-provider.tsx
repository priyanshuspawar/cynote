"use client";
import React, { createContext, useContext, useReducer } from "react";

interface ColabUserContext {
  clientId: string;
  name: string;
  color: string;
  initials?: string;
}

// Define the state structure
interface UserState {
  users: ColabUserContext[] | [];
}

// Initial state
const initialState: UserState = {
  users: [],
};

// Define action types
type Action = {
  type: "UPDATE_USER";
  payload: ColabUserContext[];
};

// Reducer function
const userReducer = (
  state: UserState = initialState,
  action: Action
): UserState => {
  switch (action.type) {
    case "UPDATE_USER":
      return {
        users: action.payload,
      };
    default:
      return state;
  }
};

// Create the context with a proper type
interface UserContextType {
  state: UserState;
  dispatch: React.Dispatch<Action>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a provider component
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
