import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./SignUp.css";

function SignUp() {
  const history = useHistory();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);

  const PostData = (e) => {
    e.preventDefault();
    setError(null);
    fetch(
      `${
        process.env.NODE_ENV === "production"
          ? "/signup"
          : "http://localhost:5000/signup"
      }`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          password,
          email,
          username,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else if (data.user) {
          alert(data.message);
          history.push("/signin");
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <section className="signup">
      <article className="conatiner">
        <div className="first">
          <div className="first-container">
            <h1 className="logo">Instagram</h1>
            <h6 className="signin_subheading">
              Sign up to see photos and videos from your friends.
            </h6>
            <button className="signup_facebook btn">
              <img src="/images/fb.png" alt="fb logo" />
              <span>Log in with facebook</span>
            </button>
            <div className="line-group">
              <div className="line"></div>
              <div className="text">OR</div>
              <div className="line"></div>
            </div>
            <div>
              <form onSubmit={PostData}>
                <div className="input_container">
                  {email ? (
                    <>
                      <p className="input_label">Mobile number or Email</p>
                    </>
                  ) : null}
                  <input
                    type="text"
                    placeholder="Mobile number or Email"
                    className={`${
                      email ? "input_tag input_tag_write" : "input_tag"
                    }`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="input_container">
                  {name ? (
                    <>
                      <p className="input_label">Full Name</p>
                    </>
                  ) : null}
                  <input
                    type="text"
                    placeholder="Full Name"
                    className={`${
                      name ? "input_tag input_tag_write" : "input_tag"
                    }`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="input_container">
                  {username ? (
                    <>
                      <p className="input_label">Username</p>
                    </>
                  ) : null}
                  <input
                    type="text"
                    placeholder="Username"
                    className={`${
                      username ? "input_tag input_tag_write" : "input_tag"
                    }`}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="input_container">
                  {password ? (
                    <>
                      <p className="input_label">Password</p>
                    </>
                  ) : null}
                  <input
                    type="password"
                    placeholder="Password"
                    className={`${
                      password ? "input_tag input_tag_write" : "input_tag"
                    }`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button
                  className={`${
                    !name || !email || !username || !password
                      ? "btn disabled"
                      : "btn"
                  }`}
                  disabled={!name || !email || !username || !password}
                >
                  Sign up
                </button>
              </form>
            </div>
            {error && <p className="errors">{error}</p>}
            <p className="policies">
              By signing up, you agree to our{" "}
              <a
                href="https://help.instagram.com/581066165581870"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms
              </a>
              ,
              <a
                href="https://help.instagram.com/519522125107875"
                target="_blank"
                rel="noopener noreferrer"
              >
                Data Policy
              </a>
              and
              <a
                href="https://help.instagram.com/1896641480634370?ref=ig"
                target="_blank"
                rel="noopener noreferrer"
              >
                Cookies Policy
              </a>
              .
            </p>
          </div>
        </div>
        <div className="second">
          <p>
            Dont have a account? <Link to="/signin">Log in</Link>
          </p>
        </div>
        <div className="third">
          <p>Get the app.</p>
          <div>
            <a
              href="https://apps.apple.com/app/instagram/id389801252?vt=lo"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/images/AppStore.png" alt="AppStore logo" />
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.instagram.android&referrer=utm_source%3Dinstagramweb%26utm_campaign%3DloginPage%26ig_mid%3D7C7CF5CF-A643-4E9A-917D-C11ED2788C48%26utm_content%3Dlo%26utm_medium%3Dbadge"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/images/GooglePlay.png" alt="GooglePlay logo" />
            </a>
          </div>
        </div>
      </article>
    </section>
  );
}

export default SignUp;
