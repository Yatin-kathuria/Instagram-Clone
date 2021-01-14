import React from "react";
import { NavLink, useRouteMatch } from "react-router-dom";
import SidebarNavlink from "./Components/SidebarNavlink";
import "./Sidebar.css";

const Navlinks = [
  { label: "Edit Profile", to: "edit", id: 1 },
  { label: "Change Password", to: "password_change", id: 2 },
  { label: "Apps and Website", to: "manage_access", id: 3 },
  { label: "Email and SMS", to: "emails_settings", id: 4 },
  { label: "Push Notification", to: "push_web_settings", id: 5 },
  { label: "Manage Contacts", to: "contact_history", id: 6 },
  {
    label: "Privacy and Security",
    to: "privacy_and_security",
    id: 7,
  },
  { label: "Login Activity", to: "session_login_activity", id: 8 },
  { label: "Emails from Instagram", to: "emails_sent", id: 9 },
];

function Sidebar() {
  return (
    <div className="sidebar">
      <ul className="sidebar_navlink_container">
        {Navlinks.map((Navlink) => (
          <SidebarNavlink key={Navlink.id} {...Navlink} />
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
