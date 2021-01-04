import React, { useEffect, useState } from "react";
import "./Profile.css";
import { useParams } from "react-router-dom";
import { useGlobalContext } from "../../context";

function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const { userId } = useParams();
  const { state, dispatch } = useGlobalContext();

  useEffect(() => {
    fetch(`http://localhost:5000/users/${userId}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUserProfile(data);
      })
      .catch((error) => console.log(error));
  }, []);

  const followUser = () => {
    fetch("http://localhost:5000/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        followId: userId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        dispatch({
          type: "UPDATE",
          payload: {
            following: result.followingResult.following,
            followers: result.followingResult.followers,
          },
        });
        const localUser = JSON.parse(localStorage.getItem("user"));
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...localUser,
            following: result.followingResult.following,
            followers: result.followingResult.followers,
          })
        );
        setUserProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: result.followersResult.followers,
            },
          };
        });
      })
      .catch((error) => console.log(`from error ${error}`));
  };

  const unFollowUser = () => {
    fetch("http://localhost:5000/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        unFollowId: userId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        dispatch({
          type: "UPDATE",
          payload: {
            following: result.followingResult.following,
            followers: result.followingResult.followers,
          },
        });
        const localUser = JSON.parse(localStorage.getItem("user"));
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...localUser,
            following: result.followingResult.following,
            followers: result.followingResult.followers,
          })
        );
        setUserProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: result.followersResult.followers,
            },
          };
        });
      })
      .catch((error) => console.log(`from error ${error}`));
  };

  return (
    <>
      {userProfile ? (
        <div className="profile">
          <div className="profile_info">
            <div>
              <img
                className="profile_image"
                src={userProfile?.user.pic}
                alt="profile img"
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "80px",
                }}
              />
            </div>
            <div>
              <h4>{userProfile?.user.name}</h4>
              <h5>{userProfile?.user.email}</h5>
              <div className="profile_data">
                <h6>{userProfile?.posts.length} posts</h6>
                <h6>{userProfile?.user.followers.length} followers</h6>
                <h6>{userProfile?.user.following.length} following</h6>
              </div>
              <div>
                {!userProfile?.user.followers.includes(state._id) ? (
                  <button
                    className="btn waves-effect waves-light blue lighten-2"
                    type="submit"
                    name="action"
                    onClick={() => followUser()}
                  >
                    Follow
                  </button>
                ) : (
                  <button
                    className="btn waves-effect waves-light blue lighten-2"
                    type="submit"
                    name="action"
                    onClick={() => unFollowUser()}
                  >
                    unfollow
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="gallary">
            {userProfile?.posts.map((post) => (
              <img
                key={post._id}
                alt={post.title}
                src={post.pic}
                className="item"
              />
            ))}
          </div>
        </div>
      ) : (
        <h1>loading.....</h1>
      )}
    </>
  );
}

export default Profile;
