import React from "react";
import "./Navbar.css";
import { Link, useHistory } from "react-router-dom";
import { useGlobalContext } from "../context";

function Navbar() {
  const { state, dispatch } = useGlobalContext();
  const history = useHistory();

  const renderList = () => {
    if (state) {
      return [
        { label: "Profile", to: "/profile" },
        { label: "Create", to: "/create" },
        { label: "My Following post", to: "/myfollowingpost" },
      ];
    } else {
      return [
        { label: "SignIn", to: "/signin" },
        { label: "SignUp", to: "/signup" },
      ];
    }
  };
  return (
    <nav>
      <div className="nav-wrapper white">
        <Link to={state ? "/" : "/signin"} className="brand-logo left">
          Instagram
        </Link>
        <ul id="nav-mobile" className="right">
          {renderList().map((navitem, index) => (
            <li key={index}>
              <Link to={navitem.to}>{navitem.label}</Link>
            </li>
          ))}
          {state ? (
            <button
              className="btn red darken-3"
              onClick={() => {
                localStorage.clear();
                dispatch({ type: "CLEAR" });
                history.push("/signin");
              }}
            >
              logout
            </button>
          ) : null}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
