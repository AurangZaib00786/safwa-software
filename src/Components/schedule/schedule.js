import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Select from "../alerts/select";
import went_wrong_toast from "../alerts/went_wrong_toast";
import Spinner from "react-bootstrap/Spinner";
import TextField from "@mui/material/TextField";
import { useTranslation } from "react-i18next";
import SaveIcon from "@material-ui/icons/Save";
import success_toast from "../alerts/success_toast";
import Red_toast from "../alerts/red_toast";

export default function Schedule(props) {
  const { t } = useTranslation();
  const user = props.state.setuser.user;
  const route = props.state.setuser.route;
  const selected_branch = props.state.Setcurrentinfo.selected_branch;
  const current_user = props.state.Setcurrentinfo.current_user;
  const all_products = props.state.Settablehistory.table_history;
  const dispatch = props.Settable_history;

  const [all_productscopy, setall_productscopy] = useState([]);
  const [timing, settiming] = useState("");
  const [alltiming, setalltiming] = useState([]);
  const [isloading, setisloading] = useState(false);
  const [check_update, setcheck_update] = useState(false);

  const [id, setid] = useState(null);

  const [search, setsearch] = useState("");
  const [callagain, setcallagain] = useState(false);

  useEffect(() => {
    dispatch({ type: "Set_menuitem", data: "buffet" });
    const fetchtimings = async () => {
      var url = `${route}/api/buffet-timing/`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        const optimize = json.map((item) => {
          return { value: item.id, label: item.name };
        });

        setalltiming(optimize);
      }
      if (!response.ok) {
        went_wrong_toast();
      }
    };

    if (user) {
      fetchtimings();
    }
  }, []);

  useEffect(() => {
    const fetchWorkouts = async () => {
      setisloading(true);
      var url = `${route}/api/process/`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        setisloading(false);
        const optimize = json.map((item) => {
          item["break_fast_start"] = null;
          item["break_fast_end"] = null;
          item["lunch_start"] = null;
          item["lunch_end"] = null;
          item["dinner_start"] = null;
          item["dinner_end"] = null;
          return item;
        });
        dispatch({ type: "Set_table_history", data: optimize });
      }
      if (!response.ok) {
        went_wrong_toast();
        setisloading(false);
      }
    };

    if (user) {
      fetchWorkouts();
    }
  }, [callagain]);

  useEffect(() => {
    const fetchschedule = async () => {
      setisloading(true);
      var url = `${route}/api/schedule/?buffet_time_id=${timing.value}`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        setisloading(false);

        if (json.length > 0) {
          const detaillist = json[0].details.map((item) => {
            return item.process;
          });
          const productsupdate = all_products?.map((item) => {
            if (detaillist.includes(item.id)) {
              const schedule = json[0].details[detaillist.indexOf(item.id)];

              item["break_fast_start"] = schedule.break_fast_start;
              item["break_fast_end"] = schedule.break_fast_end;
              item["lunch_start"] = schedule.lunch_start;
              item["lunch_end"] = schedule.lunch_end;
              item["dinner_start"] = schedule.dinner_start;
              item["dinner_end"] = schedule.dinner_end;
              item["schduleid"] = schedule.id;
            } else {
              item["break_fast_start"] = null;
              item["break_fast_end"] = null;
              item["lunch_start"] = null;
              item["lunch_end"] = null;
              item["dinner_start"] = null;
              item["dinner_end"] = null;
            }
            return item;
          });
          dispatch({ type: "Set_table_history", data: productsupdate });

          setcheck_update(true);
          setid(json[0].id);
        } else {
          const productsupdate = all_products?.map((item) => {
            item["break_fast_start"] = null;
            item["break_fast_end"] = null;
            item["lunch_start"] = null;
            item["lunch_end"] = null;
            item["dinner_start"] = null;
            item["dinner_end"] = null;
            return item;
          });
          dispatch({ type: "Set_table_history", data: productsupdate });

          setcheck_update(false);
          setid(null);
        }
      }
      if (!response.ok) {
        went_wrong_toast();
        setisloading(false);
      }
    };

    if (timing) {
      fetchschedule();
    }
  }, [timing]);

  useEffect(() => {
    if (all_products.length > 0) {
      setall_productscopy(all_products);
    }
  }, [all_products]);

  const handlesubmit = async (e) => {
    e.preventDefault();
    if (timing) {
      setisloading(true);
      const rawdata = all_products;
      const data = rawdata.map((item) => {
        delete item["name"];
        delete item["type"];
        item["process"] = item.id;
        delete item["id"];
        return item;
      });

      const response = await fetch(`${route}/api/schedule/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access}`,
        },
        body: JSON.stringify({
          time: timing.value,
          details: data,
        }),
      });
      const json = await response.json();

      if (!response.ok) {
        setisloading(false);
        Red_toast("Select all Times !");
        setcallagain(!callagain);
      }

      if (response.ok) {
        setisloading(false);
        dispatch({ type: "Set_table_history", data: [] });
        success_toast();
        settiming("");
        setcallagain(!callagain);
      }
    } else {
      Red_toast("Select Time !");
    }
  };

  const handleupdate = async (e) => {
    e.preventDefault();
    if (timing) {
      setisloading(true);

      const data = all_products.map((item) => {
        delete item["name"];
        delete item["type"];
        item["process"] = item.id;
        if (item.schduleid) {
          item["id"] = item.schduleid;
          delete item["schduleid"];
        } else {
          delete item["id"];
        }

        return item;
      });

      const response = await fetch(`${route}/api/schedule/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access}`,
        },
        body: JSON.stringify({
          time: timing.value,
          details: data,
        }),
      });
      const json = await response.json();

      if (!response.ok) {
        setisloading(false);
        went_wrong_toast();
        setcallagain(!callagain);
      }

      if (response.ok) {
        setisloading(false);
        dispatch({ type: "Set_table_history", data: [] });
        success_toast();
        setid(null);
        settiming("");
        setcheck_update(false);
        setcallagain(!callagain);
      }
    } else {
      Red_toast("Select All Timings !");
    }
  };

  const handletime = (e, item, text) => {
    var filteritem = all_products.filter((row) => {
      return row.id === item.id;
    });
    filteritem = filteritem[0];

    if (text === "breakfaststart") {
      filteritem["break_fast_start"] = e.target.value;
    } else if (text === "breakfastend") {
      filteritem["break_fast_end"] = e.target.value;
    } else if (text === "lunchstart") {
      filteritem["lunch_start"] = e.target.value;
    } else if (text === "lunchend") {
      filteritem["lunch_end"] = e.target.value;
    } else if (text === "dinnerstart") {
      filteritem["dinner_start"] = e.target.value;
    } else if (text === "dinnerend") {
      filteritem["dinner_end"] = e.target.value;
    }

    dispatch({ type: "Update_table_history", data: filteritem });
  };

  const handlesearch = (e) => {
    const value = e.target.value;
    setsearch(value);
    if (value) {
      const sortout = all_products.filter((item) => {
        if (
          item?.name.toLowerCase().includes(value) ||
          item?.name.includes(value)
        ) {
          return item;
        }
      });
      dispatch({ type: "Set_table_history", data: sortout });
    } else {
      dispatch({ type: "Set_table_history", data: all_productscopy });
    }
  };

  return (
    <div className="p-3 pt-2">
      <div className="card">
        <div className="card-header d-flex justify-content-between bg-white">
          <h3 className="mt-2 me-2">Add Schedule</h3>
          <div className="mt-2 me-2 d-flex flex-row-reverse">
            <Button
              onClick={check_update ? handleupdate : handlesubmit}
              variant="outline-primary"
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
              <SaveIcon /> {t("save")}
            </Button>
          </div>
        </div>

        <div className="card-body pt-0">
          <div className="row mt-4">
            <div className="col-md-3">
              <Select
                options={alltiming}
                placeholder={"Time"}
                value={timing}
                funct={(e) => settiming(e)}
                required={true}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-3">
        <div className="card-body pt-0">
          <div className="row mt-5">
            <label className="d-flex justify-content-between align-items-end mb-2">
              <h5 className="m-0">Processes</h5>
              <TextField
                label="Search"
                variant="outlined"
                value={search}
                onChange={handlesearch}
                size="small"
              />
            </label>

            <div className="table-responsive">
              <table
                className="table  table-bordered border-secondary "
                style={{ width: "100%" }}
              >
                <thead>
                  <tr>
                    <th className="text-center">Name</th>

                    <th colSpan={2} className="text-center ">
                      Breakfast
                    </th>
                    <th colSpan={2} className="text-center ">
                      Lunch
                    </th>
                    <th colSpan={2} className="text-center ">
                      Dinner
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {all_products.map((item) => {
                    return (
                      <tr key={item.id}>
                        <td className="pt-0 pb-0 ">{item.name}</td>

                        <td className="text-center">
                          <TextField
                            type="Time"
                            InputLabelProps={{ shrink: true }}
                            label="Start"
                            value={item.break_fast_start}
                            onChange={(e) => {
                              handletime(e, item, "breakfaststart");
                            }}
                            variant="outlined"
                            size="small"
                          />
                        </td>
                        <td className="text-center">
                          <TextField
                            type="Time"
                            label="End"
                            value={item.break_fast_end}
                            onChange={(e) => {
                              handletime(e, item, "breakfastend");
                            }}
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
                            onChange={(e) => {
                              handletime(e, item, "lunchstart");
                            }}
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
                            onChange={(e) => {
                              handletime(e, item, "lunchend");
                            }}
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
                            onChange={(e) => {
                              handletime(e, item, "dinnerstart");
                            }}
                            variant="outlined"
                            size="small"
                          />
                        </td>
                        <td className=" text-center">
                          <TextField
                            type="Time"
                            label="End"
                            value={item.dinner_end}
                            onChange={(e) => {
                              handletime(e, item, "dinnerend");
                            }}
                            InputLabelProps={{ shrink: true }}
                            variant="outlined"
                            size="small"
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
    </div>
  );
}
