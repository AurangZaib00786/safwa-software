import React, { useEffect, useState, useRef } from "react";
import "./sale.css";
import Button from "react-bootstrap/Button";
import { IconButton } from "@material-ui/core";
import Spinner from "react-bootstrap/Spinner";
import SaveIcon from "@material-ui/icons/Save";
import Select from "react-select";
import PrintRoundedIcon from "@material-ui/icons/PrintRounded";
import TextField from "@mui/material/TextField";
import InputGroup from "react-bootstrap/InputGroup";
import AddIcon from "@material-ui/icons/Add";
import went_wrong_toast from "../alerts/went_wrong_toast";
import success_toast from "../alerts/success_toast";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import moment from "moment";
function Sale_Edit(props) {
  const user = props.state.setuser.user;
  const { t } = useTranslation();
  const product_selection = useRef(null);
  const setActiveTab = props.setActiveTab;
  const route = props.state.setuser.route;
  const selected_branch = props.state.Setcurrentinfo.selected_branch;
  const current_user = props.state.Setcurrentinfo.current_user;
  const dispatch = props.Settable_history;
  const id_data = JSON.parse(localStorage.getItem("data"));

  const settable_data = props.Setproduct_history;
  const [all_suppliers, setall_suppliers] = useState([]);

  const [sub_total, setsub_total] = useState(id_data.sub_total);
  const [discount_amount, setdiscount_amount] = useState(
    id_data?.discount_amount
  );
  const [discount_percentage, setdiscount_percentage] = useState(
    id_data?.discount_percentage
  );
  const [tax_amount, settax_amount] = useState(id_data.tax_amount);
  const [tax_percentage, settax_percentage] = useState(id_data?.tax_percentage);
  const [total, settotal] = useState(id_data?.total);
  const [invoice, setinvoice] = useState(id_data?.invoice);
  const [date, setdate] = useState(id_data?.date);
  const [supplier, setsupplier] = useState({
    value: id_data?.customer_info.id,
    label: id_data?.customer_info.name,
  });
  const [payment_type, setpayment_type] = useState({
    value: id_data?.payment_type,
    label: id_data?.payment_type,
  });

  const [notes, setnotes] = useState(id_data?.remarks);
  const [isloading, setisloading] = useState(false);

  const [getagain_invoice, setgetagain_invoice] = useState(true);
  const [saleman, setsaleman] = useState({
    value: id_data?.sale_person,
    label: id_data?.sale_person_name,
  });
  const [allsalemans, setallsalemans] = useState([]);
  const [data, setdata] = useState(id_data?.details);
  const [allorders, setallorders] = useState([]);
  const [orders, setorders] = useState("");
  const [pax, setpax] = useState("");
  const [meal_type, setmeal_type] = useState("");
  const [days, setdays] = useState("");
  const [price, setprice] = useState("");
  const [remarks, setremarks] = useState("");
  const order_data_list = id_data?.orders_detail?.map((item) => item.order);

  useEffect(() => {
    dispatch({ type: "Set_menuitem", data: "sale" });
    settable_data({ type: "Set_product_history", data: [] });
  }, []);

  useEffect(() => {
    const fetchorders = async () => {
      var url = `${route}/api/orders/?customer_id=${supplier.value}`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        const supp = json.map((item) => {
          return {
            value: item,
            label: `ID-${String(item.id).padStart(3, "0")}`,
          };
        });
        setallorders(supp);
        const filter_orders = json.filter((item) =>
          order_data_list.includes(item.id)
        );
        setorders(
          filter_orders.map((item) => {
            return {
              value: item,
              label: `ID-${String(item.id).padStart(3, "0")}`,
            };
          })
        );
      }
      if (!response.ok) {
        went_wrong_toast();
      }
    };

    if (supplier) {
      fetchorders();
    }
  }, [supplier]);

  useEffect(() => {
    const fetchSuppliers = async () => {
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
        setall_suppliers(supp);

        // setmerge_flag(json[json.length - 1].merge_billing);
      }
      if (!response.ok) {
        went_wrong_toast();
      }
    };
    const fetchsalesman = async () => {
      var url = `${route}/api/employee/?account_head=${selected_branch.id}`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        setisloading(false);
        const optimize = json.map((item) => {
          return { value: item.id, label: item.name };
        });
        setallsalemans(optimize);
      }
      if (!response.ok) {
        went_wrong_toast();
        setisloading(false);
      }
    };

    if (user) {
      fetchSuppliers();
      fetchsalesman();
    }
  }, [selected_branch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (payment_type.value == "cash") {
      var credit = total;
    } else {
      credit = 0;
    }
    const body = {
      user: current_user.id,

      customer: supplier.value,
      remarks: notes,
      payment_type: payment_type.value,
      date: date,
      invoice: invoice,
      sale_person: saleman.value,
      total: total,
      sub_total: sub_total,
      credit: credit,
      debit: total,
      tax_amount: tax_amount,
      tax_percentage: tax_percentage,
      discount_amount: discount_amount,
      discount_percentage: discount_percentage,
      details: data,
    };

    if (orders) {
      const order_details = orders?.map((item) => {
        if (item.value.order) {
          return { id: item.value.id, order: item.value.order };
        } else if (order_data_list.includes(item.value.id)) {
          const filter_item = id_data?.orders_detail?.filter((fitem) => {
            return fitem.order === item.value.id;
          });

          return { id: filter_item?.shift().id, order: item.value.id };
        }
        return { order: item.value.id };
      });

      body["orders_detail"] = order_details;
    }
    setisloading(true);

    const response = await fetch(`${route}/api/sales/${id_data.id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.access}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      setisloading(false);
      went_wrong_toast();
    }

    if (response.ok) {
      setisloading(false);

      success_toast();
      setinvoice("");
      setsupplier("");
      setnotes("");
      setsaleman("");
      setorders("");
      setdata([]);
      setgetagain_invoice(!getagain_invoice);
      setActiveTab("sale_history");
    }
  };

  const handlePrint = async () => {
    if (payment_type.value == "cash") {
      var credit = total;
    } else {
      credit = 0;
    }
    const body = {
      user: current_user.id,

      customer: supplier.value,
      remarks: notes,
      payment_type: payment_type.value,
      date: date,
      invoice: invoice,
      sale_person: saleman.value,
      total: total,
      sub_total: sub_total,
      credit: credit,
      debit: total,
      tax_amount: tax_amount,
      tax_percentage: tax_percentage,
      discount_amount: discount_amount,
      discount_percentage: discount_percentage,

      details: data,
    };

    if (orders) {
      const order_details = orders?.map((item) => {
        if (item.value.order) {
          return { id: item.value.id, order: item.value.order };
        } else if (order_data_list.includes(item.value.id)) {
          const filter_item = id_data?.orders_detail?.filter((fitem) => {
            return fitem.order === item.value.id;
          });

          return { id: filter_item?.shift().id, order: item.value.id };
        }
        return { order: item.value.id };
      });

      body["orders_detail"] = order_details;
    }
    setisloading(true);
    const response = await fetch(`${route}/api/sales/${id_data.id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.access}`,
      },
      body: JSON.stringify(body),
    });
    const json = await response.json();
    setisloading(false);
    if (!response.ok) {
      went_wrong_toast();
    }

    if (response.ok) {
      setinvoice("");
      setsupplier("");
      setnotes("");
      setsaleman("");
      setorders("");
      setdata([]);
      setgetagain_invoice(!getagain_invoice);
      success_toast();
      localStorage.setItem("data", JSON.stringify(json));
      window.open("/invoice/sales", "_blank");
      setActiveTab("sale_history");
    }
  };
  const selectStyles = {
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };

  const handleaddfromorder = (e) => {
    setorders(e);

    var breakfast = 0;
    var lunch = 0;
    var dinner = 0;

    e.map((item2) => {
      item2?.value?.details?.map((item) => {
        breakfast = breakfast + Number(item.breakfast);
        lunch += Number(item.launch);
        dinner += Number(item.dinner);
      });
    });

    const new_data = [];
    if (breakfast > 0) {
      new_data.push({
        pax: breakfast,
        meal_type: "breakfast",
        days: 0,
        price: 0,
        total: 0,
        description: "",
      });
    }
    if (lunch > 0) {
      new_data.push({
        pax: lunch,
        meal_type: "lunch",
        days: 0,
        price: 0,
        total: 0,
        description: "",
      });
    }

    if (dinner > 0) {
      new_data.push({
        pax: dinner,
        meal_type: "dinner",
        days: 0,
        price: 0,
        total: 0,
        description: "",
      });
    }

    setdata(new_data);

    setpax("");
    setremarks("");
    setmeal_type("");
    setdays("");
    setprice("");
  };

  const handleadd = (e) => {
    e.preventDefault();
    const filter_data = data.filter(
      (item) => item.meal_type === meal_type.value
    );

    if (filter_data.length > 0) {
      setdata(
        data.map((item) => {
          if (item.meal_type === meal_type.value) {
            return {
              pax: Number(pax) + Number(item.pax),
              meal_type: meal_type.value,
              days: days,
              price: price,
              total: Number(price) * Number(days),
              description: remarks,
            };
          } else {
            return item;
          }
        })
      );
    } else {
      setdata([
        ...data,
        {
          pax: pax,
          meal_type: meal_type.value,
          days: days,
          price: price,
          total: Number(price) * Number(days),
          description: remarks,
        },
      ]);
    }
    setpax("");
    setremarks("");
    setmeal_type("");
    setdays("");
    setprice("");
  };

  const handledelete = (type) => {
    setdata(data.filter((item) => item.meal_type !== type));
  };

  const handlechange = (type, value, column) => {
    const optimize = data.map((item) => {
      if (item.meal_type === type) {
        switch (column) {
          case "remarks":
            item["description"] = value;
            return item;
          case "days":
            item["days"] = value;
            item["total"] = Number(value) * Number(item.price);
            return item;
          case "price":
            item["price"] = value;
            item["total"] = Number(value) * Number(item.days);
            return item;
        }
      }
      return item;
    });

    setdata(optimize);
  };

  useEffect(() => {
    if (data.length > 0) {
      var sub_total_total = 0;

      data.map((item) => {
        sub_total_total += Number(item.total);
      });

      setsub_total(sub_total_total);
      settotal(sub_total_total + Number(tax_amount) - Number(discount_amount));
    }
  }, [data]);

  return (
    <div className="p-3">
      <div className="card" style={{ minHeight: "100vh" }}>
        <div className="card-header  d-flex justify-content-end">
          <Button
            onClick={handleSubmit}
            variant="outline-primary"
            disabled={!(data.length > 0 && supplier && saleman && payment_type)}
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
            className="ms-2"
            variant="outline-success"
            onClick={handlePrint}
            disabled={!(data.length > 0 && supplier && saleman && payment_type)}
          >
            <PrintRoundedIcon /> {t("print")}
          </Button>
        </div>

        <div className="card-body  ">
          <div className="row    mt-1">
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
                size="small"
              />
            </div>

            <div className="col-6 col-md-2 mb-2">
              <TextField
                className="form-control   mb-3"
                id="outlined-basic"
                label="Invoice"
                value={invoice}
                size="small"
                required
              />
            </div>

            <div className="col-6 col-md-2 mb-2">
              <Select
                className={
                  supplier
                    ? "form-control selector customer"
                    : "form-control selector"
                }
                styles={selectStyles}
                options={all_suppliers}
                placeholder={"Customers"}
                value={supplier}
                autoFocus
                onChange={(e) => {
                  setsupplier(e);
                }}
                required
              ></Select>
            </div>
            <div className="col-6 col-md-2 mb-2">
              <Select
                isMulti
                className={
                  orders
                    ? "form-control selector orders"
                    : "form-control selector"
                }
                styles={selectStyles}
                options={allorders}
                placeholder={"Orders"}
                value={orders}
                autoFocus
                onChange={handleaddfromorder}
                required
              ></Select>
            </div>

            <div className="col-6 col-md-2 mb-2">
              <Select
                className={
                  payment_type
                    ? "form-control selector payment"
                    : "form-control selector"
                }
                styles={selectStyles}
                options={[
                  { value: "cash", label: "Cash" },
                  { value: "credit", label: "Credit" },
                ]}
                placeholder={"Payment Type"}
                value={payment_type}
                onChange={(e) => {
                  setpayment_type(e);
                }}
                required
              ></Select>
            </div>
            <div className="col-6 col-md-2 mb-2">
              <Select
                className={
                  saleman !== ""
                    ? "form-control selector saleman"
                    : "form-control selector"
                }
                styles={selectStyles}
                options={allsalemans}
                placeholder={"Sale Persons"}
                value={saleman}
                onChange={(e) => {
                  setsaleman(e);
                }}
              ></Select>
            </div>
          </div>
          <form onSubmit={handleadd}>
            <table className="table ">
              <thead>
                <tr>
                  <th className="p-0">Description</th>
                  <th className="p-0">Pax</th>
                  <th className="p-0">Meal Type</th>
                  <th className="p-0">Days</th>
                  <th className="p-0">Price</th>
                  <th className="p-0">Total</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((item, index) => {
                  return (
                    <tr key={item.meal_type} className="border-0">
                      <td className="col-2 p-0 border-0">
                        <TextField
                          className="form-control"
                          value={item.description}
                          size="small"
                          onChange={(e) => {
                            handlechange(
                              item.meal_type,
                              e.target.value,
                              "remarks"
                            );
                          }}
                        />
                      </td>
                      <td className="col-2 p-0 border-0">
                        <TextField
                          className="form-control"
                          value={item.pax}
                          size="small"
                        />
                      </td>
                      <td className="col-2 p-0 border-0">
                        <TextField
                          className="form-control"
                          value={item.meal_type}
                          size="small"
                        />
                      </td>

                      <td className="col-2 p-0 border-0">
                        <TextField
                          className="form-control"
                          value={item.days}
                          size="small"
                          onChange={(e) => {
                            handlechange(
                              item.meal_type,
                              e.target.value,
                              "days"
                            );
                          }}
                        />
                      </td>
                      <td className="col-2 p-0 border-0">
                        <TextField
                          className="form-control"
                          value={item.price}
                          size="small"
                          onChange={(e) => {
                            handlechange(
                              item.meal_type,
                              e.target.value,
                              "price"
                            );
                          }}
                        />
                      </td>
                      <td className="col-2 p-0 border-0">
                        <InputGroup>
                          <TextField
                            className="form-control"
                            value={item.total}
                            size="small"
                          />
                          <IconButton
                            className="p-0 ps-2 pe-2"
                            style={{
                              backgroundColor: "red",
                              borderRadius: "0",
                            }}
                            onClick={() => handledelete(item.meal_type)}
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
                      </td>
                    </tr>
                  );
                })}
                <tr className="border-0">
                  <td className="col-2 p-0 border-0">
                    <TextField
                      className="form-control"
                      value={remarks}
                      placeholder="Description"
                      onChange={(e) => {
                        setremarks(e.target.value);
                      }}
                      size="small"
                    />
                  </td>
                  <td className="col-2 p-0 border-0">
                    <TextField
                      type="number"
                      className="form-control"
                      value={pax}
                      placeholder="Pax"
                      onChange={(e) => {
                        setpax(e.target.value);
                      }}
                      size="small"
                      required
                    />
                  </td>
                  <td className="col-2 p-0 border-0">
                    <Select
                      className={"form-control selector"}
                      styles={selectStyles}
                      options={[
                        { value: "breakfast", label: "Breakfast" },
                        { value: "lunch", label: "Lunch" },
                        { value: "dinner", label: "Dinner" },
                      ]}
                      value={meal_type}
                      onChange={(e) => {
                        setmeal_type(e);
                      }}
                      required
                    ></Select>
                  </td>

                  <td className="col-2 p-0 border-0">
                    <TextField
                      type="number"
                      className="form-control"
                      value={days}
                      placeholder="Days"
                      onChange={(e) => {
                        setdays(e.target.value);
                      }}
                      size="small"
                      required
                    />
                  </td>
                  <td className="col-2 p-0 border-0">
                    <TextField
                      type="number"
                      className="form-control"
                      value={price}
                      placeholder="Price"
                      onChange={(e) => {
                        setprice(e.target.value);
                      }}
                      size="small"
                      required
                    />
                  </td>
                  <td className="col-2 p-0 border-0">
                    <InputGroup>
                      <TextField
                        className="form-control"
                        value={Number(price) * Number(days)}
                        placeholder="Total"
                        size="small"
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
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
        <div className="card-footer row ms-1 me-1">
          <div className="col-6 col-sm-2 ">
            <TextField
              type="number"
              className="form-control"
              id="outlined-basic"
              label={t("subtotal")}
              value={sub_total}
              size="small"
              disabled
            />
          </div>

          <div className="col-6 col-sm-2 ">
            <TextField
              type="number"
              className="form-control"
              id="outlined-basic"
              label="Disc. %"
              value={discount_percentage}
              onChange={(e) => {
                setdiscount_percentage(e.target.value);
                const amount = Number((sub_total / 100) * e.target.value);
                setdiscount_amount(amount.toFixed(2));
                settotal(
                  (Number(sub_total) + Number(tax_amount) - amount).toFixed(2)
                );
              }}
              size="small"
            />
          </div>

          <div className="col-6 col-sm-2 ">
            <TextField
              type="number"
              className="form-control "
              id="outlined-basic"
              label="Disc. Amount"
              value={discount_amount}
              onChange={(e) => {
                setdiscount_amount(e.target.value);
                const perc = Number((e.target.value / sub_total) * 100);
                setdiscount_percentage(perc.toFixed(2));
                settotal(
                  (
                    Number(sub_total) +
                    Number(tax_amount) -
                    Number(e.target.value)
                  ).toFixed(2)
                );
              }}
              size="small"
            />
          </div>
          <div className="col-6 col-sm-2 ">
            <TextField
              type="number"
              className="form-control"
              id="outlined-basic"
              label="Tax %"
              value={tax_percentage}
              onChange={(e) => {
                settax_percentage(e.target.value);
                const amount = Number((sub_total / 100) * e.target.value);
                settax_amount(amount.toFixed(2));
                settotal(
                  (
                    Number(sub_total) +
                    Number(amount) -
                    Number(discount_amount)
                  ).toFixed(2)
                );
              }}
              size="small"
            />
          </div>

          <div className="col-6 col-sm-2 ">
            <TextField
              type="number"
              className="form-control "
              id="outlined-basic"
              label="Tax Amount"
              value={tax_amount}
              onChange={(e) => {
                settax_amount(e.target.value);

                const perc = Number((e.target.value / sub_total) * 100);
                settax_percentage(perc.toFixed(2));
                settotal(
                  (
                    Number(sub_total) -
                    Number(discount_amount) +
                    Number(e.target.value)
                  ).toFixed(2)
                );
              }}
              size="small"
            />
          </div>

          <div className="col-6 col-sm-2 ">
            <TextField
              type="number"
              className="form-control "
              id="outlined-basic"
              label={t("total")}
              value={total}
              onChange={(e) => {
                settotal(e.target.value);
              }}
              size="small"
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Sale_Edit;
