import React, { useEffect, useState } from "react";
import "./SignIn.css";
import fb from "../../images/fb.png";
import AppStore from "../../images/AppStore.png";
import GooglePlay from "../../images/GooglePlay.png";
import sideImage from "../../images/sideImage.jpg";
import sideImage2 from "../../images/sideImage2.jpg";
import sideImage3 from "../../images/sideImage3.jpg";
import sideImage4 from "../../images/sideImage4.jpg";
import sideImage5 from "../../images/sideImage5.jpg";
import { Link, useHistory } from "react-router-dom";
import { useGlobalContext } from "../../context";

const images = [sideImage, sideImage2, sideImage3, sideImage4, sideImage5];
const imagesLength = images.length;

function SignIn() {
  const { userDispatch } = useGlobalContext();
  const history = useHistory();

  const [position, setposition] = useState(0);
  const [password, setPassword] = useState("");
  const [text, setText] = useState("");
  const [errors, setErrors] = useState(null);

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

  const PostData = (e) => {
    e.preventDefault();
    setErrors(null);

    fetch(
      `${
        process.env.NODE_ENV === "production"
          ? "/signin"
          : "http://localhost:5000/signin"
      }`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          text,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setErrors(data.error);
        } else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          userDispatch({ type: "USER", payload: data.user });
          alert("login successfully");
          history.push("/");
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <section className="signin">
      <div className="image-container">
        <img src={images[position]} alt="side img" className="image-display" />
      </div>
      <article className="conatiner">
        <div className="first">
          <div className="first-container">
            <h1 className="logo">Instagram</h1>
            <div>
              <form onSubmit={PostData}>
                <div className="input_container">
                  {text ? (
                    <>
                      <p className="input_label">
                        Phone number, username, or email
                      </p>
                    </>
                  ) : null}
                  <input
                    type="text"
                    placeholder="Phone number, username, or email"
                    className={`${
                      text ? "input_tag input_tag_write" : "input_tag"
                    }`}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
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
                  className={`${!text || !password ? "btn disabled" : "btn"}`}
                  disabled={!text || !password}
                >
                  Log in
                </button>
              </form>
            </div>
            <div className="line-group">
              <div className="line"></div>
              <div className="text">OR</div>
              <div className="line"></div>
            </div>
            <div className="facebook-login">
              <div>
                <img src={fb} alt="fb logo" />
                <p>Log in with facebook</p>
              </div>
              {errors ? <p className="errors">{errors}</p> : null}
              <Link to="/reset">Forget password?</Link>
            </div>
          </div>
        </div>
        <div className="second">
          <p>
            Dont have a account? <Link to="/signup">Sign up</Link>
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
              <img src={AppStore} alt="AppStore logo" />
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.instagram.android&referrer=utm_source%3Dinstagramweb%26utm_campaign%3DloginPage%26ig_mid%3D7C7CF5CF-A643-4E9A-917D-C11ED2788C48%26utm_content%3Dlo%26utm_medium%3Dbadge"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={GooglePlay} alt="GooglePlay logo" />
            </a>
          </div>
        </div>
      </article>
    </section>
  );
}

export default SignIn;
