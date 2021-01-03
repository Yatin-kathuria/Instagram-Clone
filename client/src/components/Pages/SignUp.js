import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

function SignUp() {
  const history = useHistory();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (url) {
      uploadFields();
    }
  }, [url]);

  const uploadPic = () => {
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

  const uploadFields = () => {
    const isValidEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
      email
    );
    if (isValidEmail === false) {
      M.toast({ html: "invalid email", classes: "red darken-3" });
      return;
    }

    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        password,
        email,
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
          M.toast({ html: data.message, classes: "green darken-3" });
          history.push("/signin");
        }
      })
      .catch((error) => console.log(error));
  };

  const PostData = (e) => {
    e.preventDefault();
    if (image) {
      uploadPic();
    } else {
      uploadFields();
    }
  };

  return (
    <div className="mycard">
      <div className="auth-card input-field card">
        <h2>Instagram</h2>
        <form onSubmit={PostData}>
          <input
            type="text"
            placeholder="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="file-field input-field">
            <div className="btn blue lighten-2">
              <span>Upload pic</span>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
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
            Signup
          </button>
        </form>
        <h5>
          <Link to="/signin">Already have an account ?</Link>
        </h5>
      </div>
    </div>
  );
}

export default SignUp;
