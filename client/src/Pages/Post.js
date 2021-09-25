import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../context";
import "./Post.css";
import PostModal from "../components/Modals/PostModal";
import { Comment } from "../components/Comment";
import ProfileModal from "../components/Modals/ProfileModal";
import Moment from "react-moment";

function Post({ post }) {
  const { userState, myFollowingPostDispatch } = useGlobalContext();
  const [comment, setComment] = useState("");
  const [singalPost, setSingalPost] = useState(null);
  const [postLiked, setPostLiked] = useState(null);
  const [postSaved, setPostSaved] = useState(null);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  useEffect(() => {
    setSingalPost({ ...post });
    setPostLiked(post?.likes.includes(userState?._id));

    setPostSaved(post?.savedBy.includes(userState?._id));
  }, [post, userState]);
  // console.log();

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

  const savedPost = (id) => {
    setPostSaved(true);
    fetch(
      `${
        process.env.NODE_ENV === "production"
          ? "/saved-post"
          : "http://localhost:5000/saved-post"
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
      .then((result) => {
        if (result) {
          console.log(result);

          setSingalPost({
            ...singalPost,
            savedBy: result.savedPostResult.savedBy,
          });
          myFollowingPostDispatch({
            type: "UPDATE_SAVEDBY",
            payload: {
              savedBy: result.savedPostResult.savedBy,
              _id: result.savedPostResult._id,
            },
          });
        } else {
          setPostSaved(false);
        }
      })
      .catch((error) => console.log(error));
  };

  const unsavedPost = (id) => {
    setPostSaved(false);
    fetch(
      `${
        process.env.NODE_ENV === "production"
          ? "/unsaved-post"
          : "http://localhost:5000/unsaved-post"
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
      .then((result) => {
        if (result) {
          setSingalPost({
            ...singalPost,
            savedBy: result.savedPostResult.savedBy,
          });
          myFollowingPostDispatch({
            type: "UPDATE_SAVEDBY",
            payload: {
              savedBy: result.savedPostResult.savedBy,
              _id: result.savedPostResult._id,
            },
          });
        } else {
          setPostSaved(true);
        }
      })
      .catch((error) => console.log(error));
  };

  const addComment = (e) => {
    e.preventDefault();
    setComment("");
    fetch(
      `${
        process.env.NODE_ENV === "production"
          ? "/comment"
          : "http://localhost:5000/comment"
      }`,
      {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({
          text: comment,
          id: singalPost?._id,
        }),
      }
    )
      .then((res) => res.json())
      .then((result) => {
        setSingalPost({ ...singalPost, comments: result.comments });
        myFollowingPostDispatch({ type: "ADD_COMMENT", payload: result });
      })
      .catch((error) => console.log(error));
  };

  const deleteComment = (commentId) => {
    const postId = singalPost?._id;
    fetch(
      `${
        process.env.NODE_ENV === "production"
          ? `/deletecomment/${postId}&${commentId}`
          : `http://localhost:5000/deletecomment/${postId}&${commentId}`
      }`,
      {
        method: "delete",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      }
    )
      .then((res) => res.json())
      .then((result) => {
        setSingalPost({ ...singalPost, comments: result.comments });
        myFollowingPostDispatch({ type: "UPDATE_COMMENT", payload: result });
      })
      .catch((error) => console.log(error));
  };

  if (!singalPost) {
    return null;
  }

  if (singalPost) {
    return (
      <article className="post">
        <header className="post_header">
          <div className="post_header_content">
            <div className="post_profile">
              {/* <div className="post_profile_border"></div> */}
              <img
                src={singalPost?.postedBy.pic}
                alt="profile pic"
                className="post_profile_pic"
              />

              <Link to={`/${singalPost?.postedBy.username}/`}>
                <p className="post_bold_600">{singalPost?.postedBy.username}</p>
              </Link>
            </div>
            <button
              className="icon_btn"
              type="button"
              onClick={() => setProfileModalOpen(true)}
            >
              <svg
                aria-label="More options"
                fill="#262626"
                height="16"
                viewBox="0 0 48 48"
                width="16"
              >
                <circle
                  clipRule="evenodd"
                  cx="8"
                  cy="24"
                  fillRule="evenodd"
                  r="4.5"
                ></circle>
                <circle
                  clipRule="evenodd"
                  cx="24"
                  cy="24"
                  fillRule="evenodd"
                  r="4.5"
                ></circle>
                <circle
                  clipRule="evenodd"
                  cx="40"
                  cy="24"
                  fillRule="evenodd"
                  r="4.5"
                ></circle>
              </svg>
            </button>
          </div>
        </header>
        <div>
          <img src={singalPost?.pic} alt="post" className="post_image" />
        </div>
        <div className="post_info">
          <header className="post_info_header">
            <div>
              <button className="icon_btn" style={{ paddingLeft: "0" }}>
                {postLiked ? (
                  <svg
                    aria-label="Unlike"
                    className="_8-yf5 "
                    fill="#ed4956"
                    height="24"
                    viewBox="0 0 48 48"
                    width="24"
                    onClick={() => unlikePost(singalPost?._id)}
                  >
                    <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
                  </svg>
                ) : (
                  <svg
                    aria-label="Like"
                    fill="#262626"
                    height="24"
                    viewBox="0 0 48 48"
                    width="24"
                    onClick={() => likePost(singalPost?._id)}
                  >
                    <path d="M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
                  </svg>
                )}
              </button>
              <button
                className="icon_btn"
                onClick={() => setPostModalOpen(true)}
              >
                <svg
                  aria-label="Comment"
                  fill="#262626"
                  height="24"
                  viewBox="0 0 48 48"
                  width="24"
                >
                  <path
                    clipRule="evenodd"
                    d="M47.5 46.1l-2.8-11c1.8-3.3 2.8-7.1 2.8-11.1C47.5 11 37 .5 24 .5S.5 11 .5 24 11 47.5 24 47.5c4 0 7.8-1 11.1-2.8l11 2.8c.8.2 1.6-.6 1.4-1.4zm-3-22.1c0 4-1 7-2.6 10-.2.4-.3.9-.2 1.4l2.1 8.4-8.3-2.1c-.5-.1-1-.1-1.4.2-1.8 1-5.2 2.6-10 2.6-11.4 0-20.6-9.2-20.6-20.5S12.7 3.5 24 3.5 44.5 12.7 44.5 24z"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </button>
              {/* Share button */}
              {/* <button className="icon_btn" style={{ paddingRight: "0" }}>
                <svg
                  aria-label="Share Post"
                  fill="#262626"
                  height="24"
                  viewBox="0 0 48 48"
                  width="24"
                >
                  <path d="M47.8 3.8c-.3-.5-.8-.8-1.3-.8h-45C.9 3.1.3 3.5.1 4S0 5.2.4 5.7l15.9 15.6 5.5 22.6c.1.6.6 1 1.2 1.1h.2c.5 0 1-.3 1.3-.7l23.2-39c.4-.4.4-1 .1-1.5zM5.2 6.1h35.5L18 18.7 5.2 6.1zm18.7 33.6l-4.4-18.4L42.4 8.6 23.9 39.7z"></path>
                </svg>
              </button> */}
            </div>
            <div>
              {postSaved ? (
                <button
                  className="icon_btn"
                  onClick={() => unsavedPost(singalPost?._id)}
                >
                  <svg
                    aria-label="Remove"
                    className="_8-yf5 "
                    fill="#262626"
                    height="24"
                    viewBox="0 0 48 48"
                    width="24"
                  >
                    <path d="M43.5 48c-.4 0-.8-.2-1.1-.4L24 28.9 5.6 47.6c-.4.4-1.1.6-1.6.3-.6-.2-1-.8-1-1.4v-45C3 .7 3.7 0 4.5 0h39c.8 0 1.5.7 1.5 1.5v45c0 .6-.4 1.2-.9 1.4-.2.1-.4.1-.6.1z"></path>
                  </svg>
                </button>
              ) : (
                <button
                  className="icon_btn"
                  onClick={() => savedPost(singalPost?._id)}
                >
                  <svg
                    aria-label="Save"
                    className="_8-yf5 "
                    fill="#262626"
                    height="24"
                    viewBox="0 0 48 48"
                    width="24"
                  >
                    <path d="M43.5 48c-.4 0-.8-.2-1.1-.4L24 29 5.6 47.6c-.4.4-1.1.6-1.6.3-.6-.2-1-.8-1-1.4v-45C3 .7 3.7 0 4.5 0h39c.8 0 1.5.7 1.5 1.5v45c0 .6-.4 1.2-.9 1.4-.2.1-.4.1-.6.1zM24 26c.8 0 1.6.3 2.2.9l15.8 16V3H6v39.9l15.8-16c.6-.6 1.4-.9 2.2-.9z"></path>
                  </svg>
                </button>
              )}
            </div>
          </header>
          <div className="post_bold_400 post_details">
            <p>
              Liked by
              {/* <span className="post_bold_600">deepikagoyal307</span>{" "}
              and */}
              <span className="post_bold_600">
                {" "}
                {singalPost?.likes.length} people
              </span>
            </p>
            <p>
              <Link
                to={`/${singalPost?.postedBy.username}/`}
                className="post_bold_600"
                style={{
                  cursor: "pointer",
                  marginRight: "5px",
                }}
              >
                <span>{singalPost?.postedBy.username} </span>
              </Link>
              {singalPost?.body}
            </p>
            <p
              className="post_comments_description"
              onClick={() => setPostModalOpen(true)}
              style={{ cursor: "pointer" }}
            >
              View all {singalPost?.comments.length} comments
            </p>
            {singalPost?.comments.map((comment) => (
              <Comment
                key={comment._id}
                comment={comment}
                deleteComment={deleteComment}
                postId={singalPost?._id}
              />
            ))}
            <Moment className="post_time" fromNow>
              {singalPost?.createdAt}
            </Moment>
          </div>
        </div>
        <footer className="post_footer">
          <form onSubmit={addComment}>
            <textarea
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="post_comment_input"
            />
            <button
              className={`${
                comment
                  ? "post_comment_button"
                  : "post_comment_button post_comment_disabled"
              }`}
            >
              Post
            </button>
          </form>
        </footer>
        {/* Modal for post */}
        {postModalOpen ? (
          <PostModal
            postModalOpen={postModalOpen}
            setPostModalOpen={setPostModalOpen}
            singalPost={singalPost}
            setSingalPost={setSingalPost}
            postLiked={postLiked}
            likePost={likePost}
            unlikePost={unlikePost}
            postSaved={postSaved}
            savedPost={savedPost}
            unsavedPost={unsavedPost}
            deleteComment={deleteComment}
          />
        ) : null}
        {profileModalOpen ? (
          <ProfileModal
            profileModalOpen={profileModalOpen}
            setProfileModalOpen={setProfileModalOpen}
            singalPost={singalPost}
          />
        ) : null}
      </article>
    );
  }
}

export default Post;
