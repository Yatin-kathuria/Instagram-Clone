import React, { useEffect } from "react";
import { useGlobalContext } from "../../context";
import SingalPost from "../SingalPost";
import "./Explore.css";

function Explore() {
  const { allPostState, allPostDispatch } = useGlobalContext();

  useEffect(() => {
    if (!allPostState) {
      fetch(
        `${
          process.env.NODE_ENV === "production"
            ? "/allpost"
            : "http://localhost:5000/allpost"
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
          allPostDispatch({
            type: "ALLPOST",
            payload: data.posts,
          });
        })
        .catch((error) => console.log(error));
    }
  }, [allPostState, allPostDispatch]);

  return (
    <section className="explore">
      {allPostState?.map((post) => (
        <SingalPost key={post._id} myPost={post} />
      ))}
    </section>
  );
}

export default Explore;
