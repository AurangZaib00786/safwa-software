import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import Red_toast from "../alerts/red_toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Spinner from "react-bootstrap/Spinner";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { useTranslation } from "react-i18next";
import Select from "../alerts/select";
import TextField from "@mui/material/TextField";
import custom_toast from "../alerts/custom_toast";

export default function Salaries(props) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  const user = props.state.setuser.user;
  const { t } = useTranslation();
  const route = props.state.setuser.route;
  const selected_branch = props.state.Setcurrentinfo.selected_branch;
  const current_user = props.state.Setcurrentinfo.current_user;

  const dispatch = props.Settable_history;
  const selected_year = props.state.Setcurrentinfo.selected_year;

  const [absentdays, setabsentdays] = useState("");

  const [workingdays, setworkingdays] = useState("");
  const [date, setdate] = useState(new Date().toISOString().substring(0, 10));

  const [month, setmonth] = useState("");

  const [salary_paid, setsalary_paid] = useState("");
  const [details, setdetails] = useState([]);
  const [isloading, setisloading] = useState(false);
  const [allemployees, setallemployees] = useState([]);
  const [employee, setemployee] = useState("");
  useEffect(() => {
    dispatch({ type: "Set_menuitem", data: "salaries" });
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
              value: {
                id: item.id,
                type: item.type,
                salary: item.salary,
                total_salary: item.total_salary,
              },
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

  useEffect(() => {
    const fetchcategory = async () => {
      setabsentdays(0);
      var url = `${route}/api/employee-working-detail/?employee_id=${employee.value.id}&month=${month}`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        setdetails(json.building_details);
        setworkingdays(json.total_working_days);
      }
      if (!response.ok) {
        var error = Object.keys(json);
        if (error.length > 0) {
          Red_toast(`${error[0]}:${json[error[0]]}`);
        }
      }
    };

    if (employee && month) {
      fetchcategory();
    }
  }, [employee, month]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("employee", employee?.value?.id);
    formData.append("user", current_user?.id);
    formData.append("account_head", selected_branch?.id);
    formData.append("date", date);

    formData.append("month", month);
    formData.append("working_days", workingdays);
    formData.append("absent_days", absentdays);
    formData.append("net_days", workingdays - absentdays);
    formData.append("wage_type", employee?.value?.type);
    formData.append(
      "salary",
      employee?.value?.type === "Daily Wage"
        ? employee?.value?.salary
        : employee?.value?.total_salary
    );
    formData.append(
      "total_salary",
      employee?.value?.type === "Daily Wage"
        ? Number(employee?.value?.salary) * Number(workingdays - absentdays)
        : handle_monthly_salary_total()
    );
    formData.append("salary_paid", salary_paid);
    if (details.length > 0) {
      details.map((item, index) => {
        formData.append(`details[${index}]building`, item.building_id);
        formData.append(
          `details[${index}]start_date`,
          item.start_date ? item.start_date : ""
        );
        formData.append(
          `details[${index}]end_date`,
          item.end_date ? item.end_date : ""
        );
        formData.append(
          `details[${index}]working_days`,
          item.building_working_days
        );
      });
      formData.append("details", details);
    }

    setisloading(true);

    const response = await fetch(`${route}/api/salaries/`, {
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
        Red_toast(`${json[error[0]]}`);
      }
    }

    if (response.ok) {
      setisloading(false);
      custom_toast("Save");
      setdetails([]);
      setemployee("");
      setmonth("");
      setworkingdays("");
      setabsentdays("");
      setsalary_paid("");
    }
  };

  const handle_monthly_salary_total = () => {
    const one_day_salary =
      Number(employee?.value?.total_salary) / Number(workingdays);
    const total_salary =
      Number(employee?.value?.total_salary) -
      Number(one_day_salary * Number(absentdays));
    return total_salary.toFixed(2);
  };

  return (
    <div className="p-3">
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="card-header d-flex justify-content-between bg-white">
            <h3 className="mt-2 me-2">Employee Salary</h3>
            <div className="mt-2 me-2 d-flex flex-row-reverse">
              <Button
                name="savebtn"
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
                <FontAwesomeIcon icon={faRotate} className="me-1" /> Save
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
                  required
                />
              </div>

              <div className="col-6  col-md-3 ">
                <Select
                  options={allemployees}
                  placeholder={"Employees"}
                  value={employee}
                  funct={(e) => setemployee(e)}
                  required={true}
                ></Select>
              </div>

              <div className="col-6  col-md-3 ">
                <TextField
                  className="form-control   mb-3"
                  label={"Wage Type"}
                  InputLabelProps={{ shrink: true }}
                  value={employee?.value?.type}
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
                  value={
                    employee?.value?.type === "Daily Wage"
                      ? employee?.value?.salary
                      : employee?.value?.total_salary
                  }
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
                    employee?.value?.type === "Daily Wage"
                      ? Number(employee?.value?.salary) *
                        Number(workingdays - absentdays)
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
                      <td colSpan={5} className="text-center">
                        Building Details
                      </td>
                    </tr>
                    <tr>
                      <th>Building Name</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Working Days</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.map((item) => {
                      return (
                        <tr key={item.building_id}>
                          <td>{item.building_name}</td>
                          <td>{item.start_date}</td>
                          <td>{item.end_date}</td>
                          <td>{item.building_working_days}</td>
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
