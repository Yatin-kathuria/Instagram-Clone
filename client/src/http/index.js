import axios from "axios";

const api = axios.create({
  baseURL: process.env.NODE_ENV === "production" ? "" : "http://localhost:5000",
  headers: {
    "Content-type": "application/json",
    Accept: "application/json",
  },
});

// List of all the endpoints
export const signIn = (payload) => api.post("/signin", payload);

export default api;
