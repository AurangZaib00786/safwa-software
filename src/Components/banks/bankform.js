import React, { useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./banks.css";
import { ToastContainer } from "react-toastify";
import TextField from "@mui/material/TextField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { Avatar } from "@material-ui/core";
import went_wrong_toast from "../alerts/went_wrong_toast";
import success_toast from "../alerts/success_toast";
import Save_button from "../buttons/save_button";
import { useTranslation } from "react-i18next";

function Bankform({
  show,
  onHide,
  user,
  route,
  callback,
  selected_branch,
  current_user,
}) {
  const [name, setname] = useState("");
  const [details, setdetails] = useState("");
  const { t } = useTranslation();
  const [isloading, setisloading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selected_branch) {
      setisloading(true);
      const formData = new FormData();

      formData.append("name", name);
      formData.append("details", details);
      formData.append("account_head", selected_branch.id);
      if (current_user.profile.user_type === "user") {
        formData.append("user", current_user.profile.parent_user);
      } else {
        formData.append("user", current_user.id);
      }

      const response = await fetch(`${route}/api/banks/`, {
        method: "POST",
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
        callback({ type: "Create_table_history", data: json });
        setisloading(false);
        success_toast();
        setname("");
      }
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
          <FontAwesomeIcon className="me-2" icon={faUserPlus} /> Add Type
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!selected_branch && (
          <div className="text-center text-danger mb-2">
            Please Select Account!
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="col-md-12">
            <TextField
              className="form-control"
              id="outlined-basic"
              label={t("name")}
              value={name}
              onChange={(e) => {
                setname(e.target.value);
              }}
              size="small"
              required
            />
          </div>
          <div className="col-md-12 mt-3">
            <TextField
              multiline
              className="form-control"
              id="outlined-basic"
              label={"Details"}
              value={details}
              onChange={(e) => {
                setdetails(e.target.value);
              }}
              size="small"
              required
            />
          </div>

          <hr></hr>
          <div className=" d-flex flex-row-reverse mt-2 me-2">
            <Save_button isloading={isloading} />
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default Bankform;
