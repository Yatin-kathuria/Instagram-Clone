import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../context";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  const { userState } = useGlobalContext();
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    fetch(
      `${
        process.env.NODE_ENV === "production"
          ? "/allpost"
          : "http://localhost:5000/allpost"
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
        console.log(data.posts);
        setPosts(data.posts);
      })
      .catch((error) => console.log(error));
  }, []);

  const likePost = (id) => {
    const isAlreadyLiked = posts
      .find(({ _id }) => _id === id)
      .likes.includes(userState.id);

    if (!isAlreadyLiked) {
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
          const newData = posts.map((post) => {
            if (post._id === likedPost._id) {
              return likedPost;
            } else {
              return post;
            }
          });
          setPosts(newData);
        })
        .catch((error) => console.log(error));
    }
  };

  const unlikePost = (id) => {
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
        const newData = posts.map((post) => {
          if (post._id === unlikePost._id) {
            return unlikePost;
          } else {
            return post;
          }
        });
        setPosts(newData);
      })
      .catch((error) => console.log(error));
  };

  const addComment = (text, id) => {
    console.log(text);
    if (text) {
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
            text,
            id,
          }),
        }
      )
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          const newData = posts.map((post) => {
            if (post._id === result._id) {
              return result;
            } else {
              return post;
            }
          });
          setPosts(newData);
        })
        .catch((error) => console.log(error));
    }
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
        const newData = posts.filter((post) => post._id !== result._id);
        setPosts(newData);
      })
      .catch((error) => console.log(error));
  };

  const deleteComment = (postId, commentId) => {
    fetch(
      `${
        process.env.NODE_ENV === "production"
          ? `deletecomment/${postId}&${commentId}`
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
        const newData = posts.map((post) => {
          if (post._id === postId) {
            return { ...result };
          } else {
            return post;
          }
        });
        setPosts(newData);
      })
      .catch((error) => console.log(error));
  };

  if (!posts) {
    return <h1> fetching</h1>;
  }

  return (
    <div className="home">
      {posts.map((post) => {
        const { _id, body, pic, title, likes, comments, postedBy } = post;

        return (
          <div key={_id} className="card home-card">
            <div
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Link
                to={
                  postedBy._id.toString() !== userState._id
                    ? `/profile/${postedBy._id}`
                    : "/profile"
                }
              >
                <h5>{postedBy.name}</h5>
              </Link>
              {postedBy._id.toString() === userState._id ? (
                <i
                  className="material-icons"
                  style={{ color: "black" }}
                  onClick={() => deletepost(_id)}
                >
                  delete
                </i>
              ) : null}
            </div>
            <div className="card-image">
              <img alt="images" src={pic} />
            </div>
            <div className="card-content">
              <h6>{title}</h6>
              <p>{body}</p>
              {likes.includes(userState._id) ? (
                <i
                  className="material-icons"
                  style={{ color: "red" }}
                  onClick={() => unlikePost(_id)}
                >
                  favorite
                </i>
              ) : (
                <i
                  className="material-icons"
                  style={{ color: "black" }}
                  onClick={() => likePost(_id)}
                >
                  favorite_border
                </i>
              )}

              <h6>{likes.length} likes</h6>
              {comments.map((comment) => {
                const { _id, postedBy, text } = comment;
                return (
                  <p
                    key={_id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <span>{postedBy.name}</span>.................
                      <span>{text}</span>
                    </div>
                    {postedBy._id === userState._id ? (
                      <i
                        className="material-icons"
                        style={{ color: "black" }}
                        onClick={() => deleteComment(post._id, _id)}
                      >
                        delete
                      </i>
                    ) : null}
                  </p>
                );
              })}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addComment(e.target[0].value, _id);
                }}
              >
                <input type="text" placeholder="add comment" />
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
