import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context";
import {
  Link,
  NavLink,
  Route,
  Switch,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import SingalPost from "../components/SingalPost";
import "./Profile.css";
import Saved from "../components/Profile/Saved";
import IGTV from "../components/Profile/IGTV";
import Tagged from "../components/Profile/Tagged";
import {
  DotToolbarIcon,
  IGTVIcon,
  PostsIcon,
  SavedIcon,
  SettingsIcon,
  TaggedIcon,
} from "../icons";

function Profile() {
  const { path, url } = useRouteMatch();
  const { username } = useParams();
  const { userState, userDispatch } = useGlobalContext();
  const [myPosts, setMyPosts] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [followed, setFollowed] = useState(null);
  const [followingProcessing, setFollowingProcessing] = useState(false);
  console.log(userProfile?.username);

  useEffect(() => {
    fetch(
      `${
        process.env.NODE_ENV === "production"
          ? `/users/${username}`
          : `http://localhost:5000/users/${username}`
      }`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      }
    )
      .then((res) => res.json())
      .then(async (data) => {
        setUserProfile(data.user);
        setMyPosts(data.posts);
        setFollowed(
          data.user.followers.includes(
            await JSON.parse(localStorage.getItem("user"))._id
          )
        );
      })
      .catch((error) => console.log(error));
  }, [username]);

  const followUser = () => {
    setFollowingProcessing(true);
    fetch(
      `${
        process.env.NODE_ENV === "production"
          ? "/follow"
          : "http://localhost:5000/follow"
      }`,
      {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({
          followId: userProfile._id,
        }),
      }
    )
      .then((res) => res.json())
      .then((result) => {
        userDispatch({
          type: "UPDATE",
          payload: {
            following: result.followingResult.following,
          },
        });
        const localUser = JSON.parse(localStorage.getItem("user"));
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...localUser,
            following: result.followingResult.following,
          })
        );
        setUserProfile((prevState) => {
          return {
            ...prevState,
            followers: result.followersResult.followers,
          };
        });
        setFollowingProcessing(false);
        setFollowed(!followed);
      })
      .catch((error) => console.log(`from error ${error}`));
  };

  const unFollowUser = () => {
    setFollowingProcessing(true);
    fetch(
      `${
        process.env.NODE_ENV === "production"
          ? "/unfollow"
          : "http://localhost:5000/unfollow"
      }`,
      {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({
          unFollowId: userProfile._id,
        }),
      }
    )
      .then((res) => res.json())
      .then((result) => {
        userDispatch({
          type: "UPDATE",
          payload: {
            following: result.followingResult.following,
          },
        });
        const localUser = JSON.parse(localStorage.getItem("user"));
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...localUser,
            following: result.followingResult.following,
          })
        );
        setUserProfile((prevState) => {
          return {
            ...prevState,
            followers: result.followersResult.followers,
          };
        });
        setFollowingProcessing(false);
        setFollowed(!followed);
      })
      .catch((error) => console.log(`from error ${error}`));
  };

  if (!userProfile) {
    return <section className="profile"></section>;
  }

  return (
    <section className="profile">
      <div className="profile_info_container">
        <div className="profile_img_container">
          <img
            src={userProfile?.pic}
            alt={userProfile?.username}
            className="profile_img"
          />
        </div>
        <div className="profile_information">
          <div className="profile_username">
            <h1>{userProfile?.username}</h1>
            {userState._id === userProfile._id ? (
              <div className="profile_edit_container">
                <Link to="/accounts/edit">
                  <button className="edit_btn">Edit Profile</button>
                </Link>
                <Link to="/accounts/edit">
                  <button className="setting_btn">
                    <SettingsIcon />
                  </button>
                </Link>
              </div>
            ) : (
              <>
                {!followed ? (
                  <button
                    className={`${
                      followingProcessing
                        ? "processing btn follow_btn"
                        : "btn follow_btn"
                    }`}
                    onClick={() => followUser()}
                  >
                    Follow
                  </button>
                ) : (
                  <button
                    className={`${
                      followingProcessing
                        ? "processing btn unfollow_btn"
                        : "btn unfollow_btn"
                    }`}
                    onClick={() => unFollowUser()}
                  >
                    Unfollow
                  </button>
                )}

                <button className="btn arrow_down">
                  <i className="material-icons">arrow_drop_down</i>
                </button>
                <button className="icon_btn">
                  <DotToolbarIcon />
                </button>
              </>
            )}
          </div>
          <div className="profile_data">
            <p>
              <span className="bold_data">{myPosts?.length}</span> posts
            </p>
            <p>
              <span className="bold_data">{userProfile?.followers.length}</span>{" "}
              followers
            </p>
            <p>
              <span className="bold_data">{userProfile?.following.length}</span>{" "}
              following
            </p>
          </div>
          <div className="profile_details">
            <h1 className="profile_name">{userProfile?.name}</h1>
            <div className="profile_description">
              <pre>{userProfile?.bio}</pre>
            </div>
          </div>
        </div>
      </div>
      {/* Pofile nav links */}
      <div className="profile_nav_container">
        <NavLink
          to={`/${username}/`}
          className="profile_nav_links"
          activeClassName={`${
            url !== `/${username}/` ? "profile_nav_links" : "active"
          }`}
        >
          <div>
            <PostsIcon />
            <span className="profile_nav_text">Posts</span>
          </div>
        </NavLink>
        <NavLink
          to={`/${username}/channel`}
          className="profile_nav_links"
          activeClassName="active"
        >
          <div>
            <IGTVIcon />
            <span className="profile_nav_text">IGTV</span>
          </div>
        </NavLink>
        <NavLink
          to={`/${username}/saved`}
          className="profile_nav_links"
          activeClassName="active"
        >
          <div>
            <SavedIcon />
            <span className="profile_nav_text">Saved</span>
          </div>
        </NavLink>
        <NavLink
          to={`/${username}/tagged`}
          className="profile_nav_links"
          activeClassName="active"
        >
          <div>
            <TaggedIcon />
            <span className="profile_nav_text">Tagged</span>
          </div>
        </NavLink>
      </div>
      <section className="profile_post_container">
        <Switch>
          <Route exact path={`${path}/`}>
            {myPosts?.map((myPost) => {
              return <SingalPost key={myPost._id} myPost={myPost} />;
            })}
          </Route>
          <Route path={`${path}/channel`} component={IGTV} />
          {/* <Route path={`${path}/saved`} component={Saved} /> */}
          <Route
            path={`${path}/saved`}
            render={(props) => <Saved {...props} id={userProfile?._id} />}
          />
          <Route path={`${path}/tagged`} component={Tagged} />
        </Switch>
      </section>
    </section>
  );
}

export default Profile;
