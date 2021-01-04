import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import M from "materialize-css";

function Reset() {
  const history = useHistory();
  const [email, setEmail] = useState("");

  const ResetPassword = (e) => {
    e.preventDefault();
    const isValidEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
      email
    );
    if (isValidEmail === false) {
      M.toast({ html: "invalid email", classes: "red darken-3" });
      return;
    }

    fetch("http://localhost:5000/resetpassword", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    })
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
        <form onSubmit={ResetPassword}>
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="btn waves-effect waves-light blue lighten-2"
            type="submit"
            name="action"
          >
            Reset password
          </button>
        </form>
      </div>
    </div>
  );
}

export default Reset;
