import React, { useEffect, useState, useRef } from "react";
import "./dailymeal.css";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import SaveIcon from "@material-ui/icons/Save";
import Select from "react-select";
import Selectr from "../alerts/select";
import PrintRoundedIcon from "@material-ui/icons/PrintRounded";
import TextField from "@mui/material/TextField";
import AddIcon from "@material-ui/icons/Add";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Dailymealform from "./dailymealform";
import { useTranslation } from "react-i18next";
import Red_toast from "../alerts/red_toast";
import custom_toast from "../alerts/custom_toast";
import moment from "moment";

function Dailymeal(props) {
  const user = props.state.setuser.user;
  const { t } = useTranslation();

  const route = props.state.setuser.route;
  const selected_branch = props.state.Setcurrentinfo.selected_branch;
  const selected_year = props.state.Setcurrentinfo.selected_year;
  const dispatch = props.Settable_history;

  const table_data = props.state.Setproducthistory.product_history;
  const settable_data = props.Setproduct_history;

  const [all_customers, setall_customers] = useState([]);
  const [text, settext] = useState("");
  const [type, settype] = useState("");

  var curdate = moment().format().substring(0, 10);

  const [date, setdate] = useState(curdate);

  const [customer, setcustomer] = useState("");

  const [showmodel, setshowmodel] = useState(false);
  const [isloading, setisloading] = useState(false);

  const [potsdata, setpotsdata] = useState([]);
  const [data, setdata] = useState("");
  const [column, setcolumn] = useState([]);
  const [order, setorder] = useState(null);
  const [allorder, setallorder] = useState([]);
  const [dishes, setdishes] = useState(null);
  useEffect(() => {
    const fetchorder = async () => {
      const response = await fetch(
        `${route}/api/orders/?customer_id=${customer.value}&start_date=${date}&end_date=${date}`,
        {
          headers: { Authorization: `Bearer ${user.access}` },
        }
      );
      const json = await response.json();

      if (response.ok) {
        setallorder(
          json.map((item) => {
            return { value: item, label: `Order : ${item.id}` };
          })
        );

        if (json.length === 0) {
          Red_toast("The Customer has no order for this Date !");
        }
      }
      if (!response.ok) {
        var error = Object.keys(json);
        if (error.length > 0) {
          Red_toast(`${error[0]}:${json[error[0]]}`);
        }
      }
    };

    if (date && customer) {
      fetchorder();
    }
  }, [date, customer]);

  const fetchdish = async () => {
    if (!type) {
      return;
    }
    const weekday = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const d = new Date();
    const day = d.getDay();

    const response = await fetch(
      `${route}/api/buffet-menus/?menu_id=${order.value?.menu}&title=${weekday[day]}_${type.value}`,
      {
        headers: { Authorization: `Bearer ${user.access}` },
      }
    );
    const json = await response.json();

    if (response.ok) {
      setdishes(json.shift());
    }
    if (!response.ok) {
      var error = Object.keys(json);
      if (error.length > 0) {
        Red_toast(`${error[0]}:${json[error[0]]}`);
      }
    }
  };

  useEffect(() => {
    dispatch({ type: "Set_menuitem", data: "purchase" });
    settable_data({ type: "Set_product_history", data: null });
    const fetchProducts = async () => {
      var url = `${route}/api/pots/`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        setpotsdata(json);
      }
      if (!response.ok) {
        var error = Object.keys(json);
        if (error.length > 0) {
          Red_toast(`${error[0]}:${json[error[0]]}`);
        }
      }
    };

    if (user) {
      fetchProducts();
    }
  }, []);

  useEffect(() => {
    const fetchcustomers = async () => {
      var url = `${route}/api/parties/?account_head=${selected_branch.id}&type=customer`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        const supp = json.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
        setall_customers(supp);
      }
      if (!response.ok) {
        var error = Object.keys(json);
        if (error.length > 0) {
          Red_toast(`${json[error[0]]}`);
        }
      }
    };

    if (user) {
      fetchcustomers();
    }
  }, [selected_branch]);

  const selectStyles = {
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };

  const handlepotqtychange = (row, pot, value) => {
    const newdata = table_data.map((item) => {
      if (item.id === row.id) {
        const changepot = item.pot_details.map((item2) => {
          if (item2.pot === pot.pot) {
            item2["qty"] = value;
            return item2;
          }
          return item2;
        });
        item["pot_details"] = changepot;
        return item;
      }
      return item;
    });
    settable_data({ type: "Set_product_history", data: newdata });
  };

  const handlegenerate = (e) => {
    e.preventDefault();
    if (!type) {
      Red_toast("Select Type First !");
      return;
    }
    const optimize = order.value?.details?.map((item) => {
      return {
        ...item,
        pot_details: [],
      };
    });
    settable_data({ type: "Set_product_history", data: optimize });
    fetchdish();
  };

  const handlesubmit = async (e) => {
    e.preventDefault();

    const buildingdetail = table_data.map((item) => {
      return {
        building: item.building,
        hujaj:
          type.value === "Breakfast"
            ? item.breakfast
            : type.value === "Lunch"
            ? item.launch
            : item.dinner,
        pot_details: item.pot_details,
      };
    });

    const dishdetail = dishes?.buffet_dishes?.map((item) => {
      return {
        dish: item.dish,
      };
    });

    const response = await fetch(`${route}/api/daily-meals/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.access}`,
      },
      body: JSON.stringify({
        order: order.value.id,
        meal_type: type.value,
        dish_details: dishdetail,
        building_details: buildingdetail,
      }),
    });
    const json = await response.json();
    setisloading(false);
    if (!response.ok) {
      var error = Object.keys(json);
      if (error.length > 0) {
        Red_toast(`${error[0]}:${json[error[0]]}`);
      }
    }

    if (response.ok) {
      custom_toast("Save");
      settable_data({ type: "Set_product_history", data: null });
      setorder(null);
      setdishes(null);
      setcolumn([]);
    }
  };

  const handleprint = async (e) => {
    e.preventDefault();

    const buildingdetail = table_data.map((item) => {
      return {
        building: item.building,
        hujaj:
          type.value === "Breakfast"
            ? item.breakfast
            : type.value === "Lunch"
            ? item.launch
            : item.dinner,
        pot_details: item.pot_details,
      };
    });

    const dishdetail = dishes?.buffet_dishes?.map((item) => {
      return {
        dish: item.dish,
      };
    });

    const response = await fetch(`${route}/api/daily-meals/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.access}`,
      },
      body: JSON.stringify({
        order: order.id,
        meal_type: type.value,
        dish_details: dishdetail,
        building_details: buildingdetail,
      }),
    });
    const json = await response.json();
    setisloading(false);
    if (!response.ok) {
      var error = Object.keys(json);
      if (error.length > 0) {
        Red_toast(`${error[0]}:${json[error[0]]}`);
      }
    }

    if (response.ok) {
      settable_data({ type: "Set_product_history", data: null });
      setorder(null);
      setdishes(null);
      setcolumn([]);
      localStorage.setItem("data", JSON.stringify(json));
      window.open("/mealform", "_blank");
    }
  };

  const handlenew = () => {
    settable_data({ type: "Set_product_history", data: null });
    setorder(null);
    setdishes(null);
    setcolumn([]);
  };
  return (
    <div className="p-3">
      <div className="card">
        <div className="card-header  d-flex justify-content-end">
          <Button
            onClick={handlenew}
            className="me-2"
            type="button"
            variant="outline-dark"
          >
            <AddIcon /> {t("new")}
          </Button>

          <Button
            disabled={!column.length > 0}
            onClick={handlesubmit}
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
          <Button
            disabled={!column.length > 0}
            onClick={handleprint}
            className="ms-2"
            variant="outline-success"
          >
            <PrintRoundedIcon /> {t("print")}
          </Button>
        </div>

        <div className="card-body">
          <form
            onSubmit={handlegenerate}
            className="row  d-sm-flex align-items-start mt-1"
          >
            <div className="col-6 col-md-2 mb-2">
              <TextField
                type="date"
                className="form-control   mb-3"
                id="outlined-basic"
                label="Date"
                InputLabelProps={{ shrink: true }}
                defaultValue={date}
                value={date}
                onChange={(e) => {
                  setdate(e.target.value);
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
            <div className="col-6 col-md-2 mb-2">
              <Select
                className={
                  customer !== ""
                    ? "form-control selector customer"
                    : "form-control selector"
                }
                styles={selectStyles}
                options={all_customers}
                placeholder={"Customers"}
                value={customer}
                onChange={(e) => {
                  setcustomer(e);
                }}
                required
              ></Select>
            </div>
            <div className="col-6 col-md-2 mb-2">
              <Selectr
                options={allorder}
                placeholder={"Orders"}
                value={order}
                funct={(e) => {
                  setorder(e);
                }}
                required
              ></Selectr>
            </div>
            <div className="col-6 col-md-2 mb-2">
              <Select
                className={
                  type !== ""
                    ? "form-control selector type"
                    : "form-control selector"
                }
                styles={selectStyles}
                options={[
                  { value: "Breakfast", label: "Breakfast / إفطار" },
                  { value: "Lunch", label: " Lunch / غداء" },
                  { value: "Dinner", label: "Dinner / عشاء" },
                ]}
                placeholder={"Type"}
                value={type}
                onChange={(e) => {
                  settype(e);
                }}
                required
              ></Select>
            </div>
            <div className="col-6 col-md-2 mb-2">
              <Button className="ms-2" type="submit" variant="outline-success">
                Generate..
              </Button>
            </div>
            <div className="col-6 col-md-2 mb-2">
              <Button
                className="ms-2"
                variant="outline-primary"
                onClick={() => {
                  if (table_data) {
                    settext("POTS");
                    setshowmodel(!showmodel);
                    setdata(potsdata);
                  } else {
                    Red_toast("Generate order first!");
                  }
                }}
              >
                <VisibilityIcon className="me-2" />
                Add Pots
              </Button>
            </div>
          </form>

          <div style={{ zoom: "0.8" }} className="table-responsive">
            <table
              className="table dailymealtable  table-bordered "
              style={{ width: "100%" }}
            >
              <thead>
                {dishes && (
                  <tr>
                    <th className="text-center">
                      <h5 style={{ fontWeight: "bolder" }}>م</h5>
                    </th>
                    <th className="text-center">
                      <h5 style={{ fontWeight: "bolder" }}>فندق</h5>
                    </th>
                    <th colSpan={column.length + 1} className="text-center">
                      <h5
                        className="d-flex justify-content-around align-items-center"
                        style={{ fontWeight: "bolder" }}
                      >
                        <span className="me-2">{type.label}</span>
                        <span className="d-flex">
                          {dishes?.buffet_dishes?.map((dish, index) => {
                            return (
                              <h5
                                key={dish.dish}
                                style={{ fontWeight: "normal" }}
                              >
                                {dish.dish_name}
                                {index < dishes?.buffet_dishes?.length - 1
                                  ? " + "
                                  : ""}
                              </h5>
                            );
                          })}
                        </span>
                      </h5>
                    </th>
                  </tr>
                )}

                <tr>
                  <th rowSpan={2} className="text-center">
                    <h5 style={{ fontWeight: "bolder" }}>Sr. No</h5>
                  </th>
                  <th rowSpan={2} className="text-center">
                    <h5 style={{ fontWeight: "bolder" }}>Build No.</h5>
                  </th>
                  <th className="text-center">
                    <h5 style={{ fontWeight: "bolder" }}>حجاج</h5>
                  </th>
                  {column?.map((item) => {
                    return (
                      <th key={item.id} className="text-center">
                        <h5 style={{ fontWeight: "bolder" }}>
                          {item.arabic_name}
                        </h5>
                      </th>
                    );
                  })}
                </tr>

                <tr>
                  <th className="text-center">
                    <h5 style={{ fontWeight: "bolder" }}>Haji</h5>
                  </th>
                  {column?.map((item) => {
                    return (
                      <th key={item.id} className="text-center">
                        <h5 style={{ fontWeight: "bolder" }}>{item.name}</h5>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {table_data?.map((item, index) => {
                  return (
                    <tr key={item.id}>
                      <td style={{ width: "0.5in" }}>{index + 1}</td>

                      <td
                        style={{ width: "3in" }}
                        className=" pt-0 pb-0 text-center"
                      >
                        <h5 style={{ fontWeight: "normal" }}>
                          {item.building_number}
                        </h5>
                      </td>

                      <td
                        style={{ width: "2in" }}
                        className="pt-0 pb-0  text-center"
                      >
                        <h5 style={{ fontWeight: "normal" }}>
                          {type.value === "Breakfast"
                            ? item.breakfast
                            : type.value === "Lunch"
                            ? item.launch
                            : item.dinner}
                        </h5>
                      </td>

                      {item?.pot_details?.map((pot) => {
                        return (
                          <td
                            style={{ width: "1.4in" }}
                            key={pot.pot}
                            className="text-center"
                          >
                            <input
                              type="number"
                              value={pot.qty}
                              className="form-control border-0"
                              onChange={(e) => {
                                handlepotqtychange(item, pot, e.target.value);
                              }}
                            ></input>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showmodel && (
        <Dailymealform
          show={showmodel}
          onHide={() => setshowmodel(false)}
          user={user}
          callback={settable_data}
          text={text}
          data_={data}
          column={column}
          setcolumn={setcolumn}
          table_data={table_data}
        />
      )}
    </div>
  );
}

export default Dailymeal;
