import React from "react";
import Modal from "react-bootstrap/Modal";
import "./home.css";

function Select_Branch({
  show,
  route,
  user,
  current_user,
  selected_branch,
  dispatch,
}) {
  const handledropdown = async (id) => {
    const response = await fetch(`${route}/api/account-heads/${id}/`, {
      headers: { Authorization: `Bearer ${user.access}` },
    });
    const json = await response.json();
    if (!response.ok) {
    }

    if (response.ok) {
      localStorage.setItem("selected_branch", JSON.stringify(json));
      dispatch({ type: "Set_Branch_first", data: json });
    }
  };

  return (
    <Modal
      show={show}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      style={{ zoom: ".8" }}
    >
      <Modal.Header closeButton>
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="d-flex align-items-center"
        >
          Select Branch
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ul>
          {current_user?.account_heads?.map((item) => {
            return (
              <li
                className="branch_list"
                key={item.id}
                onClick={() => handledropdown(item.id)}
              >
                {item.name}
              </li>
            );
          })}
        </ul>
      </Modal.Body>
    </Modal>
  );
}

export default Select_Branch;
