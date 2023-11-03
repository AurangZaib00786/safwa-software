import React, { memo, useEffect, useState } from "react";
import "../sale/sale.css";
import Button from "react-bootstrap/Button";
import { IconButton } from "@material-ui/core";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory, { Type } from "react-bootstrap-table2-editor";

import ToolkitProvider, {
  CSVExport,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
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
import went_wrong_toast from "../alerts/went_wrong_toast";
import success_toast from "../alerts/success_toast";
import Tooltip from "@material-ui/core/Tooltip";
import Saleform from "../sale return/saleform";
import Save_button from "../buttons/save_button";
import { useTranslation } from "react-i18next";

function Sale_Quotation_Edit(props) {
  const user = props.state.setuser.user;
  const { t } = useTranslation();
  const route = props.state.setuser.route;
  const selected_branch = props.state.Setcurrentinfo.selected_branch;
  const current_user = props.state.Setcurrentinfo.current_user;
  const check_status = props.state.Settablehistory.table_history;
  const dispatch = props.Settable_history;
  const setActiveTab = props.setActiveTab;
  const table_data = props.state.Setproducthistory.product_history;
  const settable_data = props.Setproduct_history;
  const current_data = props.state.Setsavedata.save_data[0].data;
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
  const [quotation_number, setquotation_number] = useState("");
  const [date, setdate] = useState();
  const [counter, setcounter] = useState(1);
  const [supplier, setsupplier] = useState("");
  const [valid_date, setvalid_date] = useState("");
  const [subtotal, setsubtotal] = useState(0);
  const [tax, settax] = useState(0);
  const [discount, setdiscount] = useState(0);
  const [extra_discount, setextra_discount] = useState(0);
  const [total, settotal] = useState(0);
  const [tax_perc, settax_perc] = useState(selected_branch.tax_percentage);
  const [notes, setnotes] = useState("");

  const [showmodel, setshowmodel] = useState(false);
  const [id, setid] = useState("");
  const [isloading, setisloading] = useState(false);
  const [print, setprint] = useState(false);
  const [product, setproduct] = useState("");
  const [suppliers_data, setsuppliers_data] = useState([]);
  const [data, setdata] = useState("");
  const [text_product, settext_product] = useState("");
  const [getagain_quotation_number, setgetagain_quotation_number] =
    useState(true);

  useEffect(() => {
    setid(current_data.id);
    setquotation_number(current_data.quotation_number);
    setdate(current_data.date);
    setsupplier({
      value: current_data.customer_details.id,
      label: current_data.customer_details.name,
    });
    setvalid_date(current_data.valid_date);
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
        quantity: 1,
        price: item.price,
        sub_total: item.sub_total,
        offer: item.offer,
        offer_value: item.offer_value,
        scheme: item.scheme,
        scheme_value: item.scheme_value,
        discount_percentage: item.discount_percentage,
        discount_amount: item.discount_amount,
        total: item.total,
        purchase_rate: item.total - item.margin,
        margin: item.margin,
      };
    });

    setcounter(num + 1);
    settable_data({ type: "Set_product_history", data: filter_data });
  }, []);

  useEffect(() => {
    if (quotation_number && supplier && valid_date && table_data.length > 0) {
      setprint(true);
    } else {
      setprint(false);
    }
  }, [quotation_number, supplier, valid_date, table_data]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(
        `${route}/api/stock/?account_head=${selected_branch.id}`,
        {
          headers: { Authorization: `Bearer ${user.access}` },
        }
      );
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
  }, [selected_branch, check_status]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      const response = await fetch(
        `${route}/api/parties/?account_head=${selected_branch.id}&type=Customer`,
        {
          headers: { Authorization: `Bearer ${user.access}` },
        }
      );
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
  }, [selected_branch, check_status]);

  useEffect(() => {
    var total_total = 0;
    var total_discount = 0;
    var total_scheme = 0;
    var total_offer = 0;
    table_data.forEach((item) => {
      total_offer += Number(item.offer_value);
      total_scheme += Number(item.scheme_value);
      total_discount += Number(item.discount_amount);

      total_total += Number(item.total);
    });
    setdiscount(total_offer + total_scheme + total_discount);
    setsubtotal(total_total);
    settax(((total_total / 100) * tax_perc).toFixed(2));
    settotal(
      total_total - Number(extra_discount) + (total_total / 100) * tax_perc
    );
  }, [table_data]);

  useEffect(() => {
    settotal(Number(subtotal) - Number(extra_discount) + Number(tax));
  }, [extra_discount]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selected_branch && table_data) {
      const data_details = table_data.map((item) => {
        delete item["prod_id"];
        delete item["name"];
        delete item["code"];
        item["tax_percentage"] = tax_perc;
        item["tax_amount"] = (item.total / 100) * tax_perc;
        return item;
      });

      setisloading(true);

      const response = await fetch(`${route}/api/sale-quotation/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access}`,
        },
        body: JSON.stringify({
          customer: supplier.value,
          remarks: notes,
          valid_date: valid_date,
          date: date,
          quotation_number: quotation_number,
          sub_total: subtotal,
          tax_amount: tax,
          discount: discount,
          extra_disc: extra_discount,
          total: total,
          tax_percentage: tax_perc,
          details: data_details,
        }),
      });

      if (!response.ok) {
        setisloading(false);
        went_wrong_toast();
      }

      if (response.ok) {
        setisloading(false);
        success_toast();
        settable_data({ type: "Set_product_history", data: [] });
        setquotation_number("");
        setvalid_date("");
        setsupplier("");
        setsubtotal(0);
        settax_perc(0);
        setextra_discount(0);
        settax(0);
        setdiscount(0);
        settotal(0);
        setprint(false);
        setnotes("");
        setgetagain_quotation_number(!getagain_quotation_number);
        setActiveTab("salequotation_history");
      }
    }
  };

  const handlePrint = async () => {
    if (selected_branch) {
      const data_details = table_data.map((item) => {
        delete item["prod_id"];
        delete item["name"];
        delete item["code"];
        item["tax_percentage"] = tax_perc;
        item["tax_amount"] = (item.total / 100) * tax_perc;
        return item;
      });

      const response = await fetch(`${route}/api/sale-quotation/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access}`,
        },
        body: JSON.stringify({
          customer: supplier.value,
          remarks: notes,
          valid_date: valid_date,
          date: date,
          quotation_number: quotation_number,
          sub_total: subtotal,
          tax_amount: tax,
          discount: discount,
          extra_disc: extra_discount,
          total: total,
          tax_percentage: tax_perc,
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
        setquotation_number("");
        setvalid_date("");
        setsupplier("");
        setsubtotal(0);
        settax_perc(0);
        settax(0);
        setdiscount(0);
        setgetagain_quotation_number(!getagain_quotation_number);
        settotal(0);
        setextra_discount(0);
        setprint(false);
        setnotes("");
        if (selected_branch.quotation_number_type === "Version 01") {
          window.open("/quotation_number/purchases", "_blank");
        } else if (selected_branch.quotation_number_type === "Version 02") {
          window.open("/quotation_number_2/purchases", "_blank");
        } else if (selected_branch.quotation_number_type === "Version 03") {
          window.open("/quotation_number_3/purchases", "_blank");
        }
        setActiveTab("salequotation_history");
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
    return parseFloat(cell).toFixed(2);
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
      editable: false,
    },
    {
      dataField: "sub_total",
      text: t("subtotal"),
      headerFormatter: headerstyle,
      formatter: fix_formatter,
      editable: false,
    },
    {
      dataField: "offer",
      text: "Offer",
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
          placeholder="xx + xx"
          defaultValue={value}
          className="form-control editor edit-text input_class"
          onBlur={(e) => {
            editorProps.onUpdate(e.target.value);
          }}
        />
      ),
    },
    {
      dataField: "offer_value",
      text: "Value",
      headerFormatter: headerstyle,
      formatter: fix_formatter,
      editable: false,
    },
    {
      dataField: "scheme",
      text: "Scheme",
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
      dataField: "scheme_value",
      text: "Value",
      headerFormatter: headerstyle,
      formatter: fix_formatter,
      editable: false,
    },
    {
      dataField: "discount_percentage",
      text: "%",
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
      dataField: "discount_amount",
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
      var product_offer = { offer_on: 0, free: 0 };
      const offer = filter_data[0].offer.toString().split("+");
      if (offer.length > 1) {
        const offer_on = offer[0];
        const free = offer[1];
        product_offer = { offer_on: offer_on, free: free };
      }
      var offer_value = parseInt(1 / product_offer.offer_on);
      if (!offer_value) {
        offer_value = 0;
      }

      filter_data = filter_data.map((item) => {
        return {
          stock: item.id,
          prod_id: counter,
          name: item.product_name,
          code: item.product_code,
          quantity: 1,
          price: item.sale_rate,
          sub_total: item.sale_rate,
          offer: item.offer,
          offer_value: offer_value * product_offer.free * item.sale_rate,
          scheme: item.scheme,
          scheme_value: item.scheme * 1,
          discount_percentage: 0,
          discount_amount: 0,
          total:
            item.sale_rate -
            offer_value * product_offer.free * item.sale_rate -
            item.scheme * 1,
          purchase_rate: item.purchase_rate,
          margin:
            item.sale_rate -
            offer_value * product_offer.free * item.sale_rate -
            item.scheme * 1 -
            item.purchase_rate,
        };
      });
      settable_data({ type: "Create_product_history", data: filter_data[0] });
      setcounter(counter + 1);
    } else {
      const item = item_present[0];

      var product_offer = { offer_on: 0, free: 0 };
      const offer = item.offer.toString().split("+");
      if (offer.length > 1) {
        const offer_on = offer[0];
        const free = offer[1];
        product_offer = { offer_on: offer_on, free: free };
      }
      var offer_value = parseInt((item.quantity + 1) / product_offer.offer_on);
      if (!offer_value) {
        offer_value = 0;
      }

      item.quantity = item.quantity + 1;
      item.sub_total = item.quantity * item.price;
      item.discount_amount = (item.sub_total / 100) * item.discount_percentage;
      item.offer_value = offer_value * product_offer.free * item.price;
      item.scheme_value = item.scheme * item.quantity;
      item.total =
        item.quantity * item.price -
        item.offer_value -
        item.scheme_value -
        item.discount_amount;
      item.margin = item.total - item.purchase_rate;
      settable_data({ type: "Update_product_history", data: item });
    }
  };

  const handlecellchange = (oldValue, newValue, row, column) => {
    var product_offer = { offer_on: 0, free: 0 };
    if (column.dataField === "offer") {
      const offer = newValue.toString().split("+");

      if (offer.length > 1) {
        const offer_on = offer[0];
        const free = offer[1];
        product_offer = { offer_on: offer_on, free: free };
      }
    } else {
      const offer = row.offer.toString().split("+");

      if (offer.length > 1) {
        const offer_on = offer[0];
        const free = offer[1];
        product_offer = { offer_on: offer_on, free: free };
      }
    }

    if (column.dataField === "quantity") {
      var offer_value = parseInt(newValue / product_offer.offer_on);
      if (!offer_value) {
        offer_value = 0;
      }

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

              offer: item.offer,
              offer_value: offer_value * product_offer.free * item.price,

              scheme: item.scheme,
              scheme_value: item.scheme * newValue,

              discount_percentage: item.discount_percentage,
              discount_amount:
                ((item.price * newValue) / 100) * item.discount_percentage,

              total:
                item.price * newValue -
                ((item.price * newValue) / 100) * item.discount_percentage -
                item.scheme * newValue -
                offer_value * product_offer.free * item.price,
              purchase_rate: item.purchase_rate,
              margin:
                item.price * newValue -
                ((item.price * newValue) / 100) * item.discount_percentage -
                item.scheme * newValue -
                offer_value * product_offer.free * item.price -
                item.purchase_rate,
            };
      });
      settable_data({ type: "Set_product_history", data: new_data });
    } else if (column.dataField === "offer") {
      var offer_value = parseInt(row.quantity / product_offer.offer_on);
      if (!offer_value) {
        offer_value = 0;
      }
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

              offer: newValue,
              offer_value: offer_value * product_offer.free * item.price,

              scheme: item.scheme,
              scheme_value: item.scheme_value,

              discount_percentage: item.discount_percentage,
              discount_amount: item.discount_amount,

              total:
                item.sub_total -
                item.discount_amount -
                item.scheme_value -
                offer_value * product_offer.free * item.price,

              purchase_rate: item.purchase_rate,
              margin:
                item.sub_total -
                item.discount_amount -
                item.scheme_value -
                offer_value * product_offer.free * item.price -
                item.purchase_rate,
            };
      });
      settable_data({ type: "Set_product_history", data: new_data });
    } else if (column.dataField === "scheme") {
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

              offer: item.offer,
              offer_value: item.offer_value,

              scheme: newValue,
              scheme_value: newValue * item.quantity,

              discount_percentage: item.discount_percentage,
              discount_amount: item.discount_amount,

              total:
                item.sub_total -
                item.discount_amount -
                newValue * item.quantity -
                item.offer_value,

              purchase_rate: item.purchase_rate,
              margin:
                item.sub_total -
                item.discount_amount -
                newValue * item.quantity -
                item.offer_value -
                item.purchase_rate,
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

              offer: item.offer,
              offer_value: item.offer_value,

              scheme: item.scheme,
              scheme_value: item.scheme_value,

              discount_percentage: newValue,
              discount_amount: (item.sub_total / 100) * newValue,

              total:
                item.sub_total -
                (item.sub_total / 100) * newValue -
                item.scheme_value -
                item.offer_value,

              purchase_rate: item.purchase_rate,
              margin:
                item.sub_total -
                (item.sub_total / 100) * newValue -
                item.scheme_value -
                item.offer_value -
                item.purchase_rate,
            };
      });

      settable_data({ type: "Set_product_history", data: new_data });
    }
  };

  const handletax_percentage = (e) => {
    const tax_value = e.target.value;
    settax_perc(tax_value);
    settax(((Number(subtotal) / 100) * tax_value).toFixed(2));
    settotal(
      (
        Number(subtotal) -
        Number(extra_discount) +
        (Number(subtotal) / 100) * tax_value
      ).toFixed(2)
    );
  };

  const selectStyles = {
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
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
                          label="Valid Date"
                          InputLabelProps={{ shrink: true }}
                          defaultValue={valid_date}
                          value={valid_date}
                          onChange={(e) => {
                            setvalid_date(e.target.value);
                          }}
                          size="small"
                          required
                        />
                      </div>

                      <div className="col-6 col-md-3 mb-2">
                        <TextField
                          className="form-control   mb-3"
                          id="outlined-basic"
                          label="quotation_number"
                          value={quotation_number}
                          onChange={(e) => {
                            setquotation_number(e.target.value);
                          }}
                          size="small"
                          required
                        />
                      </div>

                      <div className="col-6 col-md-3 mb-2">
                        <InputGroup>
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
                              settext("Customers");

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

                    <div className="row mt-2  d-sm-flex justify-content-center">
                      <div className="col-md-2 text-end  me-2">
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
                      <div className="col-md-4 ">
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
                              settext("Products");

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
            <ToastContainer
              autoClose={1000}
              hideProgressBar={true}
              theme="dark"
            />
          </div>
        )}
      </ToolkitProvider>

      {showmodel && (
        <Saleform
          show={showmodel}
          onHide={() => setshowmodel(false)}
          user={user}
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
export default memo(Sale_Quotation_Edit);
