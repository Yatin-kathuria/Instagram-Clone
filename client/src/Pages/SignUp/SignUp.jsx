import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import styles from "./SignUp.module.css";
import Divider from "../../components/Divider/Divider";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { CircularProgress } from "@material-ui/core";

function SignUp() {
  const history = useHistory();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const [isloading, setIsloading] = useState(false);

  const PostData = (e) => {
    e.preventDefault();
    setError(null);
    setIsloading(true);
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
      .catch((error) => console.log(error))
      .finally(() => setIsloading(false));
  };

  return (
    <section className={styles.signup}>
      <article className={styles.conatiner}>
        <div className={styles.first}>
          <div className={styles.firstContainer}>
            <h1 className={styles.logo}>Instagram</h1>
            <h6 className={styles.subheading}>
              Sign up to see photos and videos from your friends.
            </h6>
            <button className={styles.facebook}>
              <img src="/images/fb.png" alt="fb logo" />
              <span>Log in with facebook</span>
            </button>
            <Divider text="OR" />
            <div>
              <form onSubmit={PostData}>
                <Input
                  value={email}
                  placeholder="Mobile number or Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  value={name}
                  placeholder="Full Name"
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  value={username}
                  placeholder="Username"
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                  value={password}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                />
                <Button
                  disabled={
                    !name || !email || !username || !password || isloading
                  }
                  label={
                    isloading ? (
                      <CircularProgress size={20} color="#0095f6" />
                    ) : (
                      "Sign up"
                    )
                  }
                />
              </form>
            </div>
            {error && <p className={styles.errors}>{error}</p>}
            <p className={styles.policies}>
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
        <div className={styles.second}>
          <p>
            Dont have a account? <Link to="/signin">Log in</Link>
          </p>
        </div>
        <div className={styles.third}>
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
