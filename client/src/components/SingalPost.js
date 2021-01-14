import React, { useState } from "react";
import { useGlobalContext } from "../context";
import PostModal from "./Modals/PostModal";
import "./SingalPost.css";

function SingalPost({ myPost }) {
  const { userState, myFollowingPostDispatch } = useGlobalContext();

  const [modalOpen, setModalOpen] = useState(false);
  const [singalPost, setSingalPost] = useState({ ...myPost });
  const [postLiked, setPostLiked] = useState(
    myPost.likes.includes(userState._id)
  );
  // const { pic, title } = myPost;

  const likePost = (id) => {
    setPostLiked(true);

    fetch(
      `${
        process.env.NODE_ENV === "production"
          ? "/like"
          : "http://localhost:5000/like"
      }`,
      {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({
          id,
        }),
      }
    )
      .then((res) => res.json())
      .then((likedPost) => {
        if (likedPost) {
          setPostLiked(true);
          setSingalPost({ ...singalPost, likes: likedPost.likes });
          myFollowingPostDispatch({ type: "LIKE_UNLIKE", payload: likedPost });
        } else {
          setPostLiked(false);
        }
      })
      .catch((error) => console.log(error));
  };

  const unlikePost = (id) => {
    setPostLiked(false);
    fetch(
      `${
        process.env.NODE_ENV === "production"
          ? "/unlike"
          : "http://localhost:5000/unlike"
      }`,
      {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({
          id,
        }),
      }
    )
      .then((res) => res.json())
      .then((unlikePost) => {
        if (unlikePost) {
          setPostLiked(false);
          setSingalPost({ ...singalPost, likes: unlikePost.likes });
          myFollowingPostDispatch({ type: "LIKE_UNLIKE", payload: unlikePost });
        } else {
          setPostLiked(true);
        }
      })
      .catch((error) => console.log(error));
  };
  return (
    <>
      <div className="singalPost" onClick={() => setModalOpen(true)}>
        <img
          src={singalPost?.pic}
          alt={singalPost?.title}
          className="singalPost_img"
        />
      </div>
      {modalOpen ? (
        <PostModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          singalPost={singalPost}
          setSingalPost={setSingalPost}
          postLiked={postLiked}
          likePost={likePost}
          unlikePost={unlikePost}
        />
      ) : null}
    </>
  );
}

export default SingalPost;
