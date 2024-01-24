import React, { useState, useEffect, memo } from "react";
import "./branchmanagement.css";
import Select from "react-select";
import Button from "react-bootstrap/Button";
import went_wrong_toast from "../alerts/went_wrong_toast";
import success_toast from "../alerts/success_toast";
import Groupform from "./roleform";
import { useTranslation } from "react-i18next";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@mui/material/TextField";
import Save_button from "../buttons/save_button";
import Red_toast from "../alerts/red_toast";

function RolePermssion(props) {
  const { t } = useTranslation();
  const user = props.state.setuser.user;
  const route = props.state.setuser.route;
  const selected_branch = props.state.Setcurrentinfo.selected_branch;
  const current_user = props.state.Setcurrentinfo.current_user;
  const setActiveTab = props.setActiveTab;
  const dispatch = props.Settable_history;
  const [selected_role, setselected_role] = useState("");
  const setadditionalinfo = props.setadditionalinfo;
  const [allpermissions, setallpermissions] = useState([]);
  const [all_jsonpermissions, setall_jsonpermissions] = useState([]);
  const [showmodel, setshowmodel] = useState(false);

  const [allroles, setallroles] = useState([]);
  const [isloading, setisloading] = useState(false);
  const [status, setstatus] = useState(false);
  const [search, setsearch] = useState("");
  const [allpermissions_copy, setallpermissions_copy] = useState([]);
  const [keys, setkeys] = useState([]);
  const [data_to_send, setdata_to_send] = useState([]);
  const [addcheck, setaddcheck] = useState(false);
  const [changecheck, setchangecheck] = useState(false);
  const [deletecheck, setdeletecheck] = useState(false);
  const [viewcheck, setviewcheck] = useState(false);

  useEffect(() => {
    const fetchallbraches = async () => {
      const response = await fetch(`${route}/api/grouped-permission/`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();
      if (response.ok) {
        Object.keys(json).map((item) => {
          Object.keys(json[item]).map((item2) => {
            json[item][item2].sort((a, b) => {
              const nameA = a.name.toLowerCase();
              const nameB = b.name.toLowerCase();

              if (nameA < nameB) return -1;
              if (nameA > nameB) return 1;
              return 0;
            });
          });
        });

        Object.keys(json).map((item) => {
          Object.keys(json[item]).map((item2) => {
            json[item][item2].map((item3) => {
              item3["value"] = false;
              return item3;
            });
          });
        });

        setkeys(Object.keys(json));

        setall_jsonpermissions(Object.values(json));
        setallpermissions(json);
        setallpermissions_copy(json);
      }
    };

    if (user) {
      fetchallbraches();
    }
  }, []);

  useEffect(() => {
    const fetchalluser = async () => {
      var url = `${route}/api/groups/`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        setallroles(json);
      }
    };

    if (user) {
      fetchalluser();
    }
  }, [status]);

  const handlesubmit = async (e) => {
    e.preventDefault();
    if (!selected_role) {
      Red_toast("Select Role First!");
      return;
    }
    setisloading(true);

    const permissions = data_to_send.map((item) => {
      return item.id;
    });

    const response = await fetch(
      `${route}/api/groups/${selected_role.value.id}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access}`,
        },
        body: JSON.stringify({
          permissions: permissions,
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
    const dummydata = [];
    const permissions = selected_option.value.permissions;
    const optimize = all_jsonpermissions.map((item) => {
      Object.keys(item)?.map((item2) => {
        item[item2]?.map((item3) => {
          if (permissions.includes(item3.id)) {
            item3["value"] = true;
            dummydata.push(item3);
          } else {
            item3["value"] = false;
          }
          return item3;
        });
        return item2;
      });
      return item;
    });
    setdata_to_send(dummydata);
    setall_jsonpermissions(optimize);
  };

  const userlist = allroles.map((item) => {
    return {
      value: item,
      label: item.name,
    };
  });

  const handleallchange = (e, text) => {
    const dummydata = [];
    if (e.target.checked) {
      const optimize = all_jsonpermissions.map((item) => {
        Object.keys(item)?.map((item2) => {
          item[item2]?.map((item3) => {
            if (item3.name === text) {
              item3["value"] = true;
              dummydata.push(item3);
            }
            return item3;
          });
          return item2;
        });
        return item;
      });
      setdata_to_send([...data_to_send, ...dummydata]);
      setall_jsonpermissions(optimize);
    } else {
      const optimize = all_jsonpermissions.map((item) => {
        Object.keys(item)?.map((item2) => {
          item[item2]?.map((item3) => {
            if (item3.name === text) {
              item3["value"] = false;
              dummydata.push(item3.id);
            }
            return item3;
          });
          return item2;
        });
        return item;
      });
      setdata_to_send(
        data_to_send.filter((item) => !dummydata.includes(item.id))
      );
      setall_jsonpermissions(optimize);
    }
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

  const handlechange = (e, row) => {
    if (e.target.checked) {
      row["value"] = true;
      setdata_to_send([...data_to_send, row]);
    } else {
      row["value"] = false;
      setdata_to_send(data_to_send.filter((item) => item !== row.id));
    }
  };

  return (
    <div className="p-3">
      <div className="card">
        <form onSubmit={handlesubmit}>
          <div className="card-header bg-white d-flex justify-content-end">
            <Button
              className="me-2"
              variant="outline-secondary"
              onClick={() => {
                setActiveTab("User");
              }}
            >
              {" "}
              Users
            </Button>
            <Button
              className="me-2"
              variant="outline-success"
              onClick={() => {
                setadditionalinfo(null);
                setActiveTab("Assign Roles");
              }}
            >
              {" "}
              Assign Roles
            </Button>

            <Button
              type="button"
              className="me-2"
              variant="outline-success"
              onClick={() => setshowmodel(!showmodel)}
            >
              <AddIcon className="me-2" />
              Add Role
            </Button>

            <Save_button isloading={isloading} />
          </div>

          <div className="card-body">
            <div className="row">
              <div className="col-md-4">
                <label>
                  <h5>Roles</h5>
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
                <h5 className="m-0">Permissions</h5>
                <TextField
                  label="Search"
                  variant="outlined"
                  value={search}
                  onChange={handlesearch}
                  size="small"
                />
              </label>

              <div className="table-responsive">
                <table className="table table-bordered ">
                  <thead>
                    <tr>
                      <th rowSpan={2}>Name</th>
                      <th>ADD</th>
                      <th>Change</th>
                      <th>Delete</th>
                      <th>View</th>
                    </tr>
                    <tr>
                      <th>
                        <input
                          className="form-check-input m-0 me-2"
                          type="checkbox"
                          checked={addcheck}
                          onChange={(e) => {
                            setaddcheck(e.target.checked);
                            handleallchange(e, "add");
                          }}
                        />
                      </th>
                      <th>
                        <input
                          className="form-check-input m-0 me-2"
                          type="checkbox"
                          checked={changecheck}
                          onChange={(e) => {
                            setchangecheck(e.target.checked);
                            handleallchange(e, "change");
                          }}
                        />
                      </th>
                      <th>
                        <input
                          className="form-check-input m-0 me-2"
                          type="checkbox"
                          checked={deletecheck}
                          onChange={(e) => {
                            setdeletecheck(e.target.checked);
                            handleallchange(e, "delete");
                          }}
                        />
                      </th>
                      <th>
                        <input
                          className="form-check-input m-0 me-2"
                          type="checkbox"
                          checked={viewcheck}
                          onChange={(e) => {
                            setviewcheck(e.target.checked);
                            handleallchange(e, "view");
                          }}
                        />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {all_jsonpermissions?.map((item, index) => {
                      return (
                        <>
                          <tr>
                            <td className="text-danger" colSpan={5}>
                              <strong>{keys[index]}</strong>
                            </td>
                          </tr>

                          {Object.keys(item)?.map((item2) => {
                            return (
                              <tr>
                                <td className="ps-4">{item2}</td>
                                {item[item2]?.map((item3) => {
                                  return (
                                    <td className="ps-4">
                                      <input
                                        className="form-check-input m-0 me-2"
                                        type="checkbox"
                                        checked={item3.value}
                                        onChange={(e) => handlechange(e, item3)}
                                      />
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })}
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </form>
      </div>

      {showmodel && (
        <Groupform
          show={showmodel}
          onHide={() => {
            setshowmodel(false);
            setstatus(!status);
          }}
          roles={allroles}
          route={route}
          user={user}
          current_user={current_user}
        />
      )}
    </div>
  );
}

export default memo(RolePermssion);
