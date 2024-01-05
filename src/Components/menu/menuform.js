import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import "./menu.css";
import TextField from "@mui/material/TextField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import Red_toast from "../alerts/red_toast";
import success_toast from "../alerts/success_toast";
import Save_button from "../buttons/save_button";
import { useTranslation } from "react-i18next";

function Categoriesform({
  show,
  onHide,
  user,
  route,
  callback,
  selected_branch,
  current_user,
}) {
  const [name, setname] = useState("");
  const { t } = useTranslation();
  const [isloading, setisloading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selected_branch) {
      setisloading(true);
      const formData = new FormData();

      formData.append("name", name);

      const response = await fetch(`${route}/api/menu/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.access}`,
        },
        body: formData,
      });
      const json = await response.json();

      if (!response.ok) {
        setisloading(false);
        var error = Object.keys(json);
        if (error.length > 0) {
          Red_toast(`${error[0]}:${json[error[0]]}`);
        }
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
          <FontAwesomeIcon className="me-2" icon={faUserPlus} /> Add Menu
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!selected_branch && (
          <div className="text-center text-danger mb-2">
            Please Select Branch!
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="col-md-12">
            <TextField
              className="form-control   mb-3"
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

          <hr></hr>
          <div className=" d-flex flex-row-reverse mt-2 me-2">
            <Save_button isloading={isloading} />
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default Categoriesform;
