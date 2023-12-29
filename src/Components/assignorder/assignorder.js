import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Select from "../alerts/select";
import Spinner from "react-bootstrap/Spinner";
import Red_toast from "../alerts/red_toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import TextField from "@mui/material/TextField";
import success_toast from "../alerts/success_toast";

export default function AssignOrder(props) {
  const setActiveTab = props.setActiveTab;
  const user = props.state.setuser.user;
  const route = props.state.setuser.route;
  const dispatch = props.Settable_history;
  const [allprocess, setallprocess] = useState([]);
  const order = JSON.parse(localStorage.getItem("data"));
  const [allemployee, setallemployee] = useState([]);

  const [isloading, setisloading] = useState(false);

  useEffect(() => {
    setisloading(true);
    dispatch({ type: "Set_menuitem", data: "order" });
    const fetchWorkouts = async () => {
      var url = `${route}/api/schedule/?buffet_time_id=${order.timing_id}`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        setisloading(false);
        const optimize = json.shift()?.details?.map((item) => {
          var item2 = order.assignment_details.filter((item_2) => {
            return item_2.process === item.process;
          });
          if (item2.length > 0) {
            item2 = item2.shift();
            return {
              ...item,
              breakfast_employee: {
                value: item2.breakfast_employee,
                label: item2.breakfast_employee_name,
              },
              launch_employee: {
                value: item2.launch_employee,
                label: item2.launch_employee_name,
              },
              dinner_employee: {
                value: item2.dinner_employee,
                label: item2.dinner_employee_name,
              },
            };
          } else {
            return {
              ...item,
              breakfast_employee: "",
              launch_employee: "",
              dinner_employee: "",
            };
          }
        });
        setallprocess(optimize);
      }
      if (!response.ok) {
        var error = Object.keys(json);
        if (error.length > 0) {
          Red_toast(`${json[error[0]]}`);
        }
        setisloading(false);
      }
    };

    const fetchemployess = async () => {
      var url = `${route}/api/employee/`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        const optimize = json.map((item) => {
          return { value: item.id, label: item.name };
        });
        setallemployee(optimize);
      }
      if (!response.ok) {
        var error = Object.keys(json);
        if (error.length > 0) {
          Red_toast(`${json[error[0]]}`);
        }
      }
    };

    if (user) {
      fetchWorkouts();
      fetchemployess();
    }
  }, []);

  const handlesubmit = async (e) => {
    e.preventDefault();
    var flag = false;
    const optimizedata = allprocess.map((item) => {
      if (
        item.breakfast_employee &&
        item.launch_employee &&
        item.dinner_employee
      ) {
        return {
          process: item.process,
          breakfast_employee: item.breakfast_employee.value,
          launch_employee: item.launch_employee.value,
          dinner_employee: item.dinner_employee.value,
        };
      } else {
        Red_toast(`Select all employees of ${item.process_name} process!`);
        flag = true;
      }
    });
    if (flag) {
      return;
    }

    const response = await fetch(`${route}/api/orders/${order.id}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${user.access}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assignment_details: optimizedata,
      }),
    });
    const json = await response.json();
    flag = false;
    if (!response.ok) {
      setisloading(false);
      var error = Object.keys(json);
      if (error.length > 0) {
        Red_toast(`${json[error[0]]}`);
      }
    }

    if (response.ok) {
      success_toast();
      setActiveTab("assignorderhistory");
    }
  };

  const handleemployeechange = (e, row, time) => {
    switch (time) {
      case "breakfast":
        return setallprocess(
          allprocess.map((item) => {
            if (item.process === row.process) {
              item["breakfast_employee"] = e;
              return item;
            }
            return item;
          })
        );

      case "lunch":
        return setallprocess(
          allprocess.map((item) => {
            if (item.process === row.process) {
              item["launch_employee"] = e.value;
              return item;
            }
            return item;
          })
        );

      case "dinner":
        return setallprocess(
          allprocess.map((item) => {
            if (item.process === row.process) {
              item["dinner_employee"] = e.value;
              return item;
            }
            return item;
          })
        );
    }
  };

  return (
    <div className="p-3 pt-2">
      <div className="card">
        <div className="card-header d-flex justify-content-between bg-white">
          <h3 className="mt-2 me-2">Assign Order </h3>
          <div className="mt-2 me-2 d-flex flex-row-reverse">
            <Button variant="outline-primary" onClick={handlesubmit}>
              {isloading && (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              )}
              <FontAwesomeIcon icon={faRotate} /> Update
            </Button>
          </div>
        </div>

        <div className="card-body pt-0">
          <div>
            <div className="mt-3">
              {isloading && (
                <div className="text-center">
                  <Spinner animation="border" variant="primary" />
                </div>
              )}
              <div className="table-responsive">
                <table
                  className="table  table-bordered border-secondary "
                  style={{ width: "100%" }}
                >
                  <thead>
                    <tr>
                      <th className="text-center">Process</th>

                      <th colSpan={2} className="text-center ">
                        Breakfast
                      </th>
                      <th colSpan={2} className="text-center ">
                        Lunch
                      </th>
                      <th colSpan={2} className="text-center ">
                        Dinner
                      </th>
                      {/* <th className="text-center ">Category</th> */}
                      <th className="text-center ">Breakfast Employee</th>
                      <th className="text-center ">Lunch Employee</th>
                      <th className="text-center ">Dinner Employee</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allprocess?.map((item) => {
                      return (
                        <tr key={item.id}>
                          <td className="pt-0 pb-0 ">{item.process_name}</td>

                          <td className="text-center">
                            <TextField
                              type="Time"
                              InputLabelProps={{ shrink: true }}
                              label="Start"
                              value={item.break_fast_start}
                              variant="outlined"
                              size="small"
                            />
                          </td>
                          <td className="text-center">
                            <TextField
                              type="Time"
                              label="End"
                              value={item.break_fast_end}
                              InputLabelProps={{ shrink: true }}
                              variant="outlined"
                              size="small"
                            />
                          </td>

                          <td className="  text-center">
                            <TextField
                              label="Start"
                              InputLabelProps={{ shrink: true }}
                              type="Time"
                              value={item.lunch_start}
                              variant="outlined"
                              size="small"
                            />
                          </td>
                          <td className="text-center">
                            <TextField
                              type="Time"
                              InputLabelProps={{ shrink: true }}
                              label="End"
                              value={item.lunch_end}
                              variant="outlined"
                              size="small"
                            />
                          </td>

                          <td className=" text-center">
                            <TextField
                              label="Start"
                              InputLabelProps={{ shrink: true }}
                              value={item.dinner_start}
                              type="Time"
                              variant="outlined"
                              size="small"
                            />
                          </td>
                          <td className=" text-center">
                            <TextField
                              type="Time"
                              label="End"
                              value={item.dinner_end}
                              InputLabelProps={{ shrink: true }}
                              variant="outlined"
                              size="small"
                            />
                          </td>
                          <td>
                            <div>
                              <Select
                                options={allemployee}
                                placeholder={"Select"}
                                value={item.breakfast_employee}
                                funct={(e) => {
                                  handleemployeechange(e, item, "breakfast");
                                }}
                              />
                            </div>
                          </td>
                          <td>
                            <div>
                              <Select
                                options={allemployee}
                                placeholder={"Select"}
                                value={item.launch_employee}
                                funct={(e) => {
                                  handleemployeechange(e, item, "lunch");
                                }}
                              />
                            </div>
                          </td>
                          <td>
                            <div>
                              <Select
                                options={allemployee}
                                placeholder={"Select"}
                                value={item.dinner_employee}
                                funct={(e) => {
                                  handleemployeechange(e, item, "dinner");
                                }}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
