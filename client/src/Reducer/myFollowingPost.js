export const myFollowingPostInitialState = null;

export const myFollowingPostReducer = (myFollowingPostState, action) => {
  if (action.type === "MYFOLLOWINGPOST") {
    return action.payload;
  }

  if (action.type === "UPDATE_POSTS") {
    return [action.payload, ...myFollowingPostState];
  }

  if (action.type === "LIKE_UNLIKE") {
    const newSingalPost = myFollowingPostState.map((post) => {
      if (post._id === action.payload._id) {
        return { ...post, likes: action.payload.likes };
      } else {
        return post;
      }
    });
    return newSingalPost;
  }
  if (action.type === "UPDATE_COMMENT") {
    const newSingalPost = myFollowingPostState.map((post) => {
      if (post._id === action.payload._id) {
        return { ...post, comments: action.payload.comments };
      } else {
        return post;
      }
    });
    return newSingalPost;
  }
  if (action.type === "REMOVE") {
    const newPosts = myFollowingPostState.filter(
      (post) => post.postedBy._id !== action.payload
    );
    return newPosts;
  }
  if (action.type === "REMOVE_POST") {
    const newPosts = myFollowingPostState.filter(
      (post) => post._id !== action.payload
    );
    return newPosts;
  }

  if (action.type === "UPDATE_SAVEDBY") {
    const newState = myFollowingPostState.map((post) => {
      if (post._id === action.payload._id) {
        return { ...post, savedBy: action.payload.savedBy };
      } else {
        return post;
      }
    });
    return newState;
  }
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
  return myFollowingPostState;
};
