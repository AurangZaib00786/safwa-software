import React, { useState, useEffect, useRef } from "react";
import Overlay from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";
import Button from "react-bootstrap/Button";
import "./report.css";
import { useReactToPrint } from "react-to-print";
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

import Select from "../alerts/select";
import MySelect from "react-select";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css";
import { DateRangePicker, defaultStaticRanges } from "react-date-range";
import TextField from "@mui/material/TextField";
import {
  endOfDay,
  startOfYear,
  endOfYear,
  addMonths,
  addYears,
  isSameDay,
} from "date-fns";
import { useTranslation } from "react-i18next";

export default function Cash_Report(props) {
  const user = props.state.setuser.user;
  const route = props.state.setuser.route;
  const { t } = useTranslation();
  const selected_branch = props.state.Setcurrentinfo.selected_branch;
  const current_user = props.state.Setcurrentinfo.current_user;
  const settings = props.state.Setcurrentinfo.settings;
  const [show_company, setshow_company] = useState(false);
  const dispatch = props.Settable_history;
  const { SearchBar } = Search;
  const { ExportCSVButton } = CSVExport;
  const [details, setdetails] = useState([]);

  const [all_account_head, setall_account_head] = useState([]);
  const [account_head, setaccount_head] = useState({
    value: "all",
    label: "All",
  });
  const [account_label, setaccount_label] = useState("All");
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
  const [openingbalance, setopeningbalance] = useState(0);
  const [isloading, setisloading] = useState(false);
  const [showreport, setshowreport] = useState(false);

  useEffect(() => {
    dispatch({ type: "Set_menuitem", data: "cash_report" });
    const fetchaccount = async () => {
      const response = await fetch(
        `${route}/api/account-heads/?user_id=${current_user.id}`,
        {
          headers: { Authorization: `Bearer ${user.access}` },
        }
      );
      const json = await response.json();

      if (response.ok) {
        const make_option = json.map((item) => {
          return { value: item.id, label: item.name };
        });

        setall_account_head(make_option);
      }
      if (!response.ok) {
        went_wrong_toast();
      }
    };

    if (user) {
      fetchaccount();
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

  const fix_formatter = (cell, row) => {
    return <div>{parseFloat(cell).toFixed(2)}</div>;
  };

  const footerFormatter = (column, colIndex, { text }) => {
    if (colIndex > 4) {
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
      text: "#",
      headerFormatter: headerstyle,
      formatter: (cell, row, rowIndex) => {
        return rowIndex + 1;
      },
      footer: "",
    },

    {
      dataField: "reference",
      text: "Reference",
      footer: "",
      headerFormatter: headerstyle,
    },
    {
      dataField: "date",
      text: "Date",
      footer: "",
      headerFormatter: headerstyle,
    },
    {
      dataField: "description",
      text: "Descriiption",
      footer: "",
      headerFormatter: headerstyle,
    },
    {
      dataField: "remarks",
      text: "Remarks",

      headerFormatter: headerstyle,
      footer: "Total",
      footerFormatter: footerFormatter,
    },
    {
      dataField: "cash_in",
      text: "Cash In",

      headerFormatter: headerstyle,
      formatter: fix_formatter,
      footer: (columnData) => columnData.reduce((acc, item) => acc + item, 0),
      footerFormatter: footerFormatter,
    },

    {
      dataField: "cash_out",
      text: "Cash Out ",

      headerFormatter: headerstyle,
      footer: (columnData) => columnData.reduce((acc, item) => acc + item, 0),
      footerFormatter: footerFormatter,
    },

    {
      dataField: "net_cash",
      text: "Net Cash",

      headerFormatter: headerstyle,
      formatter: fix_formatter,
      footer: (columnData) => columnData[columnData.length - 1],
      footerFormatter: footerFormatter,
    },
  ];

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

  const handleselectiochange = (e) => {
    setshow(!show);
    setTarget(e.target);
  };

  const componentRef = useRef();

  useEffect(() => {
    if (show_company) {
      handleprint();
    }
  }, [show_company]);

  const print = (e) => {
    e.preventDefault();
    setshow_company(true);
  };

  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    bodyClass: "print_class",
    pageStyle: "@page { size: A4 landscape; }",
    onAfterPrint: () => {
      setshow_company(false);
    },
  });

  const handlegenerate = async (e) => {
    e.preventDefault();
    setisloading(true);
    setshowreport(true);

    if (account_head.value === "all") {
      if (current_user.profile.user_type === "user") {
        var url = `${route}/api/cash-report/?user_id=${current_user.profile.parent_user}`;
      } else {
        url = `${route}/api/cash-report/?user_id=${current_user.id}`;
      }
    } else {
      var url = `${route}/api/cash-report/?account_head=${account_head.value}`;
    }

    if (
      date_range[0].endDate.getFullYear() -
        date_range[0].startDate.getFullYear() ===
      10
    ) {
      url = `${url}`;
    } else {
      url = `${url}&start_date=${start_date}&end_date=${end_date}`;
    }

    const response = await fetch(`${url}`, {
      headers: { Authorization: `Bearer ${user.access}` },
    });
    const json = await response.json();

    if (response.ok) {
      setdetails(json.data);
      setopeningbalance(json.opening_balance);
      setisloading(false);
    }
    if (!response.ok) {
      setisloading(false);
      went_wrong_toast();
    }
  };

  const handlepayment = (e) => {
    setaccount_head(e);

    const obj = all_account_head.filter((item) => {
      return item.value === e.value;
    });
    setaccount_label(obj[0].label);
  };

  const selectStyles = {
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };
  const rowstyle = { height: "10px" };

  return (
    <div className="p-3">
      <div className="card">
        <div className="card-body pt-0">
          <ToolkitProvider
            keyField="id"
            data={details}
            columns={columns}
            search
            exportCSV
          >
            {(props) => (
              <div>
                <div className="col-sm-10 d-sm-flex justify-content-start align-items-start mt-3">
                  <div className="col-sm-2  me-3">
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
                                    endDate: endOfYear(
                                      addYears(new Date(), -1)
                                    ),
                                  }),
                                  isSelected(range) {
                                    const definedRange = this.range();
                                    return (
                                      isSameDay(
                                        range.startDate,
                                        definedRange.startDate
                                      ) &&
                                      isSameDay(
                                        range.endDate,
                                        definedRange.endDate
                                      )
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
                                      isSameDay(
                                        range.endDate,
                                        definedRange.endDate
                                      )
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
                                      isSameDay(
                                        range.endDate,
                                        definedRange.endDate
                                      )
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

                  <div className="me-3 col-sm-2   selector  mb-3">
                    <Select
                      options={[
                        { value: "all", label: "All" },
                        ...all_account_head,
                      ]}
                      placeholder={"Account Heads"}
                      value={account_head}
                      funct={handlepayment}
                    ></Select>
                  </div>

                  <Button
                    type="button"
                    className="mb-3 me-3"
                    variant="outline-success"
                    size="small"
                    onClick={handlegenerate}
                  >
                    {t("generate")}
                  </Button>
                </div>
                {isloading && (
                  <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                  </div>
                )}

                {showreport && (
                  <>
                    <div className="d-sm-flex justify-content-between align-items-center mt-2">
                      <div>
                        <ExportCSVButton
                          {...props.csvProps}
                          className="csvbutton me-3 border bg-secondary text-light"
                        >
                          Export CSV
                        </ExportCSVButton>
                        <Button
                          type="button"
                          className="mt-3 mb-3 me-3"
                          variant="outline-success"
                          size="small"
                          onClick={print}
                        >
                          {t("print")}
                        </Button>
                      </div>

                      <SearchBar {...props.searchProps} />
                    </div>

                    <hr />
                    <div ref={componentRef}>
                      {show_company && (
                        <div>
                          <hr />

                          <h3 className="text-center">Cash Report</h3>

                          <div className="p-3 d-flex justify-content-between">
                            <h6>
                              <strong className="me-3">Date:</strong>
                              {date_range[0].startDate
                                .toLocaleString("en-GB")
                                .substring(0, 10)}
                              -
                              {date_range[0].endDate
                                .toLocaleString("en-GB")
                                .substring(0, 10)}
                              <br></br>
                            </h6>
                            <h6>
                              <strong className="me-3">Account Head:</strong>
                              {account_label}
                            </h6>
                          </div>
                        </div>
                      )}
                      <h4 className="text-center">
                        Opening Balance : {openingbalance}
                      </h4>
                      <div style={{ zoom: ".9" }}>
                        <BootstrapTable
                          {...props.baseProps}
                          rowStyle={rowstyle}
                          striped
                          bootstrap4
                          condensed
                          wrapperClasses="table-responsive"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </ToolkitProvider>
        </div>
      </div>

      <ToastContainer autoClose={1000} hideProgressBar={true} theme="dark" />
    </div>
  );
}
