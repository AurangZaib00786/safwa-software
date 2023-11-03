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

export default function Stock_Report(props) {
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
  const componentRef = useRef();
  const [all_account_head, setall_account_head] = useState([]);
  const [account_head, setaccount_head] = useState({
    value: "all",
    label: "All",
  });

  const [account_label, setaccount_label] = useState("All");

  const [isloading, setisloading] = useState(false);
  const [showreport, setshowreport] = useState(false);

  useEffect(() => {
    dispatch({ type: "Set_menuitem", data: "sale_report" });
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
        make_option.splice(0, 0, { value: "all", label: "All" });
        setall_account_head(make_option);
      }
      if (!response.ok) {
        went_wrong_toast();
      }
    };

    if (user) {
      fetchaccount();
    }
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

  const fix_formatter = (cell, row) => {
    return <div>{parseFloat(cell).toFixed(2)}</div>;
  };
  const footerFormatter = (column, colIndex, { text }) => {
    if (colIndex > 1) {
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
      dataField: "product__name",
      text: "Product",
      sort: true,
      headerFormatter: headerstyle,
      footer: "Total",
      footerFormatter: footerFormatter,
    },

    {
      dataField: "quantity",
      text: "Quantity",
      sort: true,
      headerFormatter: headerstyle,
      footer: (columnData) => columnData.reduce((acc, item) => acc + item, 0),
      footerFormatter: footerFormatter,
    },
    {
      dataField: "cost",
      text: "Cost",
      sort: true,
      headerFormatter: headerstyle,
      formatter: fix_formatter,
      footer: (columnData) => columnData.reduce((acc, item) => acc + item, 0),
      footerFormatter: footerFormatter,
    },
    {
      dataField: "value",
      text: "Value",
      sort: true,
      headerFormatter: headerstyle,
      formatter: fix_formatter,
      footer: (columnData) => columnData.reduce((acc, item) => acc + item, 0),
      footerFormatter: footerFormatter,
    },
  ];

  const rowstyle = { height: "10px" };

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
        var url = `${route}/api/stock-report/?user_id=${current_user.profile.parent_user}`;
      } else {
        url = `${route}/api/stock-report/?user_id=${current_user.id}`;
      }
    } else {
      url = `${route}/api/stock-report/?account_head=${account_head.value}`;
    }

    const response = await fetch(`${url}`, {
      headers: { Authorization: `Bearer ${user.access}` },
    });
    const json = await response.json();

    if (response.ok) {
      setdetails(json);
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
                  <div className="me-3 col-sm-2   selector  mb-3">
                    <Select
                      options={all_account_head}
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
                          <h3 className="text-center">Stock Report</h3>
                          <div className="p-3 d-flex justify-content-between">
                            <h6>
                              <strong className="me-3">Account Head:</strong>
                              {account_label}
                            </h6>
                          </div>
                        </div>
                      )}
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
