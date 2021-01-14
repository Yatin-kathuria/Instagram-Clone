export const userInitialState = null;

export const userReducer = (userState, action) => {
  if (action.type === "USER") {
    return action.payload;
  }
  if (action.type === "CLEAR") {
    return null;
  }
  if (action.type === "UPDATE") {
    return {
      ...userState,
      following: action.payload.following,
    };
  }
  if (action.type === "UPDATEPIC") {
    return {
      ...userState,
      pic: action.payload,
    };
  }

  if (action.type === "EDIT") {
    return action.payload;
  }

  return userState;
};
