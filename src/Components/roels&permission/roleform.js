import React, { useState, useEffect } from "react";
import { IconButton, Avatar } from "@material-ui/core";
import cellEditFactory from "react-bootstrap-table2-editor";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import SaveIcon from "@material-ui/icons/Save";
import { ToastContainer } from "react-toastify";
import AddIcon from "@material-ui/icons/Add";
import PaymentIcon from "@material-ui/icons/Payment";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, {
  Search,
  CSVExport,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import success_toast from "../alerts/success_toast";
import went_wrong_toast from "../alerts/went_wrong_toast";
import custom_toast from "../alerts/custom_toast";

function Groupform({ show, onHide, roles, current_user, route, user }) {
  const [name, setname] = useState("");
  const { SearchBar } = Search;
  const { ExportCSVButton } = CSVExport;
  const [data, setdata] = useState(roles);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`${route}/api/groups/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.access}`,
      },
      body: JSON.stringify({
        name: name,
        permissions: [],
      }),
    });
    const json = await response.json();

    if (!response.ok) {
      went_wrong_toast();
    }

    if (response.ok) {
      success_toast();
      setname("");
      setdata((data) => [...data, json]);
    }
  };

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

  const Action = (cell, row, rowIndex, formatExtraData) => {
    return (
      <span className="action d-flex ">
        <IconButton
          className="border border-danger rounded me-2"
          onClick={async () => {
            const response = fetch(`${route}/api/groups/${row.id}/`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${user.access}`,
              },
            });

            custom_toast("Delete");

            const optimize = data.filter((item) => {
              return item.id !== row.id;
            });
            setdata(optimize);
          }}
        >
          <DeleteRoundedIcon className="m-1" color="error" fontSize="small" />
        </IconButton>
      </span>
    );
  };

  const d_types = [{ id: "1", type: "card" }];

  const columns = [
    {
      dataField: "name",
      text: " Name",
      sort: true,
      headerFormatter: headerstyle,
    },

    {
      dataField: "action",
      text: "Action",
      formatter: Action,
    },
  ];

  const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total ms-2">
      Showing {from} to {to} of {size} Results
    </span>
  );

  const options = {
    paginationSize: 4,
    pageStartIndex: 1,
    firstPageText: "First",
    showTotal: true,
    paginationTotalRenderer: customTotal,
    disablePageTitle: true,
    sizePerPageList: [
      {
        text: "10",
        value: 10,
      },
      {
        text: "20",
        value: 20,
      },
      {
        text: "All",
        value: 30,
      },
    ], // A numeric array is also available. the purpose of above example is custom the text
  };

  const rowstyle = { height: "10px" };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      style={{ zoom: "0.7" }}
    >
      <Modal.Header closeButton>
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="d-flex align-items-md-center"
        >
          Add Role
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="card-body p-0 p-2">
              <div className="d-flex justify-content-around ">
                <div className="col-6">
                  <TextField
                    className="form-control me-2"
                    id="outlined-basic"
                    label="Name"
                    value={name}
                    onChange={(e) => {
                      setname(e.target.value);
                    }}
                    size="small"
                    required
                  />
                </div>
                <Button type="submit" variant="outline-primary">
                  <SaveIcon /> Save
                </Button>
              </div>
            </div>
          </form>
        </div>

        <div className="card mt-3">
          <div className="car-body p-2 ">
            <ToolkitProvider
              keyField="id"
              data={data}
              columns={columns}
              search
              exportCSV
            >
              {(props) => (
                <div>
                  <div className="d-flex justify-content-between ">
                    <ExportCSVButton
                      {...props.csvProps}
                      className="csvbutton border  bg-secondary text-light"
                    >
                      Export CSV
                    </ExportCSVButton>
                    <SearchBar {...props.searchProps} />
                  </div>

                  <hr />
                  <BootstrapTable
                    {...props.baseProps}
                    pagination={paginationFactory(options)}
                    rowStyle={rowstyle}
                    striped
                    bootstrap4
                    condensed
                    rowClasses="custom-row-class"
                    wrapperClasses="table-responsive"
                  />
                </div>
              )}
            </ToolkitProvider>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default Groupform;
