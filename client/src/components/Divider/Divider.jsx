import React from "react";
import styles from "./Divider.module.css";

const Divider = ({ text }) => {
  return (
    <div className={styles.lineGroup}>
      <div className={styles.line}></div>
      <div className={styles.text}>{text}</div>
      <div className={styles.line}></div>
    </div>
  );
};

export default Divider;
