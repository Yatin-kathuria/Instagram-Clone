import React, { useState } from "react";
import "./Footer.css";

const footerItems = [
  "About",
  "Blog",
  "Jobs",
  "Help",
  "API",
  "Privacy",
  "Terms",
  "Top Accounts",
  "Hashtags",
  "Locations",
];

function Footer() {
  const [language, setLanguage] = useState("en");
  return (
    <footer className="footer">
      <ul className="footer_list">
        {footerItems.map((footerItem, index) => (
          <li key={index} className="footer_listItems">
            {footerItem}
          </li>
        ))}
      </ul>
      <div className="footer_end">
        <select
          aria-label="Switch Display Language"
          className="footer_select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="hy">Hindi</option>
          <option value="hui">Hindi</option>
        </select>
        <p className="copyright">
          <span>&#169;</span> 2021 Instagram from Facebook
        </p>
      </div>
    </footer>
  );
}

export default Footer;
