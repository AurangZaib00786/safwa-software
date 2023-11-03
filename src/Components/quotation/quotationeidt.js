import React, { useEffect, useState } from "react";
import "../sale/sale.css";
import Button from "react-bootstrap/Button";
import { IconButton } from "@material-ui/core";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";

import ToolkitProvider, {
  CSVExport,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import Select from "react-select";
import PrintRoundedIcon from "@material-ui/icons/PrintRounded";

import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import InputGroup from "react-bootstrap/InputGroup";

import VisibilityIcon from "@material-ui/icons/Visibility";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarcode } from "@fortawesome/free-solid-svg-icons";
import { faTag } from "@fortawesome/free-solid-svg-icons";
import { faListOl } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer } from "react-toastify";
import went_wrong_toast from "../alerts/went_wrong_toast";
import success_toast from "../alerts/success_toast";
import Tooltip from "@material-ui/core/Tooltip";

import Saleform from "../sale/saleform";

import Save_button from "../buttons/save_button";
import { useTranslation } from "react-i18next";

function Quotation(props) {
  const user = props.state.setuser.user;
  const route = props.state.setuser.route;
  const { t } = useTranslation();
  const selected_branch = props.state.Setcurrentinfo.selected_branch;
  const current_user = props.state.Setcurrentinfo.current_user;
  const check_status = props.state.Settablehistory.table_history;
  const dispatch = props.Settable_history;
  const setActiveTab = props.setActiveTab;
  const table_data = props.state.Setproducthistory.product_history;
  const settable_data = props.Setproduct_history;
  const current_data = props.state.Setsavedata.save_data;
  const settings = props.state.Setcurrentinfo.settings;

  const [all_product_option, setall_product_option] = useState([]);
  const [all_product, setall_product] = useState([]);
  const [all_suppliers, setall_suppliers] = useState([]);
  const [placeholder, setplaceholder] = useState(t("search_by_name"));
  const [name_color, setname_color] = useState("blue");
  const [barcode_color, setbarcode_color] = useState("lightgray");
  const [code_color, setcode_color] = useState("lightgray");
  const [text, settext] = useState("");
  const [url, seturl] = useState("");

  var curr = new Date();
  var curdate = curr.toISOString().substring(0, 10);
  const [invoice, setinvoice] = useState("");
  const [date, setdate] = useState("");
  const [validdate, setvaliddate] = useState(null);
  const [counter, setcounter] = useState(1);
  const [supplier, setsupplier] = useState("");

  const [subtotal, setsubtotal] = useState(0);
  const [tax, settax] = useState(0);
  const [discount, setdiscount] = useState(0);
  const [extra_discount, setextra_discount] = useState(0);
  const [total, settotal] = useState(0);
  const [tax_perc, settax_perc] = useState(0);
  const [notes, setnotes] = useState("");

  const [showmodel, setshowmodel] = useState(false);

  const [isloading, setisloading] = useState(false);
  const [id, setid] = useState("");
  const [print, setprint] = useState(false);
  const [getlatest_invoice, setgetlatest_invoice] = useState(false);
  const [product, setproduct] = useState("");
  const [suppliers_data, setsuppliers_data] = useState([]);
  const [data, setdata] = useState("");
  const [text_product, settext_product] = useState("");
  const [payment_terms, setpayment_terms] = useState("");
  const [delivery_date, setdelivery_date] = useState(curdate);
  const [company, setcompany] = useState({ value: "all", label: "All" });
  const [allcompanies, setallcompanies] = useState([]);

  useEffect(() => {
    const fetchcompany = async () => {
      if (current_user.profile.user_type === "user") {
        var url = `${route}/api/companies/?user_id=${current_user.profile.parent_user}`;
      } else {
        url = `${route}/api/companies/?user_id=${current_user.id}`;
      }
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
        went_wrong_toast();
      }
    };

    if (user) {
      fetchcompany();
    }
  }, []);

  useEffect(() => {
    setid(current_data.id);
    setinvoice(current_data.quotation_number);
    setvaliddate(current_data.valid_date);
    setdate(current_data.date);
    setsupplier({
      value: current_data.supplier_details.id,
      label: current_data.supplier_details.name,
    });
    setnotes(current_data.remarks);
    setextra_discount(current_data.extra_disc);
    var num = 0;
    const filter_data = current_data.details.map((item) => {
      num += 1;
      return {
        stock: item.stock,
        prod_id: num,
        name: item.product_name,
        code: item.product_code,
        quantity: item.quantity,
        price: item.price,
        sub_total: item.sub_total,
        tax_percentage: item.tax_percentage,
        tax_amount: item.tax_amount,
        discount_percentage: item.discount_percentage,
        discount: item.discount,
        total: item.total,
      };
    });

    setcounter(num + 1);
    settable_data({ type: "Set_product_history", data: filter_data });
  }, []);
  useEffect(() => {
    const fetchProducts = async () => {
      var url = `${route}/api/stock/?account_head=${selected_branch.id}`;
      if (!settings?.user_base?.account_base) {
        if (current_user.profile.user_type === "user") {
          url = `${route}/api/stock/?user_id=${current_user.profile.parent_user}`;
        } else {
          url = `${route}/api/stock/?user_id=${current_user.id}`;
        }
      }
      if (company.value !== "all") {
        url = `${url}&company_id=${company.value}`;
      }
      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        setall_product(json);
        const pro = json.map((item) => {
          return {
            value: item.id,
            label: item.product_name,
          };
        });
        setall_product_option(pro);
      }
      if (!response.ok) {
        went_wrong_toast();
      }
    };

    if (user) {
      fetchProducts();
    }
  }, [selected_branch, company]);

  useEffect(() => {
    if (invoice && supplier && validdate && table_data.length > 0) {
      setprint(true);
    } else {
      setprint(false);
    }
  }, [invoice, validdate, supplier, table_data]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      var url = `${route}/api/parties/?account_head=${selected_branch.id}&type=supplier`;
      if (!settings?.user_base?.account_base) {
        if (current_user.profile.user_type === "user") {
          url = `${route}/api/parties/?user_id=${current_user.profile.parent_user}&type=supplier`;
        } else {
          url = `${route}/api/parties/?user_id=${current_user.id}&type=supplier`;
        }
      }
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
        setsupplier(supp.slice(-1)[0]);
      }
      if (!response.ok) {
        went_wrong_toast();
      }
    };

    if (user) {
      fetchSuppliers();
    }
  }, [selected_branch]);

  useEffect(() => {
    var vat_total = 0;
    var subtotal_total = 0;
    var discount_total = 0;
    var total_total = 0;
    table_data.forEach((item) => {
      vat_total += Number(item.tax_amount);
      subtotal_total += Number(item.sub_total);
      discount_total += Number(item.discount);
      total_total += Number(item.total);
    });
    setsubtotal(subtotal_total);
    settax(vat_total);
    setdiscount(discount_total);
    settotal(total_total - extra_discount);
  }, [table_data]);

  useEffect(() => {
    var repeat_total = 0;
    table_data.forEach((item) => {
      repeat_total += Number(item.total);
    });
    settotal(repeat_total - extra_discount);
  }, [extra_discount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selected_branch) {
      setisloading(true);
      const data_details = table_data.map((item) => {
        delete item["prod_id"];
        delete item["name"];
        delete item["code"];
        return item;
      });

      setisloading(true);

      const response = await fetch(`${route}/api/purchase-quotation/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access}`,
        },
        body: JSON.stringify({
          supplier: supplier.value,
          remarks: notes,
          date: date,
          valid_date: validdate,
          quotation_number: invoice,
          sub_total: subtotal,
          tax_amount: tax,
          discount: discount,
          extra_disc: extra_discount,
          total: total,
          tax_percentage: tax_perc,
          status: "pending",
          details: data_details,
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
        settable_data({ type: "Set_product_history", data: [] });
        setvaliddate("");
        setsupplier("");
        setsubtotal(0);
        settax_perc(0);
        settax(0);
        setdiscount(0);
        setextra_discount(0);
        settotal(0);
        setgetlatest_invoice(!getlatest_invoice);
        setprint(false);
        setnotes("");
        setpayment_terms("");
        setdelivery_date(curdate);
        setActiveTab("purchasequotation_history");
      }
    }
  };

  const handlePrint = async () => {
    if (selected_branch) {
      const data_details = table_data.map((item) => {
        delete item["prod_id"];
        delete item["name"];
        delete item["code"];
        return item;
      });

      const response = await fetch(`${route}/api/purchase-quotation/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access}`,
        },
        body: JSON.stringify({
          supplier: supplier.value,
          remarks: notes,
          date: date,
          valid_date: validdate,
          quotation_number: invoice,
          sub_total: subtotal,
          tax_amount: tax,
          discount: discount,
          extra_disc: extra_discount,
          total: total,
          tax_percentage: tax_perc,
          status: "pending",
          details: data_details,
        }),
      });
      const json = await response.json();

      if (!response.ok) {
        went_wrong_toast();
      }

      if (response.ok) {
        localStorage.setItem("data", JSON.stringify(json));
        settable_data({ type: "Set_product_history", data: [] });
        setnotes("");
        setvaliddate("");
        setsupplier("");
        setsubtotal(0);
        settax_perc(0);
        settax(0);
        setdiscount(0);
        setextra_discount(0);
        settotal(0);
        setgetlatest_invoice(!getlatest_invoice);
        setpayment_terms("");
        setdelivery_date(curdate);
        setprint(false);
        if (selected_branch.invoice_type === "Version 01") {
          window.open("/invoice/quotation", "_blank");
        } else if (selected_branch.invoice_type === "Version 02") {
          window.open("/invoice_2/quotation", "_blank");
        } else if (selected_branch.invoice_type === "Version 03") {
          window.open("/invoice_3/quotation", "_blank");
        }
        setActiveTab("purchasequotation_history");
      }
    }
  };

  const linkFollow = (cell, row, rowIndex, formatExtraData) => {
    return (
      <div className="action text-center">
        <IconButton
          onClick={() => {
            settable_data({ type: "Delete_product_history", data: row });
          }}
        >
          <DeleteRoundedIcon color="error" fontSize="medium" />
        </IconButton>
      </div>
    );
  };

  const headerstyle = (column, colIndex, { sortElement }) => {
    return (
      <div
        className="d-flex justify-content-between align-items-center"
        style={{ minHeight: "2.5rem" }}
      >
        {column.text}
        {sortElement}
      </div>
    );
  };

  const name_column_formater = (cell, row) => {
    return <div style={{ width: "18vw" }}>{cell}</div>;
  };

  const fix_formatter = (cell, row) => {
    return <div>{parseFloat(cell).toFixed(2)}</div>;
  };

  const columns = [
    {
      dataField: "row_number",
      text: "#",
      headerFormatter: headerstyle,
      formatter: (cell, row, rowIndex) => rowIndex + 1,
      editable: false,
    },
    {
      dataField: "code",
      text: t("code"),
      headerFormatter: headerstyle,
      editable: false,
    },
    {
      dataField: "name",
      text: t("name"),
      sort: true,
      headerFormatter: headerstyle,
      formatter: name_column_formater,
      editable: false,
    },
    {
      dataField: "quantity",
      text: t("qty"),
      headerFormatter: headerstyle,
      editorRenderer: (
        editorProps,
        value,
        row,
        column,
        rowIndex,
        columnIndex
      ) => (
        <input
          type="number"
          defaultValue={value}
          className="form-control editor edit-text input_class"
          onBlur={(e) => editorProps.onUpdate(e.target.value)}
        />
      ),
    },
    {
      dataField: "price",
      text: t("price"),
      headerFormatter: headerstyle,
      formatter: fix_formatter,
      editorRenderer: (
        editorProps,
        value,
        row,
        column,
        rowIndex,
        columnIndex
      ) => (
        <input
          type="number"
          defaultValue={value}
          className="form-control editor edit-text input_class"
          onBlur={(e) => editorProps.onUpdate(e.target.value)}
        />
      ),
    },
    {
      dataField: "sub_total",
      text: t("subtotal"),
      headerFormatter: headerstyle,
      formatter: fix_formatter,
      editable: false,
    },
    {
      dataField: "tax_percentage",
      text: "Tax %",
      headerFormatter: headerstyle,
      formatter: fix_formatter,
      editorRenderer: (
        editorProps,
        value,
        row,
        column,
        rowIndex,
        columnIndex
      ) => (
        <input
          type="number"
          defaultValue={value}
          className="form-control editor edit-text input_class"
          onBlur={(e) => editorProps.onUpdate(e.target.value)}
        />
      ),
    },
    {
      dataField: "tax_amount",
      text: "Tax amount",
      headerFormatter: headerstyle,
      formatter: fix_formatter,
      editable: false,
    },

    {
      dataField: "discount_percentage",
      text: "Discount %",
      headerFormatter: headerstyle,
      formatter: fix_formatter,
      editorRenderer: (
        editorProps,
        value,
        row,
        column,
        rowIndex,
        columnIndex
      ) => (
        <input
          type="number"
          defaultValue={value}
          className="form-control editor edit-text input_class"
          onBlur={(e) => editorProps.onUpdate(e.target.value)}
        />
      ),
    },
    {
      dataField: "discount",
      text: "Value",
      headerFormatter: headerstyle,
      formatter: fix_formatter,
      editable: false,
    },

    {
      dataField: "total",
      text: t("total"),
      headerFormatter: headerstyle,
      formatter: fix_formatter,
      editable: false,
    },
    {
      dataField: "Edit",
      text: t("action"),
      formatter: linkFollow,
      headerFormatter: headerstyle,
      editable: false,
    },
  ];

  const handlesearch_by_barcode = () => {
    const pro = all_product.map((item) => {
      return {
        value: item.id,
        label: item.product_barcode,
      };
    });
    setall_product_option(pro);
    setplaceholder(t("search_by_barcode"));
    setbarcode_color("blue");
    setname_color("lightgray");
    setcode_color("lightgray");
  };
  const handlesearch_by_code = () => {
    const pro = all_product.map((item) => {
      return {
        value: item.id,
        label: `${item.product_code} | ${item.product_name} `,
      };
    });
    setall_product_option(pro);
    setplaceholder(t("search_by_code"));
    setbarcode_color("lightgray");
    setname_color("lightgray");
    setcode_color("blue");
  };

  const handlesearch_by_name = () => {
    const pro = all_product.map((item) => {
      return {
        value: item.id,
        label: item.product_name,
      };
    });
    setall_product_option(pro);
    setplaceholder(t("search_by_name"));
    setbarcode_color("lightgray");
    setname_color("blue");
    setcode_color("lightgray");
  };

  const handlebarcodeinput = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const filter_data = all_product.filter((item) => {
        if (item.product_barcode === e.target.value) {
          return item;
        }
      });
      if (filter_data.length > 0) {
        handleproduct_selection({
          value: filter_data[0].id,
          label: filter_data[0].product_name,
        });
      }
      settext_product("");
    }
  };

  const selectStyles = {
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };

  const handleproduct_selection = (selected_option) => {
    const item_present = table_data.filter((item) => {
      return item.stock === selected_option.value;
    });

    if (item_present.length === 0) {
      var filter_data = all_product.filter((item) => {
        if (item.id === selected_option.value) {
          return item;
        }
      });

      filter_data = filter_data.map((item) => {
        return {
          stock: item.id,
          prod_id: counter,
          name: item.product_name,
          code: item.product_code,
          quantity: 1,
          price: 0,
          sub_total: 0,
          tax_percentage: tax_perc,
          tax_amount: 0,
          discount_percentage: 0,
          discount: 0,
          total: 0,
        };
      });
      settable_data({ type: "Create_product_history", data: filter_data[0] });
      setcounter(counter + 1);
    } else {
      const item = item_present[0];
      item.quantity = item.quantity + 1;
      item.sub_total = item.quantity * item.price;
      item.tax_amount = (item.sub_total / 100) * item.tax_percentage;
      item.discount = (item.sub_total / 100) * item.discount_percentage;
      item.total = item.sub_total + item.tax_amount - item.discount;
      settable_data({ type: "Update_product_history", data: item });
    }
  };

  const handlecellchange = (oldValue, newValue, row, column) => {
    if (column.dataField === "quantity") {
      var new_data = table_data.map((item) => {
        return item.stock !== row.stock
          ? item
          : {
              stock: item.stock,
              prod_id: item.prod_id,
              name: item.name,
              code: item.code,
              quantity: newValue,
              price: item.price,
              sub_total: item.price * newValue,
              tax_percentage: item.tax_percentage,
              tax_amount: ((item.price * newValue) / 100) * item.tax_percentage,
              discount_percentage: item.discount_percentage,
              discount:
                ((item.price * newValue) / 100) * item.discount_percentage,
              total:
                item.price * newValue -
                ((item.price * newValue) / 100) * item.discount_percentage +
                ((item.price * newValue) / 100) * item.tax_percentage,
            };
      });
      settable_data({ type: "Set_product_history", data: new_data });
    } else if (column.dataField === "tax_percentage") {
      new_data = table_data.map((item) => {
        return item.stock !== row.stock
          ? item
          : {
              stock: item.stock,
              prod_id: item.prod_id,
              name: item.name,
              code: item.code,
              quantity: item.quantity,
              price: item.price,
              sub_total: item.sub_total,
              tax_percentage: newValue,
              tax_amount: (item.sub_total / 100) * newValue,
              discount_percentage: item.discount_percentage,
              discount: item.discount,

              total:
                item.sub_total -
                item.discount +
                (item.sub_total / 100) * newValue,
            };
      });
      settable_data({ type: "Set_product_history", data: new_data });
    } else if (column.dataField === "price") {
      new_data = table_data.map((item) => {
        return item.stock !== row.stock
          ? item
          : {
              stock: item.stock,
              prod_id: item.prod_id,
              name: item.name,
              code: item.code,
              quantity: item.quantity,
              price: newValue,
              sub_total: newValue * item.quantity,
              tax_percentage: item.tax_percentage,
              tax_amount:
                ((newValue * item.quantity) / 100) * item.tax_percentage,
              discount_percentage: item.discount_percentage,
              discount: item.discount,
              total:
                newValue * item.quantity -
                item.discount +
                ((newValue * item.quantity) / 100) * item.tax_percentage,
            };
      });

      settable_data({ type: "Set_product_history", data: new_data });
    } else if (column.dataField === "discount_percentage") {
      new_data = table_data.map((item) => {
        return item.stock !== row.stock
          ? item
          : {
              stock: item.stock,
              prod_id: item.prod_id,
              name: item.name,
              code: item.code,
              quantity: item.quantity,
              price: item.price,
              sub_total: item.sub_total,
              tax_percentage: item.tax_percentage,
              tax_amount: item.tax_amount,
              discount_percentage: newValue,
              discount: (item.sub_total / 100) * newValue,
              total:
                item.sub_total -
                (item.sub_total / 100) * newValue +
                item.tax_amount,
            };
      });

      settable_data({ type: "Set_product_history", data: new_data });
    }
  };

  const handletax_percentage = (e) => {
    const tax_value = e.target.value;
    settax_perc(tax_value);
    if (table_data) {
      const new_data = table_data.map((item) => {
        return {
          stock: item.stock,
          prod_id: item.prod_id,
          name: item.name,
          code: item.code,
          quantity: item.quantity,
          price: item.price,
          sub_total: item.sub_total,
          tax_percentage: tax_value,
          tax_amount: (item.sub_total / 100) * tax_value,
          discount_percentage: item.discount_percentage,
          discount: item.discount,

          total:
            item.sub_total - item.discount + (item.sub_total / 100) * tax_value,
        };
      });
      settable_data({ type: "Set_product_history", data: new_data });
    }
  };

  return (
    <div className="p-3">
      <h1 className="mb-3" style={{ fontSize: "1.8rem", fontWeight: "normal" }}>
        Quotation Edit
      </h1>
      <ToolkitProvider
        keyField="prod_id"
        data={table_data}
        columns={columns}
        search
        exportCSV
      >
        {(props) => (
          <div className="card">
            <form onSubmit={handleSubmit}>
              <div className="card-header  d-flex justify-content-end">
                <Save_button isloading={isloading} />
                {print ? (
                  <Button
                    className="ms-2"
                    variant="outline-success"
                    onClick={handlePrint}
                  >
                    <PrintRoundedIcon /> {t("print")}
                  </Button>
                ) : (
                  <Button className="ms-2" variant="outline-success" disabled>
                    <PrintRoundedIcon /> {t("print")}
                  </Button>
                )}
              </div>

              <div className="card-body  ">
                <div className="row">
                  <div className="col-md-9">
                    <div className="row  d-sm-flex align-items-start mt-1">
                      <div className="col-6 col-md-3 mb-2">
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

                      <div className="col-6 col-md-3 mb-2">
                        <TextField
                          type="date"
                          className="form-control   mb-3"
                          id="outlined-basic"
                          label="Validd Date"
                          InputLabelProps={{ shrink: true }}
                          value={validdate}
                          onChange={(e) => {
                            setvaliddate(e.target.value);
                          }}
                          size="small"
                          required
                        />
                      </div>

                      <div className="col-6 col-md-3 mb-2">
                        <TextField
                          className="form-control   mb-3"
                          id="outlined-basic"
                          label="Invoice"
                          value={invoice}
                          onChange={(e) => {
                            setinvoice(e.target.value);
                          }}
                          size="small"
                          required
                        />
                      </div>

                      <div className="col-6 col-md-3 mb-2">
                        <InputGroup>
                          <Select
                            className={
                              supplier !== ""
                                ? "form-control selector supplier"
                                : "form-control selector"
                            }
                            styles={selectStyles}
                            options={all_suppliers}
                            placeholder={"Suppliers"}
                            value={supplier}
                            onChange={(e) => {
                              setsupplier(e);
                            }}
                            required
                          ></Select>

                          <IconButton
                            className="p-0 ps-1 pe-1"
                            style={{
                              backgroundColor: "#0d6efd",
                              borderRadius: "0",
                            }}
                            onClick={() => {
                              settext("Suppliers");
                              seturl(
                                `${route}/api/parties/?branch_id=${selected_branch.id}&party_type=Supplier`
                              );
                              setshowmodel(!showmodel);
                              setdata(suppliers_data);
                            }}
                          >
                            <VisibilityIcon
                              style={{ color: "white", height: "fit-content" }}
                              fontSize="medium"
                            />
                          </IconButton>
                        </InputGroup>
                      </div>
                    </div>

                    <div className="row mt-2">
                      <div className="col-md-3">
                        <Select
                          className={
                            company !== ""
                              ? "form-control selector company"
                              : "form-control selector"
                          }
                          styles={selectStyles}
                          options={allcompanies}
                          placeholder={"Comapny"}
                          value={company}
                          onChange={(e) => {
                            setcompany(e);
                          }}
                        ></Select>
                      </div>
                      <div className="col-md-2 text-end">
                        <Tooltip title="Search Product by Barcode">
                          <IconButton onClick={handlesearch_by_barcode}>
                            <FontAwesomeIcon
                              color={barcode_color}
                              icon={faBarcode}
                              size="lg"
                            />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Search Product by Code">
                          <IconButton onClick={handlesearch_by_code}>
                            <FontAwesomeIcon
                              color={code_color}
                              icon={faListOl}
                              size="lg"
                            />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Search Product by Name">
                          <IconButton onClick={handlesearch_by_name}>
                            <FontAwesomeIcon
                              color={name_color}
                              icon={faTag}
                              size="lg"
                            />
                          </IconButton>
                        </Tooltip>
                      </div>
                      <div className="col-md-4">
                        <InputGroup>
                          {barcode_color === "lightgray" ? (
                            <Select
                              className="form-control selector"
                              placeholder={placeholder}
                              options={all_product_option}
                              value={product}
                              onChange={handleproduct_selection}
                            ></Select>
                          ) : (
                            <TextField
                              className="form-control"
                              id="outlined-basic"
                              label={t("search_by_barcode")}
                              onKeyDown={handlebarcodeinput}
                              value={text_product}
                              onChange={(e) => settext_product(e.target.value)}
                              size="small"
                            />
                          )}

                          <IconButton
                            className="p-0 ps-1 pe-1"
                            style={{
                              backgroundColor: "#0d6efd",
                              borderRadius: "0",
                            }}
                            onClick={() => {
                              settext(t("side_bar_product"));
                              seturl(
                                `${route}/api/products/?branch_id=${selected_branch.id}`
                              );
                              setshowmodel(!showmodel);
                              setdata(all_product);
                            }}
                          >
                            <VisibilityIcon
                              style={{
                                color: "white",
                                height: "fit-content",
                              }}
                              fontSize="medium"
                            />
                          </IconButton>
                        </InputGroup>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <TextField
                      multiline
                      maxRows={4}
                      className="form-control   mb-3"
                      id="outlined-basic"
                      label={"Notes"}
                      value={notes}
                      onChange={(e) => {
                        setnotes(e.target.value);
                      }}
                      size="small"
                    />
                  </div>
                </div>

                <hr />
                <div style={{ height: "60vh", overflow: "auto" }}>
                  <BootstrapTable
                    {...props.baseProps}
                    bordered={false}
                    bootstrap4
                    condensed
                    cellEdit={cellEditFactory({
                      mode: "click",
                      blurToSave: true,
                      afterSaveCell: handlecellchange,
                    })}
                    rowClasses="custom_row_class"
                  />
                </div>
              </div>
              <div className="card-footer d-flex justify-content-end">
                <div className="col-sm-2 pe-3">
                  <TextField
                    type="number"
                    className="form-control"
                    id="outlined-basic"
                    label={t("subtotal")}
                    value={subtotal}
                    onChange={(e) => {
                      setsubtotal(e.target.value);
                    }}
                    size="small"
                    disabled
                  />
                </div>

                <div className="col-sm-2 pe-3">
                  <TextField
                    type="number"
                    className="form-control"
                    id="outlined-basic"
                    label="Tax %"
                    value={tax_perc}
                    onChange={handletax_percentage}
                    size="small"
                  />
                </div>
                <div className="col-sm-2 pe-3">
                  <TextField
                    type="number"
                    className="form-control"
                    id="outlined-basic"
                    label="Tax Amount"
                    value={tax}
                    onChange={(e) => {
                      settax(e.target.value);
                    }}
                    size="small"
                    disabled
                  />
                </div>
                <div className="col-sm-2 pe-3">
                  <TextField
                    className="form-control "
                    id="outlined-basic"
                    label={t("discount")}
                    value={discount}
                    onChange={(e) => {
                      setdiscount(e.target.value);
                      settotal(subtotal - e.target.value + tax);
                    }}
                    size="small"
                  />
                </div>

                <div className="col-sm-2 pe-3">
                  <TextField
                    className="form-control "
                    id="outlined-basic"
                    label="Extra Discount"
                    value={extra_discount}
                    onChange={(e) => {
                      setextra_discount(e.target.value);
                    }}
                    size="small"
                  />
                </div>

                <div className="col-sm-2 pe-3">
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
            </form>
          </div>
        )}
      </ToolkitProvider>

      {showmodel && (
        <Saleform
          show={showmodel}
          onHide={() => setshowmodel(false)}
          user={user}
          route1={url}
          callback={settable_data}
          text={text}
          counter={counter}
          setcounter={setcounter}
          setsupplier={setsupplier}
          table_data={table_data}
          tax_perc={tax_perc}
          selected_branch={selected_branch}
          route={route}
          data_={data}
        />
      )}
    </div>
  );
}

export default Quotation;
