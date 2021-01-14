import React from "react";
import "./DeleteModal.css";
import { Modal } from "@material-ui/core";
import { useGlobalContext } from "../../context";

function DeleteModal({
  deleteModalOpen,
  setDeleteModalOpen,
  comment,
  deleteComment,
}) {
  const { userState } = useGlobalContext();

  const body = (
    <div className="deleteModal">
      <div className="deleteModal_container">
        <button className="button special-style">Report</button>

        <button
          className={`button special-style ${
            comment.postedBy._id === userState._id ? "d-block" : "d-none"
          }`}
          onClick={() => deleteComment(comment._id)}
        >
          Delete
        </button>
        <button className="button" onClick={() => setDeleteModalOpen(false)}>
          cancel
        </button>
      </div>
    </div>
  );

  return (
    <Modal
      open={deleteModalOpen}
      onClose={() => setDeleteModalOpen(false)}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      {body}
    </Modal>
  );
}

export default DeleteModal;
