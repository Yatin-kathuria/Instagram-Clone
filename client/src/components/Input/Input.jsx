import React from "react";
import styles from "./Input.module.css";

const Input = ({ value, placeholder, onChange, type }) => {
  return (
    <div className={styles.inputContainer}>
      {value && <p className={styles.inputLabel}>{placeholder}</p>}
      <input
        type={type}
        placeholder={placeholder}
        className={`${styles.input_tag} ${value ? styles.input_tag_write : ""}`}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

Input.defaultProps = {
  type: "text",
};

export default Input;
