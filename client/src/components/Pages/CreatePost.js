import React, { useState, useEffect } from "react";
import "./CreatePost.css";
import M from "materialize-css";
import { useHistory } from "react-router-dom";

function CreatePost() {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (url) {
      // sending the request to the server for saving the image
      fetch("http://localhost:5000/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({
          title,
          body,
          pic: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            if (data.error) {
              M.toast({ html: data.error, classes: "red darken-3" });
            }
          } else {
            M.toast({
              html: "post created successufully",
              classes: "green darken-3",
            });
            history.push("/");
          }
        })
        .catch((error) => console.log(error));
    }
  }, [url]);

  const postImage = (e) => {
    e.preventDefault();
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
      .then((data) => setUrl(data.secure_url))
      .catch((err) => console.log(err));
  };

  return (
    <div className="createPost card input-field ">
      <form onSubmit={postImage}>
        <input
          type="text"
          placeholder="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <div className="file-field input-field">
          <div className="btn blue lighten-2">
            <span>Upload image</span>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
        <button
          className="btn waves-effect waves-light blue lighten-2"
          type="submit"
          name="action"
        >
          Submit post
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
