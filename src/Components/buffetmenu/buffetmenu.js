import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import "./buffetmenu.css";
import Select from "../alerts/select";
import went_wrong_toast from "../alerts/went_wrong_toast";
import Spinner from "react-bootstrap/Spinner";
import TextField from "@mui/material/TextField";
import { useTranslation } from "react-i18next";
import SaveIcon from "@material-ui/icons/Save";
import VisibilityIcon from "@material-ui/icons/Visibility";
import success_toast from "../alerts/success_toast";
import Red_toast from "../alerts/red_toast";
import Stock_table from "./buffetmenuhistory";

export default function BuffetMenu(props) {
  const { t } = useTranslation();
  const user = props.state.setuser.user;
  const route = props.state.setuser.route;
  const selected_branch = props.state.Setcurrentinfo.selected_branch;
  const current_user = props.state.Setcurrentinfo.current_user;
  const all_products = props.state.Settablehistory.table_history;
  const dispatch = props.Settable_history;

  const [title, settitle] = useState("");
  const [all_productscopy, setall_productscopy] = useState([]);
  const [menu, setmenu] = useState("");
  const [allmenu, setallmenu] = useState([]);
  const [isloading, setisloading] = useState(false);
  const [check_update, setcheck_update] = useState(true);

  const [id, setid] = useState(null);
  const [checkall, setcheckall] = useState(false);
  const [view_stock, setview_stock] = useState(false);
  const [search, setsearch] = useState("");
  const [callagain, setcallagain] = useState(false);

  useEffect(() => {
    dispatch({ type: "Set_table_history", data: [] });

    const fetchWorkouts = async () => {
      setisloading(true);
      var url = `${route}/api/dishes/`;
      if (menu) {
        url = `${url}?menu_id=${menu.value}`;
      }

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        setisloading(false);
        const optimize = json.map((item) => {
          item["value"] = false;
          return item;
        });
        dispatch({ type: "Set_table_history", data: optimize });
        setall_productscopy(optimize);
        setcallagain(!callagain);
      }
      if (!response.ok) {
        went_wrong_toast();
        setisloading(false);
      }
    };

    if (menu) {
      fetchWorkouts();
    }
  }, [menu]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      setisloading(true);
      var url = `${route}/api/buffet-menus/?menu=${menu.value}&title=${title.value}`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        setisloading(false);
        if (json.length > 0) {
          const dishlist = json[0].buffet_dishes.map((item) => {
            return item.dish;
          });
          const productsupdate = all_products?.map((item) => {
            if (dishlist.includes(item.id)) {
              item["value"] = true;
              item["menuid"] =
                json[0].buffet_dishes[dishlist.indexOf(item.id)].id;
            } else {
              item["value"] = false;
            }
            return item;
          });
          dispatch({ type: "Set_table_history", data: productsupdate });
          setall_productscopy(productsupdate);

          setcheck_update(true);
          setid(json[0].id);
        } else {
          const productsupdate = all_products?.map((item) => {
            item["value"] = false;
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

    if (title && menu) {
      fetchWorkouts();
    }
  }, [title, callagain]);

  useEffect(() => {
    dispatch({ type: "Set_menuitem", data: "buffet menu" });
    const fetchmenu = async () => {
      var url = `${route}/api/menu/`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        const optimize = json.map((item) => {
          return { value: item.id, label: item.name };
        });
        setallmenu(optimize);
      }
    };

    if (user) {
      fetchmenu();
    }
  }, []);

  const handlesubmit = async (e) => {
    e.preventDefault();
    if (menu && title) {
      setisloading(true);
      const data = [];
      all_products.map((item) => {
        if (item.value) {
          data.push({ dish: item.id });
        }
      });

      const response = await fetch(`${route}/api/buffet-menus/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access}`,
        },
        body: JSON.stringify({
          title: title.value,
          menu: menu.value,
          buffet_dishes: data,
        }),
      });
      const json = await response.json();

      if (!response.ok) {
        setisloading(false);
        went_wrong_toast();
      }

      if (response.ok) {
        setisloading(false);

        success_toast();

        setcheckall(false);
        setcheck_update(false);
      }
    } else {
      Red_toast("Select Menu and Title !");
    }
  };

  const handleupdate = async (e) => {
    e.preventDefault();
    if (menu && title) {
      setisloading(true);
      const data = [];
      all_products.map((item) => {
        if (item.value) {
          if (item.menuid) {
            data.push({ id: item.menuid, dish: item.id });
          } else {
            data.push({ dish: item.id });
          }
        }
      });

      const response = await fetch(`${route}/api/buffet-menus/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access}`,
        },
        body: JSON.stringify({
          title: title.value,
          menu: menu.value,
          buffet_dishes: data,
        }),
      });
      const json = await response.json();

      if (!response.ok) {
        setisloading(false);
        went_wrong_toast();
      }

      if (response.ok) {
        setisloading(false);

        success_toast();
        setid(null);

        setcheckall(false);
        setcheck_update(false);
      }
    } else {
      Red_toast("Select Menu and Title !");
    }
  };

  const alltitle = [
    { value: "Monday_Breakfast", label: "Monday Breakfast" },
    { value: "Monday_Lunch", label: "Monday Lunch" },
    { value: "Monday_Dinner", label: "Monday Dinner" },

    { value: "Tuesday_Breakfast", label: "Tuesday Breakfast" },
    { value: "Tuesday_Lunch", label: "Tuesday Lunch" },
    { value: "Tuesday_Dinner", label: "Tuesday Dinner" },

    { value: "Wednesday_Breakfast", label: "Wednesday Breakfast" },
    { value: "Wednesday_Lunch", label: "Wednesday Lunch" },
    { value: "Wednesday_Dinner", label: "Wednesday Dinner" },

    { value: "Thursday_Breakfast", label: "Thursday Breakfast" },
    { value: "Thursday_Lunch", label: "Thursday Lunch" },
    { value: "Thursday_Dinner", label: "Thursday Dinner" },

    { value: "Friday_Breakfast", label: "Friday Breakfast" },
    { value: "Friday_Lunch", label: "Friday Lunch" },
    { value: "Friday_Dinner", label: "Friday Dinner" },

    { value: "Saturday_Breakfast", label: "Saturday Breakfast" },
    { value: "Saturday_Lunch", label: "Saturday Lunch" },
    { value: "Saturday_Dinner", label: "Saturday Dinner" },

    { value: "Sunday_Breakfast", label: "Sunday Breakfast" },
    { value: "Sunday_Lunch", label: "Sunday Lunch" },
    { value: "Sunday_Dinner", label: "Sunday Dinner" },
  ];

  const handleallchange = (e) => {
    if (e.target.checked) {
      setcheckall(true);
      const optimize = all_products.map((item) => {
        item["value"] = true;

        return item;
      });
      dispatch({ type: "Set_table_history", data: optimize });
      setall_productscopy(optimize);
    } else {
      setcheckall(false);
      const optimize = all_products.map((item) => {
        item["value"] = false;
        return item;
      });
      dispatch({ type: "Set_table_history", data: optimize });
      setall_productscopy(optimize);
    }
  };

  const handlecheckboxchange = (cell) => {
    const optimize = all_products.map((item) => {
      if (item.id === cell.id) {
        if (item["value"]) {
          item["value"] = false;
        } else {
          item["value"] = true;
        }
      }
      return item;
    });
    dispatch({ type: "Set_table_history", data: optimize });
    setall_productscopy(optimize);
  };

  const handlesearch = (e) => {
    const value = e.target.value;
    setsearch(value);
    if (value) {
      const sortout = all_products.filter((item) => {
        if (
          item?.name.toLowerCase().includes(value) ||
          item?.name.includes(value) ||
          item?.arabic_name.includes(value)
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
    <>
      {!view_stock ? (
        <Stock_table
          user={user}
          route={route}
          selected_branch={selected_branch}
          current_user={current_user}
          setview_stock={() => {
            setview_stock(!view_stock);
          }}
        />
      ) : (
        <div className="p-3 pt-2">
          <div className="card">
            <div className="card-header d-flex justify-content-between bg-white">
              <h3 className="mt-2 me-2">Add Buffet Menu</h3>
              <div className="mt-2 me-2 d-flex ">
                <Button
                  type="button"
                  className=" me-3"
                  variant="outline-success"
                  size="sm"
                  onClick={(e) => {
                    setview_stock(!view_stock);
                  }}
                >
                  <VisibilityIcon className="me-2" />
                  View
                </Button>
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
                  <SaveIcon /> Update
                </Button>
              </div>
            </div>

            <div className="card-body pt-0">
              <div className="row mt-4">
                <div className="col-md-3">
                  <Select
                    options={allmenu}
                    placeholder={"Menu"}
                    value={menu}
                    funct={(e) => setmenu(e)}
                    required={true}
                  />
                </div>

                <div className="col-md-3">
                  <Select
                    options={alltitle}
                    placeholder={"Buffet Title"}
                    value={title}
                    funct={(e) => settitle(e)}
                    required={true}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-body pt-0">
              <div className="row mt-5">
                <label className="d-flex justify-content-end align-items-end mb-2">
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
                    className="table table-striped table-bordered "
                    style={{ width: "100%" }}
                  >
                    <thead>
                      <tr>
                        <th className="border-0" style={{ width: "5%" }}>
                          <input
                            className="form-check-input m-0 me-2"
                            type="checkbox"
                            checked={checkall}
                            onChange={handleallchange}
                          />
                        </th>
                        <th className="text-center">Name</th>
                        <th className="text-center">اسم الطبق</th>
                      </tr>
                    </thead>
                    <tbody>
                      {all_products.map((item) => {
                        return (
                          <tr key={item.id}>
                            <td className="pt-0 pb-0 ">
                              {item && (
                                <div
                                  className="d-flex align-items-center "
                                  style={{ height: "40px" }}
                                >
                                  <input
                                    className="form-check-input m-0 me-2"
                                    type="checkbox"
                                    checked={item.value}
                                    onChange={() => handlecheckboxchange(item)}
                                  />
                                </div>
                              )}
                            </td>
                            <td className=" pt-0 pb-0 text-center">
                              {item.name}
                            </td>
                            <td className="pt-0 pb-0  text-center">
                              {item.arabic_name}
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
      )}
    </>
  );
}
