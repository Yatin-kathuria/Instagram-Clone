import React, { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import { Link, useHistory } from "react-router-dom";
import { useGlobalContext } from "../context";
import M from "materialize-css";

function Navbar() {
  const searchModal = useRef(null);
  const { state, dispatch } = useGlobalContext();
  const [userDetails, setUserDetails] = useState([]);
  const history = useHistory();
  const [search, setSearch] = useState("");

  useEffect(() => {
    M.Modal.init(searchModal.current);
  }, []);

  const fetchUsers = (query) => {
    setSearch(query);
    fetch(`http://localhost:5000/search-users`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({ query }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setUserDetails(result);
      })
      .catch((error) => console.log(error));
  };

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
          {state && (
            <li>
              <i
                className="material-icons modal-trigger"
                data-target="modal1"
                style={{ color: "black" }}
              >
                search
              </i>
            </li>
          )}
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
      <div
        id="modal1"
        className="modal"
        ref={searchModal}
        style={{ color: "black" }}
      >
        <div className="modal-content">
          <input
            type="email"
            placeholder="email"
            value={search}
            onChange={(e) => fetchUsers(e.target.value)}
          />
          <ul className="collection">
            {userDetails?.map((user) => (
              <Link
                to={
                  user._id === state._id ? "/profile" : `/profile/${user._id}`
                }
                onClick={() => {
                  M.Modal.getInstance(searchModal.current).close();
                  setSearch("");
                  setUserDetails([]);
                }}
              >
                <li key={user._id} className="collection-item">
                  {user.email}
                </li>
              </Link>
            ))}
          </ul>
        </div>
        <div className="modal-footer">
          <button
            className="modal-close waves-effect waves-green btn-flat"
            onClick={() => setSearch("")}
          >
            close
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
