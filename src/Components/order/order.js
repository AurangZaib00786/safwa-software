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
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Alert_before_delete from "../../Container/alertContainer";
import custom_toast from "../alerts/custom_toast";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import PrintIcon from "@material-ui/icons/Print";
import Overlay from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css";
import { DateRangePicker, defaultStaticRanges } from "react-date-range";
import {
  endOfDay,
  startOfYear,
  endOfYear,
  addMonths,
  addYears,
  isSameDay,
} from "date-fns";

export default function Order(props) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  const { t } = useTranslation();

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
      fetchWorkouts();
      fetchemployess();
    }
  }, [selected_branch]);

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
        success_toast();
        setdata([]);
      }
    } else {
      Red_toast("Pleae Select Building First!");
    }
  };

  const handlebuildingchange = (e) => {
    setbuilding(e);
  };

  const handleaddclick = (e) => {
    e.preventDefault();

    const optimize = data.filter((item) => {
      return item.employee.value === employee.value;
    });
    if (optimize.length > 0) {
      let pitem = optimize.shift();
      let newdata = data.map((item) => {
        if (item.employee.value === pitem.employee.value) {
          item["breakfast"] = parseInt(pitem.breakfast) + parseInt(breakfast);

          return item;
        } else {
          return item;
        }
      });
      setdata(newdata);
    } else {
      setdata([
        ...data,
        {
          employee: employee,
          type: type.value,
          breakfast: breakfast,
          remarks: remarks,
        },
      ]);
    }

    setemployee("");
    setbreakfast("");
    setremarks("");
    settype("");
  };

  const handlesavebreakfastchange = (value, row) => {
    const optimize = data.map((item) => {
      if (item.employee.value == row.employee.value) {
        item["breakfast"] = value;
        return item;
      }
      return item;
    });
    setdata(optimize);
  };
  const handlesaveremarkschange = (value, row) => {
    const optimize = data.map((item) => {
      if (item.employee.value == row.employee.value) {
        item["remarks"] = value;
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
          <h3 className="mt-2 me-2">Order </h3>
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
                      funct={handlebuildingchange}
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
                                  value={item.type}
                                />
                              </div>

                              <div className="col-4">
                                <TextField
                                  type="date"
                                  className="form-control"
                                  size="small"
                                  value={item.breakfast}
                                  onChange={(e) => {
                                    handlesavebreakfastchange(
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
                                    value={item.remarks}
                                    onChange={(e) => {
                                      handlesaveremarkschange(
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
                                options={buildingoption}
                                placeholder={""}
                                value={building}
                                funct={(e) => setbuilding(e)}
                                margin={true}
                                required={true}
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
                                  setbreakfast(e.target.value);
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
                                  setlunch(e.target.value);
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
                                  setdinner(e.target.value);
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
