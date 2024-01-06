import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import { IconButton } from "@material-ui/core";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {
  CSVExport,
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import Spinner from "react-bootstrap/Spinner";
import went_wrong_toast from "../alerts/went_wrong_toast";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { ToastContainer } from "react-toastify";
import custom_toast from "../alerts/custom_toast";
import Alert_before_delete from "../../Container/alertContainer";
import Select from "../alerts/select";
import TextField from "@mui/material/TextField";
import Overlay from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css";
import { DateRangePicker, defaultStaticRanges } from "react-date-range";
import {
  endOfDay,
  startOfYear,
  endOfYear,
  addYears,
  isSameDay,
} from "date-fns";
import PrintRoundedIcon from "@material-ui/icons/PrintRounded";
import { useTranslation } from "react-i18next";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import PrintIcon from "@material-ui/icons/Print";
import Red_toast from "../alerts/red_toast";
import moment from "moment";

function Dailymeal_history(props) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  const { t } = useTranslation();
  const user = props.state.setuser.user;
  const route = props.state.setuser.route;
  const selected_branch = props.state.Setcurrentinfo.selected_branch;
  const history = props.state.Settablehistory.table_history;
  const dispatch = props.Settable_history;
  const { SearchBar } = Search;
  const { ExportCSVButton } = CSVExport;
  const invoice_type = props.state.Setcurrentinfo.invoice_type;
  const setActiveTab = props.setActiveTab;

  const [delete_user, setdelete_user] = useState(false);
  const [url_to_delete, seturl_to_delete] = useState("");
  const [row_id, setrow_id] = useState("");
  const [isloading, setisloading] = useState(false);

  const [type, settype] = useState({ value: "all", label: "All" });
  const [customer, setcustomer] = useState({ value: "all", label: "All" });
  const [allcustomers, setallcustomers] = useState([]);

  const [start_date, setstart_date] = useState(
    moment().format().substring(0, 10)
  );

  useEffect(() => {
    const fetchcustomers = async () => {
      var url = `${route}/api/parties/?account_head=${selected_branch.id}&type=customer`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        const supp = json.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
        setallcustomers(supp);
      }
      if (!response.ok) {
        var error = Object.keys(json);
        if (error.length > 0) {
          Red_toast(`${error[0]}:${json[error[0]]}`);
        }
      }
    };

    if (user) {
      fetchcustomers();
    }
  }, [selected_branch]);

  useEffect(() => {
    setisloading(true);
    dispatch({ type: "Set_table_history", data: [] });
    const fetchProducts = async () => {
      var url = `${route}/api/daily-meals/?date=${start_date}`;
      if (customer.value !== "all") {
        url = `${url}&customer_id=${customer.value}`;
      }
      if (type.value !== "all") {
        url = `${url}&meal_type=${type.value}`;
      }

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        setisloading(false);
        dispatch({ type: "Set_table_history", data: json });
      }
      if (!response.ok) {
        setisloading(false);
        var error = Object.keys(json);
        if (error.length > 0) {
          Red_toast(`${error[0]}:${json[error[0]]}`);
        }
      }
    };

    if (user) {
      fetchProducts();
    }
  }, [start_date, type, customer]);

  const handleconfirm = (row) => {
    dispatch({ type: "Delete_table_history", data: { id: row } });
    custom_toast("Delete");
  };

  const linkFollow = (cell, row, rowIndex, formatExtraData) => {
    return (
      <span className="action d-flex">
        <IconButton
          className="border border-primary rounded me-2"
          onClick={() => {
            localStorage.setItem("data", JSON.stringify(row));
            window.open("/mealform", "_blank");
          }}
        >
          <PrintRoundedIcon className="m-1" color="primary" fontSize="medium" />
        </IconButton>
        <IconButton
          className="border border-danger rounded me-2"
          onClick={() => {
            setrow_id(row.id);
            seturl_to_delete(`${route}/api/daily-meals/${row.id}/`);
            setdelete_user(true);
          }}
        >
          <DeleteRoundedIcon className="m-1" color="error" fontSize="medium" />
        </IconButton>

        <IconButton
          className="p-0"
          style={{ border: "1px solid #003049", borderRadius: "5px" }}
          onClick={() => {
            const data = history.filter((item) => {
              return item.id === row.id;
            });
            localStorage.setItem("data", JSON.stringify(row));
            setActiveTab("dailymeal_Edit");
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
    {
      dataField: "id",
      text: "#",
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return rowIndex + 1;
      },
      headerFormatter: headerstyle,
    },
    {
      dataField: "date",
      text: "Date",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "order",
      text: "Order No.",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "customer_name",
      text: "Customer",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "meal_type",
      text: "Meal Type",
      sort: true,
      headerFormatter: headerstyle,
    },

    {
      dataField: "Edit",
      text: t("action"),
      formatter: linkFollow,
      formatExtraData: invoice_type,
      headerFormatter: headerstyle,
      csvExport: false,
    },
  ];

  const makepdf = () => {
    const body = history.map((item, index) => {
      return [
        index + 1,
        item.date,
        item.order,
        item.customer_name,
        item.meal_type,
      ];
    });
    body.splice(0, 0, ["#", "Date", "Order No", "Customer", "Meal Type"]);

    const documentDefinition = {
      content: [
        { text: "Daily Meal History", style: "header" },

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
            widths: [30, "*", "*", "*", "*"],
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
          fontSize: 7,
        },

        header: {
          fontSize: 22,
          bold: true,
          alignment: "center",
        },
        body: {
          fontSize: 12,
          bold: true,
          alignment: "left",
          marginBottom: 10,
          border: false,
        },
      },
    };
    return documentDefinition;
  };

  const download = () => {
    const documentDefinition = makepdf();
    pdfMake.createPdf(documentDefinition).download("Dailymealhistory.pdf");
  };

  const print = () => {
    const documentDefinition = makepdf();
    pdfMake.createPdf(documentDefinition).print();
  };

  return (
    <div className="p-3">
      <ToolkitProvider
        keyField="id"
        data={history}
        columns={columns}
        search
        exportCSV
      >
        {(props) => (
          <div className="card p-3">
            <div className=" d-sm-flex align-items-start mt-3">
              <div className="col-6 col-sm-2  me-3">
                <TextField
                  type="date"
                  className="form-control  mb-3"
                  label={t("date")}
                  value={start_date}
                  onChange={(e) => {
                    setstart_date(e.target.value);
                  }}
                  size="small"
                />
              </div>
              <div className="col-6 col-md-2 mb-2 me-md-3">
                <Select
                  options={[
                    { value: "all", label: "All" },
                    { value: "Breakfast", label: "Breakfast / إفطار" },
                    { value: "Lunch", label: " Lunch / غداء" },
                    { value: "Dinner", label: "Dinner / عشاء" },
                  ]}
                  placeholder={"Type"}
                  value={type}
                  funct={(e) => {
                    settype(e);
                  }}
                ></Select>
              </div>
              <div className="col-6 col-md-2 mb-2 ">
                <Select
                  options={[{ value: "all", label: "All" }, ...allcustomers]}
                  placeholder={"Customer"}
                  value={customer}
                  funct={(e) => {
                    setcustomer(e);
                  }}
                ></Select>
              </div>
            </div>
            <div className="d-sm-flex justify-content-between align-items-center mt-3  ">
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
            <div style={{ minHeight: "100vh", zoom: "0.8" }}>
              <BootstrapTable
                {...props.baseProps}
                bordered={false}
                bootstrap4
                condensed
                striped
                wrapperClasses="table-responsive"
                classes="purchasehistorytable"
              />
            </div>
          </div>
        )}
      </ToolkitProvider>

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

export default Dailymeal_history;
