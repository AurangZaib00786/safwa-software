import React, { useEffect, useState, useRef } from "react";
import "./sale.css";
import Button from "react-bootstrap/Button";
import { IconButton } from "@material-ui/core";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import Spinner from "react-bootstrap/Spinner";
import SaveIcon from "@material-ui/icons/Save";
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
import Red_toast from "../alerts/red_toast";
import Tooltip from "@material-ui/core/Tooltip";
import Saleform from "./saleform";
import Save_button from "../buttons/save_button";
import { useTranslation } from "react-i18next";

function Sale(props) {
  const user = props.state.setuser.user;
  const { t } = useTranslation();
  const product_selection = useRef(null);

  const route = props.state.setuser.route;
  const selected_branch = props.state.Setcurrentinfo.selected_branch;
  const invoice_type = props.state.Setcurrentinfo.invoice_type;

  const current_user = props.state.Setcurrentinfo.current_user;
  const check_status = props.state.Settablehistory.table_history;
  const dispatch = props.Settable_history;
  const table_data = props.state.Setproducthistory.product_history;

  const settable_data = props.Setproduct_history;
  const settings = props.state.Setcurrentinfo.settings;
  const [all_product_option, setall_product_option] = useState([]);
  const [all_product, setall_product] = useState([]);
  const [all_suppliers, setall_suppliers] = useState([]);
  const [allpaymentmethod, setallpaymentmethod] = useState([
    { value: "cash", label: "Cash" },
    { value: "credit", label: "Credit" },
  ]);
  const [placeholder, setplaceholder] = useState(t("search_by_name"));
  const [name_color, setname_color] = useState("blue");
  const [barcode_color, setbarcode_color] = useState("lightgray");
  const [code_color, setcode_color] = useState("lightgray");
  const [text, settext] = useState("");
  const [url, seturl] = useState("");

  var curr = new Date();
  var curdate = curr.toISOString().substring(0, 10);
  const [invoice, setinvoice] = useState("");
  const [date, setdate] = useState(curdate);
  const [counter, setcounter] = useState(1);
  const [supplier, setsupplier] = useState("");
  const [payment_type, setpayment_type] = useState("");
  const [subtotal, setsubtotal] = useState(0);
  const [tax, settax] = useState(0);
  const [discount, setdiscount] = useState(0);
  const [extra_discount, setextra_discount] = useState(0);
  const [total, settotal] = useState(0);
  const [tax_perc, settax_perc] = useState(selected_branch?.tax_percentage);
  const [notes, setnotes] = useState("");
  const [stayfocus, setstayfocus] = useState(false);
  const [showmodel, setshowmodel] = useState(false);
  const [margin, setmargin] = useState(0);
  const [isloading, setisloading] = useState(false);
  const [print, setprint] = useState(false);
  const [product, setproduct] = useState("");
  const [suppliers_data, setsuppliers_data] = useState([]);
  const [data, setdata] = useState("");
  const [text_product, settext_product] = useState("");
  const [getagain_invoice, setgetagain_invoice] = useState(true);
  const [saleman, setsaleman] = useState("");
  const [allsalemans, setallsalemans] = useState([]);
  const [merge_flag, setmerge_flag] = useState(true);
  const [offer_amount, setoffer_amount] = useState(0);
  const [scheme_amount, setscheme_amount] = useState(0);
  const [company, setcompany] = useState({ value: "all", label: "All" });
  const [allcompanies, setallcompanies] = useState([]);

  const [editedRow, setEditedRow] = useState(null);

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
    const fetchinvoice = async () => {
      const response = await fetch(
        `${route}/api/sales/${selected_branch.id}/latest-invoice/`,
        {
          headers: { Authorization: `Bearer ${user.access}` },
        }
      );
      const json = await response.json();

      if (response.ok) {
        setinvoice(json.invoice_number);
      }
      if (!response.ok) {
        went_wrong_toast();
      }
    };

    if (user) {
      fetchinvoice();
    }
  }, [selected_branch, getagain_invoice]);

  useEffect(() => {
    dispatch({ type: "Set_menuitem", data: "sale" });
    settable_data({ type: "Set_product_history", data: [] });
  }, []);

  useEffect(() => {
    if (invoice && supplier && payment_type && table_data.length > 0) {
      setprint(true);
    } else {
      setprint(false);
    }
  }, [invoice, supplier, payment_type, saleman, table_data]);

  useEffect(() => {
    if (!merge_flag) {
      settable_data({ type: "Set_product_history", data: [] });
    }

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
  }, [selected_branch, company, getagain_invoice]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      var url = `${route}/api/parties/?account_head=${selected_branch.id}&type=Customer`;
      if (!settings?.user_base?.account_base) {
        if (current_user.profile.user_type === "user") {
          url = `${route}/api/parties/?user_id=${current_user.profile.parent_user}&type=Customer`;
        } else {
          url = `${route}/api/parties/?user_id=${current_user.id}&type=Customer`;
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

        // setmerge_flag(json[json.length - 1].merge_billing);
      }
      if (!response.ok) {
        went_wrong_toast();
      }
    };
    const fetchsalesman = async () => {
      if (current_user.profile.user_type === "user") {
        var url = `${route}/api/sales-persons/?user_id=${current_user.profile.parent_user}&account_head=${selected_branch.id}`;
      } else {
        var url = `${route}/api/sales-persons/?user_id=${current_user.id}&account_head=${selected_branch.id}`;
      }

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

  useEffect(() => {
    var total_total = 0;
    var total_discount = 0;
    var total_scheme = 0;
    var total_offer = 0;
    var total_margin = 0;
    var total_tax = 0;
    table_data.forEach((item) => {
      total_offer += Number(item.offer_value);
      total_scheme += Number(item.scheme_value);
      total_margin += Number(item.margin);
      total_discount += Number(item.discount_amount);
      total_tax += Number(item.tax_amount);
      total_total += Number(item.total);
    });
    setoffer_amount(total_offer);
    setscheme_amount(total_scheme);
    setmargin(total_margin);
    setdiscount(total_offer + total_scheme + total_discount);
    setsubtotal(total_total);
    settax(total_tax);
    settotal(total_total - Number(extra_discount));
  }, [table_data]);

  useEffect(() => {
    settotal(Number(subtotal) - Number(extra_discount) + Number(tax));
  }, [extra_discount]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selected_branch && table_data) {
      var checksale = true;
      for (let i = 0; i < table_data.length; i++) {
        var item = table_data[i];
        if (item.offer_rate > item.total / item.quantity) {
          Red_toast(
            `${item.name} final amount ${
              item.total / item.quantity.toFixed(2)
            } is less than offer rate ${item.offer_rate}`
          );
          checksale = false;
          break;
        }
      }

      if (checksale) {
        const data_details = table_data.map((item) => {
          delete item["prod_id"];
          delete item["name"];
          delete item["code"];
          delete item["offer_rate"];
          delete item["purchase_rate"];

          return item;
        });
        if (payment_type.value == "cash") {
          var credit = total;
        } else {
          credit = 0;
        }

        setisloading(true);

        const response = await fetch(`${route}/api/sales/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.access}`,
          },
          body: JSON.stringify({
            reference: "SB",
            user: current_user.id,
            account_head: selected_branch.id,
            customer: supplier.value,
            remarks: notes,
            payment_type: payment_type.value,
            date: date,
            invoice: invoice,
            sub_total: subtotal,
            tax_amount: tax,
            discount_amount: discount,
            extra_disc: extra_discount,
            total: total,
            margin: margin,
            credit: credit,
            debit: total,
            offer_amount: offer_amount,
            scheme_amount: scheme_amount,
            details: data_details,
            sale_person: saleman.value,
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
          setinvoice("");
          setsupplier("");
          setsubtotal(0);
          settax_perc(0);
          setextra_discount(0);
          settax(0);
          setdiscount(0);
          settotal(0);
          setprint(false);
          setnotes("");
          setgetagain_invoice(!getagain_invoice);
          product_selection.current.focus();
        }
      }
    }
  };

  const handleNewSale = (e) => {
    e.preventDefault();
    settable_data({ type: "Set_product_history", data: [] });

    setsubtotal(0);
    settax_perc(0);
    settax(0);
    setdiscount(0);
    settotal(0);
    setprint(false);
  };

  const handlePrint = async () => {
    if (selected_branch) {
      var checksale = true;
      for (let i = 0; i < table_data.length; i++) {
        var item = table_data[i];
        if (item.offer_rate > item.total / item.quantity) {
          Red_toast(
            `${item.name} final amount ${
              item.total / item.quantity.toFixed(2)
            } is less than offer rate ${item.offer_rate}`
          );
          checksale = false;
          break;
        }
      }

      if (checksale) {
        const data_details = table_data.map((item) => {
          delete item["prod_id"];
          delete item["name"];
          delete item["code"];
          delete item["offer_rate"];
          delete item["purchase_rate"];
          return item;
        });

        if (payment_type.value == "cash") {
          var credit = total;
        } else {
          credit = 0;
        }
        const response = await fetch(`${route}/api/sales/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.access}`,
          },
          body: JSON.stringify({
            reference: "SB",
            user: current_user.id,
            account_head: selected_branch.id,
            customer: supplier.value,
            remarks: notes,
            payment_type: payment_type.value,
            date: date,
            invoice: invoice,
            sub_total: subtotal,
            tax_amount: tax,
            discount_amount: discount,
            extra_disc: extra_discount,
            total: total,
            margin: margin,
            credit: credit,
            debit: total,
            offer_amount: offer_amount,
            scheme_amount: scheme_amount,
            details: data_details,
            sale_person: saleman.value,
          }),
        });
        const json = await response.json();

        if (!response.ok) {
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
          setgetagain_invoice(!getagain_invoice);
          settotal(0);
          setextra_discount(0);
          setprint(false);
          setnotes("");
          if (invoice_type.code === "A4") {
            window.open("/invoice/sales", "_blank");
          } else if (invoice_type.code === "80mm") {
            window.open("/invoice_80/sales", "_blank");
          }
        }
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

  const quantity_formatter = (cell, row, rowIndex, formatExtraData) => {
    return (
      <input
        type="number"
        defaultValue={cell}
        autoFocus={formatExtraData.dataField === "quantity" || stayfocus}
        className="form-control border-0"
        onChange={(e) => {
          // if (e.key === "Enter") {
          var newValue = e.target.value;

          if (!newValue) {
            newValue = 0;
          }

          handlecellchange(cell, newValue, row, formatExtraData);
          setstayfocus(true);
          // }
        }}
      ></input>
    );
  };

  var columns = [
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
    },
    {
      dataField: "quantity",
      text: t("qty"),
      formatter: quantity_formatter,
      formatExtraData: { dataField: "quantity" },
      headerFormatter: headerstyle,
    },
    {
      dataField: "remaining_quantity",
      text: t("Re. qty"),
      headerFormatter: headerstyle,
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
  ];

  if (settings?.account_base?.offer) {
    columns.push({
      dataField: "offer",
      text: "Offer",
      headerFormatter: headerstyle,
      formatter: quantity_formatter,
      formatExtraData: { dataField: "offer" },
    });
    columns.push({
      dataField: "offer_value",
      text: "Value",
      headerFormatter: headerstyle,
      formatter: fix_formatter,
      editable: false,
    });
  }
  if (settings?.account_base?.scheme) {
    columns.push({
      dataField: "scheme",
      text: "Scheme",
      headerFormatter: headerstyle,
      formatter: fix_formatter,
      formatter: quantity_formatter,
      formatExtraData: { dataField: "scheme" },
    });
    columns.push({
      dataField: "scheme_value",
      text: "Value",
      headerFormatter: headerstyle,
      formatter: fix_formatter,
      editable: false,
    });
  }
  if (settings?.account_base?.percentage) {
    columns.push({
      dataField: "discount_percentage",
      text: "%",
      headerFormatter: headerstyle,
      formatter: fix_formatter,
      formatter: quantity_formatter,
      formatExtraData: { dataField: "discount_percentage" },
    });
    columns.push({
      dataField: "discount_amount",
      text: "Value",
      headerFormatter: headerstyle,
      formatter: fix_formatter,
      editable: false,
    });
  }
  if (settings?.account_base?.item_wise_tax) {
    columns.push({
      dataField: "tax_percentage",
      text: " Tax %",
      headerFormatter: headerstyle,
      formatter: quantity_formatter,
      formatExtraData: { dataField: "tax_percentage" },
    });
    columns.push({
      dataField: "tax_amount",
      text: "Tax Val.",
      headerFormatter: headerstyle,
      formatter: fix_formatter,
      editable: false,
    });
  }
  columns.push({
    dataField: "total",
    text: t("total"),
    headerFormatter: headerstyle,
    formatter: fix_formatter,
    editable: false,
  });
  if (current_user?.permissions?.includes("view_sale_margin")) {
    columns.push({
      dataField: "margin",
      text: "Margin",
      headerFormatter: headerstyle,
      formatter: fix_formatter,
      editable: false,
    });
  }
  columns.push({
    dataField: "Edit",
    text: t("action"),
    formatter: linkFollow,
    headerFormatter: headerstyle,
    editable: false,
  });

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

    ////////////////////////////////////////////////////
    var filter_data = all_product.filter((item) => {
      if (item.id === selected_option.value) {
        return item;
      }
    });

    if (item_present.length === 0) {
      if (
        filter_data[0].quantity > 0 ||
        settings?.account_base?.negative_stock
      ) {
        add_product_totable(item_present, filter_data);
      } else {
        Red_toast("Product out Of Stock!");
      }
    } else {
      if (
        filter_data[0].quantity - item_present[0].quantity > 0 ||
        settings?.account_base?.negative_stock
      ) {
        add_quantity(item_present);
      } else {
        Red_toast("Product out Of Stock!");
      }
    }
  };
  const add_product_totable = (item_present, filter_data) => {
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
    ///////////////////////////////////////////////////////////////////////
    filter_data = filter_data.map((item) => {
      var generate_row = {
        stock: item.id,
        prod_id: counter,
        name: item.product_name,
        code: item.product_code,
        quantity: 1,
        remaining_quantity: item.quantity - 1,
        price: item.sale_rate,
        sub_total: item.sale_rate,
        offer: 0,
        offer_value: 0,
        scheme: 0,
        scheme_value: 0,
        discount_percentage: 0,
        discount_amount: 0,
        tax_percentage: 0,
        tax_amount: 0,

        total: item.sale_rate,
        purchase_rate: item.purchase_rate,
        margin: item.sale_rate - item.purchase_rate,
        offer_rate: item.offer_rate,
      };
      if (settings?.account_base?.item_wise_tax) {
        const calculate_total_pr_item =
          generate_row.total +
          (item.sale_rate / 100) * selected_branch.tax_percentage;

        generate_row = {
          ...generate_row,

          tax_percentage: selected_branch.tax_percentage,
          tax_amount: (item.sale_rate / 100) * selected_branch.tax_percentage,
          total: calculate_total_pr_item,
          margin: calculate_total_pr_item - item.purchase_rate,
        };
      }
      if (settings?.account_base?.offer) {
        const calculate_total_pr_item =
          generate_row.total -
          offer_value * product_offer.free * item.sale_rate;

        generate_row = {
          ...generate_row,
          offer: item.offer,
          offer_value: offer_value * product_offer.free * item.sale_rate,

          total: calculate_total_pr_item,

          margin: calculate_total_pr_item - item.purchase_rate,
        };
      }
      if (settings?.account_base?.scheme) {
        const calculate_total_pr_item = generate_row.total - item.scheme;

        generate_row = {
          ...generate_row,

          scheme: item.scheme,
          scheme_value: item.scheme,
          total: calculate_total_pr_item,
          margin: calculate_total_pr_item - item.purchase_rate,
        };
      }

      if (settings?.account_base?.percentage) {
        const calculate_total_pr_item =
          generate_row.total - (item.sale_rate / 100) * item.percentage;

        generate_row = {
          ...generate_row,

          discount_percentage: item.percentage,
          discount_amount: (item.sale_rate / 100) * item.percentage,

          total: calculate_total_pr_item,

          margin: calculate_total_pr_item - item.purchase_rate,
        };
      }

      return generate_row;
    });

    if (filter_data[0]) {
      settable_data({ type: "Create_product_history", data: filter_data[0] });
      setcounter(counter + 1);

      setEditedRow(filter_data[0].prod_id);
    }
  };

  const add_quantity = (item_present) => {
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

    item.quantity = Number(item.quantity) + 1;
    item.remaining_quantity = Number(item.remaining_quantity) - 1;
    item.sub_total = item.quantity * item.price;
    item.discount_amount = (item.sub_total / 100) * item.discount_percentage;
    item.offer_value = offer_value * product_offer.free * item.price;
    item.scheme_value = item.scheme * item.quantity;
    item.tax_amount = (item.sub_total / 100) * item.tax_percentage;
    item.total =
      item.quantity * item.price -
      item.offer_value -
      item.scheme_value -
      item.discount_amount +
      item.tax_amount;
    item.margin = item.total - item.quantity * item.purchase_rate;
    settable_data({ type: "Update_product_history", data: item });
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
      var filter_data = all_product.filter((item) => {
        if (item.id === row.stock) {
          return item;
        }
      });
      ///////////////////////////////////////////////////
      if (
        filter_data[0].quantity - newValue >= 0 ||
        settings?.account_base?.negative_stock
      ) {
        var offer_value = parseInt(newValue / product_offer.offer_on);
        if (!offer_value) {
          offer_value = 0;
        }

        const new_data = table_data.filter((item, index) => {
          return item.stock === row.stock;
        });
        const item = new_data[0];

        const calculate_total =
          item.price * newValue -
          ((item.price * newValue) / 100) * item.discount_percentage -
          item.scheme * newValue +
          ((item.price * newValue) / 100) * item.tax_percentage -
          offer_value * product_offer.free * item.price;

        const calculate_total_pr_item = calculate_total / newValue;

        const createnew_data = {
          stock: item.stock,
          prod_id: item.prod_id,
          name: item.name,
          code: item.code,
          quantity: newValue,
          remaining_quantity:
            Number(item.remaining_quantity) -
            (Number(newValue) - Number(oldValue)),
          price: item.price,
          sub_total: item.price * newValue,

          offer: item.offer,
          offer_value: offer_value * product_offer.free * item.price,

          scheme: item.scheme,
          scheme_value: item.scheme * newValue,

          discount_percentage: item.discount_percentage,
          discount_amount:
            ((item.price * newValue) / 100) * item.discount_percentage,

          tax_percentage: item.tax_percentage,
          tax_amount: ((item.price * newValue) / 100) * item.tax_percentage,
          total: calculate_total,
          purchase_rate: item.purchase_rate,
          margin: calculate_total - newValue * item.purchase_rate,
          offer_rate: item.offer_rate,
        };
        settable_data({
          type: "Update_product_history",
          data: createnew_data,
        });
      } else {
        Red_toast(`${newValue} Quantity not Available!`);
        var offer_value = parseInt(newValue / product_offer.offer_on);
        if (!offer_value) {
          offer_value = 0;
        }

        var new_data = table_data.filter((item) => {
          return item.stock === row.stock;
        });
        const item = new_data[0];
        const createnew_data = {
          stock: item.stock,
          prod_id: item.prod_id,
          name: item.name,
          code: item.code,
          quantity: oldValue,
          price: item.price,
          sub_total: item.price,

          offer: item.offer,
          offer_value: item.offer_value,

          scheme: item.scheme,
          scheme_value: item.scheme_value,

          discount_percentage: item.discount_percentage,
          discount_amount: item.discount_amount,

          tax_percentage: item.tax_percentage,
          tax_amount: item.tax_amount,
          total: item.total,
          purchase_rate: item.purchase_rate,
          margin: item.margin,
          offer_rate: item.offer_rate,
        };

        settable_data({ type: "Update_product_history", data: createnew_data });
      }
    } else if (column.dataField === "offer") {
      var offer_value = parseInt(row.quantity / product_offer.offer_on);
      if (!offer_value) {
        offer_value = 0;
      }
      const new_data = table_data.filter((item) => {
        return item.stock === row.stock;
      });
      const item = new_data[0];

      const calculate_total =
        item.sub_total -
        item.discount_amount -
        item.scheme_value +
        item.tax_amount -
        offer_value * product_offer.free * item.price;

      const calculate_total_pr_item = calculate_total / item.quantity;

      const createnew_data = {
        stock: item.stock,
        prod_id: item.prod_id,
        name: item.name,
        code: item.code,
        quantity: item.quantity,
        remaining_quantity: item.remaining_quantity,
        price: item.price,
        sub_total: item.sub_total,

        offer: newValue,
        offer_value: offer_value * product_offer.free * item.price,

        scheme: item.scheme,
        scheme_value: item.scheme_value,

        discount_percentage: item.discount_percentage,
        discount_amount: item.discount_amount,
        tax_percentage: item.tax_percentage,
        tax_amount: item.tax_amount,
        total: calculate_total,

        purchase_rate: item.purchase_rate,
        margin: calculate_total - item.quantity * item.purchase_rate,
        offer_rate: item.offer_rate,
      };
      settable_data({ type: "Update_product_history", data: createnew_data });
    } else if (column.dataField === "scheme") {
      const new_data = table_data.filter((item) => {
        return item.stock === row.stock;
      });
      const item = new_data[0];
      const calculate_total =
        item.sub_total -
        item.discount_amount +
        item.tax_amount -
        newValue * item.quantity -
        item.offer_value;

      const calculate_total_pr_item = calculate_total / item.quantity;

      const createnew_data = {
        stock: item.stock,
        prod_id: item.prod_id,
        name: item.name,
        code: item.code,
        quantity: item.quantity,
        remaining_quantity: item.remaining_quantity,
        price: item.price,
        sub_total: item.sub_total,

        offer: item.offer,
        offer_value: item.offer_value,

        scheme: newValue,
        scheme_value: newValue * item.quantity,

        discount_percentage: item.discount_percentage,
        discount_amount: item.discount_amount,

        tax_percentage: item.tax_percentage,
        tax_amount: item.tax_amount,

        total: calculate_total,

        purchase_rate: item.purchase_rate,
        margin: calculate_total - item.quantity * item.purchase_rate,
        offer_rate: item.offer_rate,
      };
      settable_data({ type: "Update_product_history", data: createnew_data });
    } else if (column.dataField === "discount_percentage") {
      const new_data = table_data.filter((item) => {
        return item.stock === row.stock;
      });
      const item = new_data[0];
      const calculate_total =
        item.sub_total -
        (item.sub_total / 100) * newValue -
        item.scheme_value +
        item.tax_amount -
        item.offer_value;

      const calculate_total_pr_item = calculate_total / item.quantity;

      const createnew_data = {
        stock: item.stock,
        prod_id: item.prod_id,
        name: item.name,
        code: item.code,
        quantity: item.quantity,
        remaining_quantity: item.remaining_quantity,
        price: item.price,
        sub_total: item.sub_total,

        offer: item.offer,
        offer_value: item.offer_value,

        scheme: item.scheme,
        scheme_value: item.scheme_value,

        discount_percentage: newValue,
        discount_amount: (item.sub_total / 100) * newValue,

        tax_percentage: item.tax_percentage,
        tax_amount: item.tax_amount,

        total: calculate_total,

        purchase_rate: item.purchase_rate,
        margin: calculate_total - item.quantity * item.purchase_rate,
        offer_rate: item.offer_rate,
      };
      settable_data({ type: "Update_product_history", data: createnew_data });
    } else if (column.dataField === "price") {
      var offer_value = parseInt(row.quantity / product_offer.offer_on);
      if (!offer_value) {
        offer_value = 0;
      }

      const new_data = table_data.filter((item) => {
        return item.stock === row.stock;
      });
      const item = new_data[0];
      const calculate_total =
        newValue * item.quantity -
        ((newValue * item.quantity) / 100) * item.discount_percentage -
        item.scheme_value +
        ((newValue * item.quantity) / 100) * item.tax_percentage -
        offer_value * product_offer.free * newValue;

      const calculate_total_pr_item = calculate_total / item.quantity;

      const createnew_data = {
        stock: item.stock,
        prod_id: item.prod_id,
        name: item.name,
        code: item.code,
        quantity: item.quantity,
        remaining_quantity: item.remaining_quantity,
        price: newValue,
        sub_total: newValue * item.quantity,

        offer: item.offer,
        offer_value: offer_value * product_offer.free * newValue,

        scheme: item.scheme,
        scheme_value: item.scheme_value,

        discount_percentage: item.discount_percentage,
        discount_amount:
          ((newValue * item.quantity) / 100) * item.discount_percentage,

        tax_percentage: item.tax_percentage,
        tax_amount: ((newValue * item.quantity) / 100) * item.tax_percentage,

        total: calculate_total,

        purchase_rate: item.purchase_rate,
        margin: calculate_total - item.quantity * item.purchase_rate,
        offer_rate: item.offer_rate,
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
        remaining_quantity: item.remaining_quantity,
        price: item.price,
        sub_total: item.sub_total,

        offer: item.offer,
        offer_value: item.offer_value,

        scheme: item.scheme,
        scheme_value: item.scheme_value,

        discount_percentage: item.discount_percentage,
        discount_amount: item.discount_amount,

        tax_percentage: newValue,
        tax_amount: (item.sub_total / 100) * newValue,

        total:
          item.sub_total -
          item.discount_amount -
          item.scheme_value +
          (item.sub_total / 100) * newValue -
          item.offer_value,

        purchase_rate: item.purchase_rate,
        margin:
          item.sub_total -
          item.discount_amount -
          item.scheme_value +
          (item.sub_total / 100) * newValue -
          item.offer_value -
          item.quantity * item.purchase_rate,
        offer_rate: item.offer_rate,
      };

      settable_data({ type: "Update_product_history", data: createnew_data });
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

  const fetchstock_rate = async (filter_customer_type) => {
    var url = `${route}/api/stock-rates/?account_head=${selected_branch.id}&customer_type=${filter_customer_type}`;
    if (!settings?.user_base?.account_base) {
      if (current_user.profile.user_type === "user") {
        url = `${route}/api/stock-rates/?user_id=${current_user.profile.parent_user}&customer_type=${filter_customer_type}`;
      } else {
        url = `${route}/api/stock-rates/?user_id=${current_user.id}&customer_type=${filter_customer_type}`;
      }
    }
    const response = await fetch(`${url}`, {
      headers: { Authorization: `Bearer ${user.access}` },
    });
    const json = await response.json();
    if (response.ok) {
      const optimize = all_product.map((item) => {
        const filter_stock = json.filter((stock) => {
          return stock.stock === item.id;
        });

        if (filter_stock.length > 0) {
          item["sale_rate"] = filter_stock[0].sale_rate;
          return item;
        } else {
          return item;
        }
      });

      setall_product(optimize);
    }
  };

  const handlecustomerchange = (e) => {
    setsupplier(e);
    const optimize = suppliers_data.filter((item) => {
      return e.value === item.id;
    });
    setmerge_flag(optimize[0].merge_billing);
    fetchstock_rate(optimize[0].customer_type);
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
              <Button
                className="me-2"
                type="button"
                variant="outline-dark"
                onClick={handleNewSale}
              >
                <AddIcon /> {t("new")}
              </Button>

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
              <div className="row  d-sm-flex  mt-1">
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
                      autoFocus
                      onChange={handlecustomerchange}
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

                <div className="col-6 col-md-2 mb-2">
                  <Select
                    className={
                      payment_type
                        ? "form-control selector payment"
                        : "form-control selector"
                    }
                    styles={selectStyles}
                    options={allpaymentmethod}
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

              <div className="row d-sm-flex  mt-1">
                <div className="col-md-2">
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
                <div className="col-md-3 ">
                  <InputGroup>
                    {barcode_color === "lightgray" ? (
                      <Select
                        className="form-control selector"
                        placeholder={placeholder}
                        options={all_product_option}
                        value={product}
                        onChange={handleproduct_selection}
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

              <div style={{ height: " 60vh " }}>
                <BootstrapTable
                  {...props.baseProps}
                  bordered={false}
                  bootstrap4
                  condensed
                  classes="saletable"
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
          selected_branch={selected_branch}
          data_={data}
          settings={settings}
        />
      )}
    </div>
  );
}
export default Sale;
