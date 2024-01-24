import React, { useState, useEffect, useRef, memo } from "react";
import "./user.css";
import { IconButton, Avatar } from "@material-ui/core";

import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, {
  Search,
  CSVExport,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import Button from "react-bootstrap/Button";
import Alert_before_delete from "../../Container/alertContainer";

import custom_toast from "../alerts/custom_toast";
import went_wrong_toast from "../alerts/went_wrong_toast";
import Spinner from "react-bootstrap/Spinner";
import pdfMake from "pdfmake/build/pdfmake";
// import Tooltiprender from "../alerts/tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import PrintIcon from "@material-ui/icons/Print";
import { useTranslation } from "react-i18next";
import TextField from "@mui/material/TextField";
import Save_button from "../buttons/save_button";
import success_toast from "../alerts/success_toast";
import StoreIcon from "@material-ui/icons/Store";
import Red_toast from "../alerts/red_toast";
import DeviceHubIcon from "@material-ui/icons/DeviceHub";
import ListAltIcon from "@material-ui/icons/ListAlt";

function User(props) {
  const { t } = useTranslation();

  const user = props.state.setuser.user;
  const route = props.state.setuser.route;
  const setActiveTab = props.setActiveTab;
  const current_user = props.state.Setcurrentinfo.current_user;
  console.log(current_user);
  const setadditionalinfo = props.setadditionalinfo;
  const all_users = props.state.Settablehistory.table_history;
  const dispatch = props.Settable_history;
  const { SearchBar } = Search;
  const { ExportCSVButton } = CSVExport;
  const [id, setid] = useState("");
  const [check_update, setcheck_update] = useState(true);
  const [delete_user, setdelete_user] = useState(false);
  const [url_to_delete, seturl_to_delete] = useState("");
  const [row_id, setrow_id] = useState("");
  const [isloading, setisloading] = useState(false);

  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  useEffect(() => {
    setisloading(true);
    dispatch({ type: "Set_menuitem", data: "user" });
    const fetchWorkouts = async () => {
      const response = await fetch(`${route}/api/users/`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });

      const json = await response.json();

      if (response.ok) {
        setisloading(false);
        dispatch({ type: "Set_table_history", data: json });
      }
      if (!response.ok) {
        went_wrong_toast();
        setisloading(false);
      }
    };

    fetchWorkouts();
  }, []);

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

  const handleconfirm = (row) => {
    dispatch({ type: "Delete_table_history", data: { id: row } });
    custom_toast("Delete");
  };

  const linkFollow = (cell, row, rowIndex, formatExtraData) => {
    return (
      <span className="action d-flex">
        {row.id !== 1 && (
          <IconButton
            className="me-2 border border-danger rounded"
            onClick={() => {
              setrow_id(row.id);
              seturl_to_delete(`${route}/api/users/${row.id}/`);
              setdelete_user(true);
            }}
          >
            <DeleteRoundedIcon
              className="m-1"
              color="error"
              fontSize="medium"
            />
          </IconButton>
        )}

        {current_user?.permissions?.includes("change_user") && (
          <IconButton
            style={{ border: "1px solid #003049", borderRadius: "5px" }}
            className="me-2"
            onClick={() => {
              setusername(row.username);
              setemail(row.email);

              setid(row.id);
              setcheck_update(false);
            }}
          >
            <EditOutlinedIcon
              className="m-1"
              style={{ color: "#003049" }}
              fontSize="medium"
            />
          </IconButton>
        )}

        {current_user?.permissions?.includes("delete_user") && (
          <IconButton
            style={{ border: "1px solid #004099", borderRadius: "5px" }}
            className="me-2"
            onClick={() => {
              setadditionalinfo(row);
              setActiveTab("Assign Branch");
            }}
          >
            <StoreIcon
              className="m-1"
              style={{ color: "#004099" }}
              fontSize="medium"
            />
          </IconButton>
        )}

        <IconButton
          style={{ border: "1px solid #007299", borderRadius: "5px" }}
          className="me-2"
          onClick={() => {
            setadditionalinfo(row);
            setActiveTab("Assign Roles");
          }}
        >
          <DeviceHubIcon
            className="m-1"
            style={{ color: "#007299" }}
            fontSize="medium"
          />
        </IconButton>
      </span>
    );
  };

  const columns = [
    { dataField: "id", text: "Id", hidden: true, headerFormatter: headerstyle },

    {
      dataField: "username",
      text: t("name"),
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "email",
      text: t("Email"),
      sort: true,
      headerFormatter: headerstyle,
    },

    {
      dataField: "action",
      text: t("action"),
      formatter: linkFollow,
      headerFormatter: headerstyle,
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
        value: all_users.length,
      },
    ], // A numeric array is also available. the purpose of above example is custom the text
  };

  const makepdf = () => {
    const body = all_users.map((item, index) => {
      return [{ text: index + 1 }, { text: item.username }];
    });
    body.splice(0, 0, ["#", "Name", "Phone No.", "Address"]);

    const documentDefinition = {
      content: [
        { text: "Users", style: "header" },

        {
          canvas: [
            { type: "line", x1: 0, y1: 10, x2: 510, y2: 10, lineWidth: 1 },
          ],
        },

        {
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: [30, "*"],
            body: body,
          },
          style: "tableStyle",
        },
      ],
      defaultStyle: {
        font: "ArabicFont",
      },

      styles: {
        tableStyle: {
          width: "100%", // Set the width of the table to 100%
          marginTop: 20,
          font: "ArabicFont",
        },

        header: {
          fontSize: 22,
          bold: true,
          alignment: "center",
        },
        body: {
          fontSize: 12,
          bold: true,
          alignment: "center",
          marginBottom: 10,
        },
      },
    };
    return documentDefinition;
  };

  const download = () => {
    const documentDefinition = makepdf();
    pdfMake.createPdf(documentDefinition).download("Users.pdf");
  };

  const print = () => {
    const documentDefinition = makepdf();
    pdfMake.createPdf(documentDefinition).print();
  };

  const rowstyle = { height: "10px" };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (check_update && current_user?.permissions?.includes("add_user")) {
      if (!isloading) {
        console.log("ok");
        setisloading(true);
        const formData = new FormData();
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);

        const response = await fetch(`${route}/api/users/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.access}`,
          },
          body: formData,
        });
        const json = await response.json();

        if (!response.ok) {
          setisloading(false);

          Red_toast(`${json.error}`);
        }

        if (response.ok) {
          dispatch({ type: "Create_table_history", data: json });
          setisloading(false);
          success_toast();
          setusername("");
          setemail("");
          setpassword("");
        }
      }
    } else if (current_user?.permissions?.includes("change_user")) {
      handleSubmit_update(e);
    }
  };

  const handleSubmit_update = async (e) => {
    e.preventDefault();
    setisloading(true);
    const formData = new FormData();

    if (password.length > 0) {
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
    } else {
      formData.append("username", username);
      formData.append("email", email);
    }

    const response = await fetch(`${route}/api/users/${id}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${user.access}`,
      },
      body: formData,
    });
    const json = await response.json();

    if (!response.ok) {
      setisloading(false);
      Red_toast(`${json.error}`);
      setcheck_update(false);
    }

    if (response.ok) {
      setisloading(false);
      dispatch({ type: "Update_table_history", data: json });
      success_toast();
      setusername("");
      setemail("");
      setpassword("");

      setcheck_update(true);
    }
  };

  return (
    <div className="p-3 pt-2">
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="card-header d-flex justify-content-between bg-white">
            <h3 className="mt-2 me-2">Add User</h3>
            <div className="mt-2 me-2 d-flex ">
              <Button
                className="me-2"
                variant="outline-secondary"
                onClick={() => {
                  setActiveTab("Assign Roles");
                  setadditionalinfo(null);
                }}
              >
                {" "}
                Assign Roles
              </Button>
              <Button
                className="me-2"
                variant="outline-success"
                onClick={() => {
                  setActiveTab("Permissions");
                }}
              >
                {" "}
                Permissions
              </Button>
              {(current_user?.permissions?.includes("add_user") ||
                current_user?.permissions?.includes("change_user")) && (
                <Save_button isloading={isloading} />
              )}
            </div>
          </div>

          {(current_user?.permissions?.includes("add_user") ||
            current_user?.permissions?.includes("change_user")) && (
            <div className="card-body pt-0">
              <div className="row mt-4">
                <div className="col-md-3">
                  <TextField
                    className="form-control   mb-3"
                    label={t("username")}
                    value={username}
                    onChange={(e) => {
                      setusername(e.target.value);
                    }}
                    size="small"
                    required
                    autoFocus
                  />
                </div>
                <div className="col-md-3">
                  <TextField
                    type="email"
                    className="form-control  mb-3"
                    label={t("email")}
                    value={email}
                    onChange={(e) => {
                      setemail(e.target.value);
                    }}
                    size="small"
                  />
                </div>

                <div className="col-md-3">
                  {check_update ? (
                    <TextField
                      type="password"
                      className="form-control  mb-3"
                      label={t("password")}
                      value={password}
                      onChange={(e) => {
                        setpassword(e.target.value);
                      }}
                      size="small"
                      required
                    />
                  ) : (
                    <TextField
                      type="password"
                      className="form-control  mb-3"
                      label={t("password")}
                      value={password}
                      onChange={(e) => {
                        setpassword(e.target.value);
                      }}
                      size="small"
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      {current_user?.permissions?.includes("view_user") ? (
        <div className="card mt-3">
          <div className="card-body pt-0">
            <ToolkitProvider
              keyField="id"
              data={all_users}
              columns={columns}
              search
              exportCSV
            >
              {(props) => (
                <div>
                  <div className="d-sm-flex justify-content-between align-items-center mt-3">
                    <div>
                      <ExportCSVButton
                        {...props.csvProps}
                        className="csvbutton  border bg-secondary text-light me-2 mb-2"
                      >
                        Export CSV
                      </ExportCSVButton>
                      <Button
                        type="button"
                        className="p-1 ps-3 pe-3 me-2 mb-2"
                        variant="outline-primary"
                        onClick={download}
                      >
                        <PictureAsPdfIcon /> PDF
                      </Button>
                      <Button
                        type="button"
                        className="p-1 ps-3 pe-3 mb-2"
                        variant="outline-success"
                        onClick={print}
                      >
                        <PrintIcon /> Print
                      </Button>
                    </div>
                    <SearchBar {...props.searchProps} />
                  </div>
                  {isloading && (
                    <div className="text-center">
                      <Spinner animation="border" variant="primary" />
                    </div>
                  )}
                  <hr />
                  <BootstrapTable
                    {...props.baseProps}
                    pagination={paginationFactory(options)}
                    rowStyle={rowstyle}
                    striped
                    bootstrap4
                    condensed
                    wrapperClasses="table-responsive"
                  />
                </div>
              )}
            </ToolkitProvider>
          </div>
        </div>
      ) : (
        <div
          style={{
            fontSize: "20px",
            opacity: "0.6",
            fontWeight: "bold",
            height: "90vh",
          }}
          className="d-flex justify-content-center align-items-center"
        >
          {" "}
          User has no permission to see users.
        </div>
      )}

      {delete_user && (
        <Alert_before_delete
          show={delete_user}
          onHide={() => setdelete_user(false)}
          url={url_to_delete}
          dis_fun={handleconfirm}
          row_id={row_id}
        />
      )}
    </div>
  );
}

export default User;
