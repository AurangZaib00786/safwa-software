import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import "./customer.css";
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
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import success_toast from "../alerts/success_toast";
import Save_button from "../buttons/save_button";
import TextField from "@mui/material/TextField";
import custom_toast from "../alerts/custom_toast";
import Spinner from "react-bootstrap/Spinner";
import Alert_before_delete from "../../Container/alertContainer";
import pdfMake from "pdfmake/build/pdfmake";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import PrintIcon from "@material-ui/icons/Print";
import { useTranslation } from "react-i18next";
import Red_toast from "../alerts/red_toast";
import { MuiThemeProvider, createTheme } from "@material-ui/core/styles";
import Select from "../alerts/select";

export default function Customer(props) {
  const { t } = useTranslation();
  const user = props.state.setuser.user;
  const route = props.state.setuser.route;
  const selected_branch = props.state.Setcurrentinfo.selected_branch;
  const current_user = props.state.Setcurrentinfo.current_user;
  const all_customers = props.state.Settablehistory.table_history;
  const dispatch = props.Settable_history;
  const { SearchBar } = Search;
  const { ExportCSVButton } = CSVExport;

  const [id, setid] = useState("");
  const [check_update, setcheck_update] = useState(true);
  const [delete_user, setdelete_user] = useState(false);
  const [url_to_delete, seturl_to_delete] = useState("");
  const [row_id, setrow_id] = useState("");

  const [name, setname] = useState("");
  const [arabicname, setarabicname] = useState("");
  const [contact, setcontact] = useState("");
  const [address, setaddress] = useState("");
  const [vatno, setvatno] = useState("");
  const [bankdetails, setbankdetails] = useState("");
  const [email, setemail] = useState("");

  const [area, setarea] = useState("");
  const [allarea, setallarea] = useState([]);
  const [notes, setnotes] = useState("");
  const [allemployee, setallemployee] = useState([]);

  const [contact_name, setcontact_name] = useState("");

  const [contact_mobile, setcontact_mobile] = useState("");
  const [contact_email, setcontact_email] = useState("");
  const [contact_notes, setcontact_notes] = useState("");

  const [saleman_start_date, setsaleman_start_date] = useState("");
  const [saleman_saleman, setsaleman_saleman] = useState("");

  const [client_date, setclient_date] = useState("");
  const [client_limit, setclient_limit] = useState("");
  const [client_period, setclient_period] = useState("");

  const [isloading, setisloading] = useState(false);
  const theme = createTheme({
    direction: "rtl", // Both here and <body dir="rtl">
  });
  useEffect(() => {
    dispatch({ type: "Set_table_history", data: [] });
    setisloading(true);
    dispatch({ type: "Set_menuitem", data: "customer" });
    const fetchWorkouts = async () => {
      var url = `${route}/api/parties/?account_head=${selected_branch.id}&type=customer`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        setisloading(false);
        dispatch({ type: "Set_table_history", data: json });
      }
      if (!response.ok) {
        var error = Object.keys(json);
        if (error.length > 0) {
          Red_toast(`${json[error[0]]}`);
        }
        setisloading(false);
      }
    };
    const fetchemployees = async () => {
      var url = `${route}/api/employee/?account_head=${selected_branch.id}`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        setisloading(false);
        const optimize = json.map((item) => {
          return { value: item.id, label: `${item.id}-${item.name}` };
        });
        setallemployee(optimize);
      }
      if (!response.ok) {
        var error = Object.keys(json);
        if (error.length > 0) {
          Red_toast(`${error[0]}:${json[error[0]]}`);
        }
        setisloading(false);
      }
    };
    if (user) {
      fetchWorkouts();
      fetchemployees();
    }
  }, [selected_branch]);

  useEffect(() => {
    const fetchareas = async () => {
      var url = `${route}/api/area/`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        setisloading(false);
        const optimize = json.map((item) => {
          return { value: item.id, label: item.name };
        });
        setallarea(optimize);
      }
      if (!response.ok) {
        var error = Object.keys(json);
        if (error.length > 0) {
          Red_toast(`${error[0]}:${json[error[0]]}`);
        }
        setisloading(false);
      }
    };
    fetchareas();
  }, []);

  const handleconfirm = (row) => {
    dispatch({ type: "Delete_table_history", data: { id: row } });
    custom_toast("Delete");
  };

  const Action = (cell, row, rowIndex, formatExtraData) => {
    return (
      <span className="action d-flex">
        {current_user?.permissions?.includes("delete_customer") && (
          <IconButton
            className="border border-danger rounded me-2"
            onClick={() => {
              setrow_id(row.id);
              seturl_to_delete(`${route}/api/parties/${row.id}/`);
              setdelete_user(true);
            }}
          >
            <DeleteRoundedIcon className="m-1" color="error" fontSize="small" />
          </IconButton>
        )}

        {current_user?.permissions?.includes("change_customer") && (
          <IconButton
            style={{ border: "1px solid #003049", borderRadius: "5px" }}
            onClick={() => {
              setname(row.name);
              setarabicname(row.arabic_name);
              setcontact(row.contact);
              setvatno(row.vat_number);
              setaddress(row.address);
              setbankdetails(row.bank);
              setemail(row.email);
              setnotes(row.notes);
              setarea({ value: row.area, label: row.area_name });

              setclient_date(row.client_limits?.date);
              setclient_limit(row.client_limits?.limit);
              setclient_period(row.client_limits?.period);

              setcontact_email(row.contact_details?.email);
              setcontact_mobile(row.contact_details?.mobile);
              setcontact_name(row.contact_details?.name);
              setcontact_notes(row.contact_details?.notes);

              setsaleman_saleman({
                value: row.saleman_details?.sale_man,
                label: row.saleman_details?.sale_man_name,
              });
              setsaleman_start_date(row.saleman_details?.start_date);

              setid(row.id);
              setcheck_update(false);
            }}
          >
            <EditOutlinedIcon
              className="m-1"
              style={{ color: "#003049" }}
              fontSize="small"
            />
          </IconButton>
        )}
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
      dataField: "arabic_name",
      text: t("اسم"),
      sort: true,
      headerFormatter: headerstyle,
    },

    {
      dataField: "contact",
      text: t("Contact"),
      sort: true,
      headerFormatter: headerstyle,
    },

    {
      dataField: "vat_number",
      text: "VAT No",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "bank",
      text: "Bank Details",
      sort: true,
      headerFormatter: headerstyle,
    },

    {
      dataField: "address",
      text: t("address"),
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "notes",
      text: t("Notes"),
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
      return [
        index + 1,
        item.name,
        item.arabic_name,

        item.contact,
        item.vat_number,
        item.bank,
        item.timing_name,
        item.menu_name,
        item.address,
      ];
    });
    body.splice(0, 0, [
      "#",
      "Type",
      "Area",
      "Name",
      "Contact",
      "vatno",
      "menu",
      "%",
      "Address",
    ]);

    const documentDefinition = {
      content: [
        { text: "Customers", style: "header" },
        { text: `Account Head: ${selected_branch.name}`, style: "body" },
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
            widths: [30, "*", "*", "*", "*", "*", "*", "*", "*"],
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
          fontSize: 8,
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
    pdfMake.createPdf(documentDefinition).download("Customers.pdf");
  };

  const print = () => {
    const documentDefinition = makepdf();
    pdfMake.createPdf(documentDefinition).print();
  };

  const rowstyle = { height: "10px", paddingLeft: "30px" };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isloading) {
      setisloading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("arabic_name", arabicname);
      formData.append("contact", contact);
      formData.append("vat_number", vatno);
      formData.append("address", address);
      formData.append("bank", bankdetails);
      formData.append("type", "customer");
      formData.append("area", area?.value);
      formData.append("email", email);
      formData.append("notes", notes);

      formData.append("saleman_details.sale_man", saleman_saleman?.value);
      if (saleman_start_date) {
        formData.append("saleman_details.start_date", saleman_start_date);
      }

      formData.append("client_limits.limit", client_limit);
      if (client_date) {
        formData.append("client_limits.date", client_date);
      }
      if (client_period) {
        formData.append("client_limits.period", client_period);
      }

      formData.append("contact_details.name", contact_name);
      if (contact_email) {
        formData.append("contact_details.email", contact_email);
      }

      if (contact_mobile) {
        formData.append("contact_details.mobile", contact_mobile);
      }
      if (contact_notes) {
        formData.append("contact_details.notes", contact_notes);
      }

      formData.append("account_head", selected_branch.id);

      const response = await fetch(`${route}/api/parties/`, {
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
        dispatch({ type: "Create_table_history", data: json });
        setisloading(false);
        success_toast();

        setname("");
        setarabicname("");
        setvatno("");
        setaddress("");
        setcontact("");
        setemail("");
        setarea("");
        setnotes("");
        setbankdetails("");

        setclient_date("");
        setclient_limit("");
        setclient_period("");

        setsaleman_saleman("");
        setsaleman_start_date("");

        setcontact_email("");
        setcontact_mobile("");
        setcontact_name("");
        setcontact_notes("");
      }
    }
  };

  const handleSubmit_update = async (e) => {
    e.preventDefault();
    if (!isloading) {
      setisloading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("arabic_name", arabicname);
      formData.append("contact", contact);
      formData.append("vat_number", vatno);
      formData.append("address", address);
      formData.append("bank", bankdetails);
      formData.append("area", area?.value);
      formData.append("email", email);
      formData.append("notes", notes);

      formData.append("saleman_details.sale_man", saleman_saleman?.value);
      if (saleman_start_date) {
        formData.append("saleman_details.start_date", saleman_start_date);
      }

      formData.append("client_limits.limit", client_limit);
      if (client_date) {
        formData.append("client_limits.date", client_date);
      }
      if (client_period) {
        formData.append("client_limits.period", client_period);
      }

      formData.append("contact_details.name", contact_name);
      if (contact_email) {
        formData.append("contact_details.email", contact_email);
      }

      if (contact_mobile) {
        formData.append("contact_details.mobile", contact_mobile);
      }
      if (contact_notes) {
        formData.append("contact_details.notes", contact_notes);
      }
      const response = await fetch(`${route}/api/parties/${id}/`, {
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
        dispatch({ type: "Update_table_history", data: json });
        setisloading(false);
        success_toast();

        setname("");
        setarabicname("");
        setvatno("");
        setaddress("");
        setcontact("");
        setemail("");
        setarea("");
        setnotes("");
        setbankdetails("");

        setclient_date("");
        setclient_limit("");
        setclient_period("");

        setsaleman_saleman("");
        setsaleman_start_date("");

        setcontact_email("");
        setcontact_mobile("");
        setcontact_name("");
        setcontact_notes("");

        setid("");
        setcheck_update(true);
      }
    }
  };

  return (
    <div className="p-3 pt-2">
      {current_user?.permissions?.includes("add_customer") && (
        <div className="card">
          <form onSubmit={check_update ? handleSubmit : handleSubmit_update}>
            <div className="card-header d-flex justify-content-between bg-white">
              <h3 className="mt-2 me-2">Add Customer</h3>
              <div className="mt-2 me-2 d-flex flex-row-reverse">
                <Save_button isloading={isloading} />
              </div>
            </div>

            <div className="card-body pt-0" style={{ minHeight: "45vh" }}>
              <Tabs
                defaultActiveKey={"information"}
                transition={true}
                id="noanim-tab-example"
                className="mb-3"
              >
                <Tab eventKey="information" title="Info">
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
                          autoFocus
                        />
                      </div>
                      <MuiThemeProvider theme={theme}>
                        <div dir="rtl" className="col-md-3">
                          <TextField
                            className="form-control  mb-3"
                            label={"اسم"}
                            value={arabicname}
                            onChange={(e) => {
                              setarabicname(e.target.value);
                            }}
                            size="small"
                            required
                          />
                        </div>
                      </MuiThemeProvider>

                      <div className="col-md-3">
                        <TextField
                          type="number"
                          className="form-control  mb-3"
                          label={"Mobile"}
                          value={contact}
                          onChange={(e) => {
                            if (e.target.value.length < 11) {
                              setcontact(e.target.value);
                            } else {
                              Red_toast("Mobile digits must be between 0~10");
                            }
                          }}
                          size="small"
                        />
                      </div>

                      <div className="col-md-3">
                        <TextField
                          type="number"
                          className="form-control  mb-3"
                          label={"VAT No"}
                          value={vatno}
                          onChange={(e) => {
                            if (e.target.value.length < 16) {
                              setvatno(e.target.value);
                            } else {
                              Red_toast("VAT no digits must be between 0~15");
                            }
                          }}
                          size="small"
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-3">
                        <Select
                          options={allarea}
                          value={area}
                          placeholder={"Area"}
                          funct={(e) => setarea(e)}
                          required={true}
                        />
                      </div>
                      <div className="col-md-3">
                        <TextField
                          type="email"
                          className="form-control  mb-3"
                          label={"Email"}
                          value={email}
                          onChange={(e) => {
                            setemail(e.target.value);
                          }}
                          size="small"
                        />
                      </div>

                      <div className="col-md-3">
                        <TextField
                          multiline
                          className="form-control   mb-3"
                          label={"Bank Details"}
                          value={bankdetails}
                          onChange={(e) => {
                            setbankdetails(e.target.value);
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
                      <div className=" col-md-3">
                        <TextField
                          multiline
                          className="form-control  mb-3"
                          label={"Notes"}
                          value={notes}
                          onChange={(e) => {
                            setnotes(e.target.value);
                          }}
                          size="small"
                        />
                      </div>
                    </div>
                  </div>
                </Tab>
                <Tab eventKey="contact" title="Contact">
                  <div className="mt-4">
                    <div className="row">
                      <div className="col-md-3">
                        <TextField
                          className="form-control   mb-3"
                          label={"Name"}
                          value={contact_name}
                          onChange={(e) => {
                            setcontact_name(e.target.value);
                          }}
                          size="small"
                          required
                          autoFocus
                        />
                      </div>

                      <div className="col-md-3">
                        <TextField
                          type="number"
                          className="form-control  mb-3"
                          label={"Mobile"}
                          value={contact_mobile}
                          onChange={(e) => {
                            if (e.target.value.length < 11) {
                              setcontact_mobile(e.target.value);
                            } else {
                              Red_toast("Mobile digits must be between 0~10");
                            }
                          }}
                          size="small"
                        />
                      </div>

                      <div className="col-md-3">
                        <TextField
                          type="email"
                          className="form-control  mb-3"
                          label={"Email"}
                          value={contact_email}
                          onChange={(e) => {
                            setcontact_email(e.target.value);
                          }}
                          size="small"
                        />
                      </div>
                      <div className="col-md-3">
                        <TextField
                          multiline
                          className="form-control   mb-3"
                          label={"Notes"}
                          value={contact_notes}
                          onChange={(e) => {
                            setcontact_notes(e.target.value);
                          }}
                          size="small"
                        />
                      </div>
                    </div>
                  </div>
                </Tab>
                <Tab eventKey="saleman" title="Saleman">
                  <div className="mt-4">
                    <div className="row">
                      <div className="col-md-3">
                        <TextField
                          type="date"
                          className="form-control   mb-3"
                          label={"Start Date"}
                          InputLabelProps={{ shrink: true }}
                          value={saleman_start_date}
                          onChange={(e) => {
                            setsaleman_start_date(e.target.value);
                          }}
                          size="small"
                          autoFocus
                        />
                      </div>

                      <div className="col-md-3">
                        <Select
                          options={allemployee}
                          value={saleman_saleman}
                          placeholder={"Employees"}
                          funct={(e) => setsaleman_saleman(e)}
                          required={true}
                        />
                      </div>
                    </div>
                  </div>
                </Tab>
                <Tab eventKey="client_limit" title="Client Limits">
                  <div className="mt-4">
                    <div className="row">
                      <div className="col-md-3">
                        <TextField
                          type="date"
                          className="form-control   mb-3"
                          label={"Date"}
                          value={client_date}
                          InputLabelProps={{ shrink: true }}
                          onChange={(e) => {
                            setclient_date(e.target.value);
                          }}
                          size="small"
                          autoFocus
                        />
                      </div>

                      <div className="col-md-3">
                        <TextField
                          type="number"
                          className="form-control  mb-3"
                          label={"Limit"}
                          value={client_limit}
                          onChange={(e) => {
                            setclient_limit(e.target.value);
                          }}
                          size="small"
                          required
                        />
                      </div>
                      <div className="col-md-3">
                        <TextField
                          className="form-control  mb-3"
                          label={"Period"}
                          value={client_period}
                          onChange={(e) => {
                            setclient_period(e.target.value);
                          }}
                          size="small"
                        />
                      </div>
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </div>
          </form>
        </div>
      )}

      {current_user?.permissions?.includes("view_customer") && (
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
