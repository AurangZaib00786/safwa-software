import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "./dailymeal.css";
import custom_toast from "../alerts/custom_toast";
import Spinner from "react-bootstrap/Spinner";
import Red_toast from "../alerts/red_toast";

function Dailymealform({
  show,
  onHide,
  callback,
  text,
  data_,
  column,
  setcolumn,
  table_data,
}) {
  const [isloading, setisloading] = useState(false);

  const headerstyle = (column, colIndex, { sortElement }) => {
    return (
      <div
        className="d-flex justify-content-between align-items-center"
        style={{ minHeight: "2.5rem" }}
      >
        {column.text}
        {sortElement}
      </div>
    );
  };

  const addproduct = (row) => {
    const optimize = column?.filter((item) => {
      return item.id === row.id;
    });
    if (optimize.length > 0) {
      Red_toast(`${row.name} pot already Added`);
      return false;
    } else {
      setcolumn([...column, { ...row, qty: "" }]);
      const optimizetable = table_data.map((item) => {
        return {
          ...item,
          pot_details: [...item.pot_details, { ...row, qty: "" }],
        };
      });
      callback({ type: "Set_product_history", data: optimizetable });
      return true;
    }
  };

  const addallproduct = (rows) => {
    var newcolumn = column;
    var newtabeldata = table_data;
    var flag = false;
    rows.map((row) => {
      const optimize = column?.filter((item) => {
        return item.id === row.id;
      });
      if (optimize.length > 0) {
        Red_toast(`${row.name} pot already Added`);
        return false;
      } else {
        newcolumn = [...newcolumn, { ...row, qty: "" }];
        newtabeldata = newtabeldata.map((item) => {
          return {
            ...item,
            pot_details: [...item.pot_details, { ...row, qty: "" }],
          };
        });
        flag = true;
      }
    });
    setcolumn(newcolumn);
    callback({ type: "Set_product_history", data: newtabeldata });
    return flag;
  };

  const columns = [
    {
      dataField: "id",
      text: "Id",
      hidden: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "name",
      text: "Name",
      sort: true,
      headerFormatter: headerstyle,
    },
  ];

  const selectRow = {
    mode: "checkbox",
    clickToSelect: true,
    onSelect: (row, isSelect, rowIndex, e) => {
      if (isSelect) {
        const response = addproduct(row);
        if (response) {
          custom_toast(`${row.name} pot added`);
        }
      }
    },
    onSelectAll: (isSelect, rows, e) => {
      if (isSelect) {
        const response = addallproduct(rows);
        if (response) {
          custom_toast("Pots added");
        }
      }
    },
  };

  const rowstyle = { height: "10px" };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      style={{ zoom: ".7" }}
    >
      <Modal.Header closeButton>
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="d-flex align-items-md-center"
        >
          {text}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ToolkitProvider
          keyField="id"
          data={data_}
          columns={columns}
          search
          exportCSV
        >
          {(props) => (
            <div>
              {/* <div className="d-flex flex-row-reverse justify-content-between align-items-center mt-3">
                <SearchBar {...props.searchProps} />
              </div> */}

              {isloading && (
                <div className="text-center">
                  <Spinner animation="border" variant="primary" />
                </div>
              )}

              <div>
                <BootstrapTable
                  {...props.baseProps}
                  rowStyle={rowstyle}
                  striped
                  bootstrap4
                  condensed
                  selectRow={selectRow}
                  wrapperClasses="table-responsive"
                />
              </div>
            </div>
          )}
        </ToolkitProvider>
      </Modal.Body>
    </Modal>
  );
}

export default Dailymealform;
