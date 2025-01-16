// GlobalProvider.tsx
import React from "react";
import { GlobalContext } from "./GlobalContext";
import { useGlobalState } from "./GlobalState";
import { useRefreshUser } from "./useRefreshUser";

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const state = useGlobalState();
  const refreshUserRecord = useRefreshUser(
    state.user,
    state.setUserInfo,
    state.setUserActivity,
    state.setUserLine,
    state.setUserPost,
    state.setUserNotification
  );

  return (
    <GlobalContext.Provider value={{ ...state, refreshUserRecord }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
