import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../context";
import { useParams } from "react-router-dom";
import SingalPost from "../SingalPost";
import "./Profile.css";

function Profile() {
  const { username } = useParams();
  const { userState, userDispatch } = useGlobalContext();
  const [myPosts, setMyPosts] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [followed, setFollowed] = useState(null);
  const [followingProcessing, setFollowingProcessing] = useState(false);

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
  console.log(userProfile?.bio);

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
    return null;
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
                <button className="edit_btn">Edit Profile</button>
                <button className="setting_btn">
                  <svg
                    aria-label="Options"
                    className="_8-yf5 "
                    fill="#262626"
                    height="24"
                    viewBox="0 0 48 48"
                    width="24"
                  >
                    <path
                      clipRule="evenodd"
                      d="M46.7 20.6l-2.1-1.1c-.4-.2-.7-.5-.8-1-.5-1.6-1.1-3.2-1.9-4.7-.2-.4-.3-.8-.1-1.2l.8-2.3c.2-.5 0-1.1-.4-1.5l-2.9-2.9c-.4-.4-1-.5-1.5-.4l-2.3.8c-.4.1-.8.1-1.2-.1-1.4-.8-3-1.5-4.6-1.9-.4-.1-.8-.4-1-.8l-1.1-2.2c-.3-.5-.8-.8-1.3-.8h-4.1c-.6 0-1.1.3-1.3.8l-1.1 2.2c-.2.4-.5.7-1 .8-1.6.5-3.2 1.1-4.6 1.9-.4.2-.8.3-1.2.1l-2.3-.8c-.5-.2-1.1 0-1.5.4L5.9 8.8c-.4.4-.5 1-.4 1.5l.8 2.3c.1.4.1.8-.1 1.2-.8 1.5-1.5 3-1.9 4.7-.1.4-.4.8-.8 1l-2.1 1.1c-.5.3-.8.8-.8 1.3V26c0 .6.3 1.1.8 1.3l2.1 1.1c.4.2.7.5.8 1 .5 1.6 1.1 3.2 1.9 4.7.2.4.3.8.1 1.2l-.8 2.3c-.2.5 0 1.1.4 1.5L8.8 42c.4.4 1 .5 1.5.4l2.3-.8c.4-.1.8-.1 1.2.1 1.4.8 3 1.5 4.6 1.9.4.1.8.4 1 .8l1.1 2.2c.3.5.8.8 1.3.8h4.1c.6 0 1.1-.3 1.3-.8l1.1-2.2c.2-.4.5-.7 1-.8 1.6-.5 3.2-1.1 4.6-1.9.4-.2.8-.3 1.2-.1l2.3.8c.5.2 1.1 0 1.5-.4l2.9-2.9c.4-.4.5-1 .4-1.5l-.8-2.3c-.1-.4-.1-.8.1-1.2.8-1.5 1.5-3 1.9-4.7.1-.4.4-.8.8-1l2.1-1.1c.5-.3.8-.8.8-1.3v-4.1c.4-.5.1-1.1-.4-1.3zM24 41.5c-9.7 0-17.5-7.8-17.5-17.5S14.3 6.5 24 6.5 41.5 14.3 41.5 24 33.7 41.5 24 41.5z"
                      fillRule="evenodd"
                    ></path>
                  </svg>
                </button>
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
                  <svg
                    aria-label="Options"
                    className="_8-yf5 "
                    fill="#262626"
                    height="24"
                    viewBox="0 0 48 48"
                    width="24"
                  >
                    <circle
                      clip-rule="evenodd"
                      cx="8"
                      cy="24"
                      fill-rule="evenodd"
                      r="4.5"
                    ></circle>
                    <circle
                      clip-rule="evenodd"
                      cx="24"
                      cy="24"
                      fill-rule="evenodd"
                      r="4.5"
                    ></circle>
                    <circle
                      clip-rule="evenodd"
                      cx="40"
                      cy="24"
                      fill-rule="evenodd"
                      r="4.5"
                    ></circle>
                  </svg>
                </button>
              </>
            )}
          </div>
          <div className="profile_data">
            <p>
              <span className="bold_data">37</span> posts
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
        <a href="/realyatinkathuria/" className="profile_nav_links">
          <div>
            <svg
              aria-label="Posts"
              fill="#262626"
              height="12"
              viewBox="0 0 48 48"
              width="12"
            >
              <path
                clipRule="evenodd"
                d="M45 1.5H3c-.8 0-1.5.7-1.5 1.5v42c0 .8.7 1.5 1.5 1.5h42c.8 0 1.5-.7 1.5-1.5V3c0-.8-.7-1.5-1.5-1.5zm-40.5 3h11v11h-11v-11zm0 14h11v11h-11v-11zm11 25h-11v-11h11v11zm14 0h-11v-11h11v11zm0-14h-11v-11h11v11zm0-14h-11v-11h11v11zm14 28h-11v-11h11v11zm0-14h-11v-11h11v11zm0-14h-11v-11h11v11z"
                fillRule="evenodd"
              ></path>
            </svg>
            <span className="profile_nav_text">Posts</span>
          </div>
        </a>
        <a href="/realyatinkathuria/channel/" className="profile_nav_links">
          <div>
            <svg
              aria-label="Posts"
              fill="#8e8e8e"
              height="12"
              viewBox="0 0 48 48"
              width="12"
            >
              <path d="M41 10c-2.2-2.1-4.8-3.5-10.4-3.5h-3.3L30.5 3c.6-.6.5-1.6-.1-2.1-.6-.6-1.6-.5-2.1.1L24 5.6 19.7 1c-.6-.6-1.5-.6-2.1-.1-.6.6-.7 1.5-.1 2.1l3.2 3.5h-3.3C11.8 6.5 9.2 7.9 7 10c-2.1 2.2-3.5 4.8-3.5 10.4v13.1c0 5.7 1.4 8.3 3.5 10.5 2.2 2.1 4.8 3.5 10.4 3.5h13.1c5.7 0 8.3-1.4 10.5-3.5 2.1-2.2 3.5-4.8 3.5-10.4V20.5c0-5.7-1.4-8.3-3.5-10.5zm.5 23.6c0 5.2-1.3 7-2.6 8.3-1.4 1.3-3.2 2.6-8.4 2.6H17.4c-5.2 0-7-1.3-8.3-2.6-1.3-1.4-2.6-3.2-2.6-8.4v-13c0-5.2 1.3-7 2.6-8.3 1.4-1.3 3.2-2.6 8.4-2.6h13.1c5.2 0 7 1.3 8.3 2.6 1.3 1.4 2.6 3.2 2.6 8.4v13zM34.6 25l-9.1 2.8v-3.7c0-.5-.2-.9-.6-1.2-.4-.3-.9-.4-1.3-.2l-11.1 3.4c-.8.2-1.2 1.1-1 1.9.2.8 1.1 1.2 1.9 1l9.1-2.8v3.7c0 .5.2.9.6 1.2.3.2.6.3.9.3.1 0 .3 0 .4-.1l11.1-3.4c.8-.2 1.2-1.1 1-1.9s-1.1-1.2-1.9-1z"></path>
            </svg>
            <span className="profile_nav_text">IGTV</span>
          </div>
        </a>
        <a href="/realyatinkathuria/saved/" className="profile_nav_links">
          <div>
            <svg
              aria-label="Saved"
              fill="#8e8e8e"
              height="12"
              viewBox="0 0 48 48"
              width="12"
            >
              <path d="M43.5 48c-.4 0-.8-.2-1.1-.4L24 29 5.6 47.6c-.4.4-1.1.6-1.6.3-.6-.2-1-.8-1-1.4v-45C3 .7 3.7 0 4.5 0h39c.8 0 1.5.7 1.5 1.5v45c0 .6-.4 1.2-.9 1.4-.2.1-.4.1-.6.1zM24 26c.8 0 1.6.3 2.2.9l15.8 16V3H6v39.9l15.8-16c.6-.6 1.4-.9 2.2-.9z"></path>
            </svg>
            <span className="profile_nav_text">Saved</span>
          </div>
        </a>
        <a href="/realyatinkathuria/tagged/" className="profile_nav_links">
          <div>
            <svg
              aria-label="Tagged"
              fill="#8e8e8e"
              height="12"
              viewBox="0 0 48 48"
              width="12"
            >
              <path d="M41.5 5.5H30.4c-.5 0-1-.2-1.4-.6l-4-4c-.6-.6-1.5-.6-2.1 0l-4 4c-.4.4-.9.6-1.4.6h-11c-3.3 0-6 2.7-6 6v30c0 3.3 2.7 6 6 6h35c3.3 0 6-2.7 6-6v-30c0-3.3-2.7-6-6-6zm-29.4 39c-.6 0-1.1-.6-1-1.2.7-3.2 3.5-5.6 6.8-5.6h12c3.4 0 6.2 2.4 6.8 5.6.1.6-.4 1.2-1 1.2H12.1zm32.4-3c0 1.7-1.3 3-3 3h-.6c-.5 0-.9-.4-1-.9-.6-5-4.8-8.9-9.9-8.9H18c-5.1 0-9.4 3.9-9.9 8.9-.1.5-.5.9-1 .9h-.6c-1.7 0-3-1.3-3-3v-30c0-1.7 1.3-3 3-3h11.1c1.3 0 2.6-.5 3.5-1.5L24 4.1 26.9 7c.9.9 2.2 1.5 3.5 1.5h11.1c1.7 0 3 1.3 3 3v30zM24 12.5c-5.3 0-9.6 4.3-9.6 9.6s4.3 9.6 9.6 9.6 9.6-4.3 9.6-9.6-4.3-9.6-9.6-9.6zm0 16.1c-3.6 0-6.6-2.9-6.6-6.6 0-3.6 2.9-6.6 6.6-6.6s6.6 2.9 6.6 6.6c0 3.6-3 6.6-6.6 6.6z"></path>
            </svg>
            <span className="profile_nav_text">Tagged</span>
          </div>
        </a>
      </div>
      <section className="profile_post_container">
        {myPosts?.map((myPost) => {
          return <SingalPost myPost={myPost} />;
        })}
      </section>
    </section>
  );
}

export default Profile;
