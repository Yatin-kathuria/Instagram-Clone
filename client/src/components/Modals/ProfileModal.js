import React from "react";
import "./ProfileModal.css";
import { Modal } from "@material-ui/core";
import { useGlobalContext } from "../../context";

function ProfileModal({
  profileModalOpen,
  setProfileModalOpen,
  singalPost,
  //   deleteModalOpen,
  //   setDeleteModalOpen,
  //   comment,
  //   deleteComment,
}) {
  const {
    userState,
    userDispatch,
    myFollowingPostDispatch,
  } = useGlobalContext();

  const unFollowUser = () => {
    // setFollowingProcessing(true);
    fetch(
      `${
        process.env.NODE_ENV === "production"
          ? "/unfollow"
          : "http://localhost:5000/unfollow"
      }`,
      {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({
          unFollowId: singalPost.postedBy._id,
        }),
      }
    )
      .then((res) => res.json())
      .then((result) => {
        userDispatch({
          type: "UPDATE",
          payload: {
            following: result.followingResult.following,
          },
        });
        const localUser = JSON.parse(localStorage.getItem("user"));
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...localUser,
            following: result.followingResult.following,
          })
        );
        myFollowingPostDispatch({
          type: "REMOVE",
          payload: result.followersResult._id,
        });
      })
      .catch((error) => console.log(`from error ${error}`));
  };

  const deletepost = (postId) => {
    fetch(
      `${
        process.env.NODE_ENV === "production"
          ? `/deletepost/${postId}`
          : `http://localhost:5000/deletepost/${postId}`
      }`,
      {
        method: "delete",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      }
    )
      .then((res) => res.json())
      .then(({ result }) => {
        myFollowingPostDispatch({
          type: "REMOVE_POST",
          payload: result._id,
        });
        // const newData = posts.filter((post) => post._id !== result._id);
        // setPosts(newData);
      })
      .catch((error) => console.log(error));
  };

  const body = (
    <div className="profileModal">
      <div className="deleteModal_container">
        <button className="button special-style border-b">Report</button>
        {userState._id === singalPost.postedBy._id ? (
          <button
            className="button special-style border-b"
            onClick={() => deletepost(singalPost._id)}
          >
            Delete
          </button>
        ) : (
          <button
            className="button special-style border-b"
            onClick={unFollowUser}
          >
            Unfollow
          </button>
        )}
        {/* <button className="button border-b">Go to post</button>
        <button className="button border-b">Share to...</button>
        <button className="button border-b">Copy Link</button>
        <button className="button border-b">Embed</button> */}
        <button className="button " onClick={() => setProfileModalOpen(false)}>
          cancel
        </button>
      </div>
    </div>
  );

  return (
    <Modal
      open={profileModalOpen}
      onClose={() => setProfileModalOpen(false)}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      {body}
    </Modal>
  );
}

export default ProfileModal;
