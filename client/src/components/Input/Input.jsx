import React from "react";
import styles from "./Input.module.css";

const inputWrapper = {
  border: "1px solid #dbdbdb",
  height: "38px",
  marginBottom: "10px",
  borderRadius: "4px",
};

const Input = ({ value, placeholder, onChange, type }) => {
  return (
    <div className={styles.inputWrapper} style={inputWrapper}>
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
