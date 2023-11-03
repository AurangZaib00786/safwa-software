import React, { useEffect, useState, useRef } from "react";
import "./Purchase_return.css";
import Button from "react-bootstrap/Button";
import { IconButton } from "@material-ui/core";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import BootstrapTable from "react-bootstrap-table-next";
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
import VisibilityIcon from "@material-ui/icons/Visibility";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarcode } from "@fortawesome/free-solid-svg-icons";
import { faTag } from "@fortawesome/free-solid-svg-icons";
import { faListOl } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer } from "react-toastify";
import Save_button from "../buttons/save_button";
import went_wrong_toast from "../alerts/went_wrong_toast";
import Tooltip from "@material-ui/core/Tooltip";

import Purchaseform from "../purchase/purchaseform";
import Spinner from "react-bootstrap/Spinner";
import SaveIcon from "@material-ui/icons/Save";
import { useTranslation } from "react-i18next";

function Purchase_return_Edit(props) {
  const product_selection = useRef(null);
  const { t } = useTranslation();
  const user = props.state.setuser.user;
  const route = props.state.setuser.route;
  const selected_branch = props.state.Setcurrentinfo.selected_branch;
  const current_user = props.state.Setcurrentinfo.current_user;
  const invoice_type = props.state.Setcurrentinfo.invoice_type;
  const setActiveTab = props.setActiveTab;
  const table_data = props.state.Setproducthistory.product_history;
  const settable_data = props.Setproduct_history;
  const id_data = props.state.Setsavedata.save_data;

  const settings = props.state.Setcurrentinfo.settings;
  const [text_product, settext_product] = useState("");
  const [all_product_option, setall_product_option] = useState([]);
  const [all_product, setall_product] = useState([]);
  const [all_suppliers, setall_suppliers] = useState([]);

  const [stayfocus, setstayfocus] = useState(false);
  const [placeholder, setplaceholder] = useState(t("search_by_name"));
  const [name_color, setname_color] = useState("blue");
  const [barcode_color, setbarcode_color] = useState("lightgray");
  const [code_color, setcode_color] = useState("lightgray");
  const [text, settext] = useState("");
  const [url, seturl] = useState("");
  const [product, setproduct] = useState("");

  const [purchase_id, setpurchase_id] = useState("");
  const [invoice, setinvoice] = useState("");
  const [date, setdate] = useState("");
  const [counter, setcounter] = useState(0);
  const [supplier, setsupplier] = useState("");

  const [subtotal, setsubtotal] = useState("");
  const [tax, settax] = useState("");
  const [discount, setdiscount] = useState("");

  const [total, settotal] = useState("");
  const [tax_perc, settax_perc] = useState("");
  const [notes, setnotes] = useState("");

  const [showmodel, setshowmodel] = useState(false);

  const [isloading, setisloading] = useState(false);
  const [print, setprint] = useState(false);
  const [suppliers_data, setsuppliers_data] = useState([]);
  const [data, setdata] = useState("");
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
    settable_data({ type: "Set_product_history", data: [] });
    var count = 0;

    setdate(id_data.date);
    setinvoice(id_data.invoice);
    setsupplier({ value: id_data.supplier, label: id_data.supplier_name });

    setpurchase_id(id_data.id);
    setnotes(id_data.remarks);
    settax_perc(id_data.tax_percentage);
    setdiscount(id_data.discount);
    const filter_data = id_data?.details.map((item) => {
      count += 1;
      return {
        id: item.id,
        stock: item.stock,
        prod_id: count,
        name: item.product_name,
        code: item.product_code,
        quantity: item.quantity,
        price: item.price,
        sub_total: item.sub_total,
        tax_percentage: item.tax_percentage,
        tax_amount: item.tax_amount,

        total: item.total,
      };
    });
    setcounter(count + 1);

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
    if (table_data.length > 0) {
      var tax_total = 0;
      var subtotal_total = 0;

      var total_total = 0;
      table_data.forEach((item) => {
        tax_total += Number(item.tax_amount);
        subtotal_total += Number(item.sub_total);

        total_total += Number(item.total - discount);
      });
      setsubtotal(subtotal_total);
      settax(tax_total);
      settotal(total_total);
    }
  }, [table_data]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selected_branch && table_data) {
      const data_details = table_data.map((item) => {
        delete item["prod_id"];
        delete item["name"];
        delete item["code"];
        return item;
      });

      setisloading(true);

      const response = await fetch(
        `${route}/api/purchase-return/${purchase_id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.access}`,
          },
          body: JSON.stringify({
            supplier: supplier.value,
            remarks: notes,
            date: date,
            invoice: invoice,
            sub_total: subtotal,
            tax_amount: tax,
            discount: discount,
            debit: total,
            credit: 0,
            total: total,
            tax_percentage: tax_perc,
            details: data_details,
            user: current_user.id,
          }),
        }
      );

      if (!response.ok) {
        setisloading(false);
        went_wrong_toast();
      }

      if (response.ok) {
        settable_data({ type: "Set_product_history", data: [] });

        setinvoice("");

        setsupplier("");
        setsubtotal(0);
        settax_perc(0);
        settax(0);
        setdiscount(0);

        settotal(0);
        setprint(false);
        setnotes("");
        setActiveTab("purchasereturn_history");
      }
    }
  };

  useEffect(() => {
    if (invoice && supplier && table_data.length > 0) {
      setprint(true);
    } else {
      setprint(false);
    }
  }, [invoice, supplier, table_data]);

  const handlePrint = async (e) => {
    e.preventDefault();

    if (selected_branch && table_data) {
      const data_details = table_data.map((item) => {
        delete item["prod_id"];
        delete item["name"];
        delete item["code"];
        return item;
      });

      setisloading(true);

      const response = await fetch(
        `${route}/api/purchase-return/${purchase_id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.access}`,
          },
          body: JSON.stringify({
            supplier: supplier.value,
            remarks: notes,
            date: date,
            invoice: invoice,
            sub_total: subtotal,
            tax_amount: tax,
            discount: discount,
            debit: total,
            credit: 0,
            total: total,
            tax_percentage: tax_perc,
            details: data_details,
            user: current_user.id,
          }),
        }
      );
      const json = await response.json();

      if (!response.ok) {
        setisloading(false);
        went_wrong_toast();
      }

      if (response.ok) {
        localStorage.setItem("data", JSON.stringify(json));
        settable_data({ type: "Set_product_history", data: [] });

        setinvoice("");

        setsupplier("");
        setsubtotal(0);
        settax_perc(0);
        settax(0);
        setdiscount(0);

        settotal(0);
        setprint(false);
        setnotes("");

        if (invoice_type.code === "A4") {
          window.open("/invoice/purchases_return", "_blank");
        } else if (invoice_type.code === "80mm") {
          window.open("/invoice_80/purchases_return", "_blank");
        }

        setActiveTab("purchasereturn_history");
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

  const quantity_formatter = (cell, row, rowIndex, formatExtraData) => {
    return (
      <input
        type="number"
        defaultValue={cell}
        autoFocus={formatExtraData.dataField === "quantity" || stayfocus}
        className="form-control border-0"
        onChange={(e) => {
          var newValue = e.target.value;

          if (!newValue) {
            newValue = 0;
          }

          handlecellchange(cell, newValue, row, formatExtraData);
          setstayfocus(true);
        }}
      ></input>
    );
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
      formatter: quantity_formatter,
      headerFormatter: headerstyle,
      formatExtraData: { dataField: "quantity" },
    },
    {
      dataField: "price",
      text: t("price"),
      headerFormatter: headerstyle,
      formatter: quantity_formatter,
      formatExtraData: { dataField: "price" },
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
      formatter: quantity_formatter,
      formatExtraData: { dataField: "tax_percentage" },
    },
    {
      dataField: "tax_amount",
      text: "Tax Amount",
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

  const handleproduct_selection = (selected_option) => {
    setstayfocus(false);
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

          total: 0,
        };
      });
      settable_data({ type: "Create_product_history", data: filter_data[0] });
      setcounter(counter + 1);
    } else {
      const item = item_present[0];
      item.quantity = Number(item.quantity) + 1;
      item.sub_total = item.quantity * item.price;
      item.tax_amount = (item.sub_total / 100) * item.tax_percentage;
      item.total = item.sub_total + item.tax_amount;
      settable_data({ type: "Update_product_history", data: item });
    }
  };

  const handlecellchange = (oldValue, newValue, row, column) => {
    if (column.dataField === "quantity") {
      var new_data = table_data.filter((item) => {
        return item.stock === row.stock;
      });
      const item = new_data[0];
      const createnew_data = {
        stock: item.stock,
        prod_id: item.prod_id,
        name: item.name,
        code: item.code,
        quantity: newValue,
        price: item.price,
        sub_total: item.price * newValue,
        tax_percentage: item.tax_percentage,
        tax_amount: ((item.price * newValue) / 100) * item.tax_percentage,

        total:
          item.price * newValue +
          ((item.price * newValue) / 100) * item.tax_percentage,
      };

      settable_data({ type: "Update_product_history", data: createnew_data });
    } else if (column.dataField === "tax_percentage") {
      const new_data = table_data.filter((item) => {
        return item.stock === row.stock;
      });
      const item = new_data[0];
      const createnew_data = {
        stock: item.stock,
        prod_id: item.prod_id,
        name: item.name,
        code: item.code,
        quantity: item.quantity,
        price: item.price,
        sub_total: item.sub_total,
        tax_percentage: newValue,
        tax_amount: (item.sub_total / 100) * newValue,

        total: item.sub_total + (item.sub_total / 100) * newValue,
      };

      settable_data({ type: "Update_product_history", data: createnew_data });
    } else if (column.dataField === "price") {
      const new_data = table_data.filter((item) => {
        return item.stock === row.stock;
      });
      const item = new_data[0];
      const createnew_data = {
        stock: item.stock,
        prod_id: item.prod_id,
        name: item.name,
        code: item.code,
        quantity: item.quantity,
        price: newValue,
        sub_total: newValue * item.quantity,
        tax_percentage: item.tax_percentage,
        tax_amount: ((newValue * item.quantity) / 100) * item.tax_percentage,

        total:
          newValue * item.quantity +
          ((newValue * item.quantity) / 100) * item.tax_percentage,
      };

      settable_data({ type: "Update_product_history", data: createnew_data });
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
          total: item.sub_total + (item.sub_total / 100) * tax_value,
        };
      });
      settable_data({ type: "Set_product_history", data: new_data });
    }
  };

  const selectStyles = {
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Shift") {
        product_selection.current.focus();
      }
    };
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className="p-3">
      <h1 className="mb-3" style={{ fontSize: "1.8rem", fontWeight: "normal" }}>
        Return Edit
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
            <div className="card-header  d-flex justify-content-end">
              {print ? (
                <Button onClick={handleSubmit} variant="outline-primary">
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
              ) : (
                <Button variant="outline-primary" disabled>
                  <SaveIcon /> {t("save")}
                </Button>
              )}

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
                <div className="col-md-8">
                  <div className="row  d-sm-flex align-items-start mt-1">
                    <div className="col-6 col-md-4 mb-2">
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

                    <div className="col-6 col-md-4 mb-2">
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

                    <div className="col-6 col-md-4 mb-2">
                      <InputGroup>
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

                  <div className="row mt-2  ">
                    <div className="col-md-4">
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
                    <div className="col-md-3 text-end">
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
                    <div className="col-md-5">
                      <InputGroup>
                        {barcode_color === "lightgray" ? (
                          <Select
                            className="form-control selector"
                            placeholder={placeholder}
                            options={all_product_option}
                            value={product}
                            onChange={handleproduct_selection}
                            autoFocus
                            ref={product_selection}
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
                            autoFocus
                            ref={product_selection}
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
                <div className="col-md-4">
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
                  classes="purchasetable"
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
                  label="TAX %"
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
                  label="Discount"
                  value={discount}
                  onChange={(e) => {
                    setdiscount(e.target.value);
                    settotal(subtotal - e.target.value + tax);
                  }}
                  size="small"
                />{" "}
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

            <ToastContainer
              autoClose={1000}
              hideProgressBar={true}
              theme="dark"
            />
          </div>
        )}
      </ToolkitProvider>

      {showmodel && (
        <Purchaseform
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

export default Purchase_return_Edit;
