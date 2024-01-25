import React, { useState, useEffect, useRef, memo } from "react";
import Button from "react-bootstrap/Button";
import "./supplier.css";
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
import success_toast from "../alerts/success_toast";
import Save_button from "../buttons/save_button";
import TextField from "@mui/material/TextField";
import custom_toast from "../alerts/custom_toast";
import Red_toast from "../alerts/red_toast";
import Spinner from "react-bootstrap/Spinner";
import Alert_before_delete from "../../Container/alertContainer";
import pdfMake from "pdfmake/build/pdfmake";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import PrintIcon from "@material-ui/icons/Print";
import { useTranslation } from "react-i18next";
import { MuiThemeProvider, createTheme } from "@material-ui/core/styles";

function Supplier(props) {
  const { t } = useTranslation();
  const user = props.state.setuser.user;
  const route = props.state.setuser.route;
  const selected_branch = props.state.Setcurrentinfo.selected_branch;
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
  const [isloading, setisloading] = useState(false);
  const theme = createTheme({
    direction: "rtl", // Both here and <body dir="rtl">
  });

  useEffect(() => {
    dispatch({ type: "Set_table_history", data: [] });
    dispatch({ type: "Set_menuitem", data: "supplier" });
    setisloading(true);

    const fetchWorkouts = async () => {
      var url = `${route}/api/parties/?account_head=${selected_branch.id}&type=supplier`;

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
          Red_toast(`${error[0]}:${json[error[0]]}`);
        }
        setisloading(false);
      }
    };

    if (user) {
      fetchWorkouts();
    }
  }, [selected_branch]);

  const handleconfirm = (row) => {
    dispatch({ type: "Delete_table_history", data: { id: row } });
    custom_toast("Delete");
  };

  const Action = (cell, row, rowIndex, formatExtraData) => {
    return (
      <span className="action d-flex">
        <IconButton
          className="border border-danger rounded me-2 tooltipclass"
          onClick={() => {
            setrow_id(row.id);
            seturl_to_delete(`${route}/api/parties/${row.id}/`);
            setdelete_user(true);
          }}
        >
          <DeleteRoundedIcon className="m-1" color="error" fontSize="small" />
          <span className="tooltip-textclass">Delete</span>
        </IconButton>

        <IconButton
          style={{ border: "1px solid #003049", borderRadius: "5px" }}
          className="tooltipclass"
          onClick={() => {
            setname(row.name);
            setarabicname(row.arabic_name);
            setcontact(row.contact);
            setvatno(row.vat_number);
            setbankdetails(row.bank);
            setaddress(row.address);

            setid(row.id);
            setcheck_update(false);
            custom_toast("Data loaded");
          }}
        >
          <EditOutlinedIcon
            className="m-1"
            style={{ color: "#003049" }}
            fontSize="small"
          />
          <span className="tooltip-textclass">Edit</span>
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
      dataField: "arabic_name",
      text: t("اسم"),
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "contact",
      text: t("Cell"),
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
        item.address,
      ];
    });
    body.splice(0, 0, [
      "#",
      "Name",
      "Arabic Name",
      "Contact",
      "VAT No.",
      "Bank",
      "Address",
    ]);

    const documentDefinition = {
      content: [
        { text: "Suppliers", style: "header" },
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
            widths: [30, "*", "*", "*", "*", "*", "*"],
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
    pdfMake.createPdf(documentDefinition).download("Suppliers.pdf");
  };

  const print = () => {
    const documentDefinition = makepdf();
    pdfMake.createPdf(documentDefinition).print();
  };

  const rowstyle = { height: "10px", paddingLeft: "30px" };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (check_update) {
      if (!isloading) {
        setisloading(true);
        const formData = new FormData();
        formData.append("name", name);
        formData.append("arabic_name", arabicname);
        formData.append("contact", contact);
        formData.append("vat_number", vatno);

        formData.append("address", address);
        formData.append("bank", bankdetails);
        formData.append("type", "supplier");
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
          setbankdetails("");
        }
      }
    } else {
      handleSubmit_update();
    }
  };

  const handleSubmit_update = async () => {
    if (!isloading) {
      setisloading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("arabic_name", arabicname);
      formData.append("contact", contact);
      formData.append("vat_number", vatno);

      formData.append("address", address);
      formData.append("bank", bankdetails);

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
        setbankdetails("");
        setid("");
        setcheck_update(true);
      }
    }
  };

  return (
    <div className="p-3 pt-2">
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="card-header d-flex justify-content-between bg-white">
            <h3 className="mt-2 me-2">Add Vendors</h3>
            <div className="mt-2 me-2 d-flex flex-row-reverse">
              <Save_button isloading={isloading} />
            </div>
          </div>

          <div className="card-body pt-0">
            <div className="row mt-4">
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

                <div className="col-md-3">
                  <TextField
                    multiline
                    className="form-control   mb-3"
                    label={"Address"}
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
export default memo(Supplier);
