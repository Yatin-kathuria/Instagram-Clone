import React, { useEffect, useState } from "react";
import SingalPost from "../SingalPost";

function Saved({ id }) {
  const [savedPost, setSavedPost] = useState(null);
  useEffect(() => {
    fetch(
      `${
        process.env.NODE_ENV === "production"
          ? `/getsavedpost/${id}`
          : `http://localhost:5000/getsavedpost/${id}`
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
      .then((data) => {
        setSavedPost(data.posts);
      })
      .catch((error) => console.log(error));
  }, [id]);

  console.log("saved post");
  console.log(savedPost);

  if (!savedPost) {
    return <></>;
  }

  return (
    <>
      {savedPost?.map((Post) => (
        <SingalPost key={Post._id} myPost={Post} />
      ))}
    </>
  );
}

export default Saved;
