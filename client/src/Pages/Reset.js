import React, { useState } from "react";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import M from "materialize-css";
import "./Reset.css";

function Reset() {
  const [email, setEmail] = useState("");
  const history = useHistory();
  const { url } = useRouteMatch();
  console.log(url);

  const ResetPassword = (e) => {
    e.preventDefault();
    fetch(
      `${
        process.env.NODE_ENV === "production"
          ? "/resetpassword"
          : "http://localhost:5000/resetpassword"
      }`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
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
    <section className="Reset">
      <article className="conatiner">
        <div className="Reset_first">
          <div className="reset_container">
            <div className="lock_container">
              <img src="/images/lock.png" alt="lock" className="Reset_lock" />
            </div>
            <h4 className="Reset_title">Trouble Logging In?</h4>
            <p className="Reset_message">
              Enter your email, phone, or username and we'll send you a link to
              get back into your account.
            </p>
            <div>
              <form onSubmit={ResetPassword}>
                <div className="input_container">
                  {email ? (
                    <>
                      <p className="input_label">Email, Phone, or Username</p>
                    </>
                  ) : null}
                  <input
                    type="text"
                    placeholder="Email, Phone, or Username"
                    className={`${
                      email ? "input_tag input_tag_write" : "input_tag"
                    }`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button
                  className={`${email ? "btn" : "btn disabled"}`}
                  disabled={!email}
                >
                  Send Login Link
                </button>
              </form>
            </div>
            {url === "/password_reset" ? null : (
              <>
                <div className="line-group">
                  <div className="line"></div>
                  <div className="text">OR</div>
                  <div className="line"></div>
                </div>
                <Link to="/signup" className="Reset_link">
                  Create New Account
                </Link>
              </>
            )}
          </div>
          {url === "/password_reset" ? null : (
            <div className="Reset_login_container">
              <Link to="/signin" className="Reset_link Reset_login">
                Back To Login
              </Link>
            </div>
          )}
        </div>
      </article>
    </section>
  );
}

export default Reset;
