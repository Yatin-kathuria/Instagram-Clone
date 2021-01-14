import React, { useContext, useReducer } from "react";
import { userInitialState, userReducer } from "./Reducer/userReducer";
import {
  myFollowingPostInitialState,
  myFollowingPostReducer,
} from "./Reducer/myFollowingPost";
import { allPostInitialState, allPostReducer } from "./Reducer/allPost";
const userContext = React.createContext();

const UserProvider = ({ children }) => {
  const [userState, userDispatch] = useReducer(userReducer, userInitialState);
  const [myFollowingPostState, myFollowingPostDispatch] = useReducer(
    myFollowingPostReducer,
    myFollowingPostInitialState
  );
  const [allPostState, allPostDispatch] = useReducer(
    allPostReducer,
    allPostInitialState
  );

  return (
    <userContext.Provider
      value={{
        userState,
        userDispatch,
        myFollowingPostState,
        myFollowingPostDispatch,
        allPostState,
        allPostDispatch,
      }}
    >
      {children}
    </userContext.Provider>
  );
};
// make sure use
export const useGlobalContext = () => {
  return useContext(userContext);
};

export { UserProvider };
