import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import { IconButton } from "@material-ui/core";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
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
import { Link } from "react-router-dom";
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
  addMonths,
  addYears,
  isSameDay,
} from "date-fns";
import "./dailymealhistory.css";
import PrintRoundedIcon from "@material-ui/icons/PrintRounded";
import { useTranslation } from "react-i18next";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import PrintIcon from "@material-ui/icons/Print";

function Dailymeal_history(props) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  const { t } = useTranslation();
  const user = props.state.setuser.user;
  const route = props.state.setuser.route;
  const selected_branch = props.state.Setcurrentinfo.selected_branch;
  const current_user = props.state.Setcurrentinfo.current_user;
  const history = props.state.Settablehistory.table_history;
  const dispatch = props.Settable_history;
  const { SearchBar } = Search;
  const { ExportCSVButton } = CSVExport;
  const invoice_type = props.state.Setcurrentinfo.invoice_type;
  const setActiveTab = props.setActiveTab;
  const settable_data = props.Setsavedata;
  const settings = props.state.Setcurrentinfo.settings;
  const [delete_user, setdelete_user] = useState(false);
  const [url_to_delete, seturl_to_delete] = useState("");
  const [row_id, setrow_id] = useState("");
  const [isloading, setisloading] = useState(false);

  const [payment_type, setpayment_type] = useState({
    value: "all",
    label: "All",
  });
  const [allpayment_type, setallpayment_type] = useState([
    { value: "all", label: "All" },
    { value: "credit", label: "Credit" },
    { value: "cash", label: "Cash" },
  ]);
  const [supplier, setsupplier] = useState({ value: "all", label: "All" });
  const [allsupplier, setallsupplier] = useState([]);

  const [callagain, setcallagain] = useState(false);

  const [start_date, setstart_date] = useState(
    addMonths(new Date(), -1).toISOString().substring(0, 10)
  );
  const [end_date, setend_date] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [show, setshow] = useState(false);
  const [target, setTarget] = useState(null);
  const ref = useRef(null);
  const [date_range, setdate_range] = useState([
    {
      startDate: addMonths(new Date(), -1),
      endDate: new Date(),
      key: "selection",
      showDateDisplay: "false",
    },
  ]);

  const handleSelect = (item) => {
    const get_date = item.selection;
    setdate_range([item.selection]);
    setstart_date(get_date.startDate.toISOString().substring(0, 10));
    setend_date(get_date.endDate.toISOString().substring(0, 10));
    if (
      get_date.startDate.toISOString().substring(0, 10) !==
      get_date.endDate.toISOString().substring(0, 10)
    ) {
      setshow(!show);
    }
  };

  useEffect(() => {
    dispatch({ type: "Set_menuitem", data: "Purchase_history" });

    const fetchSupplier = async () => {
      var url = `${route}/api/parties/?account_head=${selected_branch.id}&type=supplier`;
      if (!settings?.user_base?.account_base) {
        if (current_user.profile.user_type === "user") {
          url = `${route}/api/parties/?user_id=${current_user.profile.parent_user}&type=supplier`;
        } else {
          url = `${route}/api/parties/?user_id=${current_user.id}&type=supplier`;
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
        optimize.splice(0, 0, { value: "all", label: "All" });
        setallsupplier(optimize);
      }
    };

    fetchSupplier();
  }, [selected_branch]);

  useEffect(() => {
    setisloading(true);
    dispatch({ type: "Set_table_history", data: [] });
    const fetchProducts = async () => {
      var url = `${route}/api/purchases/?account_head=${selected_branch.id}&user_id=${current_user.id}&user_type=${current_user?.profile?.user_type}&start_date=${start_date}&end_date=${end_date}`;
      if (
        date_range[0].endDate.getFullYear() -
          date_range[0].startDate.getFullYear() ===
        10
      ) {
        url = `${route}/api/purchases/?branch_id=${selected_branch.id}&user_id=${current_user.id}&user_type=${current_user?.profile?.user_type}`;
      }
      if (payment_type.value != "all") {
        url = `${url}&payment_type=${payment_type.label}`;
      }
      if (supplier.value != "all") {
        url = `${url}&supplier_id=${supplier.value}`;
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
        went_wrong_toast();
      }
    };

    if (user) {
      fetchProducts();
    }
  }, [callagain, selected_branch]);

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

            if (formatExtraData.code === "A4") {
              window.open("/invoice/purchases", "_blank");
            } else if (formatExtraData.code === "80mm") {
              window.open("/invoice_80/purchases", "_blank");
            }
          }}
        >
          <PrintRoundedIcon className="m-1" color="primary" fontSize="medium" />
        </IconButton>
        <IconButton
          className="border border-danger rounded me-2"
          onClick={() => {
            setrow_id(row.id);
            seturl_to_delete(`${route}/api/purchases/${row.id}/`);
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
            settable_data({
              type: "Set_save_data",
              data: [{ data: data[0] }],
            });
            setActiveTab("purchase_Edit");
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

  const fix_formatter = (cell, row) => {
    return <div>{parseFloat(cell).toFixed(2)}</div>;
  };

  const footerFormatter = (column, colIndex, { text }) => {
    if (colIndex > 3) {
      return (
        <span style={{ fontSize: "large" }}>{Number(text).toFixed(2)}</span>
      );
    } else {
      return <span style={{ fontSize: "large" }}>{text}</span>;
    }
  };

  const columns = [
    {
      dataField: "id",
      text: "Id",
      hidden: true,
      headerFormatter: headerstyle,
      csvExport: false,
      footer: "",
    },
    {
      dataField: "date",
      text: t("date"),
      sort: true,
      headerFormatter: headerstyle,
      footer: "",
    },
    {
      dataField: "invoice",
      text: t("invoice"),
      sort: true,
      headerFormatter: headerstyle,
      footer: "",
    },
    {
      dataField: "supplier_name",
      text: "Vendors",
      sort: true,
      headerFormatter: headerstyle,
      footer: "Total",
      footerFormatter: footerFormatter,
    },
    {
      dataField: "sub_total",
      text: t("subtotal"),
      sort: true,
      headerFormatter: headerstyle,
      formatter: fix_formatter,
      footer: (columnData) => columnData.reduce((acc, item) => acc + item, 0),
      footerFormatter: footerFormatter,
    },
    {
      dataField: "tax_percentage",
      text: t("vat%"),
      sort: true,
      headerFormatter: headerstyle,
      formatter: fix_formatter,
      footer: (columnData) => columnData.reduce((acc, item) => acc + item, 0),
      footerFormatter: footerFormatter,
    },
    {
      dataField: "tax_amount",
      text: t("vat_amount"),
      sort: true,
      headerFormatter: headerstyle,
      formatter: fix_formatter,
      footer: (columnData) => columnData.reduce((acc, item) => acc + item, 0),
      footerFormatter: footerFormatter,
    },
    {
      dataField: "discount",
      text: t("discount"),
      sort: true,
      headerFormatter: headerstyle,
      formatter: fix_formatter,
      footer: (columnData) => columnData.reduce((acc, item) => acc + item, 0),
      footerFormatter: footerFormatter,
    },

    {
      dataField: "total",
      text: t("total"),
      sort: true,
      headerFormatter: headerstyle,
      formatter: fix_formatter,
      footer: (columnData) => columnData.reduce((acc, item) => acc + item, 0),
      footerFormatter: footerFormatter,
    },
    {
      dataField: "payment_type",
      text: t("side_bar_paymnettype"),
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
      dataField: "user_name",
      text: "User",
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

  const handleselectiochange = (e) => {
    setshow(!show);
    setTarget(e.target);
  };

  useEffect(() => {
    setcallagain(!callagain);
  }, [payment_type, supplier, date_range]);

  const handlecategory = (e) => {
    setpayment_type(e);
  };

  const handlesubcategory = (e) => {
    setsupplier(e);
  };

  const makepdf = () => {
    const body = history.map((item, index) => {
      return [
        index + 1,
        item.date,
        item.invoice,
        item.supplier_name,
        item.sub_total,
        item.tax_percentage,

        item.tax_amount,
        item.discount,
        item.total,
        item.payment_type,
        item.remarks,
        item.user_name,
      ];
    });
    body.splice(0, 0, [
      "#",
      "Date",
      "Invoice No",
      "Vendor",
      "Subtotal",
      "Tax",
      "Tax Amount",
      "Discount",
      "Total",
      "Payment Type",
      "Remarks",
      "User",
    ]);

    const documentDefinition = {
      content: [
        { text: "Purchase History", style: "header" },

        {
          layout: "noBorders",
          table: {
            headerRows: 1,
            widths: ["*", "*"],
            body: [
              [
                `Account Head: ${selected_branch.name}`,
                `Date: ${start_date} - ${end_date}`,
              ],
              [
                `Payment Type: ${payment_type.label}`,
                `Supplier: ${supplier.label}`,
              ],
            ],
          },
          style: "body",
        },

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
            widths: [30, "*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
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
    pdfMake.createPdf(documentDefinition).download("Purchasehistory.pdf");
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
            <div className="col-sm-6 d-sm-flex align-items-start mt-3">
              <div className="col-sm-4  me-3">
                {date_range[0].endDate.getFullYear() -
                  date_range[0].startDate.getFullYear() ===
                10 ? (
                  <TextField
                    ref={ref}
                    type="button"
                    className="form-control  mb-3"
                    label={t("date")}
                    value="From Start"
                    onClick={handleselectiochange}
                    size="small"
                  />
                ) : (
                  <TextField
                    ref={ref}
                    type="button"
                    className="form-control  mb-3 "
                    label={t("date")}
                    value={`${date_range[0].startDate
                      .toLocaleString("en-GB")
                      .substring(0, 10)} - ${date_range[0].endDate
                      .toLocaleString("en-GB")
                      .substring(0, 10)}`}
                    onClick={handleselectiochange}
                    size="small"
                  />
                )}
                <Overlay
                  show={show}
                  target={target}
                  placement="bottom-start"
                  container={ref}
                >
                  <Popover id="popover-contained" className="pop_over">
                    <Popover.Body>
                      <div>
                        <DateRangePicker
                          onChange={handleSelect}
                          showSelectionPreview={true}
                          showCalendarPreview={false}
                          dragSelectionEnabled={true}
                          moveRangeOnFirstSelection={false}
                          months={2}
                          ranges={date_range}
                          direction="horizontal"
                          preventSnapRefocus={true}
                          calendarFocus="backwards"
                          staticRanges={[
                            ...defaultStaticRanges,
                            {
                              label: "Last Year",
                              range: () => ({
                                startDate: startOfYear(
                                  addYears(new Date(), -1)
                                ),
                                endDate: endOfYear(addYears(new Date(), -1)),
                              }),
                              isSelected(range) {
                                const definedRange = this.range();
                                return (
                                  isSameDay(
                                    range.startDate,
                                    definedRange.startDate
                                  ) &&
                                  isSameDay(range.endDate, definedRange.endDate)
                                );
                              },
                            },
                            {
                              label: "This Year",
                              range: () => ({
                                startDate: startOfYear(new Date()),
                                endDate: endOfDay(new Date()),
                              }),
                              isSelected(range) {
                                const definedRange = this.range();
                                return (
                                  isSameDay(
                                    range.startDate,
                                    definedRange.startDate
                                  ) &&
                                  isSameDay(range.endDate, definedRange.endDate)
                                );
                              },
                            },
                            {
                              label: "From Start",
                              range: () => ({
                                startDate: startOfYear(
                                  addYears(new Date(), -10)
                                ),
                                endDate: endOfDay(new Date()),
                              }),
                              isSelected(range) {
                                const definedRange = this.range();
                                return (
                                  isSameDay(
                                    range.startDate,
                                    definedRange.startDate
                                  ) &&
                                  isSameDay(range.endDate, definedRange.endDate)
                                );
                              },
                            },
                          ]}
                        />
                      </div>
                    </Popover.Body>
                  </Popover>
                </Overlay>
              </div>
              <div className="col-sm-4 ms-3  me-3 selector mb-2">
                <Select
                  options={allsupplier}
                  placeholder={t("supplier")}
                  value={supplier}
                  funct={handlesubcategory}
                ></Select>
              </div>
              <div className="col-sm-4 ms-3  me-3  selector mb-2">
                <Select
                  options={allpayment_type}
                  placeholder={t("side_bar_paymnettype")}
                  value={payment_type}
                  funct={handlecategory}
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
