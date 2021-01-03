import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../context";
import "./Profile.css";

function Profile() {
  const [myPost, setMyPost] = useState([]);
  const { state, dispatch } = useGlobalContext();

  useEffect(() => {
    fetch("/mypost", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMyPost(data.mypost);
      })
      .catch((error) => console.log(error));
  }, []);

  const updatePhoto = (file) => {
    const data = new FormData();
    data.append("file", file); // the file to be upload
    data.append("upload_preset", "insta-clone"); // project name
    data.append("cloud_name", "yatinkathuria2020"); //cloud name

    // saving the image in the cloud and get the link of that image
    fetch("https://api.cloudinary.com/v1_1/yatinkathuria2020/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        fetch("/updatpic", {
          method: "put",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
          body: JSON.stringify({
            pic: data.secure_url,
          }),
        })
          .then((res) => res.json())
          .then((result) => {
            localStorage.setItem(
              "user",
              JSON.stringify({ ...state, pic: result.pic })
            );
            dispatch({ type: "UPDATEPIC", payload: result.pic });
          })
          .catch((error) => console.log(error));
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="profile">
      <div className="profile_info">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            margin: "10px",
          }}
        >
          <img
            className="profile_image"
            src={state?.pic}
            alt="profile img"
            style={{ width: "160px", height: "160px", borderRadius: "80px" }}
          />
          <div className="file-field input-field">
            <div className="btn blue lighten-2">
              <span>Upload pic</span>
              <input
                type="file"
                onChange={(e) => updatePhoto(e.target.files[0])}
              />
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" />
            </div>
          </div>
        </div>
        <div>
          <h4>{state?.name}</h4>
          <h5>{state?.email}</h5>
          <div className="profile_data">
            <h6>{myPost.length} posts</h6>
            <h6>{state?.followers.length} followers</h6>
            <h6>{state?.following.length} following</h6>
          </div>
        </div>
      </div>

      <div className="gallary">
        {myPost.map((post) => (
          <img
            key={post._id}
            alt={post.title}
            src={post.pic}
            className="item"
          />
        ))}
      </div>
    </div>
  );
}

export default Profile;
