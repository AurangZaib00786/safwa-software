import React, { useEffect, useState, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import "./payment.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import ApartmentIcon from "@material-ui/icons/Apartment";
import Select from "../alerts/select";
import went_wrong_toast from "../alerts/went_wrong_toast";
import success_toast from "../alerts/success_toast";
import Save_button from "../buttons/save_button";
import { useTranslation } from "react-i18next";

function Paymentform({
  show,
  onHide,
  user,
  route,
  callback,
  selected_branch,
  customers,
  text,
  current_user,
  setloadagain,
}) {
  const { t } = useTranslation();
  const [party, setparty] = useState("");
  const [amount, setamount] = useState("");
  const [description, setdescription] = useState("");
  const [type, settype] = useState({ value: "debit", label: "Debit" });

  const [isloading, setisloading] = useState(false);
  var curr = new Date();
  var curdate = curr.toISOString().substring(0, 10);

  const [date, setdate] = useState(curdate);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selected_branch && !isloading) {
      setisloading(true);
      const formData = new FormData();

      formData.append("date", date);
      formData.append("description", description);
      formData.append("amount", amount);
      if (type) {
        formData.append("payment_type", type.value);
      } else {
        formData.append("payment_type", type);
      }
      if (party) {
        formData.append("party", party.value);
      } else {
        formData.append("party", party);
      }

      formData.append("branch", selected_branch.id);
      formData.append("user", current_user.id);

      const response = await fetch(`${route}`, {
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
        setisloading(false);
        success_toast();
        setparty("");
        setamount("");
        setdescription("");
        settype("debit");
        setdate(curdate);
        setloadagain();
      }
    }
  };

  const type_option = [
    { value: "debit", label: "Debit" },
    { value: "credit", label: "Credit" },
  ];

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      style={{ zoom: ".8" }}
    >
      <Modal.Header closeButton>
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="d-flex align-items-md-center"
        >
          <ApartmentIcon className="me-2" />
          {t("add_payment")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <Select
                options={customers}
                placeholder={text}
                value={party}
                funct={(e) => {
                  setparty(e);
                }}
                required={true}
              ></Select>

              <TextField
                type="number"
                className="form-control  mb-3"
                id="outlined-basic"
                label={t("amount")}
                value={amount}
                onChange={(e) => setamount(e.target.value)}
                size="small"
                required
              />
            </div>
            <div className="col-md-6">
              <TextField
                type="date"
                className="form-control   mb-3"
                id="outlined-basic"
                label={t("date")}
                value={date}
                onChange={(e) => setdate(e.target.value)}
                size="small"
              />
              <Select
                options={type_option}
                placeholder={t("type")}
                value={type}
                funct={(e) => {
                  settype(e);
                }}
              ></Select>
            </div>
          </div>
          <div className="mb-3">
            <TextField
              multiline
              className="form-control   mb-3"
              id="outlined-basic"
              label={t("description")}
              value={description}
              onChange={(e) => setdescription(e.target.value)}
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

export default Paymentform;
