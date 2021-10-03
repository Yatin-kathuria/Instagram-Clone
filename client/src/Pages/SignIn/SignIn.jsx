import React, { useEffect, useState } from "react";
import styles from "./SignIn.module.css";
import { Link, useHistory } from "react-router-dom";
import { useGlobalContext } from "../../context";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Divider from "../../components/Divider/Divider";
import { CircularProgress } from "@material-ui/core";
import { signIn } from "../../http";
// import CircularProgress from '@mui/material/CircularProgress';

const images = [
  "/images/sideImage.jpg",
  "/images/sideImage2.jpg",
  "/images/sideImage3.jpg",
  "/images/sideImage4.jpg",
  "/images/sideImage5.jpg",
];
const imagesLength = images.length;

function SignIn() {
  const { userDispatch } = useGlobalContext();
  const history = useHistory();

  const [position, setposition] = useState(0);
  const [password, setPassword] = useState("");
  const [text, setText] = useState("");
  const [errors, setErrors] = useState(null);
  const [isloading, setIsloading] = useState(false);

  useEffect(() => {
    const timeout = setInterval(() => {
      setposition((prevState) => {
        if (prevState === imagesLength - 1) {
          return 0;
        }
        return prevState + 1;
      });
    }, 3000);
    return () => clearInterval(timeout);
  }, [position]);

  const onSignIn = async (e) => {
    e.preventDefault();
    setErrors(null);
    setIsloading(true);
    signIn({ password, text })
      .then((res) => {
        if (res.data.error) {
          setErrors(res.data.error);
          return;
        }
        localStorage.setItem("jwt", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        userDispatch({ type: "USER", payload: res.data.user });
        history.push("/");
      })
      .catch((error) => console.log(error))
      .finally(() => setIsloading(false));
  };

  return (
    <section className={styles.signin}>
      <div
        className={styles.imageContainer}
        style={{ backgroundImage: `url("/images/Phone.png")` }}
      >
        <img
          src={images[position]}
          alt="side img"
          className={styles.imageDisplay}
        />
      </div>
      <article className={styles.conatiner}>
        <div className={styles.first}>
          <div className={styles.firstContainer}>
            <h1 className={styles.logo}>Instagram</h1>
            <div>
              <form onSubmit={onSignIn}>
                <Input
                  value={text}
                  placeholder="Phone number, username, or email"
                  onChange={(e) => setText(e.target.value)}
                />
                <Input
                  value={password}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                />
                <Button
                  disabled={!text || !password || isloading}
                  label={
                    isloading ? (
                      <CircularProgress size={20} color="#0095f6" />
                    ) : (
                      "Log in"
                    )
                  }
                />
              </form>
            </div>
            <Divider text="OR" />
            <div className={styles.facebookLogin}>
              <div>
                <img src="/images/fb.png" alt="fb logo" />
                <p>Log in with facebook</p>
              </div>
              {errors && <p className={styles.errors}>{errors}</p>}
              <Link to="/reset">Forget password?</Link>
            </div>
          </div>
        </div>
        <div className={styles.second}>
          <p>
            Dont have a account? <Link to="/signup">Sign up</Link>
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
              <img src="../images/GooglePlay.png" alt="GooglePlay logo" />
            </a>
          </div>
        </div>
      </article>
      <div className={styles.help}>
        Want to give a try ? Use ID : test123 and password : test
      </div>
    </section>
  );
}

export default SignIn;
