import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../context";
import { InstaBlackAndWhiteIcon } from "../../icons";
import "./EditProfile.css";

function EditProfile() {
  const [user, setUser] = useState(null);
  const { userState, userDispatch } = useGlobalContext();
  const [error, setError] = useState(null);
  const [isDisable, setIsDisable] = useState(true);
  const updateData = (e) => {
    setIsDisable(false);
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setUser(userState);
  }, [userState]);

  const editData = (e) => {
    e.preventDefault();
    setError(null);
    setIsDisable(true);

    fetch(
      `${
        process.env.NODE_ENV === "production"
          ? "/edit"
          : "http://localhost:5000/edit"
      }`,
      {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({
          ...user,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("in edit profile");
        if (data.error) {
          setError(data.error);
        }
        if (data.phoneError) {
          setError(data.phoneError);
        }
        if (data.result) {
          setUser({ ...data.result });
          userDispatch({ type: "EDIT", payload: data.result });
          localStorage.setItem("user", JSON.stringify(data.result));
          alert("Profile Saved");
        }
      })
      .catch((error) => console.log(error));
  };

  const postImage = (e) => {
    e.preventDefault();
    setError(null);
    const data = new FormData();
    data.append("file", e.target.files[0]); // the file to be upload
    data.append("upload_preset", "insta-clone"); // project name
    data.append("cloud_name", "yatinkathuria2020"); //cloud name

    // saving the image in the cloud and get the link of that image
    fetch("https://api.cloudinary.com/v1_1/yatinkathuria2020/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          fetch(
            `${
              process.env.NODE_ENV === "production"
                ? "/updatepic"
                : "http://localhost:5000/updatepic"
            }`,
            {
              method: "put",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
              },
              body: JSON.stringify({
                pic: data.secure_url,
              }),
            }
          )
            .then((res) => res.json())
            .then((updatedPicUser) => {
              if (updatedPicUser.error) {
                setError(updatedPicUser.error);
              } else {
                setUser({ ...user, pic: updatedPicUser.pic });
                userDispatch({
                  type: "UPDATEPIC",
                  payload: updatedPicUser.pic,
                });
                localStorage.setItem(
                  "user",
                  JSON.stringify({ ...user, pic: updatedPicUser.pic })
                );
              }
            })
            .catch((error) => console.log(error));
        } else {
          setError("Unable to upload pic due to technical error");
        }
      })
      .catch((err) => console.log(err));
  };

  if (!user) {
    return <InstaBlackAndWhiteIcon />;
  }

  return (
    <section className="editProfile">
      <div className="editProfile_container">
        <div className="editProfile_userinfo_container">
          <div className="editProfile_image_container">
            <img
              src={user?.pic}
              alt={user?.username}
              className="editProfile_image"
            />
          </div>
          <div className="editProfile_username">
            <h1 className="username">{user?.username}</h1>

            <input type="file" id="upload" hidden onChange={postImage} />
            <label htmlFor="upload" className="fileLabel">
              Change Profile Photo
            </label>
          </div>
        </div>
        <form className="editProfile_form" onSubmit={editData}>
          <div className="form_input">
            <aside>
              <label className="form_input_label">Name</label>
            </aside>
            <div>
              <input
                type="text"
                placeholder="Name"
                name="name"
                value={user?.name}
                onChange={updateData}
              />
              <p>
                Help people discover your account by using the name you're known
                by: either your full name, nickname, or business name.
              </p>
              <p>You can only change your name twice within 14 days.</p>
            </div>
          </div>
          <div className="form_input">
            <aside>
              <label className="form_input_label">Username</label>
            </aside>
            <div>
              <input
                type="text"
                placeholder="Username"
                name="username"
                value={user?.username}
                onChange={updateData}
              />
              <p>
                In most cases, you'll be able to change your username back to{" "}
                {user.username} for another 14 days.
              </p>
            </div>
          </div>

          <div className="form_input">
            <aside>
              <label className="form_input_label">Website</label>
            </aside>
            <div>
              <input
                type="text"
                placeholder="Website"
                name="website"
                value={user?.website}
                onChange={updateData}
              />
            </div>
          </div>
          <div className="form_input">
            <aside>
              <label className="form_input_label">Bio</label>
            </aside>
            <div>
              <textarea
                type="text"
                name="bio"
                value={user?.bio}
                onChange={updateData}
              />
            </div>
          </div>
          <div className="form_input">
            <aside></aside>
            <div>
              <h2 className="editProfile_form_heading">Personal Information</h2>
              <p style={{ marginTop: "5px" }}>
                Provide your personal information, even if the account is used
                for a business, a pet or something else. This won't be a part of
                your public profile.
              </p>
            </div>
          </div>
          <div className="form_input">
            <aside>
              <label className="form_input_label">Email</label>
            </aside>
            <div>
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={user?.email}
                onChange={updateData}
              />
            </div>
          </div>
          <div className="form_input">
            <aside>
              <label className="form_input_label">Phone Number</label>
            </aside>
            <div>
              <input
                type="text"
                placeholder="Phone Number"
                maxLength="10"
                name="phoneNumber"
                value={user?.phoneNumber}
                onChange={updateData}
              />
            </div>
          </div>
          <button
            className={`${
              isDisable
                ? "editProfile_submit disable_submit"
                : "editProfile_submit"
            }`}
          >
            Submit
          </button>
        </form>
        {error ? <p>{error}</p> : null}
      </div>
    </section>
  );
}

export default EditProfile;
