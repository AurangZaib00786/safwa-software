import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import Red_toast from "../alerts/red_toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Spinner from "react-bootstrap/Spinner";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { useTranslation } from "react-i18next";
import PrintRoundedIcon from "@material-ui/icons/PrintRounded";
import TextField from "@mui/material/TextField";
import custom_toast from "../alerts/custom_toast";

export default function Salaries_edit(props) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  const setActiveTab = props.setActiveTab;
  const user = props.state.setuser.user;
  const { t } = useTranslation();
  const route = props.state.setuser.route;
  const data = JSON.parse(localStorage.getItem("data"));
  const selected_branch = props.state.Setcurrentinfo.selected_branch;
  const current_user = props.state.Setcurrentinfo.current_user;
  const selected_year = props.state.Setcurrentinfo.selected_year;

  const [absentdays, setabsentdays] = useState(data.absent_days);
  const [wage_type, setwage_type] = useState(data.wage_type);
  const [workingdays, setworkingdays] = useState(data.working_days);
  const [date, setdate] = useState(data.date);
  const [salary, setsalary] = useState(data.salary);

  const [employee, setemployee] = useState(data.employee_name);
  const [month, setmonth] = useState(data.month);
  const [total_salary, settotal_salary] = useState(data.total_salary);
  const [salary_paid, setsalary_paid] = useState(data.salary_paid);
  const [details, setdetails] = useState(data.details);
  const [isloading, setisloading] = useState(false);

  const handleSubmit = async (e) => {
    const formData = new FormData();

    formData.append("user", current_user?.id);

    formData.append("working_days", workingdays);
    formData.append("absent_days", absentdays);
    formData.append("net_days", workingdays - absentdays);
    formData.append(
      "salary",
      wage_type === "Daily Wage" ? salary : total_salary
    );
    formData.append(
      "total_salary",
      wage_type === "Daily Wage"
        ? Number(salary) * Number(workingdays - absentdays)
        : handle_monthly_salary_total()
    );
    formData.append("salary_paid", salary_paid);

    setisloading(true);

    const response = await fetch(`${route}/api/salaries/${data.id}/`, {
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
        Red_toast(`${json[error[0]]}`);
      }
    }

    if (response.ok) {
      custom_toast("Save");
      setdetails([]);
      setemployee("");
      setmonth("");
      setworkingdays("");
      setabsentdays("");
      setsalary_paid("");
      setActiveTab("salaries_history");
      if (e) {
        localStorage.setItem("data", JSON.stringify(json));
        window.open("/salary_print", "_blank");
      }
    }
  };

  const handle_monthly_salary_total = () => {
    const one_day_salary = Number(total_salary) / Number(workingdays);
    const sum_salary =
      Number(total_salary) - Number(one_day_salary * Number(absentdays));
    return sum_salary.toFixed(2);
  };

  return (
    <div className="p-3">
      <div className="card">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (document.activeElement.name === "printbtn") {
              handleSubmit(true);
            } else {
              handleSubmit(false);
            }
          }}
        >
          <div className="card-header d-flex justify-content-between bg-white">
            <h3 className="mt-2 me-2">Employee Salary</h3>
            <div className="mt-2 me-2 d-flex flex-row-reverse">
              <Button
                name="savebtn"
                variant="outline-success"
                className="me-2"
                type="submit"
                disabled={isloading}
              >
                {isloading && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                )}
                <FontAwesomeIcon icon={faRotate} className="me-1" /> Save
              </Button>

              <Button
                name="printbtn"
                variant="outline-primary"
                type="submit"
                disabled={isloading}
              >
                {isloading && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                )}
                <PrintRoundedIcon className="me-1" /> Print
              </Button>
            </div>
          </div>

          <div className="card-body pt-0">
            <div className="row mt-4">
              <div className=" col-6  col-md-3">
                <TextField
                  type="Date"
                  className="form-control  mb-3"
                  label={t("Date")}
                  InputLabelProps={{ shrink: true }}
                  value={date}
                  InputProps={{
                    inputProps: {
                      min: `${selected_year.value}-01-01`,
                      max: `${selected_year.value}-12-31`,
                    },
                  }}
                  size="small"
                />
              </div>

              <div className=" col-6  col-md-3">
                <TextField
                  type="month"
                  className="form-control  mb-3"
                  label={"Month"}
                  InputLabelProps={{ shrink: true }}
                  value={month}
                  InputProps={{
                    inputProps: {
                      min: `${selected_year.value}-01`,
                      max: `${selected_year.value}-12`,
                    },
                  }}
                  size="small"
                  required
                />
              </div>

              <div className="col-6  col-md-3 ">
                <TextField
                  className="form-control   mb-3"
                  label={"Employee"}
                  InputLabelProps={{ shrink: true }}
                  value={employee}
                  size="small"
                />
              </div>

              <div className="col-6  col-md-3 ">
                <TextField
                  className="form-control   mb-3"
                  label={"Wage Type"}
                  InputLabelProps={{ shrink: true }}
                  value={wage_type}
                  size="small"
                  disabled
                />
              </div>

              <div className="col-6  col-md-3">
                <TextField
                  type="number"
                  className="form-control   mb-3"
                  label={"Working Days"}
                  value={workingdays}
                  onChange={(e) => {
                    setworkingdays(e.target.value);
                  }}
                  size="small"
                />
              </div>

              <div className="col-6  col-md-3">
                <TextField
                  type="number"
                  className="form-control   mb-3"
                  label={"Absent Days"}
                  value={absentdays}
                  onChange={(e) => {
                    setabsentdays(e.target.value);
                  }}
                  size="small"
                />
              </div>
              <div className="col-6  col-md-3">
                <TextField
                  type="number"
                  className="form-control   mb-3"
                  label={"Net Days"}
                  value={workingdays - absentdays}
                  size="small"
                  disabled
                />
              </div>

              <div className="col-6  col-md-3">
                <TextField
                  type="number"
                  className="form-control   mb-3"
                  label={"Salary"}
                  InputLabelProps={{ shrink: true }}
                  value={wage_type === "Daily Wage" ? salary : total_salary}
                  size="small"
                  disabled
                />
              </div>

              <div className="col-6  col-md-3">
                <TextField
                  type="number"
                  className="form-control   mb-3"
                  label={"Total Salary"}
                  value={
                    wage_type === "Daily Wage"
                      ? Number(salary) * Number(workingdays - absentdays)
                      : handle_monthly_salary_total()
                  }
                  size="small"
                  disabled
                />
              </div>

              <div className="col-6  col-md-3">
                <TextField
                  type="number"
                  className="form-control   mb-3"
                  label={"Salary Paid"}
                  value={salary_paid}
                  onChange={(e) => {
                    setsalary_paid(e.target.value);
                  }}
                  size="small"
                />
              </div>
            </div>
            {details.length > 0 && (
              <div className="">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <td colSpan={4} className="text-center">
                        Building Details
                      </td>
                    </tr>
                    <tr>
                      <th>Building No.</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Working Days</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.map((item) => {
                      return (
                        <tr key={item.id}>
                          <td>{item.building_number}</td>
                          <td>{item.start_date}</td>
                          <td>{item.end_date}</td>
                          <td>{item.working_days}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
