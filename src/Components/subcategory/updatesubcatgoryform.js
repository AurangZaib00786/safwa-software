import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import TextField from "@mui/material/TextField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPen } from "@fortawesome/free-solid-svg-icons";
import Red_toast from "../alerts/red_toast";
import Update_button from "../buttons/update_button";
import { useTranslation } from "react-i18next";
import Select from "../alerts/select";

function Updatesubcategories({
  show,
  onHide,
  data,
  user,
  route,
  fun,
  callback,
  menulist,
}) {
  const [isloading, setisloading] = useState(false);
  const { t } = useTranslation();
  const [name, setname] = useState(data.name);
  const [menu, setmenu] = useState({
    value: data.category,
    label: data.category_name,
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setisloading(true);

    const formData = new FormData();

    formData.append("name", name);
    formData.append("category", menu.value);

    const response = await fetch(`${route}/api/sub-categories/${data.id}/`, {
      method: "PATCH",
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
          Edit Sub Category
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="col-md-12 mt-3">
            <Select
              options={menulist}
              placeholder="Category"
              value={menu}
              funct={(e) => setmenu(e)}
              required={true}
            />
          </div>
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
          <div className="d-flex flex-row-reverse mt-2 me-2">
            <Update_button isloading={isloading} />
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default Updatesubcategories;
