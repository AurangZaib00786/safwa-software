import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import "./journal.css";
import Select from "../alerts/select";
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
import TextField from "@mui/material/TextField";
import Save_button from "../buttons/save_button";
import success_toast from "../alerts/success_toast";

export default function Customer_Journal(props) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  const { t } = useTranslation();
  const user = props.state.setuser.user;
  const route = props.state.setuser.route;
  const selected_branch = props.state.Setcurrentinfo.selected_branch;
  const current_user = props.state.Setcurrentinfo.current_user;
  const all_products = props.state.Settablehistory.table_history;
  const settings = props.state.Setcurrentinfo.settings;
  const dispatch = props.Settable_history;
  const { SearchBar } = Search;
  const { ExportCSVButton } = CSVExport;
  var curr = new Date();
  var curdate = curr.toISOString().substring(0, 10);

  const [delete_user, setdelete_user] = useState(false);
  const [url_to_delete, seturl_to_delete] = useState("");
  const [row_id, setrow_id] = useState("");
  const [isloading, setisloading] = useState(false);

  const [customer, setcustomer] = useState("");
  const [allcustomer, setallcustomer] = useState([]);

  const [saleman, setsaleman] = useState("");
  const [allsalemans, setallsalemans] = useState([]);

  const [credit, setcredit] = useState(0);
  const [debit, setdebit] = useState(0);
  const [date, setdate] = useState(curdate);
  const [remarks, setremarks] = useState("");

  const [check_update, setcheck_update] = useState(true);
  const [callagain, setcallagain] = useState(false);
  const [id, setid] = useState("");

  useEffect(() => {
    dispatch({ type: "Set_menuitem", data: "journal_customer" });
  }, []);

  useEffect(() => {
    const fetchcustomer = async () => {
      var url = `${route}/api/parties/?account_head=${selected_branch.id}&type=customer`;
      if (!settings?.user_base?.account_base) {
        if (current_user.profile.user_type === "user") {
          url = `${route}/api/parties/?user_id=${current_user.profile.parent_user}&type=customer`;
        } else {
          url = `${route}/api/parties/?user_id=${current_user.id}&type=customer`;
        }
      }
      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        const optimize = json.map((item) => {
          return { value: item.id, label: item.name };
        });
        setallcustomer(optimize);
      }
    };

    const fetchsalesman = async () => {
      var url = `${route}/api/sales-persons/?account_head=${selected_branch.id}`;
      if (!settings?.user_base?.account_base) {
        if (current_user.profile.user_type === "user") {
          url = `${route}/api/sales-persons/?user_id=${current_user.profile.parent_user}`;
        } else {
          url = `${route}/api/sales-persons/?user_id=${current_user.id}`;
        }
      }

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        setisloading(false);
        const optimize = json.map((item) => {
          return { value: item.id, label: item.name };
        });
        setallsalemans(optimize);
      }
      if (!response.ok) {
        went_wrong_toast();
        setisloading(false);
      }
    };

    if (user) {
      fetchcustomer();
      fetchsalesman();
    }
  }, [selected_branch]);

  useEffect(() => {
    dispatch({ type: "Set_table_history", data: [] });
    setisloading(true);
    const fetchpaments = async () => {
      const response = await fetch(
        `${route}/api/parties-payments/?account_head=${selected_branch.id}&user_id=${current_user.id}&user_type=${current_user?.profile?.user_type}&party_type=Customer&reference=JV`,
        {
          headers: { Authorization: `Bearer ${user.access}` },
        }
      );
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

    if (user) {
      fetchpaments();
    }
  }, [selected_branch]);

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

  const Action = (cell, row, rowIndex, formatExtraData) => {
    return (
      <span className="action d-flex">
        <IconButton
          className="border border-danger rounded me-2"
          onClick={() => {
            setrow_id(row.id);
            seturl_to_delete(`${route}/api/parties-payments/${row.id}/`);
            setdelete_user(true);
          }}
        >
          <DeleteRoundedIcon className="m-1" color="error" fontSize="medium" />
        </IconButton>

        <IconButton
          className=""
          style={{ border: "1px solid #003049", borderRadius: "5px" }}
          onClick={() => {
            setcredit(row.credit);
            setdebit(row.debit);
            setdate(row.date);
            setremarks(row.remarks);
            setcustomer({ value: row.party, label: row.party_name });
            setsaleman({ value: row.sale_person, label: row.sale_person_name });
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
      </span>
    );
  };

  const fix_formatter = (cell, row) => {
    return <div>{parseFloat(cell).toFixed(2)}</div>;
  };

  const columns = [
    {
      dataField: "id",
      text: "Id",
      hidden: true,
      headerFormatter: headerstyle,
      csvExport: false,
    },

    {
      dataField: "date",
      text: "Date",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "party_name",
      text: "Customer",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "sale_person_name",
      text: "Sale Person",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "credit",
      text: "Credit(++)",
      sort: true,
      headerFormatter: headerstyle,
      formatter: fix_formatter,
    },
    {
      dataField: "debit",
      text: "Debit(--)",
      sort: true,
      headerFormatter: headerstyle,
    },

    {
      dataField: "remarks",
      text: "Remarks",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "action",
      text: t("action"),
      formatter: Action,
      headerFormatter: headerstyle,
      csvExport: false,
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
        value: all_products.length,
      },
    ], // A numeric array is also available. the purpose of above example is custom the text
  };

  const makepdf = () => {
    const body = all_products.map((item, index) => {
      return [
        index + 1,
        item.date,
        item.party_name,
        item.sale_person_name,
        item.credit,
        item.debit,
        item.remarks,
      ];
    });
    body.splice(0, 0, [
      "#",
      "Date",
      "Party",
      "Sale Person",
      "Credit(++)",
      "debit(--)",
      "Remarks",
    ]);

    const documentDefinition = {
      content: [
        { text: "Customers Journal", style: "header" },
        { text: `Account Heads: ${selected_branch.name}`, style: "body" },
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
    pdfMake.createPdf(documentDefinition).download("Customer Journal.pdf");
  };

  const print = () => {
    const documentDefinition = makepdf();
    pdfMake.createPdf(documentDefinition).print();
  };

  const rowstyle = { height: "10px" };

  const handlesubmit = async (e) => {
    e.preventDefault();
    if (check_update) {
      setisloading(true);
      const formData = new FormData();

      formData.append("credit", credit);
      formData.append("debit", debit);
      formData.append("date", date);
      formData.append("party", customer.value);
      formData.append("remarks", remarks);
      formData.append("reference", "JV");
      formData.append("account_head", selected_branch.id);
      formData.append("sale_person", saleman.value);
      formData.append("user", current_user.id);

      const response = await fetch(`${route}/api/parties-payments/`, {
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
        dispatch({ type: "Create_table_history", data: json });
        success_toast();
        setcredit("");
        setdebit("");
        setdate(curdate);
        setremarks("");
        setcustomer("");
        setsaleman("");
      }
    } else {
      handleSubmit_update();
    }
  };

  const handleSubmit_update = async (e) => {
    setisloading(true);
    const formData = new FormData();

    formData.append("credit", credit);
    formData.append("debit", debit);
    formData.append("date", date);
    formData.append("party", customer.value);
    formData.append("sale_person", saleman.value);
    formData.append("remarks", remarks);

    const response = await fetch(`${route}/api/parties-payments/${id}/`, {
      method: "PATCH",
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
      dispatch({ type: "Update_table_history", data: json });
      success_toast();
      setcredit("");
      setdebit("");
      setdate(curdate);
      setremarks("");
      setcustomer("");
      setsaleman("");
      setcheck_update(true);
    }
  };

  return (
    <div className="p-3 pt-2">
      <div className="card">
        <form onSubmit={handlesubmit}>
          <div className="card-header d-flex justify-content-between bg-white">
            <h3 className="mt-2 me-2">Add Journal</h3>
            <div className="mt-2 me-2 d-flex flex-row-reverse">
              <Save_button isloading={isloading} />
            </div>
          </div>

          <div className="card-body pt-0">
            <div className="row mt-4">
              <div className="col-md-3">
                <TextField
                  type="date"
                  className="form-control   mb-3"
                  label="Date"
                  value={date}
                  onChange={(e) => {
                    setdate(e.target.value);
                  }}
                  size="small"
                  required
                />
              </div>
              <div className="col-md-3">
                <Select
                  options={allcustomer}
                  placeholder="Customers"
                  value={customer}
                  funct={(e) => setcustomer(e)}
                  required={true}
                />
              </div>
              <div className="col-md-3">
                <Select
                  options={allsalemans}
                  placeholder="Sale Person"
                  value={saleman}
                  funct={(e) => setsaleman(e)}
                  required={true}
                />
              </div>
              <div className="col-md-3">
                <TextField
                  type="number"
                  className="form-control  mb-3"
                  label="Credit"
                  value={credit}
                  onChange={(e) => {
                    setcredit(e.target.value);
                  }}
                  size="small"
                  required
                />
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-3">
                <TextField
                  type="number"
                  className="form-control  mb-3"
                  label="Debit"
                  value={debit}
                  onChange={(e) => {
                    setdebit(e.target.value);
                  }}
                  size="small"
                  required
                />
              </div>
              <div className="col-md-3">
                <TextField
                  multiline
                  className="form-control   mb-3"
                  label="Remarks"
                  value={remarks}
                  onChange={(e) => {
                    setremarks(e.target.value);
                  }}
                  size="small"
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="card mt-3">
        <div className="card-body pt-0">
          <ToolkitProvider
            keyField="id"
            data={all_products}
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
