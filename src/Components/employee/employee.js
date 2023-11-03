import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import "./employee.css";
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
import CustomerTypeform from "./typeform";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer } from "react-toastify";
import custom_toast from "../alerts/custom_toast";
import went_wrong_toast from "../alerts/went_wrong_toast";
import Spinner from "react-bootstrap/Spinner";
import Alert_before_delete from "../../Container/alertContainer";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import PrintIcon from "@material-ui/icons/Print";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Save_button from "../buttons/save_button";
import Select from "react-select";
import TextField from "@mui/material/TextField";

export default function CustomerType(props) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  const user = props.state.setuser.user;
  const { t } = useTranslation();
  const route = props.state.setuser.route;
  const selected_branch = props.state.Setcurrentinfo.selected_branch;
  const current_user = props.state.Setcurrentinfo.current_user;
  const all_customers = props.state.Settablehistory.table_history;
  const dispatch = props.Settable_history;
  const settings = props.state.Setcurrentinfo.settings;
  const { SearchBar } = Search;
  const { ExportCSVButton } = CSVExport;
  const [showmodel, setshowmodel] = useState(false);
  const [data, setdata] = useState("");
  const [showmodelupdate, setshowmodelupdate] = useState(false);
  const [delete_user, setdelete_user] = useState(false);
  const [url_to_delete, seturl_to_delete] = useState("");
  const [row_id, setrow_id] = useState("");

  const [name, setname] = useState("");

  const [contact, setcontact] = useState("");
  const [cnic, setcnic] = useState("");
  const [address, setaddress] = useState("");
  const [ntn, setntn] = useState("");
  const [strn, setstrn] = useState("");
  const [percentage, setpercentage] = useState("");
  const [mergebilling, setmergebilling] = useState(true);
  const [isloading, setisloading] = useState(false);

  const [status, setstatus] = useState(false);
  const [allchannels, setallchannels] = useState([]);
  const [channel, setchannel] = useState("");

  const [allarea, setallarea] = useState([]);
  const [area, setarea] = useState("");

  // useEffect(() => {
  //   setisloading(true);

  //   const fetchWorkouts = async () => {
  //     dispatch({ type: "Set_table_history", data: [] });

  //     if (current_user.profile.user_type === "user") {
  //       var url = `${route}/api/customer-type/?user_id=${current_user.profile.parent_user}`;
  //     } else {
  //       url = `${route}/api/customer-type/?user_id=${current_user.id}`;
  //     }

  //     const response = await fetch(`${url}`, {
  //       headers: { Authorization: `Bearer ${user.access}` },
  //     });
  //     const json = await response.json();

  //     if (response.ok) {
  //       setisloading(false);
  //       dispatch({ type: "Set_table_history", data: json });
  //     }
  //     if (!response.ok) {
  //       went_wrong_toast();
  //       setisloading(false);
  //     }
  //   };

  //   if (user) {
  //     fetchWorkouts();
  //   }
  // }, [selected_branch]);

  const handleconfirm = (row) => {
    dispatch({ type: "Delete_table_history", data: { id: row } });
    custom_toast("Delete");
  };

  const Action = (cell, row, rowIndex, formatExtraData) => {
    return (
      <span className="action d-flex">
        <IconButton
          className="border border-danger rounded me-2"
          onClick={() => {
            setrow_id(row.id);
            seturl_to_delete(`${route}/api/customer-type/${row.id}/`);
            setdelete_user(true);
          }}
        >
          <DeleteRoundedIcon className="m-1" color="error" fontSize="small" />
        </IconButton>

        <IconButton
          style={{ border: "1px solid #003049", borderRadius: "5px" }}
          onClick={() => {
            setdata(row);
            setshowmodelupdate(true);
          }}
        >
          <EditOutlinedIcon
            className="m-1"
            style={{ color: "#003049" }}
            fontSize="small"
          />
        </IconButton>
      </span>
    );
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

  const columns = [
    { dataField: "id", text: "Id", hidden: true, headerFormatter: headerstyle },
    {
      dataField: "name",
      text: t("name"),
      sort: true,
      headerFormatter: headerstyle,
    },

    {
      dataField: "name",
      text: t("Category"),
      sort: true,
      headerFormatter: headerstyle,
    },

    {
      dataField: "name",
      text: t("Pr Day Wage"),
      sort: true,
      headerFormatter: headerstyle,
    },

    {
      dataField: "name",
      text: t("Balance"),
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "name",
      text: t("Cell"),
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "name",
      text: t("Salary"),
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "name",
      text: t("Hire Date"),
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "name",
      text: t("Nationality"),
      sort: true,
      headerFormatter: headerstyle,
    },

    {
      dataField: "action",
      text: t("action"),
      formatter: Action,
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
        value: all_customers.length,
      },
    ], // A numeric array is also available. the purpose of above example is custom the text
  };

  const makepdf = () => {
    const body = all_customers.map((item, index) => {
      return [index + 1, item.name];
    });
    body.splice(0, 0, ["#", "Name"]);

    const documentDefinition = {
      content: [
        { text: "Customers Type", style: "header" },

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
            widths: [50, "*"],
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
    pdfMake.createPdf(documentDefinition).download("Customers Type.pdf");
  };

  const print = () => {
    const documentDefinition = makepdf();
    pdfMake.createPdf(documentDefinition).print();
  };

  const rowstyle = { height: "10px", paddingLeft: "30px" };
  const selectStyles = {
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };
  return (
    <div className="p-3">
      <div className="card">
        <form>
          <div className="card-header d-flex justify-content-between bg-white">
            <h3 className="mt-2 me-2">Add Employee</h3>
            <div className="mt-2 me-2 d-flex flex-row-reverse">
              <Save_button isloading={isloading} />
              <Button
                type="button"
                className="me-3"
                variant="outline-success"
                onClick={() => setshowmodel(!showmodel)}
              >
                <FontAwesomeIcon className="me-2" icon={faUserPlus} />
                Add Category
              </Button>
            </div>
          </div>

          <div className="card-body pt-0">
            <div className="mt-4">
              <div className="row">
                <div className="col-md-3">
                  <TextField
                    className="form-control   mb-3"
                    label={"Name"}
                    value={name}
                    onChange={(e) => {
                      setname(e.target.value);
                    }}
                    size="small"
                    required
                  />
                </div>
                <div className="col-md-3">
                  <TextField
                    className="form-control  mb-3"
                    label={"اسم"}
                    value={cnic}
                    onChange={(e) => {
                      setcnic(e.target.value);
                    }}
                    size="small"
                  />
                </div>

                <div className="col-md-3">
                  <TextField
                    className="form-control  mb-3"
                    label={"Cell"}
                    value={contact}
                    onChange={(e) => {
                      setcontact(e.target.value);
                    }}
                    size="small"
                  />
                </div>
                <div className="col-md-3">
                  <TextField
                    type="number"
                    className="form-control   mb-3"
                    label={"Per Day Wage"}
                    value={strn}
                    onChange={(e) => {
                      setstrn(e.target.value);
                    }}
                    size="small"
                  />
                </div>
              </div>

              <div className="row">
                <div className=" col-md-3 mb-3">
                  <Select
                    className={
                      channel
                        ? "form-control selector type "
                        : "form-control selector"
                    }
                    styles={selectStyles}
                    options={allchannels}
                    placeholder={"Employee Category"}
                    value={channel}
                    onChange={(e) => {
                      setchannel(e);
                    }}
                    required
                    autoFocus
                  ></Select>
                </div>
                <div className="col-md-3">
                  <TextField
                    className="form-control  mb-3"
                    label={"Balance"}
                    value={percentage}
                    onChange={(e) => {
                      setpercentage(e.target.value);
                    }}
                    size="small"
                  />
                </div>

                <div className="col-md-3">
                  <TextField
                    multiline
                    className="form-control   mb-3"
                    label={"Working Hours"}
                    value={ntn}
                    onChange={(e) => {
                      setntn(e.target.value);
                    }}
                    size="small"
                  />
                </div>

                <div className=" col-md-3">
                  <TextField
                    multiline
                    className="form-control  mb-3"
                    label={t("address")}
                    value={address}
                    onChange={(e) => {
                      setaddress(e.target.value);
                    }}
                    size="small"
                  />
                </div>
              </div>

              <div className="row">
                <div className=" col-md-3">
                  <TextField
                    type="Date"
                    className="form-control  mb-3"
                    label={t("Hiring Date")}
                    InputLabelProps={{ shrink: true }}
                    value={address}
                    onChange={(e) => {
                      setaddress(e.target.value);
                    }}
                    size="small"
                  />
                </div>

                <div className=" col-md-3">
                  <TextField
                    type="Date"
                    className="form-control  mb-3"
                    label={t("Firing Date")}
                    InputLabelProps={{ shrink: true }}
                    value={address}
                    onChange={(e) => {
                      setaddress(e.target.value);
                    }}
                    size="small"
                  />
                </div>

                <div className=" col-md-3">
                  <TextField
                    className="form-control  mb-3"
                    label={t("Nationality")}
                    value={address}
                    onChange={(e) => {
                      setaddress(e.target.value);
                    }}
                    size="small"
                  />
                </div>

                <div className=" col-md-3">
                  <TextField
                    type="Number"
                    className="form-control  mb-3"
                    label={t("Basic Salary")}
                    value={address}
                    onChange={(e) => {
                      setaddress(e.target.value);
                    }}
                    size="small"
                  />
                </div>
              </div>

              <div className="row">
                <div className=" col-md-3">
                  <TextField
                    type="number"
                    className="form-control  mb-3"
                    label={t("Transport Allowance")}
                    value={address}
                    onChange={(e) => {
                      setaddress(e.target.value);
                    }}
                    size="small"
                  />
                </div>

                <div className=" col-md-3">
                  <TextField
                    type="number"
                    className="form-control  mb-3"
                    label={t("Food Allowance")}
                    value={address}
                    onChange={(e) => {
                      setaddress(e.target.value);
                    }}
                    size="small"
                  />
                </div>

                <div className=" col-md-3">
                  <TextField
                    type="number"
                    className="form-control  mb-3"
                    label={t("Accomodation Allowance")}
                    value={address}
                    onChange={(e) => {
                      setaddress(e.target.value);
                    }}
                    size="small"
                  />
                </div>

                <div className=" col-md-3">
                  <TextField
                    type="Number"
                    className="form-control  mb-3"
                    label={t("PR Allowance")}
                    value={address}
                    onChange={(e) => {
                      setaddress(e.target.value);
                    }}
                    size="small"
                  />
                </div>
              </div>

              <div className="row">
                <div className=" col-md-3">
                  <TextField
                    type="number"
                    className="form-control  mb-3"
                    label={t("Extra Allowance")}
                    value={address}
                    onChange={(e) => {
                      setaddress(e.target.value);
                    }}
                    size="small"
                  />
                </div>

                <div className="d-flex col-md-3">
                  <div className=" col-md-6">
                    <TextField
                      className="form-control   mb-3"
                      label={t("Passport No")}
                      value={address}
                      onChange={(e) => {
                        setaddress(e.target.value);
                      }}
                      size="small"
                    />
                  </div>
                  <div className="ps-3 col-md-6 ">
                    <TextField
                      type="Date"
                      className="form-control  mb-3"
                      label={t("Expiry")}
                      InputLabelProps={{ shrink: true }}
                      value={address}
                      onChange={(e) => {
                        setaddress(e.target.value);
                      }}
                      size="small"
                    />
                  </div>
                </div>

                <div className="d-flex col-md-3 ">
                  <div className="col-md-6">
                    <TextField
                      className="form-control  mb-3"
                      label={t("Muncipilaty Card")}
                      value={address}
                      onChange={(e) => {
                        setaddress(e.target.value);
                      }}
                      size="small"
                    />
                  </div>
                  <div className="ps-3 col-md-6 ">
                    <TextField
                      type="Date"
                      className="form-control  mb-3"
                      label={t("Expiry")}
                      InputLabelProps={{ shrink: true }}
                      value={address}
                      onChange={(e) => {
                        setaddress(e.target.value);
                      }}
                      size="small"
                    />
                  </div>
                </div>

                <div className="d-flex col-md-3 ">
                  <div className=" col-md-6">
                    <TextField
                      className="form-control  mb-3"
                      label={t("Driving License")}
                      value={address}
                      onChange={(e) => {
                        setaddress(e.target.value);
                      }}
                      size="small"
                    />
                  </div>
                  <div className="ps-3 col-md-6">
                    <TextField
                      type="Date"
                      className="form-control  mb-3"
                      label={t("Expiry")}
                      InputLabelProps={{ shrink: true }}
                      value={address}
                      onChange={(e) => {
                        setaddress(e.target.value);
                      }}
                      size="small"
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="d-flex col-md-3">
                  <div className=" col-md-6">
                    <TextField
                      className="form-control   mb-3"
                      label={t("Work Permit")}
                      value={address}
                      onChange={(e) => {
                        setaddress(e.target.value);
                      }}
                      size="small"
                    />
                  </div>
                  <div className="ps-3 col-md-6 ">
                    <TextField
                      type="Date"
                      className="form-control  mb-3"
                      label={t("Expiry")}
                      InputLabelProps={{ shrink: true }}
                      value={address}
                      onChange={(e) => {
                        setaddress(e.target.value);
                      }}
                      size="small"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="card mt-3">
        <div className="card-body pt-0">
          <ToolkitProvider
            keyField="id"
            data={all_customers}
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
                <div style={{ zoom: ".9" }}>
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
              </div>
            )}
          </ToolkitProvider>
        </div>
      </div>

      {showmodel && (
        <CustomerTypeform
          show={showmodel}
          onHide={() => setshowmodel(false)}
          user={user}
          route={route}
          callback={dispatch}
          selected_branch={selected_branch}
          current_user={current_user}
        />
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
      <ToastContainer autoClose={1000} hideProgressBar={true} theme="dark" />
    </div>
  );
}
