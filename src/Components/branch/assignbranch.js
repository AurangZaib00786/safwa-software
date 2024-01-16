import React, { useState, useEffect, memo } from "react";
import "./account_heads.css";
import Select from "react-select";
import Button from "react-bootstrap/Button";
import went_wrong_toast from "../alerts/went_wrong_toast";
import Update_button from "../buttons/update_button";
import success_toast from "../alerts/success_toast";
import PersonAddIcon from "@material-ui/icons/PersonAdd";

import { useTranslation } from "react-i18next";
import TextField from "@mui/material/TextField";

function Account_head(props) {
  const { t } = useTranslation();
  const user = props.state.setuser.user;
  const route = props.state.setuser.route;
  const selected_branch = props.state.Setcurrentinfo.selected_branch;
  const current_user = props.state.Setcurrentinfo.current_user;
  const setActiveTab = props.setActiveTab;
  const dispatch = props.Settable_history;
  const [selected_role, setselected_role] = useState("");
  const [selected, setSelected] = useState([]);
  const [allpermissions, setallpermissions] = useState([]);
  const [all_jsonpermissions, setall_jsonpermissions] = useState([]);
  const [showmodel, setshowmodel] = useState(false);
  const [allroles, setallroles] = useState([]);
  const [isloading, setisloading] = useState(false);
  const [status, setstatus] = useState(false);
  const [search, setsearch] = useState("");
  const [allpermissions_copy, setallpermissions_copy] = useState([]);

  useEffect(() => {
    const fetchallbraches = async () => {
      const response = await fetch(`${route}/api/user-account-heads/`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();
      if (response.ok) {
        const optimize = json.map((item) => {
          item["value"] = false;
          return item;
        });
        setall_jsonpermissions(optimize);
        const nestedArray = [];

        for (let i = 0; i < optimize.length; i += 2) {
          const subArray = optimize.slice(i, i + 2);

          nestedArray.push({ p_0: subArray[0], p_1: subArray[1] });
        }

        setallpermissions(nestedArray);
        setallpermissions_copy(nestedArray);
      }
    };

    fetchallbraches();
  }, []);

  useEffect(() => {
    const fetchalluser = async () => {
      const response = await fetch(
        `${route}/api/subusers-account-heads/?user_id=${current_user.id}`,
        {
          headers: { Authorization: `Bearer ${user.access}` },
        }
      );
      const json = await response.json();

      if (response.ok) {
        setallroles(json);
      }
    };

    if (current_user) {
      fetchalluser();
    }
  }, [status, current_user]);

  const handlesubmit = async (e) => {
    e.preventDefault();
    setisloading(true);

    const permissions = [];
    all_jsonpermissions.forEach((item) => {
      if (item.value) {
        permissions.push(item.id);
      }
    });

    const response = await fetch(
      `${route}/api/users/${selected_role.value}/assign-account-head/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access}`,
        },
        body: JSON.stringify({
          account_heads: permissions,
        }),
      }
    );
    const json = await response.json();

    if (!response.ok) {
      setisloading(false);
      went_wrong_toast();
    }

    if (response.ok) {
      setisloading(false);
      success_toast();
      setstatus(!status);
    }
  };

  const handleselect = (selected_option) => {
    setselected_role(selected_option);
    const role = allroles.filter((item) => {
      return item.id === selected_option.value;
    });
    const permissions = role[0].account_heads;
    const optimize = all_jsonpermissions.map((item) => {
      if (permissions.includes(item.id)) {
        item["value"] = true;
      } else {
        item["value"] = false;
      }
      return item;
    });
    setall_jsonpermissions(optimize);
    const nestedArray = [];

    for (let i = 0; i < optimize.length; i += 2) {
      const subArray = optimize.slice(i, i + 2);

      nestedArray.push({ p_0: subArray[0], p_1: subArray[1] });
    }

    setallpermissions(nestedArray);
    setallpermissions_copy(nestedArray);
  };

  const userlist = allroles.map((item) => {
    return {
      value: item.id,
      label: item.username,
    };
  });

  const handleallchange = (e) => {
    if (e.target.checked) {
      const optimize = all_jsonpermissions.map((item) => {
        item["value"] = true;

        return item;
      });
      setall_jsonpermissions(optimize);
      const nestedArray = [];

      for (let i = 0; i < optimize.length; i += 2) {
        const subArray = optimize.slice(i, i + 2);

        nestedArray.push({ p_0: subArray[0], p_1: subArray[1] });
      }

      setallpermissions(nestedArray);
      setallpermissions_copy(nestedArray);
    } else {
      const optimize = all_jsonpermissions.map((item) => {
        item["value"] = false;
        return item;
      });
      setall_jsonpermissions(optimize);
      const nestedArray = [];

      for (let i = 0; i < optimize.length; i += 2) {
        const subArray = optimize.slice(i, i + 2);

        nestedArray.push({ p_0: subArray[0], p_1: subArray[1] });
      }

      setallpermissions(nestedArray);
      setallpermissions_copy(nestedArray);
    }
  };

  const handlecheckboxchange = (cell) => {
    const optimize = all_jsonpermissions.map((item) => {
      if (item.id === cell.id) {
        if (item["value"]) {
          item["value"] = false;
        } else {
          item["value"] = true;
        }
      }
      return item;
    });
    setall_jsonpermissions(optimize);
    const nestedArray = [];

    for (let i = 0; i < optimize.length; i += 2) {
      const subArray = optimize.slice(i, i + 2);

      nestedArray.push({ p_0: subArray[0], p_1: subArray[1] });
    }

    setallpermissions(nestedArray);
    setallpermissions_copy(nestedArray);
  };

  const handlesearch = (e) => {
    const value = e.target.value;
    setsearch(value);
    if (value) {
      const sortout = allpermissions_copy.filter((item) => {
        if (
          item.p_0?.name.toLowerCase().includes(value) ||
          item.p_0?.name.includes(value) ||
          item.p_1?.name.toLowerCase().includes(value) ||
          item.p_1?.name.includes(value)
        ) {
          return item;
        }
      });
      setallpermissions(sortout);
    } else {
      setallpermissions(allpermissions_copy);
    }
  };

  return (
    <div className="p-3">
      <div className="card">
        <form onSubmit={handlesubmit}>
          <div className="card-header bg-white d-flex justify-content-end">
            <Button
              className="me-2"
              variant="outline-success"
              onClick={() => {
                setActiveTab("Branch");
              }}
            >
              {" "}
              Branches
            </Button>
            <Update_button isloading={isloading} />
          </div>

          <div className="card-body">
            <div className="row">
              <div className="col-md-4">
                <label>
                  <h5>Users</h5>
                </label>
                <Select
                  className="form-control selector"
                  options={userlist}
                  value={selected_role}
                  onChange={handleselect}
                ></Select>
              </div>
            </div>

            <div className="row mt-5">
              <label className="d-flex justify-content-between align-items-end mb-2">
                <h5 className="m-0">Branches</h5>
                <TextField
                  label="Search"
                  variant="outlined"
                  value={search}
                  onChange={handlesearch}
                  size="small"
                />
              </label>

              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>
                        <input
                          className="form-check-input m-0 me-2"
                          type="checkbox"
                          onChange={handleallchange}
                        />{" "}
                        Check All
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allpermissions.map((item) => {
                      return (
                        <tr key={item.p_0.id}>
                          <td>
                            {item.p_0 && (
                              <div
                                className="d-flex align-items-center "
                                style={{ height: "40px" }}
                              >
                                <input
                                  className="form-check-input m-0 me-2"
                                  type="checkbox"
                                  checked={item.p_0.value}
                                  onChange={() =>
                                    handlecheckboxchange(item.p_0)
                                  }
                                />
                                <h6 className="m-0">{item.p_0.name}</h6>
                              </div>
                            )}
                          </td>

                          <td>
                            {item.p_1 && (
                              <div
                                className="d-flex align-items-center "
                                style={{ height: "40px" }}
                              >
                                <input
                                  className="form-check-input m-0 me-2"
                                  type="checkbox"
                                  checked={item.p_1.value}
                                  onChange={() =>
                                    handlecheckboxchange(item.p_1)
                                  }
                                />
                                <h6 className="m-0">{item.p_1.name}</h6>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default memo(Account_head);
