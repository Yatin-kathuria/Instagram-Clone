import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import M from "materialize-css";

function NewPassword() {
  const history = useHistory();
  const { token } = useParams();
  console.log(token);

  const [password, setPassword] = useState("");

  const PostData = (e) => {
    e.preventDefault();

    fetch(
      `${
        process.env.NODE_ENV === "production"
          ? "/newpassword"
          : "http://localhost:5000/newpassword"
      }`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          token,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          if (data.error) {
            M.toast({ html: data.error, classes: "red darken-3" });
          }
        } else {
          M.toast({
            html: data.message,
            classes: "green darken-3",
          });
          history.push("/signin");
        }
      })
      .catch((error) => console.log(error));
  };
  return (
    <div className="mycard">
      <div className="auth-card input-field card">
        <h2>Instagram</h2>
        <form onSubmit={PostData}>
          <input
            type="password"
            placeholder="enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="btn waves-effect waves-light blue lighten-2"
            type="submit"
            name="action"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewPassword;
