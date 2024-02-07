import React, { useEffect, useState, useRef } from "react";
import "./Purchase.css";
import Button from "react-bootstrap/Button";
import { IconButton } from "@material-ui/core";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import BootstrapTable from "react-bootstrap-table-next";
import Spinner from "react-bootstrap/Spinner";
import SaveIcon from "@material-ui/icons/Save";
import ToolkitProvider, {
  CSVExport,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import cellEditFactory from "react-bootstrap-table2-editor";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import Select from "react-select";
import PrintRoundedIcon from "@material-ui/icons/PrintRounded";

import TextField from "@mui/material/TextField";

import InputGroup from "react-bootstrap/InputGroup";
import AddIcon from "@material-ui/icons/Add";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarcode } from "@fortawesome/free-solid-svg-icons";
import { faTag } from "@fortawesome/free-solid-svg-icons";
import { faListOl } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer } from "react-toastify";
import success_toast from "../alerts/success_toast";
import Red_toast from "../alerts/red_toast";
import Tooltip from "@material-ui/core/Tooltip";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import moment from "moment";

function Purchase(props) {
  const user = props.state.setuser.user;
  const { t } = useTranslation();
  const product_selection = useRef(null);
  const route = props.state.setuser.route;
  const selected_branch = props.state.Setcurrentinfo.selected_branch;
  const current_user = props.state.Setcurrentinfo.current_user;
  const invoice_type = props.state.Setcurrentinfo.invoice_type;
  const dispatch = props.Settable_history;
  const settings = props.state.Setcurrentinfo.settings;
  const table_data = props.state.Setproducthistory.product_history;
  const settable_data = props.Setproduct_history;

  const [all_product_option, setall_product_option] = useState([]);
  const [all_product, setall_product] = useState([]);
  const [all_suppliers, setall_suppliers] = useState([]);

  const [text, settext] = useState("");
  const [url, seturl] = useState("");
  var curdate = moment().format().substring(0, 10);
  const [invoice, setinvoice] = useState("");
  const [date, setdate] = useState(curdate);
  const [refernce_invoice, setrefernce_invoice] = useState("");
  const [supplier, setsupplier] = useState("");
  const [payment_type, setpayment_type] = useState("");

  const [notes, setnotes] = useState("");

  const [showmodel, setshowmodel] = useState(false);
  const [isloading, setisloading] = useState(false);
  const [print, setprint] = useState(false);
  const [product, setproduct] = useState("");
  const [suppliers_data, setsuppliers_data] = useState([]);
  const [data, setdata] = useState([]);

  const [company, setcompany] = useState({ value: "all", label: "All" });
  const [allcompanies, setallcompanies] = useState([]);
  const [getagain_invoice, setgetagain_invoice] = useState(true);

  const [sub_total, setsub_total] = useState("");
  const [discount_amount, setdiscount_amount] = useState("");
  const [discount_percentage, setdiscount_percentage] = useState("");
  const [tax_amount, settax_amount] = useState("");
  const [tax_percentage, settax_percentage] = useState("");
  const [total, settotal] = useState("");
  const [quantity, setquantity] = useState("");
  const [price, setprice] = useState("");

  const [sub_total_total, setsub_total_total] = useState("");
  const [total_total, settotal_total] = useState("");
  const [total_discount, settotal_discount] = useState("");
  const [total_tax, settotal_tax] = useState("");

  useEffect(() => {
    const fetchcompany = async () => {
      var url = `${route}/api/stores/`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        const pro = json.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
        pro.splice(0, 0, { value: "all", label: "All" });
        setallcompanies(pro);
      }
      if (!response.ok) {
        var error = Object.keys(json);
        if (error.length > 0) {
          Red_toast(`${json[error[0]]}`);
        }
      }
    };

    if (user) {
      fetchcompany();
    }
  }, []);

  useEffect(() => {
    const fetchinvoice = async () => {
      const response = await fetch(
        `${route}/api/purchases/${selected_branch.id}/latest-invoice/`,
        {
          headers: { Authorization: `Bearer ${user.access}` },
        }
      );
      const json = await response.json();

      if (response.ok) {
        setinvoice(json.invoice_number);
      }
      if (!response.ok) {
        var error = Object.keys(json);
        if (error.length > 0) {
          Red_toast(`${json[error[0]]}`);
        }
      }
    };

    if (user) {
      fetchinvoice();
    }
  }, [selected_branch, getagain_invoice]);

  useEffect(() => {
    dispatch({ type: "Set_menuitem", data: "purchase" });
    settable_data({ type: "Set_product_history", data: [] });
  }, []);

  useEffect(() => {
    if (invoice && supplier && payment_type && table_data.length > 0) {
      setprint(true);
    } else {
      setprint(false);
    }
  }, [invoice, supplier, payment_type, table_data]);

  useEffect(() => {
    settable_data({ type: "Set_product_history", data: [] });
    const fetchProducts = async () => {
      var url = `${route}/api/stock/?account_head=${selected_branch.id}`;

      if (company.value !== "all") {
        url = `${url}&store_id=${company.value}`;
      }
      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        setall_product(json);
        const pro = json.map((item) => {
          return {
            value: item,
            label: item.product_name,
          };
        });
        setall_product_option(pro);
      }
      if (!response.ok) {
        var error = Object.keys(json);
        if (error.length > 0) {
          Red_toast(`${json[error[0]]}`);
        }
      }
    };

    if (user) {
      fetchProducts();
    }
  }, [selected_branch, company]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      var url = `${route}/api/parties/?account_head=${selected_branch.id}&type=supplier`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        setsuppliers_data(json);
        const supp = json.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
        setall_suppliers(supp);
      }
      if (!response.ok) {
        var error = Object.keys(json);
        if (error.length > 0) {
          Red_toast(`${json[error[0]]}`);
        }
      }
    };

    if (user) {
      fetchSuppliers();
    }
  }, [selected_branch]);

  useEffect(() => {
    if (data.length > 0) {
      var tax_total = 0;
      var subtotal_total = 0;

      var total_total = 0;
      data.forEach((item) => {
        tax_total += Number(item.tax_amount);
        subtotal_total += Number(item.sub_total);

        total_total += Number(item.total);
      });
      setsub_total_total(subtotal_total);

      settotal_tax(tax_total);
      settotal_total(total_total);
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selected_branch && table_data) {
      setisloading(true);

      if (payment_type.value == "cash") {
        var debit = total_total;
      } else {
        debit = 0;
      }
      const response = await fetch(`${route}/api/purchases/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access}`,
        },
        body: JSON.stringify({
          reference: "PB",
          user: current_user.id,
          reference_invoice: refernce_invoice,
          account_head: selected_branch.id,
          supplier: supplier.value,
          remarks: notes,
          payment_type: payment_type.value,
          date: date,
          invoice: invoice,
          sub_total: sub_total_total,
          tax_amount: total_tax,
          tax_percentage: tax_percentage,
          discount_amount: 0,
          discount_percentage: 0,
          total: total_total,
          credit: total_total,
          debit: debit,
          details: data,
        }),
      });
      if (response.status === 500) {
        Red_toast("There is 500 error in server");
      }
      setisloading(false);
      const json = await response.json();

      if (!response.ok) {
        var error = Object.keys(json);
        if (error.length > 0) {
          Red_toast(`${error[0]}:${json[error[0]]}`);
        }
      }

      if (response.ok) {
        setgetagain_invoice(!getagain_invoice);

        success_toast();
        setdata([]);
        setinvoice("");
        setpayment_type("");
        setsupplier("");
        setsub_total(0);

        settax_amount(0);
        setdiscount_amount(0);
        settotal(0);
        setprint(false);
        setnotes("");
        settotal_tax("");
        settotal_discount("");
        settotal_total("");
        setsub_total_total("");
        setrefernce_invoice("");
        product_selection.current.focus();
      }
    }
  };

  const handleNewSale = (e) => {
    e.preventDefault();
    setdata([]);
    setpayment_type("");
    setinvoice("");
    setsupplier("");
    setsub_total(0);
    settotal_discount("");
    settotal_total("");
    setsub_total_total("");
    setrefernce_invoice("");
    settax_amount(0);
    setdiscount_amount(0);
    settotal(0);
    setprint(false);
  };

  const handlePrint = async () => {
    if (selected_branch) {
      setisloading(true);

      if (payment_type.value == "cash") {
        var debit = total_total;
      } else {
        debit = 0;
      }
      const response = await fetch(`${route}/api/purchases/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access}`,
        },
        body: JSON.stringify({
          reference: "PB",
          user: current_user.id,
          reference_invoice: refernce_invoice,
          account_head: selected_branch.id,
          supplier: supplier.value,
          remarks: notes,
          payment_type: payment_type.value,
          date: date,
          invoice: invoice,
          sub_total: sub_total_total,
          tax_amount: total_tax,
          tax_percentage: tax_percentage,
          discount_amount: 0,
          discount_percentage: 0,
          total: total_total,
          credit: total_total,
          debit: debit,
          details: data,
        }),
      });
      if (response.status === 500) {
        Red_toast("There is 500 error in server");
      }
      setisloading(false);
      const json = await response.json();

      if (!response.ok) {
        var error = Object.keys(json);
        if (error.length > 0) {
          Red_toast(`${error[0]}:${json[error[0]]}`);
        }
      }

      if (response.ok) {
        localStorage.setItem("data", JSON.stringify(json));
        setgetagain_invoice(!getagain_invoice);
        setdata([]);
        setinvoice("");
        setpayment_type("");
        setsupplier("");
        setsub_total(0);

        settax_amount(0);
        setdiscount_amount(0);
        settotal(0);
        setprint(false);
        setnotes("");
        settotal_tax("");
        settotal_discount("");
        settotal_total("");
        setsub_total_total("");
        setrefernce_invoice("");
        product_selection.current.focus();

        if (invoice_type.code === "A4") {
          window.open("/invoice/purchases", "_blank");
        } else if (invoice_type.code === "80mm") {
          window.open("/invoice_80/purchases", "_blank");
        }
      }
    }
  };

  const selectStyles = {
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };

  const handleadd = (e) => {
    e.preventDefault();
    const filter_data = data.filter((item) => item.stock === product.value.id);
    if (filter_data.length > 0) {
      setdata(
        data.map((item) => {
          if (item.stock === product.value.id) {
            return {
              stock: product.value.id,
              name: product.value.product_name,
              quantity: Number(quantity),
              price: price,
              sub_total: Number(quantity) * Number(price),
              tax_percentage: tax_percentage,
              tax_amount: tax_amount,

              total: total,
            };
          }
          return item;
        })
      );
    } else {
      setdata([
        ...data,
        {
          stock: product.value.id,
          name: product.value.product_name,
          quantity: quantity,
          price: price,
          sub_total: Number(quantity) * Number(price),
          tax_percentage: tax_percentage,
          tax_amount: tax_amount,

          total: total,
        },
      ]);
    }
    setproduct("");
    setquantity("");
    setprice("");
    setsub_total("");
    product_selection.current.focus();
  };

  const handledelete = (stock) => {
    setdata(data.filter((item) => item.stock !== stock));
  };

  useEffect(() => {
    settax_amount(
      ((Number(sub_total) / 100) * Number(tax_percentage)).toFixed(2)
    );

    settotal(
      (
        Number(sub_total) +
        (Number(sub_total) / 100) * Number(tax_percentage)
      ).toFixed(2)
    );
  }, [sub_total]);

  return (
    <div className="p-3">
      <div className="card" style={{ minHeight: "100vh" }}>
        <div className="card-header  d-flex justify-content-end">
          <Button
            className="me-2"
            type="button"
            variant="outline-dark"
            onClick={handleNewSale}
          >
            <AddIcon /> {t("new")}
          </Button>

          <Button
            disabled={
              !(
                data.length > 0 &&
                refernce_invoice &&
                supplier &&
                payment_type
              ) || isloading
            }
            onClick={handleSubmit}
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
            className="ms-2"
            variant="outline-success"
            onClick={handlePrint}
            disabled={
              !(
                data.length > 0 &&
                refernce_invoice &&
                supplier &&
                payment_type
              ) || isloading
            }
          >
            <PrintRoundedIcon /> {t("print")}
          </Button>
        </div>

        <div className="card-body  ">
          <div className="row">
            <div className="col-6 col-md-2">
              <TextField
                type="date"
                className="form-control   mb-3"
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

            <div className="col-6 col-md-2">
              <TextField
                className="form-control   mb-3"
                label="Invoice"
                value={invoice}
                size="small"
                required
              />
            </div>
            <div className="col-6 col-md-2">
              <TextField
                className="form-control   mb-3"
                label="Reference Invoice"
                value={refernce_invoice}
                onChange={(e) => {
                  setrefernce_invoice(e.target.value);
                }}
                size="small"
                required
              />
            </div>

            <div className="col-6 col-md-2">
              <Select
                className={
                  supplier !== ""
                    ? "form-control selector supplier"
                    : "form-control selector"
                }
                styles={selectStyles}
                options={all_suppliers}
                placeholder={"Vendors"}
                value={supplier}
                onChange={(e) => {
                  setsupplier(e);
                }}
                required
              ></Select>
            </div>

            <div className="col-6 col-md-2">
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

            <div className="col-6 col-md-2">
              <TextField
                multiline
                className="form-control   mb-3"
                label="Remarks"
                value={notes}
                onChange={(e) => {
                  setnotes(e.target.value);
                }}
                size="small"
                required
              />
            </div>

            <div className="col-6 col-md-2">
              <Select
                className={
                  company !== ""
                    ? "form-control selector company"
                    : "form-control selector"
                }
                styles={selectStyles}
                options={allcompanies}
                placeholder={"Stores"}
                value={company}
                onChange={(e) => {
                  setcompany(e);
                }}
              ></Select>
            </div>
          </div>

          <form onSubmit={handleadd}>
            <table className="table ">
              <thead>
                <tr>
                  <th className="p-0">Name</th>
                  <th className="p-0">Qty</th>
                  <th className="p-0">Price</th>
                  <th className="p-0">Sub Total</th>
                  <th className="p-0">Tax %</th>
                  <th className="p-0">Tax Amount</th>

                  <th className="p-0">Total</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((item, index) => {
                  return (
                    <tr key={item.stock} className="border-0">
                      <td className="col-2 p-0 border-0">
                        <TextField
                          className="form-control"
                          value={item.name}
                          size="small"
                        />
                      </td>
                      <td className=" p-0 border-0">
                        <TextField
                          className="form-control"
                          value={item.quantity}
                          size="small"
                        />
                      </td>
                      <td className=" p-0 border-0">
                        <TextField
                          className="form-control"
                          value={item.price}
                          size="small"
                        />
                      </td>

                      <td className=" p-0 border-0">
                        <TextField
                          className="form-control"
                          value={item.sub_total}
                          size="small"
                        />
                      </td>
                      <td className=" p-0 border-0">
                        <TextField
                          className="form-control"
                          value={item.tax_percentage}
                          size="small"
                        />
                      </td>
                      <td className=" p-0 border-0">
                        <TextField
                          className="form-control"
                          value={item.tax_amount}
                          size="small"
                        />
                      </td>

                      <td className=" p-0 border-0">
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
                            onClick={() => handledelete(item.stock)}
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
                    <Select
                      className={"form-control selector"}
                      styles={selectStyles}
                      options={all_product_option}
                      value={product}
                      onChange={(e) => {
                        setproduct(e);
                      }}
                      required
                      ref={product_selection}
                    ></Select>
                  </td>
                  <td className=" p-0 border-0">
                    <TextField
                      type="number"
                      className="form-control"
                      value={quantity}
                      placeholder="Qty"
                      onChange={(e) => {
                        setquantity(e.target.value);
                        setsub_total(
                          (Number(price) * Number(e.target.value)).toFixed(2)
                        );
                      }}
                      size="small"
                      required
                    />
                  </td>
                  <td className=" p-0 border-0">
                    <TextField
                      type="number"
                      className="form-control"
                      value={price}
                      placeholder="Price"
                      onChange={(e) => {
                        setprice(e.target.value);
                        setsub_total(
                          (Number(quantity) * Number(e.target.value)).toFixed(2)
                        );
                      }}
                      size="small"
                      required
                    />
                  </td>

                  <td className=" p-0 border-0">
                    <TextField
                      type="number"
                      className="form-control"
                      value={sub_total}
                      placeholder="Subtotal"
                      size="small"
                      required
                    />
                  </td>
                  <td className=" p-0 border-0">
                    <TextField
                      type="number"
                      className="form-control"
                      value={tax_percentage}
                      placeholder="Tax %"
                      onChange={(e) => {
                        settax_percentage(e.target.value);

                        const amount = Number(
                          ((Number(quantity) * Number(price)) / 100) *
                            e.target.value
                        );
                        settax_amount(amount.toFixed(2));
                        settotal(
                          (
                            Number(Number(quantity) * Number(price)) + amount
                          ).toFixed(2)
                        );
                      }}
                      size="small"
                    />
                  </td>
                  <td className=" p-0 border-0">
                    <TextField
                      type="number"
                      className="form-control"
                      value={tax_amount}
                      placeholder="Tax Value"
                      onChange={(e) => {
                        settax_amount(e.target.value);

                        const perc = Number((e.target.value / sub_total) * 100);
                        settax_percentage(perc.toFixed(2));
                        settotal(
                          (Number(sub_total) + Number(e.target.value)).toFixed(
                            2
                          )
                        );
                      }}
                      size="small"
                    />
                  </td>

                  <td className=" p-0 border-0">
                    <InputGroup>
                      <TextField
                        className="form-control"
                        value={total}
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
              label={t("subtotal")}
              value={sub_total_total}
              size="small"
              disabled
            />
          </div>

          <div className="col-6 col-sm-2 ">
            <TextField
              type="number"
              className="form-control "
              label="Tax Amount"
              value={total_tax}
              size="small"
            />
          </div>

          <div className="col-6 col-sm-2 ">
            <TextField
              type="number"
              className="form-control "
              label={t("total")}
              value={total_total}
              size="small"
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Purchase;
