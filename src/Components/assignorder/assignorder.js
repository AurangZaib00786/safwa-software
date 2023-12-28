import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Select from "../alerts/select";
import { IconButton } from "@material-ui/core";
import InputGroup from "react-bootstrap/InputGroup";
import AddIcon from "@material-ui/icons/Add";
import Spinner from "react-bootstrap/Spinner";
import Red_toast from "../alerts/red_toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import TextField from "@mui/material/TextField";
import success_toast from "../alerts/success_toast";
import ClearIcon from "@material-ui/icons/Clear";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

export default function AssignOrder(props) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  const setActiveTab = props.setActiveTab;
  const user = props.state.setuser.user;
  const route = props.state.setuser.route;
  const selected_branch = props.state.Setcurrentinfo.selected_branch;
  const current_user = props.state.Setcurrentinfo.current_user;
  const all_stock = props.state.Settablehistory.table_history;
  const dispatch = props.Settable_history;
  var curr = new Date();
  var curdate = curr.toISOString().substring(0, 10);
  const [date, setdate] = useState(curdate);
  const [data, setdata] = useState([]);
  const [lunch, setlunch] = useState("");
  const [dinner, setdinner] = useState("");
  const [building, setbuilding] = useState("");
  const [buildingoption, setbuildingoption] = useState([]);
  const [allprocess, setallprocess] = useState([]);
  const order = JSON.parse(localStorage.getItem("data"));
  const [allemployee, setallemployee] = useState([]);
  const [employee, setemployee] = useState("");
  const [type, settype] = useState("");
  const [breakfast, setbreakfast] = useState("");
  const [remarks, setremarks] = useState("");
  const [isloading, setisloading] = useState(false);

  useEffect(() => {
    setisloading(true);
    dispatch({ type: "Set_menuitem", data: "order" });
    const fetchWorkouts = async () => {
      var url = `${route}/api/schedule/?buffet_time_id=1`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        setisloading(false);
        setallprocess(json.shift());
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
    if (employee) {
      const optimizedata = data.map((item) => {
        return {
          ...item,
          building: item.building.value.id,
        };
      });

      const response = await fetch(`${route}/api/orders/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.access}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          details: optimizedata,
          user: current_user.id,
          customer: employee.value,
          date: date,
        }),
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
        setdata([]);
        setemployee("");
        setdate(curdate);
      }
    } else {
      Red_toast("Pleae Select Customer!");
    }
  };

  const handleaddclick = (e) => {
    e.preventDefault();

    const optimize = data.filter((item) => {
      return item.building.value.id === building.value.id;
    });
    if (optimize.length > 0) {
      Red_toast("Building Already Selected!");
    } else {
      setdata([
        ...data,
        {
          building: building,
          breakfast: breakfast,
          lunch: lunch,
          dinner: dinner,
          remarks: remarks,
        },
      ]);
    }

    setbuilding("");
    setbreakfast("");
    setlunch("");
    setdinner("");
    setremarks("");
  };

  const handlesavedchange = (value, field, row) => {
    console.log(row);
    if (field !== "remarks") {
      if (value <= row.value.capacity) {
        switch (field) {
          case "breakfast":
            var optimize = data.map((item) => {
              if (item.building.value.id === row.value.id) {
                item["breakfast"] = value;
                return item;
              }
            });
            return setdata(optimize);
          case "lunch":
            optimize = data.map((item) => {
              if (item.building.value.id === row.value.id) {
                item["lunch"] = value;
                return item;
              }
            });
            return setdata(optimize);
          case "dinner":
            optimize = data.map((item) => {
              if (item.building.value.id === row.value.id) {
                item["dinner"] = value;
                return item;
              }
            });
            return setdata(optimize);
        }
      } else {
        Red_toast(
          `${field} value should be less than building capacity ${row.value.capacity}`
        );
      }
    } else {
      const optimize = data.map((item) => {
        if (item.building.value.id === row.value.id) {
          item["remarks"] = value;
          return item;
        }
      });
      return setdata(optimize);
    }
  };

  const handledelete = (row) => {
    const optimize = data.filter((item) => {
      return item.building.value.id !== row.value.id;
    });
    setdata(optimize);
  };

  const handlequantityvhange = (value, field) => {
    if (building) {
      if (value <= building.value.capacity) {
        switch (field) {
          case "breakfast":
            return setbreakfast(value);
          case "lunch":
            return setlunch(value);
          case "dinner":
            return setdinner(value);
        }
      } else {
        Red_toast(
          `${field} value should be less than building capacity ${building.value.capacity}`
        );
      }
    } else {
      Red_toast("Please select Building first!");
    }
  };

  return (
    <div className="p-3 pt-2">
      <div className="card">
        <div className="card-header d-flex justify-content-between bg-white">
          <h3 className="mt-2 me-2">Assign Order </h3>
          <div className="mt-2 me-2 d-flex flex-row-reverse">
            <Button
              variant="outline-primary"
              onClick={handlesubmit}
              disabled={!data.length > 0}
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
                    {allprocess?.details?.map((item) => {
                      return (
                        <tr key={item.id}>
                          <td className="pt-0 pb-0 ">{item.name}</td>

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
                              />
                            </div>
                          </td>
                          <td>
                            <div>
                              <Select
                                options={allemployee}
                                placeholder={"Select"}
                              />
                            </div>
                          </td>
                          <td>
                            <div>
                              <Select
                                options={allemployee}
                                placeholder={"Select"}
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
