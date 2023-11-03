import React, { useState, useEffect, useRef, memo } from "react";
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
import TextField from "@mui/material/TextField";
import PrintRoundedIcon from "@material-ui/icons/PrintRounded";
import { useTranslation } from "react-i18next";

function Sale_Quotation_History(props) {
  const user = props.state.setuser.user;
  const { t } = useTranslation();
  const route = props.state.setuser.route;
  const selected_branch = props.state.Setcurrentinfo.selected_branch;
  const current_user = props.state.Setcurrentinfo.current_user;
  const history = props.state.Settablehistory.table_history;
  const dispatch = props.Settable_history;
  const settable_data = props.Setsavedata;
  const { SearchBar } = Search;
  const setActiveTab = props.setActiveTab;
  const [delete_user, setdelete_user] = useState(false);
  const [url_to_delete, seturl_to_delete] = useState("");
  const [row_id, setrow_id] = useState("");
  const [isloading, setisloading] = useState(false);

  const [customer, setcustomer] = useState({ value: "all", label: "All" });
  const [allcustomer, setallcustomer] = useState([]);

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
    const fetchCustomer = async () => {
      const response = await fetch(
        `${route}/api/parties/?account_head=${selected_branch.id}&type=Customer`,
        {
          headers: { Authorization: `Bearer ${user.access}` },
        }
      );
      const json = await response.json();

      if (response.ok) {
        const optimize = json.map((item) => {
          return { value: item.id, label: item.name };
        });
        optimize.splice(0, 0, { value: "all", label: "All" });
        setallcustomer(optimize);
      }
    };

    fetchCustomer();
  }, [selected_branch]);

  useEffect(() => {
    setisloading(true);
    dispatch({ type: "Set_menuitem", data: "sale_history" });

    const fetchProducts = async () => {
      var url = `${route}/api/sale-quotation/?account_head=${selected_branch.id}&start_date=${start_date}&end_date=${end_date}`;
      if (
        date_range[0].endDate.getFullYear() -
          date_range[0].startDate.getFullYear() ===
        10
      ) {
        url = `${route}/api/sale-quotation/?account_head=${selected_branch.id}`;
      }

      if (customer.value != "all") {
        url = `${url}&customer_id=${customer.value}`;
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
            if (selected_branch.invoice_type === "Version 01") {
              window.open("/invoice/sales", "_blank");
            } else if (selected_branch.invoice_type === "Version 02") {
              window.open("/invoice_2/sales", "_blank");
            } else if (selected_branch.invoice_type === "Version 03") {
              window.open("/invoice_3/sales", "_blank");
            }
          }}
        >
          <PrintRoundedIcon className="m-1" color="primary" fontSize="medium" />
        </IconButton>
        <IconButton
          className="border border-danger rounded me-2"
          onClick={() => {
            setrow_id(row.id);
            seturl_to_delete(`${route}/api/sale-quotation/${row.id}/`);
            setdelete_user(true);
          }}
        >
          <DeleteRoundedIcon className="m-1" color="error" fontSize="medium" />
        </IconButton>

        <IconButton
          className="p-0 me-2"
          style={{ border: "1px solid #003049", borderRadius: "5px" }}
          onClick={() => {
            const data = history.filter((item) => {
              return item.id === row.id;
            });
            settable_data({
              type: "Set_save_data",
              data: [{ data: data[0] }],
            });
            setActiveTab("salequotation_Edit");
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
      text: t("date"),
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "quotation_number",
      text: "Quotation No",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "customer_details.name",
      text: t("side_bar_customers"),
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "sub_total",
      text: t("subtotal"),
      sort: true,
      headerFormatter: headerstyle,
      formatter: fix_formatter,
    },
    {
      dataField: "tax_percentage",
      text: "Tax %",
      sort: true,
      headerFormatter: headerstyle,
      formatter: fix_formatter,
    },
    {
      dataField: "tax_amount",
      text: "Tax",
      sort: true,
      headerFormatter: headerstyle,
      formatter: fix_formatter,
    },
    {
      dataField: "discount",
      text: "Discount",
      sort: true,
      headerFormatter: headerstyle,
      formatter: fix_formatter,
    },
    {
      dataField: "extra_disc",
      text: "Extra Dis.",
      sort: true,
      headerFormatter: headerstyle,
      formatter: fix_formatter,
    },

    {
      dataField: "total",
      text: "Total",
      sort: true,
      headerFormatter: headerstyle,
      formatter: fix_formatter,
    },
    {
      dataField: "status",
      text: "Status",
      sort: true,
      headerFormatter: headerstyle,
    },

    {
      dataField: "remarks",
      text: " Remarks",
      sort: true,
      headerFormatter: headerstyle,
    },

    {
      dataField: "Edit",
      text: t("action"),
      formatter: linkFollow,
      headerFormatter: headerstyle,
      csvExport: false,
    },
  ];

  const handleselectiochange = (e) => {
    setshow(!show);
    setTarget(e.target);
  };

  const componentRef = useRef();

  useEffect(() => {
    setcallagain(!callagain);
  }, [, customer, date_range]);

  const handlesubcategory = (e) => {
    setcustomer(e);
  };

  return (
    <div className="p-3">
      <h1 className="mb-3" style={{ fontSize: "1.8rem", fontWeight: "normal" }}>
        {t("sale_history")}
      </h1>
      <ToolkitProvider
        keyField="id"
        data={history}
        columns={columns}
        search
        exportCSV
      >
        {(props) => (
          <div className="card">
            <div className=" col-sm-11 d-sm-flex align-items-start mt-3">
              <div className="col-sm-2 ms-3  me-3">
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

              <div className=" col-sm-2 ms-3  me-3  selector mb-2">
                <Select
                  options={allcustomer}
                  placeholder={t("side_bar_customers")}
                  value={customer}
                  funct={handlesubcategory}
                ></Select>
              </div>
            </div>

            <div className="col-sm-2 text-start ps-3 pb-3">
              <SearchBar {...props.searchProps} />
            </div>

            {isloading && (
              <div className="text-center">
                <Spinner animation="border" variant="primary" />
              </div>
            )}

            <div
              className="ps-3 pe-3"
              style={{ minHeight: "70vh", zoom: "0.8" }}
            >
              <BootstrapTable
                {...props.baseProps}
                bordered={false}
                bootstrap4
                condensed
                striped
                wrapperClasses="table-responsive"
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
    </div>
  );
}

export default memo(Sale_Quotation_History);
