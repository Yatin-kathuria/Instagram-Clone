import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import { useGlobalContext } from "../../context";

function SignIn() {
  const { state, dispatch } = useGlobalContext();

  const history = useHistory();

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const PostData = (e) => {
    e.preventDefault();
    const isValidEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
      email
    );
    if (isValidEmail === false) {
      M.toast({ html: "invalid email", classes: "red darken-3" });
      return;
    }

    fetch("/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
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
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          M.toast({
            html: "signed in successfully",
            classes: "green darken-3",
          });
          history.push("/");
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
            type="email"
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
          <button
            className="btn waves-effect waves-light blue lighten-2"
            type="submit"
            name="action"
          >
            Login
          </button>
        </form>
        <h5>
          <Link to="/signup">Dont have an account ?</Link>
        </h5>
      </div>
    </div>
  );
}

export default SignIn;
