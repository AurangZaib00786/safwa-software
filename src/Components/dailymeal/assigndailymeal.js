import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Select from "react-select";
import Spinner from "react-bootstrap/Spinner";
import Red_toast from "../alerts/red_toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import TextField from "@mui/material/TextField";
import success_toast from "../alerts/success_toast";

export default function AssignDailymeal(props) {
  const setActiveTab = props.setActiveTab;
  const user = props.state.setuser.user;
  const route = props.state.setuser.route;
  const dispatch = props.Settable_history;
  const [allprocess, setallprocess] = useState([]);
  const order = JSON.parse(localStorage.getItem("data"));
  const [allemployee, setallemployee] = useState([]);
  const [id, setid] = useState("");
  const [isloading, setisloading] = useState(false);
  const [data, setdata] = useState([]);

  useEffect(() => {
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
      fetchemployess();
    }
  }, []);

  useEffect(() => {
    const fetchWorkouts = async () => {
      var url = `${route}/api/schedule/?buffet_time_id=${order.time_id}`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        setisloading(false);
        // const optimize = json.shift()?.details?.map((item) => {
        //   var item2 = order.assignment_details.filter((item_2) => {
        //     return item_2.process === item.process;
        //   });
        //   if (item2.length > 0) {
        //     item2 = item2.shift();
        //     return {
        //       ...item,
        //       breakfast_employee: {
        //         value: item2.breakfast_employee ? item2.breakfast_employee : "",
        //         label: item2.breakfast_employee_name
        //           ? item2.breakfast_employee_name
        //           : "",
        //       },
        //       launch_employee: {
        //         value: item2.launch_employee,
        //         label: item2.launch_employee_name,
        //       },
        //       dinner_employee: {
        //         value: item2.dinner_employee,
        //         label: item2.dinner_employee_name,
        //       },
        //     };
        //   } else {
        //     return {
        //       ...item,
        //       breakfast_employee: "",
        //       launch_employee: "",
        //       dinner_employee: "",
        //     };
        //   }
        // });
        // setallprocess();
        fetchassignmeal(json.shift());
      }
      if (!response.ok) {
        var error = Object.keys(json);
        if (error.length > 0) {
          Red_toast(`${json[error[0]]}`);
        }
        setisloading(false);
      }
    };

    const fetchassignmeal = async (input_data) => {
      var url = `${route}/api/assign-daily-meals/?daily_meal_id=${order.id}`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        if (json.length > 0) {
          setid(true);
          setallprocess({ details: json });
        } else {
          setallprocess({ details: input_data.details });
        }
        // const optimize = input_data?.details?.map((item) => {
        //   var assign_meal_process = json.filter(
        //     (assign_mealitem) => assign_mealitem.process === item.process
        //   );
        //   assign_meal_process = assign_meal_process.shift();
        //   if (assign_meal_process) {
        //     item["employee"] = {
        //       value: assign_meal_process.employee,
        //       label: assign_meal_process.employee_name,
        //     };
        //     item["id"] = assign_meal_process.id;
        //     switch (item.order_info?.meal_type) {
        //       case "Breakfast":
        //         item["break_fast_start"] =
        //           assign_meal_process.alloted_start_time;
        //         item["break_fast_end"] = assign_meal_process.alloted_end_time;
        //         return;
        //       case "Lunch":
        //         item["lunch_start"] = assign_meal_process.alloted_start_time;
        //         item["lunch_end"] = assign_meal_process.alloted_end_time;
        //         return;
        //       case "Dinner":
        //         item["dinner_start"] = assign_meal_process.alloted_start_time;
        //         item["dinner_end"] = assign_meal_process.alloted_end_time;
        //         return;
        //     }
        //   }

        //   return item;
        // });
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
    }
  }, []);

  const handlesubmit = async (e) => {
    e.preventDefault();
    var flag = false;
    const optimizedata = allprocess.details?.map((item) => {
      return {
        daily_meal: order.id,
        process: item.process,
        employee: item?.employee ? item?.employee : "",
        alloted_start_time:
          order?.meal_type === "Breakfast"
            ? item.break_fast_start
            : order?.meal_type === "Dinner"
            ? item.dinner_start
            : item.lunch_start,
        alloted_end_time:
          order?.meal_type === "Breakfast"
            ? item.break_fast_end
            : order?.meal_type === "Dinner"
            ? item.dinner_end
            : item.lunch_end,
      };
    });

    const response = await fetch(`${route}/api/assign-bulk-daily-meals/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.access}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(optimizedata),
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
      setActiveTab("dailymeal_history");
    }
  };

  const handleupdate = async (e) => {
    e.preventDefault();

    const response = await fetch(`${route}/api/assign-bulk-daily-meals/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.access}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(allprocess.details),
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
      success_toast();
      setActiveTab("dailymeal_history");
    }
  };

  const handleemployeechange = (e, row, time) => {
    switch (time) {
      case "Breakfast":
        var optimize = allprocess?.details.map((item) => {
          if (item.id === row.id) {
            item["employee"] = e.value;
            item["employee_name"] = e.label;
            return item;
          }
          return item;
        });
        return setallprocess({ details: optimize });

      case "Lunch":
        var optimize = allprocess?.details.map((item) => {
          if (item.id === row.id) {
            item["employee"] = e.value;
            item["employee_name"] = e.label;
            return item;
          }
          return item;
        });
        return setallprocess({ details: optimize });

      case "Dinner":
        var optimize = allprocess?.details.map((item) => {
          if (item.id === row.id) {
            item["employee"] = e.value;
            item["employee_name"] = e.label;
            return item;
          }
          return item;
        });
        return setallprocess({ details: optimize });
    }
  };

  const handlestarttimechange = (e, row, time) => {
    switch (time) {
      case "Breakfast":
        var optimize = allprocess?.details.map((item) => {
          if (item.id === row.id) {
            if (id) {
              item["alloted_start_time"] = e;
            } else {
              item["break_fast_start"] = e;
            }

            return item;
          }
          return item;
        });
        return setallprocess({ details: optimize });

      case "Lunch":
        var optimize = allprocess?.details.map((item) => {
          if (item.id === row.id) {
            if (id) {
              item["alloted_start_time"] = e;
            } else {
              item["lunch_start"] = e;
            }

            return item;
          }
          return item;
        });
        return setallprocess({ details: optimize });

      case "Dinner":
        var optimize = allprocess?.details.map((item) => {
          if (item.id === row.id) {
            if (id) {
              item["alloted_start_time"] = e;
            } else {
              item["dinner_start"] = e;
            }

            return item;
          }
          return item;
        });
        return setallprocess({ details: optimize });
    }
  };

  const handleendtimechange = (e, row, time) => {
    switch (time) {
      case "Breakfast":
        var optimize = allprocess?.details.map((item) => {
          if (item.id === row.id) {
            if (id) {
              item["alloted_end_time"] = e;
            } else {
              item["break_fast_end"] = e;
            }

            return item;
          }
          return item;
        });
        return setallprocess({ details: optimize });

      case "Lunch":
        var optimize = allprocess?.details.map((item) => {
          if (item.id === row.id) {
            if (id) {
              item["alloted_end_time"] = e;
            } else {
              item["lunch_end"] = e;
            }

            return item;
          }
          return item;
        });
        return setallprocess({ details: optimize });

      case "Dinner":
        var optimize = allprocess?.details.map((item) => {
          if (item.id === row.id) {
            if (id) {
              item["alloted_end_time"] = e;
            } else {
              item["dinner_end"] = e;
            }

            return item;
          }
          return item;
        });
        return setallprocess({ details: optimize });
    }
  };

  const selectStyles = {
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
    menuList: (base) => ({
      ...base,
      height: "200px", // your desired height
    }),
  };

  return (
    <div className="p-3 pt-2">
      <div className="card">
        <div className="card-header d-flex justify-content-between bg-white">
          <h3 className="mt-2 me-2">Assign Meal </h3>
          <div className="mt-2 me-2 d-flex flex-row-reverse">
            <Button
              variant="outline-primary"
              onClick={id ? handleupdate : handlesubmit}
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
              <FontAwesomeIcon icon={faRotate} /> Save
            </Button>
          </div>
        </div>

        <div className="card-body pt-0 ">
          {isloading && (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
            </div>
          )}
          <div className=" mt-3">
            <table
              className="table  table-bordered border-secondary"
              style={{ width: "100%" }}
            >
              <thead>
                <tr>
                  <th className="text-center">Process</th>

                  <th colSpan={2} className="text-center ">
                    {order?.meal_type}
                  </th>

                  {/* <th className="text-center ">Category</th> */}
                  <th className="text-center ">{order?.meal_type} Employee</th>
                </tr>
              </thead>
              <tbody>
                {allprocess?.details?.map((item) => {
                  return (
                    <tr key={item.id}>
                      <td className="pt-0 pb-0 ">{item.process_name}</td>

                      <td className="text-center">
                        <TextField
                          type="Time"
                          InputLabelProps={{ shrink: true }}
                          label="Start"
                          value={
                            id
                              ? item.alloted_start_time
                              : order?.meal_type === "Breakfast"
                              ? item.break_fast_start
                              : order?.meal_type === "Dinner"
                              ? item.dinner_start
                              : item.lunch_start
                          }
                          variant="outlined"
                          onChange={(e) => {
                            handlestarttimechange(
                              e.target.value,
                              item,
                              order?.meal_type
                            );
                          }}
                          size="small"
                        />
                      </td>
                      <td className="text-center">
                        <TextField
                          type="Time"
                          label="End"
                          value={
                            id
                              ? item.alloted_end_time
                              : order?.meal_type === "Breakfast"
                              ? item.break_fast_end
                              : order?.meal_type === "Dinner"
                              ? item.dinner_end
                              : item.lunch_end
                          }
                          onChange={(e) => {
                            handleendtimechange(
                              e.target.value,
                              item,
                              order?.meal_type
                            );
                          }}
                          InputLabelProps={{ shrink: true }}
                          variant="outlined"
                          size="small"
                        />
                      </td>

                      <td>
                        <Select
                          styles={selectStyles}
                          options={allemployee}
                          value={{
                            value: item.employee,
                            label: item.employee ? item.employee_name : "",
                          }}
                          onChange={(e) => {
                            handleemployeechange(e, item, order?.meal_type);
                          }}
                        />
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
  );
}
