export const allPostInitialState = null;

export const allPostReducer = (allPostState, action) => {
  if (action.type === "ALLPOST") {
    console.log("ALlPOST");
    return action.payload;
  }
  //   if (action.type === "LIKE_UNLIKE") {
  //     const newSingalPost = myFollowingPostState.map((post) => {
  //       if (post._id === action.payload._id) {
  //         return { ...post, likes: action.payload.likes };
  //       } else {
  //         return post;
  //       }
  //     });
  //     return newSingalPost;
  //   }
  //   if (action.type === "CLEAR") {
  //     return null;
  //   }
  //   if (action.type === "UPDATE") {
  //     return {
  //       ...userState,
  //       following: action.payload.following,
  //     };
  //   }
  //   if (action.type === "UPDATEPIC") {
  //     return {
  //       ...userState,
  //       pic: action.payload,
  //     };
  //   }
  return allPostState;
};
