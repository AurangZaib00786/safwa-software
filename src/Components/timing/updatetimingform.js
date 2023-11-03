import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import TextField from "@mui/material/TextField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPen } from "@fortawesome/free-solid-svg-icons";
import { Avatar } from "@material-ui/core";
import went_wrong_toast from "../alerts/went_wrong_toast";
import Update_button from "../buttons/update_button";
import { ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";

function Unitformupdate({ show, onHide, data, user, route, fun, callback }) {
  const [isloading, setisloading] = useState(false);
  const { t } = useTranslation();
  const [name, setname] = useState(data.name);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setisloading(true);

    const formData = new FormData();

    formData.append("name", name);

    const response = await fetch(`${route}/api/buffet-timing/${data.id}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${user.access}`,
      },
      body: formData,
    });
    const json = await response.json();

    if (!response.ok) {
      setisloading(false);
      went_wrong_toast();
    }

    if (response.ok) {
      setisloading(false);
      callback({ type: "Update_table_history", data: json });
      onHide();
      fun("Update");
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      style={{ zoom: ".8" }}
    >
      <Modal.Header closeButton>
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="d-flex align-items-md-center"
        >
          <FontAwesomeIcon className="me-2" icon={faUserPen} />
          Edit Timing
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="col-md-12">
            <TextField
              className="form-control   mb-3"
              id="outlined-basic"
              label="Name"
              value={name}
              onChange={(e) => {
                setname(e.target.value);
              }}
              size="small"
              autoFocus
              required
            />
          </div>

          <hr></hr>
          <div className="d-flex flex-row-reverse mt-2 me-2">
            <Update_button isloading={isloading} />
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default Unitformupdate;
