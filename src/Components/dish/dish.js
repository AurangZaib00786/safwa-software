import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import "./dish.css";
import Select from "../alerts/select";
import { IconButton } from "@material-ui/core";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import Red_toast from "../alerts/red_toast";
import Spinner from "react-bootstrap/Spinner";
import Alert_before_delete from "../../Container/alertContainer";
import InputGroup from "react-bootstrap/InputGroup";
import AddIcon from "@material-ui/icons/Add";
import { useTranslation } from "react-i18next";
import TextField from "@mui/material/TextField";
import success_toast from "../alerts/success_toast";
import SaveIcon from "@material-ui/icons/Save";
import ClearIcon from "@material-ui/icons/Clear";
import Dish_View from "./viewdishes";

export default function Dish(props) {
  const { t } = useTranslation();
  const user = props.state.setuser.user;
  const route = props.state.setuser.route;
  const selected_branch = props.state.Setcurrentinfo.selected_branch;
  const setActiveTab = props.setActiveTab;
  const all_products = props.state.Settablehistory.table_history;
  const dispatch = props.Settable_history;

  const inputFile = useRef(null);
  const [submenu, setsubmenu] = useState("");
  const [name, setname] = useState("");
  const [arabicname, setarabicname] = useState("");
  const [menu, setmenu] = useState("");
  const [allmenu, setallmenu] = useState([]);
  const [allsubmenu, setallsubmenu] = useState([]);
  const [isloading, setisloading] = useState(false);
  const [check_update, setcheck_update] = useState(true);
  const [view, setview] = useState(false);

  useEffect(() => {
    const fetchWorkouts = async () => {
      dispatch({ type: "Set_table_history", data: [] });
      setisloading(true);
      var url = `${route}/api/dishes/`;
      if (menu) {
        url = `${url}?menu_id=${menu.value}`;
        if (submenu) {
          url = `${url}&sub_menu_id=${submenu.value}`;
        }
      } else if (submenu) {
        url = `${url}?sub_menu_id=${submenu.value}`;
      }

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        setisloading(false);
        dispatch({ type: "Set_table_history", data: json });
      }
      if (!response.ok) {
        var error = Object.keys(json);
        if (error.length > 0) {
          Red_toast(`${error[0]}:${json[error[0]]}`);
        }
        setisloading(false);
      }
    };

    if (menu || submenu) {
      fetchWorkouts();
    }
  }, [menu, submenu]);

  useEffect(() => {
    dispatch({ type: "Set_menuitem", data: "dish" });
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

  useEffect(() => {
    const fetchsubmenu = async () => {
      var url = `${route}/api/sub-menu/`;
      if (menu) {
        url = `${url}?menu_id=${menu.value}`;
      }

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        const optimize = json.map((item) => {
          return { value: item.id, label: item.name };
        });

        setallsubmenu(optimize);
      }
    };

    if (user) {
      fetchsubmenu();
    }
  }, [menu]);

  const handlesubmit = async (e) => {
    e.preventDefault();
    if (check_update) {
      setisloading(true);

      const optimize = all_products.map((item) => {
        delete item["sub_menu_name"];
        delete item["menu_name"];
        return item;
      });

      const response = await fetch(`${route}/api/bulk-dishes/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access}`,
        },
        body: JSON.stringify(optimize),
      });
      const json = await response.json();

      if (!response.ok) {
        setisloading(false);
        var error = Object.keys(json);
        if (error.length > 0) {
          Red_toast(`${error[0]}:${json[error[0]]}`);
        }
      }

      if (response.ok) {
        setisloading(false);
        dispatch({ type: "Set_table_history", data: json });
        success_toast();
        setname("");
        setarabicname("");
      }
    }
  };

  const handleadd = (e) => {
    e.preventDefault();
    if (menu && submenu) {
      dispatch({
        type: "Create_table_history",
        data: {
          sub_menu: submenu.value,
          menu: menu.value,
          name: name,
          arabic_name: arabicname,
          menu_name: menu.label,
          sub_menu_name: submenu.label,
        },
      });
      setname("");
      setarabicname("");
    } else {
      Red_toast("Select Menu and Submenu First!");
    }
  };

  const onButtonClick = () => {
    // `current` points to the mounted file input element
    inputFile.current.click();
  };

  const handleimageselection = (event) => {
    const file = event.target.files[0];

    if (file) {
      handlefileupload(file);
    }
  };

  const handlefileupload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${route}/api/upload-dishes/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.access}`,
      },
      body: formData,
    });
    const json = await response.json();

    if (!response.ok) {
      var error = Object.keys(json);
      if (error.length > 0) {
        Red_toast(`${error[0]}:${json[error[0]]}`);
      }
    }

    if (response.ok) {
      success_toast();
    }
  };

  return (
    <>
      {!view ? (
        <div className="p-3 pt-2">
          <div className="card">
            <div className="card-header d-flex justify-content-between bg-white">
              <h3 className="mt-2 me-2">Add Dish</h3>
              <div className="mt-2 me-2 d-flex">
                <Button
                  className="me-2"
                  variant="outline-dark"
                  onClick={() => {
                    setActiveTab("Menu");
                  }}
                >
                  {" "}
                  Menu
                </Button>
                <Button
                  className="me-2"
                  variant="outline-secondary"
                  onClick={() => {
                    setActiveTab("Submenu");
                  }}
                >
                  {" "}
                  SubMenu
                </Button>
                <Button
                  className="me-2"
                  variant="outline-success"
                  onClick={() => {
                    setview(true);
                  }}
                >
                  {" "}
                  View
                </Button>
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
                  <SaveIcon /> {t("save")}
                </Button>
                {/* <div>
              <input
                onChange={handleimageselection}
                id="select-file"
                type="file"
                accept=".csv,.xml"
                ref={inputFile}
                style={{ display: "none" }}
              />

              <Button
                className="me-2"
                variant="outline-primary"
                onClick={onButtonClick}
              >
                {t("Import File")}
              </Button>
            </div> */}
              </div>
            </div>

            <div className="card-body pt-0" style={{ minHeight: "100vh" }}>
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
                    options={allsubmenu}
                    placeholder={"Sub Menu"}
                    value={submenu}
                    funct={(e) => setsubmenu(e)}
                    required={true}
                  />
                </div>
              </div>

              <div className="mb-4">
                <table className="table">
                  <thead className="border-0 ">
                    <tr>
                      <th className="d-flex align-items-center border-0 p-0">
                        <h6 className="col-3 p-2 ps-0 pb-0 ">Name</h6>
                        <h6 className=" col-3  p-2 pb-0 ">اسم الطبق</h6>
                      </th>
                    </tr>
                    {all_products.map((item) => {
                      return (
                        <tr key={item.name}>
                          <th className="d-flex align-items-center p-0 border-0">
                            <div className="col-3">
                              <TextField
                                className="form-control"
                                size="small"
                                value={item.name}
                              />
                            </div>

                            <div className="col-3">
                              <InputGroup>
                                <TextField
                                  className="form-control"
                                  size="small"
                                  value={item.arabic_name}
                                />

                                <IconButton
                                  className="p-0 ps-2 pe-2"
                                  style={{
                                    backgroundColor: "red",
                                    borderRadius: "0",
                                  }}
                                  onClick={() => {
                                    dispatch({
                                      type: "Delete_table_history",
                                      data: { row: item, filter: "name" },
                                    });
                                  }}
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
                        <form onSubmit={handleadd} className="d-flex ">
                          <div className="col-3">
                            <TextField
                              placeholder={"Name"}
                              size="small"
                              className="form-control"
                              value={name}
                              onChange={(e) => {
                                setname(e.target.value);
                              }}
                              required
                            />
                          </div>
                          <div className="col-3">
                            <InputGroup>
                              <TextField
                                placeholder={"اسم الطبق"}
                                size="small"
                                className="form-control"
                                value={arabicname}
                                onChange={(e) => {
                                  setarabicname(e.target.value);
                                }}
                                required
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
      ) : (
        <Dish_View
          user={user}
          route={route}
          setview={() => {
            setview(!view);
          }}
        />
      )}
    </>
  );
}
