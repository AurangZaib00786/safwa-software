import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import TextField from "@mui/material/TextField";
import { useTranslation } from "react-i18next";

function Notesmodel({ show, onHide, notes, setnotes }) {
  const { t } = useTranslation();

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
          {t("add_notes")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <TextField
          multiline
          className="form-control   mb-3"
          id="outlined-basic"
          label={t("add_notes_")}
          value={notes}
          onChange={(e) => {
            setnotes(e.target.value);
          }}
          size="small"
        />

        <hr></hr>
        <div className=" d-flex flex-row-reverse mt-2 me-2">
          <Button type="button" variant="outline-primary" onClick={onHide}>
            {" "}
            {t("add")}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default Notesmodel;
