import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Select from "../alerts/select";
import { IconButton } from "@material-ui/core";
import InputGroup from "react-bootstrap/InputGroup";
import AddIcon from "@material-ui/icons/Add";
import Spinner from "react-bootstrap/Spinner";
import Red_toast from "../alerts/red_toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import TextField from "@mui/material/TextField";
import success_toast from "../alerts/success_toast";
import ClearIcon from "@material-ui/icons/Clear";
import { SignalCellularNull } from "@material-ui/icons";

export default function BuildingManagement(props) {
  const user = props.state.setuser.user;
  const route = props.state.setuser.route;
  const dispatch = props.Settable_history;
  const selected_year = props.state.Setcurrentinfo.selected_year;
  const setActiveTab = props.setActiveTab;
  const setadditionalinfo = props.setadditionalinfo;
  const additionalinfo = props.additionalinfo;

  const [data, setdata] = useState([]);
  const [building, setbuilding] = useState("");
  const [buildingoption, setbuildingoption] = useState([]);

  const [allemployee, setallemployee] = useState([]);
  const [employee, setemployee] = useState("");
  const [type, settype] = useState("");
  const [joindate, setjoindate] = useState("");
  const [enddate, setenddate] = useState(null);
  const [isloading, setisloading] = useState(false);
  const [callagain, setcallagain] = useState(false);
  const [closing_date, setclosing_date] = useState("");

  useEffect(() => {
    if (additionalinfo) {
      handlebuildingchange({
        value: additionalinfo,
        label: additionalinfo.building_number,
      });
    }
  }, [buildingoption]);

  useEffect(() => {
    setisloading(true);
    dispatch({ type: "Set_menuitem", data: "building" });

    const fetchemployess = async () => {
      var url = `${route}/api/employee/`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        const optimize = json.map((item) => {
          return { value: item, label: item.name };
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
    fetchWorkouts();
  }, [callagain]);

  const handlesubmit = async (e) => {
    e.preventDefault();
    if (building) {
      const optimizedata = data.map((item) => {
        return {
          ...item,
          employee: item.employee.value.id,
        };
      });

      const response = await fetch(
        `${route}/api/buildings/${building.value.id}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${user.access}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            details: optimizedata,
            closing_date: closing_date,
          }),
        }
      );
      const json = await response.json();

      if (!response.ok) {
        setisloading(false);
        var error = Object.keys(json);
        if (error.length > 0) {
          Red_toast(`${json[error[0]]}`);
        }
      }

      if (response.ok) {
        setcallagain(!callagain);
        success_toast();
        setdata([]);
        setbuilding("");
        setadditionalinfo(null);
        setActiveTab("building");
      }
    } else {
      Red_toast("Pleae Select Building First!");
    }
  };

  const handlebuildingchange = (e) => {
    setbuilding(e);
    setclosing_date(e.value.closing_date);
    setdata(
      e.value.details.map((item) => {
        return {
          ...item,
          employee: { value: { id: item.employee }, label: item.employee_name },
          employee_type: item.employee_type,
          start_date: item.start_date,
          end_date: item.end_date,
        };
      })
    );
  };

  const handleaddclick = (e) => {
    e.preventDefault();

    const optimize = data.filter((item) => {
      return item.employee.value.id === employee.value.id;
    });
    if (optimize.length > 0) {
      Red_toast("Already Selected!");
    } else {
      setdata([
        ...data,
        {
          employee: employee,
          employee_type: type.value,
          start_date: joindate,
          end_date: enddate,
        },
      ]);
    }

    setemployee("");
    setjoindate("");
    setenddate(null);
    settype("");
  };

  const handlesavejoindatechange = (value, row) => {
    const optimize = data.map((item) => {
      if (item.employee.value == row.employee.value) {
        item["start_date"] = value;
        return item;
      }
      return item;
    });
    setdata(optimize);
  };
  const handlesaveenddatechange = (value, row) => {
    const optimize = data.map((item) => {
      if (item.employee.value == row.employee.value) {
        item["end_date"] = value;
        return item;
      }
      return item;
    });
    setdata(optimize);
  };

  const handledelete = (row) => {
    const optimize = data.filter((item) => {
      return item.employee.value !== row.value;
    });
    setdata(optimize);
  };

  return (
    <div className="p-3 pt-2">
      <div className="card">
        <div className="card-header d-flex justify-content-between bg-white">
          <h3 className="mt-2 me-2">Building Management</h3>
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
              <FontAwesomeIcon icon={faRotate} /> Save
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
                    <Select
                      options={buildingoption}
                      placeholder={" Select Building..."}
                      value={building}
                      funct={handlebuildingchange}
                    />
                  </div>

                  <div className="col-md-4 me-3 mb-3">
                    <TextField
                      type="date"
                      className="form-control"
                      label={"Closing Date"}
                      InputLabelProps={{ shrink: true }}
                      value={closing_date}
                      onChange={(e) => {
                        setclosing_date(e.target.value);
                      }}
                      InputProps={{
                        inputProps: {
                          min: `${selected_year.value}-01-01`,
                          max: `${selected_year.value}-12-31`,
                        },
                      }}
                      size="small"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <table className="table">
                    <thead className="border-0">
                      <tr>
                        <th className="d-flex align-items-center border-0 p-0">
                          <h6 className="col-4 p-2 ps-0 pb-0 m-0">Employees</h6>

                          <h6 className=" col-4  p-2 pb-0 m-0">Type</h6>

                          <h6 className="col-4 p-2 pb-0 m-0">Join Date</h6>
                          <h6 className="col-4 p-2 pb-0 m-0">End Date</h6>
                        </th>
                      </tr>
                      {data?.map((item) => {
                        return (
                          <tr key={item.employee.value}>
                            <th className="d-flex align-items-center p-0 border-0">
                              <div className="col-4">
                                <TextField
                                  className="form-control"
                                  size="small"
                                  value={item.employee.label}
                                />
                              </div>

                              <div className="col-4">
                                <TextField
                                  className="form-control"
                                  size="small"
                                  value={item.employee_type}
                                />
                              </div>

                              <div className="col-4">
                                <TextField
                                  type="date"
                                  className="form-control"
                                  size="small"
                                  value={item.start_date}
                                  InputProps={{
                                    inputProps: {
                                      min: `${selected_year.value}-01-01`,
                                      max: `${selected_year.value}-12-31`,
                                    },
                                  }}
                                  onChange={(e) => {
                                    handlesavejoindatechange(
                                      e.target.value,
                                      item
                                    );
                                  }}
                                />
                              </div>
                              <div className="col-4">
                                <InputGroup>
                                  <TextField
                                    type="date"
                                    className="form-control"
                                    size="small"
                                    value={item.end_date}
                                    InputProps={{
                                      inputProps: {
                                        min: `${selected_year.value}-01-01`,
                                        max: `${selected_year.value}-12-31`,
                                      },
                                    }}
                                    onChange={(e) => {
                                      handlesaveenddatechange(
                                        e.target.value,
                                        item
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
                              <Select
                                options={allemployee}
                                placeholder={""}
                                value={employee}
                                funct={(e) => setemployee(e)}
                                margin={true}
                                required={true}
                              />
                            </div>

                            <div className="col-4">
                              <Select
                                options={[
                                  { value: "Captain", label: "Captain" },
                                  { value: "Worker", label: "Worker" },
                                ]}
                                placeholder={""}
                                margin={true}
                                value={type}
                                funct={(e) => settype(e)}
                                required={true}
                              />
                            </div>

                            <div className="col-4">
                              <TextField
                                type="date"
                                placeholder={"JOin Date"}
                                size="small"
                                className="form-control"
                                value={joindate}
                                onChange={(e) => {
                                  setjoindate(e.target.value);
                                }}
                                InputProps={{
                                  inputProps: {
                                    min: `${selected_year.value}-01-01`,
                                    max: `${selected_year.value}-12-31`,
                                  },
                                }}
                                required
                              />
                            </div>
                            <div className="col-4">
                              <InputGroup>
                                <TextField
                                  type="date"
                                  placeholder={"End date"}
                                  size="small"
                                  className="form-control"
                                  value={enddate}
                                  InputProps={{
                                    inputProps: {
                                      min: `${selected_year.value}-01-01`,
                                      max: `${selected_year.value}-12-31`,
                                    },
                                  }}
                                  onChange={(e) => {
                                    setenddate(e.target.value);
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
