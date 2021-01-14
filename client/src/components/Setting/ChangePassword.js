import React, { useState } from "react";
import "./ChangePassword.css";
import { useGlobalContext } from "../../context";
import { Link, useHistory } from "react-router-dom";

function ChangePassword() {
  const { userState, userDispatch } = useGlobalContext();
  const history = useHistory();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState(null);

  // Your old password was entered incorrectly. Please enter it again.

  const editPassword = (e) => {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirmNewPassword) {
      return setError("Please make sure both passwords match.");
    }

    fetch(
      `${
        process.env.NODE_ENV === "production"
          ? "/change_password"
          : "http://localhost:5000/change_password"
      }`,
      {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        }
        if (data.message) {
          alert(`${data.message}. Please login again`);
          userDispatch({ type: "CLEAR" });
          localStorage.clear();
          history.push("/signin");
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <section className="editProfile">
      <div className="editProfile_container">
        <div className="editProfile_userinfo_container">
          <div className="editProfile_image_container">
            <img
              src={userState?.pic}
              alt={userState?.username}
              className="editProfile_image"
            />
          </div>
          <div className="editProfile_username">
            <h1 className="username">{userState?.username}</h1>
          </div>
        </div>
        <form className="editProfile_form" onSubmit={editPassword}>
          <div className="form_input">
            <aside>
              <label className="form_input_label">Old Password</label>
            </aside>
            <div>
              <input
                type="text"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="form_input">
            <aside>
              <label className="form_input_label">New Password</label>
            </aside>
            <div>
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="form_input">
            <aside>
              <label className="form_input_label">Confirm New Password</label>
            </aside>
            <div>
              <input
                type="text"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            className={`${
              !oldPassword || !newPassword || !confirmNewPassword
                ? "editProfile_submit disable_submit"
                : "editProfile_submit"
            }`}
            type="submit"
          >
            Change Password
          </button>
        </form>
        <Link to={`/password_reset`} className="forget_password">
          Forget Password
        </Link>
        {error ? (
          <p style={{ color: "red", marginTop: "50px" }}>{error}</p>
        ) : null}
      </div>
    </section>
  );
}

export default ChangePassword;
