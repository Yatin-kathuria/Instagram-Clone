import React from "react";
import "./InputField.css";

function Inputfield({ label, placeholder }) {
  return (
    <div className="form_input">
      <aside>
        <label className="form_input_label">{label}</label>
      </aside>
      <div>
        <input type="text" placeholder={placeholder} />
      </div>
    </div>
  );
}

export default Inputfield;
