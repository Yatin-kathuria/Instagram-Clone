import axios from "axios";

const api = axios.create({
  baseURL: process.env.NODE_ENV === "production" ? "" : "http://localhost:5000",
  headers: {
    "Content-type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
  },
});

// List of all the endpoints
export const signIn = (payload) => api.post("/signin", payload);

export const resetPassword = (payload) => api.post("/resetpassword", payload);

export const likeComment = (payload) => api.put("/like_comment", payload);

export const unlikeComment = (payload) => api.put("/unlike_comment", payload);

export const like = (payload) => api.put("/like", payload);

export const unlike = (payload) => api.put("/unlike", payload);

export const savedPost = (payload) => api.put("/saved-post", payload);

export const unsavedPost = (payload) => api.put("/unsaved-post", payload);

export const addComment = (payload) => api.put("/comment", payload);

export const deleteComment = (postId, commentId) =>
  api.delete(`/deletecomment/${postId}&${commentId}`);

export default api;
