import React from "react";
import "./SidebarNavlink.css";
import { Link, NavLink, useRouteMatch } from "react-router-dom";

function SidebarNavlink({ label, to }) {
  const { url } = useRouteMatch();
  return (
    <li className="SidebarNavlink">
      <NavLink
        className="SidebarNavlink_link"
        to={`${url}/${to}`}
        activeClassName="active_SidebarNavlink"
      >
        {label}
      </NavLink>
    </li>
  );
}

export default SidebarNavlink;
