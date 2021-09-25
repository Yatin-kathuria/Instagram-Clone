import React from "react";
import styles from "./Button.module.css";

const Button = ({ disabled, label }) => {
  return (
    <button
      className={`${styles.btn} ${disabled ? styles.disabled : ""}`}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
