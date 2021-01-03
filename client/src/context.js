import React, { useState, useContext, useEffect, useReducer } from "react";
import { initialState, reducer } from "./Reducer/useReducer";
const userContext = React.createContext();

const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <userContext.Provider value={{ state, dispatch }}>
      {children}
    </userContext.Provider>
  );
};
// make sure use
export const useGlobalContext = () => {
  return useContext(userContext);
};

export { UserProvider };
