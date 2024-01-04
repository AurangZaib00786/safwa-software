import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Select from "../alerts/select";
import Selectr from "react-select";
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

export default function Order(props) {
  const user = props.state.setuser.user;
  const route = props.state.setuser.route;
  const selected_branch = props.state.Setcurrentinfo.selected_branch;
  const current_user = props.state.Setcurrentinfo.current_user;
  const dispatch = props.Settable_history;
  const setActiveTab = props.setActiveTab;
  var curr = new Date();
  const buildingref = useRef(null);
  var curdate = curr.toISOString().substring(0, 10);
  const [date, setdate] = useState(curdate);
  const [data, setdata] = useState([]);
  const [lunch, setlunch] = useState("");
  const [dinner, setdinner] = useState("");
  const [building, setbuilding] = useState("");
  const [buildingoption, setbuildingoption] = useState([]);
  const [allemployee, setallemployee] = useState([]);
  const [employee, setemployee] = useState("");

  const [breakfast, setbreakfast] = useState("");
  const [remarks, setremarks] = useState("");
  const [isloading, setisloading] = useState(false);
  const [update, setupdate] = useState(false);
  const order = JSON.parse(localStorage.getItem("data"));
  useEffect(() => {
    if (order?.order&&order.data) {
      let orderdata = order.data;
      setupdate(true);
      setemployee({
        value: orderdata.customer,
        label: orderdata.customer_name,
      });
      setdate(orderdata.date);
      setdata(
        orderdata.details?.map((item) => {
          return {
            id: item.id,
            building: {
              value: { id: item.building },
              label: item.building_number,
            },
            breakfast: item.breakfast,
            lunch: item.launch,
            dinner: item.dinner,
            remarks: item.remarks,
          };
        })
      );
    }
  }, []);

  useEffect(() => {
    setisloading(true);
    dispatch({ type: "Set_menuitem", data: "order" });
    const fetchWorkouts = async () => {
      var url = `${route}/api/buildings/`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        setisloading(false);

        const optimize = json.map((item) => {
          return { value: item, label: item.building_number };
        });
        setbuildingoption(optimize);
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
      var url = `${route}/api/parties/?account_head=${selected_branch.id}&type=customer`;

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
  }, [selected_branch]);

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

  const handleupdate = async (e) => {
    e.preventDefault();

    const optimizedata = data.map((item) => {
      return {
        ...item,
        building: item.building.value.id,
      };
    });

    const response = await fetch(`${route}/api/orders/${order.data.id}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${user.access}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        details: optimizedata,
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
      localStorage.setItem("data", JSON.stringify(""));
      setupdate(false);
      setActiveTab("assignorderhistory");
    }
  };

  const handleclear = () => {
    setdata([]);
    setemployee("");
    setdate(curdate);
    setupdate(false);
    localStorage.setItem("data", JSON.stringify(""));
  };

  const handleaddclick = (e) => {
    e.preventDefault();

    const optimize = data.filter((item) => {
      return item.building.value.id === building.value.id;
    });
    if (optimize.length > 0) {
      Red_toast("Building Already Selected!");
    } else {
      console.log(data);
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
    buildingref.current.focus();
  };

  const handlesavedchange = (value, field, row) => {
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
          <h3 className="mt-2 me-2">Order </h3>
          <div className="mt-2 me-2 d-flex flex-row-reverse">
            <Button
              variant="outline-primary"
              onClick={update ? handleupdate : handlesubmit}
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
              <FontAwesomeIcon icon={faRotate} /> {update ? "Update" : "Save"}
            </Button>
            <Button variant="outline-secondary me-2" onClick={handleclear}>
              Clear
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
              <div className="col-md-7">
                <div className="d-sm-flex  align-items-center mt-3">
                  <div className="col-md-4 me-3">
                    <TextField
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      className="form-control mb-3"
                      size="small"
                      label="Delivery date"
                      value={date}
                      onChange={(e) => {
                        setdate(e.target.value);
                      }}
                    />
                  </div>

                  <div className="col-md-4 me-3">
                    <Select
                      options={allemployee}
                      placeholder={" Select Customer..."}
                      value={employee}
                      funct={(e) => {
                        setemployee(e);
                      }}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <table className="table">
                    <thead className="border-0">
                      <tr>
                        <th className="d-flex align-items-center border-0 p-0">
                          <h6 className="col-4 p-2 ps-0 pb-0 m-0">
                            Building No
                          </h6>

                          <h6 className=" col-4  p-2 pb-0 m-0">Breakfast</h6>

                          <h6 className="col-4 p-2 pb-0 m-0">Lunch</h6>
                          <h6 className="col-4 p-2 pb-0 m-0">Dinner</h6>
                          <h6 className="col-4 p-2 pb-0 m-0">Remarks</h6>
                        </th>
                      </tr>
                      {data?.map((item) => {
                        return (
                          <tr key={item.building.value.id}>
                            <th className="d-flex align-items-center p-0 border-0">
                              <div className="col-4">
                                <TextField
                                  className="form-control"
                                  size="small"
                                  value={item.building.label}
                                />
                              </div>

                              <div className="col-4">
                                <TextField
                                  className="form-control"
                                  size="small"
                                  value={item.breakfast}
                                  onChange={(e) => {
                                    handlesavedchange(
                                      e.target.value,
                                      "breakfast",
                                      item.building
                                    );
                                  }}
                                />
                              </div>

                              <div className="col-4">
                                <TextField
                                  className="form-control"
                                  size="small"
                                  value={item.lunch}
                                  onChange={(e) => {
                                    handlesavedchange(
                                      e.target.value,
                                      "lunch",
                                      item.building
                                    );
                                  }}
                                />
                              </div>
                              <div className="col-4">
                                <TextField
                                  className="form-control"
                                  size="small"
                                  value={item.dinner}
                                  onChange={(e) => {
                                    handlesavedchange(
                                      e.target.value,
                                      "dinner",
                                      item.building
                                    );
                                  }}
                                />
                              </div>
                              <div className="col-4">
                                <InputGroup>
                                  <TextField
                                    className="form-control"
                                    size="small"
                                    value={item.remarks}
                                    onChange={(e) => {
                                      handlesavedchange(
                                        e.target.value,
                                        "remarks",
                                        item.building
                                      );
                                    }}
                                  />

                                  <IconButton
                                    className="p-0 ps-2 pe-2"
                                    style={{
                                      backgroundColor: "red",
                                      borderRadius: "0",
                                    }}
                                    onClick={() => handledelete(item.employee)}
                                  >
                                    <ClearIcon
                                      style={{
                                        color: "white",
                                        height: "fit-content",
                                      }}
                                      fontSize="medium"
                                    />
                                  </IconButton>
                                </InputGroup>
                              </div>
                            </th>
                          </tr>
                        );
                      })}
                    </thead>
                    <tbody>
                      <tr>
                        <td className=" p-0 border-0">
                          <form onSubmit={handleaddclick} className="d-flex ">
                            <div className="col-4">
                              <Selectr
                                options={buildingoption}
                                value={building}
                                onChange={(e) => setbuilding(e)}
                                required={true}
                                ref={buildingref}
                              />
                            </div>

                            <div className="col-4">
                              <TextField
                                type="number"
                                placeholder={"Breakfast"}
                                size="small"
                                className="form-control"
                                value={breakfast}
                                onChange={(e) => {
                                  handlequantityvhange(
                                    e.target.value,
                                    "breakfast"
                                  );
                                }}
                                required
                              />
                            </div>

                            <div className="col-4">
                              <TextField
                                type="number"
                                placeholder={"Lunch"}
                                size="small"
                                className="form-control"
                                value={lunch}
                                onChange={(e) => {
                                  handlequantityvhange(e.target.value, "lunch");
                                }}
                                required
                              />
                            </div>
                            <div className="col-4">
                              <TextField
                                type="number"
                                placeholder={"Dinner"}
                                size="small"
                                className="form-control"
                                value={dinner}
                                onChange={(e) => {
                                  handlequantityvhange(
                                    e.target.value,
                                    "dinner"
                                  );
                                }}
                                required
                              />
                            </div>
                            <div className="col-4">
                              <InputGroup>
                                <TextField
                                  placeholder={"Remarks"}
                                  size="small"
                                  className="form-control"
                                  value={remarks}
                                  onChange={(e) => {
                                    setremarks(e.target.value);
                                  }}
                                />

                                <IconButton
                                  className="p-0 ps-2 pe-2"
                                  style={{
                                    backgroundColor: "#0d6efd",
                                    borderRadius: "0",
                                  }}
                                  type="submit"
                                >
                                  <AddIcon
                                    style={{
                                      color: "white",
                                      height: "fit-content",
                                    }}
                                    fontSize="medium"
                                  />
                                </IconButton>
                              </InputGroup>
                            </div>
                          </form>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
