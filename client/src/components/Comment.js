import React, { useEffect } from "react";
import "./Comment.css";
import { useState } from "react";
import DeleteModal from "./Modals/DeleteModal";
import { useGlobalContext } from "../context";
import { Link } from "react-router-dom";

export function Comment({ comment, deleteComment, postId }) {
  const { userState, myFollowingPostDispatch } = useGlobalContext();
  const [commentLiked, setCommentLiked] = useState(null);
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    setCommentLiked(comment?.commentLikes.includes(userState?._id));
  }, [userState, setCommentLiked, comment]);

  const likeComment = (commentId) => {
    setCommentLiked(true);
    fetch(
      `${
        process.env.NODE_ENV === "production"
          ? "/like_comment"
          : "http://localhost:5000/like_comment"
      }`,
      {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({
          commentId,
          postId,
        }),
      }
    )
      .then((res) => res.json())
      .then(async (likedComment) => {
        if (likedComment) {
          await myFollowingPostDispatch({
            type: "LIKE_UNLIKE_COMMENT",
            payload: { commentId, post: likedComment },
          });
        } else {
          setCommentLiked(false);
        }
      })
      .catch((error) => console.log(error));
  };

  const unlikeComment = (commentId) => {
    setCommentLiked(false);
    fetch(
      `${
        process.env.NODE_ENV === "production"
          ? "/unlike_comment"
          : "http://localhost:5000/unlike_comment"
      }`,
      {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({
          commentId,
          postId,
        }),
      }
    )
      .then((res) => res.json())
      .then(async (unlikedComment) => {
        if (unlikedComment) {
          await myFollowingPostDispatch({
            type: "LIKE_UNLIKE_COMMENT",
            payload: { commentId, post: unlikedComment },
          });
        } else {
          setCommentLiked(true);
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <div
      className="post_comments"
      onMouseOver={() => setShowDeleteIcon(true)}
      onMouseOut={() => setShowDeleteIcon(false)}
    >
      <p>
        <Link
          to={`/${comment.postedBy.username}/`}
          className="post_bold_600"
          style={{ cursor: "pointer", marginRight: "5px", color: "#262626" }}
        >
          {comment.postedBy.username}
        </Link>
        {comment.text}
      </p>
      <div className="comments_icon_cotainer">
        <button
          className={`icon_btn ${showDeleteIcon ? " d-block" : " d-none"}`}
          onClick={() => setDeleteModalOpen(true)}
        >
          <svg
            aria-label="More options"
            className="_8-yf5 "
            fill="#8e8e8e"
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
        {commentLiked ? (
          <button
            className="icon_btn"
            onClick={() => unlikeComment(comment._id)}
          >
            <svg
              aria-label="Unlike"
              class="_8-yf5 "
              fill="#ed4956"
              height="12"
              viewBox="0 0 48 48"
              width="12"
            >
              <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
            </svg>
          </button>
        ) : (
          <button className="icon_btn" onClick={() => likeComment(comment._id)}>
            <svg
              aria-label="Like"
              fill="#262626"
              height="12"
              viewBox="0 0 48 48"
              width="12"
            >
              <path d="M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
            </svg>
          </button>
        )}
      </div>
      {deleteModalOpen ? (
        <DeleteModal
          deleteModalOpen={deleteModalOpen}
          setDeleteModalOpen={setDeleteModalOpen}
          comment={comment}
          deleteComment={deleteComment}
        />
      ) : null}
    </div>
  );
}

export function CommentOverModal({ comment, deleteComment, postId }) {
  const { userState, myFollowingPostDispatch } = useGlobalContext();
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [commentLiked, setCommentLiked] = useState(null);

  useEffect(() => {
    setCommentLiked(comment?.commentLikes.includes(userState?._id));
  }, [userState, setCommentLiked, comment]);

  const likeComment = (commentId) => {
    setCommentLiked(true);
    fetch(
      `${
        process.env.NODE_ENV === "production"
          ? "/like_comment"
          : "http://localhost:5000/like_comment"
      }`,
      {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({
          commentId,
          postId,
        }),
      }
    )
      .then((res) => res.json())
      .then(async (likedComment) => {
        if (likedComment) {
          await myFollowingPostDispatch({
            type: "LIKE_UNLIKE_COMMENT",
            payload: { commentId, post: likedComment },
          });
        } else {
          setCommentLiked(false);
        }
      })
      .catch((error) => console.log(error));
  };

  const unlikeComment = (commentId) => {
    setCommentLiked(false);
    fetch(
      `${
        process.env.NODE_ENV === "production"
          ? "/unlike_comment"
          : "http://localhost:5000/unlike_comment"
      }`,
      {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({
          commentId,
          postId,
        }),
      }
    )
      .then((res) => res.json())
      .then(async (unlikedComment) => {
        if (unlikedComment) {
          await myFollowingPostDispatch({
            type: "LIKE_UNLIKE_COMMENT",
            payload: { commentId, post: unlikedComment },
          });
        } else {
          setCommentLiked(true);
        }
      })
      .catch((error) => console.log(error));
  };
  return (
    <div
      key={comment._id}
      className="postModal_comment_img"
      onMouseOver={() => setShowDeleteIcon(true)}
      onMouseOut={() => setShowDeleteIcon(false)}
    >
      <button className="icon_btn post_img_margin">
        <img
          src={comment.postedBy.pic}
          alt={comment.postedBy.username}
          className="profile_pic height_width"
        />
      </button>
      <div className="postModal_comments">
        <p className="post_comment_text">
          <Link
            to={`/${comment.postedBy.username}/`}
            className="post_bold_600"
            style={{ cursor: "pointer", marginRight: "5px", color: "#262626" }}
          >
            <span>{comment.postedBy.username}</span>
          </Link>

          {comment.text}
        </p>
        <div className="comments_icon_cotainer">
          <button
            className={`icon_btn ${showDeleteIcon ? " d-block" : " d-none"}`}
            onClick={() => setDeleteModalOpen(true)}
          >
            <svg
              aria-label="More options"
              className="_8-yf5 "
              fill="#8e8e8e"
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
          {commentLiked ? (
            <button
              className="icon_btn"
              onClick={() => unlikeComment(comment._id)}
            >
              <svg
                aria-label="Unlike"
                class="_8-yf5 "
                fill="#ed4956"
                height="12"
                viewBox="0 0 48 48"
                width="12"
              >
                <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
              </svg>
            </button>
          ) : (
            <button
              className="icon_btn"
              onClick={() => likeComment(comment._id)}
            >
              <svg
                aria-label="Like"
                fill="#262626"
                height="12"
                viewBox="0 0 48 48"
                width="12"
              >
                <path d="M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
              </svg>
            </button>
          )}
        </div>
      </div>
      {deleteModalOpen ? (
        <DeleteModal
          deleteModalOpen={deleteModalOpen}
          setDeleteModalOpen={setDeleteModalOpen}
          comment={comment}
          deleteComment={deleteComment}
        />
      ) : null}
    </div>
  );
}

// export Comment;
