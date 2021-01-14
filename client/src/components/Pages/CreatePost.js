import React, { useState } from "react";
import "./CreatePost.css";
import { useHistory } from "react-router-dom";
import { useGlobalContext } from "../../context";

function CreatePost() {
  const history = useHistory();
  const { myFollowingPostDispatch } = useGlobalContext();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);

  const postImage = (e) => {
    e.preventDefault();
    setImage(null);
    const data = new FormData();
    data.append("file", image); // the file to be upload
    data.append("upload_preset", "insta-clone"); // project name
    data.append("cloud_name", "yatinkathuria2020"); //cloud name

    // saving the image in the cloud and get the link of that image
    fetch("https://api.cloudinary.com/v1_1/yatinkathuria2020/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.secure_url) {
          // sending the request to the server for saving the image
          fetch(
            `${
              process.env.NODE_ENV === "production"
                ? "/createpost"
                : "http://localhost:5000/createpost"
            }`,
            {
              method: "post",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
              },
              body: JSON.stringify({
                title,
                body,
                pic: data.secure_url,
              }),
            }
          )
            .then((res) => res.json())
            .then((data) => {
              if (data.error) {
                if (data.error) {
                  alert(data.error);
                }
              } else {
                myFollowingPostDispatch({
                  type: "UPDATE_POSTS",
                  payload: data.post,
                });
                history.push("/");
              }
            })
            .catch((error) => console.log(error));
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <section className="CreatePost">
      <article className="conatiner">
        <div className="first">
          <div className="first-container">
            <h1 className="logo">Instagram</h1>
            <div>
              <form onSubmit={postImage}>
                <div className="input_container">
                  {title ? (
                    <>
                      <p className="input_label">Title of the Post</p>
                    </>
                  ) : null}
                  <input
                    type="text"
                    placeholder="Title of the Post"
                    className={`${
                      title ? "input_tag input_tag_write" : "input_tag"
                    }`}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="input_container">
                  {body ? (
                    <>
                      <p className="input_label">Body</p>
                    </>
                  ) : null}
                  <input
                    type="text"
                    placeholder="Body"
                    className={`${
                      body ? "input_tag input_tag_write" : "input_tag"
                    }`}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                </div>
                <div className="file_input_container">
                  <input
                    type="file"
                    id="actual-btn"
                    hidden
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                  <label htmlFor="actual-btn" className="CreatePost_fileLabel">
                    Choose File
                  </label>
                  <input
                    className="file-chosen"
                    placeholder="No file chosen"
                    value={image?.name}
                  />
                </div>
                <button
                  className={`${
                    !title || !body || !image ? "btn disabled" : "btn"
                  }`}
                  disabled={!title || !body || !image}
                >
                  Upload Post
                </button>
              </form>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}

export default CreatePost;
