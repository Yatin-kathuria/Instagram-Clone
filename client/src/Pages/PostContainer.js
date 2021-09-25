import React, { useEffect } from "react";
import "./PostContainer.css";
import Post from "./Post";
import { useGlobalContext } from "../context";

function PostContainer() {
  const { myFollowingPostState, myFollowingPostDispatch } = useGlobalContext();

  useEffect(() => {
    if (!myFollowingPostState) {
      fetch(
        `${
          process.env.NODE_ENV === "production"
            ? "/getsubpost"
            : "http://localhost:5000/getsubpost"
        }`,
        {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          myFollowingPostDispatch({
            type: "MYFOLLOWINGPOST",
            payload: data.posts,
          });
        })
        .catch((error) => console.log(error));
    }
  }, [myFollowingPostState, myFollowingPostDispatch]);

  return (
    <section className="postContainer">
      <div className="inner_postContainer">
        {myFollowingPostState?.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </section>
  );
}

export default PostContainer;
