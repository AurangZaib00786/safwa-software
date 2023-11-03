import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import "./sale.css";
import SaveIcon from "@material-ui/icons/Save";
import Button from "react-bootstrap/Button";
import { useTranslation } from "react-i18next";

function Paymentmodel({
  show,
  onHide,
  total,
  setamount_received,
  setpayment_status,
  handlefun,
}) {
  const { t } = useTranslation();
  const [remaing, setremaing] = useState(0);
  const [receive, setreceive] = useState(total);
  useEffect(() => {
    setamount_received(total);
    setpayment_status(true);
  }, []);

  const handlesubmit = (e) => {
    e.preventDefault();

    handlefun();
    onHide();
  };

  const handlereceived = (e) => {
    const value = e.target.value;
    setreceive(value);
    setremaing(total - value);
    setamount_received(value);
    if (value === total) {
      setpayment_status(true);
    } else {
      setpayment_status(false);
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
          {t("manage_payment")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className=" mt-3 d-flex justify-content-start align-items-center mb-3">
          <h5 className="me-2">{t("amount_receive")}</h5>
          <input
            style={{ width: "50%" }}
            type="number"
            className="input ps-2"
            value={receive}
            onChange={handlereceived}
          />
        </div>

        <div className="d-flex justify-content-start align-items-center mb-3">
          <h5 className="me-3 text-danger">{t("remaining_amount")} :</h5>
          <h5 className="me-3 text-danger"> {remaing}</h5>
        </div>

        <hr className="mb-1"></hr>
        <div className=" d-flex flex-row-reverse mt-2 me-2">
          <Button
            type="submit"
            variant="outline-primary"
            onClick={handlesubmit}
          >
            <SaveIcon /> Save
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default Paymentmodel;
