import React, { useState } from "react";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import M from "materialize-css";
import styles from "./Reset.module.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Divider from "../../components/Divider/Divider";

function Reset() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const history = useHistory();
  const { url } = useRouteMatch();

  const ResetPassword = (e) => {
    setError(null);
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
        if ("error" in data) {
          setError(data.error);
          M.toast({ html: data.error, classes: "red darken-3" });
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
    <section className={styles.Reset}>
      <article className={styles.conatiner}>
        <div className={styles.first}>
          <div className={styles.reset_container}>
            <div className={styles.lock_container}>
              <img src="/images/lock.png" alt="lock" className={styles.lock} />
            </div>
            <h4 className={styles.title}>Trouble Logging In?</h4>
            <p className={styles.message}>
              Enter your email, phone, or username and we'll send you a link to
              get back into your account.
            </p>
            <div>
              <form onSubmit={ResetPassword}>
                <Input
                  value={email}
                  placeholder="Email, Phone, or Username"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button disabled={!email} label="Send Login Link" />
              </form>
            </div>
            {error && <p className="errors">{error}</p>}
            {url === "/password_reset" ? null : (
              <>
                <Divider text="OR" />
                <Link to="/signup" className={styles.link}>
                  Create New Account
                </Link>
              </>
            )}
          </div>
          {url !== "/password_reset" && (
            <div className={styles.login_container}>
              <Link to="/signin" className={styles.backToLogin}>
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
