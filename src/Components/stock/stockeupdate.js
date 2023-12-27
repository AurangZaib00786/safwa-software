import React, { useState, useEffect, memo } from "react";
import "./stock.css";
import Select from "../alerts/select";
import Button from "react-bootstrap/Button";
import { ToastContainer } from "react-toastify";
import Red_toast from "../alerts/red_toast";
import Update_button from "../buttons/update_button";
import success_toast from "../alerts/success_toast";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import Spinner from "react-bootstrap/Spinner";
import VisibilityIcon from "@material-ui/icons/Visibility";
import TextField from "@mui/material/TextField";
import Stock_table from "./stock";

function StockUpdate(props) {
  const user = props.state.setuser.user;
  const route = props.state.setuser.route;
  const selected_branch = props.state.Setcurrentinfo.selected_branch;
  const current_user = props.state.Setcurrentinfo.current_user;
  const settings = props.state.Setcurrentinfo.settings;
  const dispatch = props.Settable_history;
  const [allproducts, setallproducts] = useState([]);
  const [view_stock, setview_stock] = useState(false);
  const [isloading, setisloading] = useState(false);
  const [status, setstatus] = useState(false);
  const [search, setsearch] = useState("");
  const [allproducts_copy, setallproducts_copy] = useState([]);
  const [stock, setstock] = useState([]);
  const [allchecked, setallchecked] = useState(false);
  const [store, setstore] = useState("");
  const [allstore, setallstore] = useState([]);

  useEffect(() => {
    dispatch({ type: "Set_menuitem", data: "store" });
    const fetchstore = async () => {
      var url = `${route}/api/stores/`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        const optimize = json.map((item) => {
          return { value: item.id, label: item.name };
        });
        setallstore(optimize);
      }
      if (!response.ok) {
      }
    };

    if (user) {
      fetchstore();
    }
  }, []);

  useEffect(() => {
    const fetchstock = async () => {
      var url = `${route}/api/stock/?account_head=${selected_branch.id}`;
      if (store.value !== "all") {
        url = `${url}&store_id=${store.value}`;
      }

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();
      if (response.ok) {
        setstock(json);
      }
    };

    if (store) {
      fetchstock();
    }
  }, [selected_branch, status, store]);

  useEffect(() => {
    const fetchallproducts = async () => {
      var url = `${route}/api/products/`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();
      if (response.ok) {
        const optimize = json.map((item, index) => {
          const item2 = stock.filter((item_2) => {
            return item_2.product === item.id;
          });

          if (item2.length > 0) {
            return {
              id: item2[0].id,
              product: item.id,
              name: item.name,
              category_name: item.category_name,
              value: true,
              offer_rate: item2[0].offer_rate,
              sale_rate: item2[0].sale_rate,

              percentage: item2[0].percentage,
            };
          } else {
            return {
              product: item.id,
              name: item.name,
              category_name: item.category_name,
              value: false,
              offer_rate: 0,
              sale_rate: 0,

              percentage: 0,
            };
          }
        });

        setallproducts(optimize);
        setallproducts_copy(optimize);
      }
    };
    if (stock) {
      fetchallproducts();
    }
  }, [stock]);

  const handlesubmit = async (e) => {
    e.preventDefault();
    setisloading(true);

    const stock = [];
    allproducts_copy.forEach((item) => {
      if (item.value) {
        delete item["name"];
        delete item["category_name"];
        delete item["value"];
        item["account_head"] = selected_branch.id;
        item["store"] = store.value;
        stock.push(item);
      }
    });

    const response = await fetch(`${route}/api/stock-bulk/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.access}`,
      },
      body: JSON.stringify({
        stock: stock,
        store: store.value,
        account_head: selected_branch.id,
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
      setisloading(false);
      success_toast();
      setstatus(!status);
      setallchecked(false);
    }
  };

  const handleallchange = (e) => {
    if (e.target.checked) {
      setallchecked(true);
      const optimize = allproducts.map((item) => {
        item["value"] = true;

        return item;
      });

      setallproducts(optimize);
      setallproducts_copy(optimize);
    } else {
      setallchecked(false);
      const optimize = allproducts.map((item) => {
        item["value"] = false;
        return item;
      });

      setallproducts(optimize);
      setallproducts_copy(optimize);
    }
  };

  const handlecheckboxchange = (cell) => {
    const optimize = allproducts.map((item) => {
      if (item.product === cell.product) {
        if (item["value"]) {
          item["value"] = false;
        } else {
          item["value"] = true;
        }
      }
      return item;
    });

    setallproducts_copy(optimize);
    setallproducts(optimize);
  };

  const handlesearch = (e) => {
    const value = e.target.value;
    setsearch(value);
    if (value) {
      const sortout = allproducts_copy.filter((item) => {
        if (
          item?.name.toLowerCase().includes(value) ||
          item?.name.includes(value) ||
          item?.name.toLowerCase().includes(value) ||
          item?.name.includes(value)
        ) {
          return item;
        }
      });
      setallproducts(sortout);
    } else {
      setallproducts(allproducts_copy);
    }
  };

  const handlesalerate = (e, selected_item) => {
    const optimize = allproducts.map((item) => {
      if (item.product === selected_item.product) {
        item["sale_rate"] = e.target.value;
      }
      return item;
    });
    setallproducts(optimize);
    setallproducts_copy(optimize);
  };

  const handleofferrate = (e, selected_item) => {
    const optimize = allproducts.map((item) => {
      if (item.product === selected_item.product) {
        item["offer_rate"] = e.target.value;
      }
      return item;
    });
    setallproducts(optimize);
    setallproducts_copy(optimize);
  };

  const handlepercentage = (e, selected_item) => {
    const optimize = allproducts.map((item) => {
      if (item.product === selected_item.product) {
        item["percentage"] = e.target.value;
      }
      return item;
    });
    setallproducts(optimize);
    setallproducts_copy(optimize);
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
        <div className="p-3">
          <div className="card">
            <form onSubmit={handlesubmit}>
              <div className="card-header bg-white d-flex justify-content-end">
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
                <Update_button isloading={isloading} />
              </div>

              <div className="card-body">
                <div className="d-sm-flex justify-content-between align-items-center mt-3">
                  <div className="col-md-2">
                    <Select
                      options={allstore}
                      placeholder={"Select Store..."}
                      value={store}
                      funct={(e) => setstore(e)}
                      required={true}
                    />
                  </div>
                </div>
                <div className="row">
                  <label className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="m-0">Stock</h5>
                    <TextField
                      label="Search"
                      variant="outlined"
                      value={search}
                      onChange={handlesearch}
                      size="small"
                    />
                  </label>

                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>
                            <input
                              className="form-check-input m-0 me-2"
                              type="checkbox"
                              checked={allchecked}
                              onChange={handleallchange}
                            />{" "}
                            Check All
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {allproducts.map((item) => {
                          return (
                            <tr key={item.product}>
                              <td>
                                {item && (
                                  <div
                                    className="d-flex align-items-center "
                                    style={{ height: "40px" }}
                                  >
                                    <input
                                      className="form-check-input m-0 me-2"
                                      type="checkbox"
                                      checked={item.value}
                                      onChange={() =>
                                        handlecheckboxchange(item)
                                      }
                                    />
                                    <div
                                      className=" d-flex"
                                      style={{ zoom: ".8" }}
                                    >
                                      <h5
                                        className="border rounded border-secondary p-2 pb-1 m-0"
                                        style={{ width: "30rem" }}
                                      >
                                        {item.category_name}
                                      </h5>
                                      <h5
                                        className="border rounded border-secondary p-2 pb-1 m-0"
                                        style={{ width: "30rem" }}
                                      >
                                        {item.name}
                                      </h5>
                                      <TextField
                                        type="number"
                                        label="Sale Rate"
                                        size="small"
                                        value={item.sale_rate}
                                        onChange={(e) => {
                                          handlesalerate(e, item);
                                        }}
                                      />
                                      <TextField
                                        type="number"
                                        label="Offer Rate"
                                        size="small"
                                        value={item.offer_rate}
                                        onChange={(e) => {
                                          handleofferrate(e, item);
                                        }}
                                      />
                                      <TextField
                                        type="number"
                                        label="Tax %"
                                        size="small"
                                        value={item.percentage}
                                        onChange={(e) => {
                                          handlepercentage(e, item);
                                        }}
                                      />
                                    </div>
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
      )}
    </>
  );
}

export default memo(StockUpdate);
