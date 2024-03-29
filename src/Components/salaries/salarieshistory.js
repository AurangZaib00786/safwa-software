import React, { useState, useEffect, useRef, memo } from "react";
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
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import PrintIcon from "@material-ui/icons/Print";
import { useTranslation } from "react-i18next";
import TextField from "@mui/material/TextField";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
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
import moment from "moment";
import Red_toast from "../alerts/red_toast";
import Select from "../alerts/select";
import PrintRoundedIcon from "@material-ui/icons/PrintRounded";

function Salalrieshistory(props) {
  const { t } = useTranslation();

  const user = props.state.setuser.user;
  const route = props.state.setuser.route;
  const setActiveTab = props.setActiveTab;
  const current_user = props.state.Setcurrentinfo.current_user;
  const all_users = props.state.Settablehistory.table_history;

  const selected_branch = props.state.Setcurrentinfo.selected_branch;
  const dispatch = props.Settable_history;
  const { SearchBar } = Search;
  const { ExportCSVButton } = CSVExport;
  const [delete_user, setdelete_user] = useState(false);
  const [url_to_delete, seturl_to_delete] = useState("");
  const [row_id, setrow_id] = useState("");
  const [isloading, setisloading] = useState(false);
  const [start_date, setstart_date] = useState(
    moment().format().substring(0, 10)
  );
  const [end_date, setend_date] = useState(moment().format().substring(0, 10));
  const [show, setshow] = useState(false);
  const [target, setTarget] = useState(null);
  const ref = useRef(null);
  const [date_range, setdate_range] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
      showDateDisplay: "false",
    },
  ]);
  const selected_year = props.state.Setcurrentinfo.selected_year;
  const [allemployees, setallemployees] = useState([]);
  const [employee, setemployee] = useState({ value: "all", label: "All" });
  const [month, setmonth] = useState("");
  useEffect(() => {
    const fetchWorkouts = async () => {
      setisloading(true);
      var url = `${route}/api/employee/?account_head=${selected_branch.id}`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        setisloading(false);
        setallemployees(
          json.map((item) => {
            return {
              value: item.id,
              label: item.name,
            };
          })
        );
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

  const handleSelect = (item) => {
    const get_date = item.selection;
    setdate_range([item.selection]);

    setstart_date(moment(get_date.startDate).format().substring(0, 10));
    setend_date(moment(get_date.endDate).format().substring(0, 10));
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

  useEffect(() => {
    setisloading(true);
    dispatch({ type: "Set_menuitem", data: "salaries" });
    const fetchWorkouts = async () => {
      var url = `${route}/api/salaries/?start_date=${start_date}&end_date=${end_date}`;
      if (employee.value !== "all") {
        url = `${url}&employee_id=${employee.value}`;
      }
      if (month) {
        url = `${url}&month=${month}`;
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
        went_wrong_toast();
        setisloading(false);
      }
    };

    fetchWorkouts();
  }, [date_range, month, employee]);

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
        <IconButton
          className="border border-primary rounded me-2 tooltipclass"
          onClick={() => {
            localStorage.setItem("data", JSON.stringify(row));

            window.open("/salary_print", "_blank");
          }}
        >
          <PrintRoundedIcon className="m-1" color="primary" fontSize="medium" />
          <span className="tooltip-textclass">Print</span>
        </IconButton>
        {current_user?.permissions?.includes("delete_salaries") && (
          <IconButton
            className="me-2 border border-danger rounded"
            onClick={() => {
              setrow_id(row.id);
              seturl_to_delete(`${route}/api/salaries/${row.id}/`);
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

        {current_user?.permissions?.includes("change_salaries") && (
          <IconButton
            style={{ border: "1px solid #003049", borderRadius: "5px" }}
            onClick={() => {
              localStorage.setItem("data", JSON.stringify(row));
              setActiveTab("salaries_edit");
            }}
          >
            <EditOutlinedIcon
              className="m-1"
              style={{ color: "#003049" }}
              fontSize="medium"
            />
          </IconButton>
        )}
      </span>
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
      dataField: "month",
      text: "Month",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "employee_info.name",
      text: "Employee",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "wage_type",
      text: "Wage Type",
      sort: true,
      headerFormatter: headerstyle,
    },

    {
      dataField: "working_days",
      text: "Working Days",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "absent_days",
      text: "Absent Days",
      sort: true,
      headerFormatter: headerstyle,
    },

    {
      dataField: "net_days",
      text: "Net Days",
      sort: true,
      headerFormatter: headerstyle,
    },

    {
      dataField: "salary",
      text: "Salary",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "total_salary",
      text: "Total Salary",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "salary_paid",
      text: "Salary Paid",
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
      return [
        { text: index + 1 },
        { text: item.date },
        { text: item.month },
        { text: item.employee_name },
        { text: item.wage_type },
        { text: item.workking_days },
        { text: item.absent_days },
        { text: item.net_days },
        { text: item.salary },
        { text: item.total_salary },
        { text: item.salary_paid },
      ];
    });
    body.splice(0, 0, [
      "#",
      "Date",
      "Month",
      "Employee",
      "Wage Type",
      "Working Days",
      "Absent Days",
      "Net Days",
      "Salary",
      "Total Salary",
      "Salary Paid",
    ]);

    const documentDefinition = {
      content: [
        { text: "Salaries", style: "header" },

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
            widths: [30, "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
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

  return (
    <div className="p-3 pt-2">
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
                <div className="row mt-3">
                  <div className="col-6 col-sm-2  ">
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
                      rootClose
                      onHide={() => setshow(false)}
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
                  <div className=" col-6  col-md-2">
                    <TextField
                      type="month"
                      className="form-control  mb-3"
                      label={"Month"}
                      InputLabelProps={{ shrink: true }}
                      value={month}
                      onChange={(e) => {
                        setmonth(e.target.value);
                      }}
                      InputProps={{
                        inputProps: {
                          min: `${selected_year.value}-01`,
                          max: `${selected_year.value}-12`,
                        },
                      }}
                      size="small"
                    />
                  </div>
                  <div className="col-6  col-md-2 ">
                    <Select
                      options={[
                        { value: "all", label: "All" },
                        ...allemployees,
                      ]}
                      placeholder={"Employees"}
                      value={employee}
                      funct={(e) => setemployee(e)}
                    ></Select>
                  </div>
                </div>
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

export default Salalrieshistory;
