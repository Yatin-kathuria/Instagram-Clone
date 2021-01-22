import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../context";
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
    return (
      <svg
        width="50"
        height="50"
        viewBox="0 0 50 50"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          margin: "-25px 0 0 -25px",
          fill: "#c7c7c7",
        }}
      >
        <path d="M25 1c-6.52 0-7.34.03-9.9.14-2.55.12-4.3.53-5.82 1.12a11.76 11.76 0 0 0-4.25 2.77 11.76 11.76 0 0 0-2.77 4.25c-.6 1.52-1 3.27-1.12 5.82C1.03 17.66 1 18.48 1 25c0 6.5.03 7.33.14 9.88.12 2.56.53 4.3 1.12 5.83a11.76 11.76 0 0 0 2.77 4.25 11.76 11.76 0 0 0 4.25 2.77c1.52.59 3.27 1 5.82 1.11 2.56.12 3.38.14 9.9.14 6.5 0 7.33-.02 9.88-.14 2.56-.12 4.3-.52 5.83-1.11a11.76 11.76 0 0 0 4.25-2.77 11.76 11.76 0 0 0 2.77-4.25c.59-1.53 1-3.27 1.11-5.83.12-2.55.14-3.37.14-9.89 0-6.51-.02-7.33-.14-9.89-.12-2.55-.52-4.3-1.11-5.82a11.76 11.76 0 0 0-2.77-4.25 11.76 11.76 0 0 0-4.25-2.77c-1.53-.6-3.27-1-5.83-1.12A170.2 170.2 0 0 0 25 1zm0 4.32c6.4 0 7.16.03 9.69.14 2.34.11 3.6.5 4.45.83 1.12.43 1.92.95 2.76 1.8a7.43 7.43 0 0 1 1.8 2.75c.32.85.72 2.12.82 4.46.12 2.53.14 3.29.14 9.7 0 6.4-.02 7.16-.14 9.69-.1 2.34-.5 3.6-.82 4.45a7.43 7.43 0 0 1-1.8 2.76 7.43 7.43 0 0 1-2.76 1.8c-.84.32-2.11.72-4.45.82-2.53.12-3.3.14-9.7.14-6.4 0-7.16-.02-9.7-.14-2.33-.1-3.6-.5-4.45-.82a7.43 7.43 0 0 1-2.76-1.8 7.43 7.43 0 0 1-1.8-2.76c-.32-.84-.71-2.11-.82-4.45a166.5 166.5 0 0 1-.14-9.7c0-6.4.03-7.16.14-9.7.11-2.33.5-3.6.83-4.45a7.43 7.43 0 0 1 1.8-2.76 7.43 7.43 0 0 1 2.75-1.8c.85-.32 2.12-.71 4.46-.82 2.53-.11 3.29-.14 9.7-.14zm0 7.35a12.32 12.32 0 1 0 0 24.64 12.32 12.32 0 0 0 0-24.64zM25 33a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm15.68-20.8a2.88 2.88 0 1 0-5.76 0 2.88 2.88 0 0 0 5.76 0z"></path>
      </svg>
    );
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
