import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, {
  Search,
  CSVExport,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import Button from "react-bootstrap/Button";
import { Avatar } from "@material-ui/core";
import "../sale/sale.css";
import { ToastContainer } from "react-toastify";
import went_wrong_toast from "../alerts/went_wrong_toast";
import Spinner from "react-bootstrap/Spinner";
import Select from "react-select";
import custom_toast from "../alerts/custom_toast";
import Red_toast from "../alerts/red_toast";
import { useTranslation } from "react-i18next";

function Saleform({
  show,
  onHide,
  callback,
  text,
  counter,
  setcounter,
  setsupplier,
  table_data,
  selected_branch,
  data_,
  settings,
}) {
  const { t } = useTranslation();
  const [isloading, setisloading] = useState(false);
  const [data, setdata] = useState(data_);
  const { SearchBar } = Search;
  const [callonce, setcallonce] = useState(false);
  const [callagain, setcallagain] = useState(false);

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

  const addproduct = (row, num) => {
    const item_present = table_data.filter((item) => {
      return item.stock === row.id;
    });

    ////////////////////////////////////////////////////
    var filter_data = [row];

    if (item_present.length === 0) {
      if (filter_data[0].quantity > 0 || settings.negative_stock) {
        return [add_product_totable(filter_data, num), true];
      } else {
        Red_toast(`${row.product_name} out Of Stock!`);
        return [false, false];
      }
    } else {
      if (
        filter_data[0].quantity - item_present[0].quantity > 0 ||
        settings.negative_stock
      ) {
        return [add_quantity(item_present), true];
      } else {
        Red_toast(`${row.product_name} out Of Stock!`);
        return [false, false];
      }
    }
  };

  const add_product_totable = (filter_data, item_present) => {
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
        if (calculate_total_pr_item > item.offer_rate) {
          generate_row = {
            ...generate_row,
            offer: item.offer,
            offer_value: offer_value * product_offer.free * item.sale_rate,

            total: calculate_total_pr_item,

            margin: calculate_total_pr_item - item.purchase_rate,
          };
        } else {
          Red_toast(
            `Product final amount ${calculate_total_pr_item} including Offer is less than offer rate ${item.offer_rate}`
          );
          return null;
        }
      }
      if (settings?.account_base?.scheme) {
        const calculate_total_pr_item = generate_row.total - item.scheme;
        if (calculate_total_pr_item > item.offer_rate) {
          generate_row = {
            ...generate_row,

            scheme: item.scheme,
            scheme_value: item.scheme,
            total: calculate_total_pr_item,
            margin: calculate_total_pr_item - item.purchase_rate,
          };
        } else {
          Red_toast(
            `Product final amount ${calculate_total_pr_item} including Scheme is less than offer rate ${item.offer_rate}`
          );
          return null;
        }
      }

      if (settings?.account_base?.percentage) {
        const calculate_total_pr_item =
          generate_row.total - (item.sale_rate / 100) * item.percentage;
        if (calculate_total_pr_item > item.offer_rate) {
          generate_row = {
            ...generate_row,

            discount_percentage: item.percentage,
            discount_amount: (item.sale_rate / 100) * item.percentage,

            total: calculate_total_pr_item,

            margin: calculate_total_pr_item - item.purchase_rate,
          };
        } else {
          Red_toast(
            `Product final amount ${calculate_total_pr_item} including Discount is less than offer rate ${item.offer_rate}`
          );
          return null;
        }
      }

      return generate_row;
    });

    if (filter_data[0]) {
      callback({ type: "Create_product_history", data: filter_data[0] });
      return true;
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
    item.margin = item.total - item.quantity * item.purchase_rate;
    callback({ type: "Update_product_history", data: item });
    return false;
  };

  if (text === "Customers") {
    var columns = [
      {
        dataField: "id",
        text: "Id",
        hidden: true,
        headerFormatter: headerstyle,
      },

      {
        dataField: "name",
        text: t("name"),
        sort: true,
        headerFormatter: headerstyle,
      },
      {
        dataField: "email",
        text: t("email"),
        sort: true,
        headerFormatter: headerstyle,
      },
      {
        dataField: "contact",
        text: t("phone"),
        sort: true,
        headerFormatter: headerstyle,
      },
      {
        dataField: "ntn",
        text: "NTN",
        sort: true,
        headerFormatter: headerstyle,
      },
      {
        dataField: "strn",
        text: "STRN",
        sort: true,
        headerFormatter: headerstyle,
      },
      {
        dataField: "address",
        text: t("address"),
        sort: true,
        headerFormatter: headerstyle,
      },
    ];

    var selectRow = {
      mode: "radio",
      clickToSelect: true,
      onSelect: (row, isSelect, rowIndex, e) => {
        if (isSelect) {
          if (text === "Customers") {
            setsupplier({ value: row.id, label: row.name });
            onHide();
          }
        }
      },
    };
  } else {
    columns = [
      {
        dataField: "id",
        text: "Id",
        hidden: true,
        headerFormatter: headerstyle,
      },
      {
        dataField: "product_name",
        text: "Product",
        sort: true,
        headerFormatter: headerstyle,
      },
      {
        dataField: "product_code",
        text: "Code",
        sort: true,
        headerFormatter: headerstyle,
      },
      {
        dataField: "quantity",
        text: "Quantity",
        sort: true,
        headerFormatter: headerstyle,
      },
      {
        dataField: "offer",
        text: "Offer",
        sort: true,
        headerFormatter: headerstyle,
      },
      {
        dataField: "scheme",
        text: "Scheme",
        sort: true,
        headerFormatter: headerstyle,
      },

      {
        dataField: "sale_rate",
        text: "Sale Rate",
        sort: true,
        headerFormatter: headerstyle,
      },
    ];

    selectRow = {
      mode: "checkbox",
      clickToSelect: true,
      onSelect: (row, isSelect, rowIndex, e) => {
        if (isSelect) {
          const [flag1, flag2] = addproduct(row, counter);
          if (flag2) {
            custom_toast("Item added");
          }

          if (flag1) {
            setcounter(counter + 1);
          }
        }
      },
      onSelectAll: (isSelect, rows, e) => {
        if (isSelect) {
          var num = counter;

          rows.forEach((row) => {
            const [flag1, flag2] = addproduct(row, num);
            if (flag1) {
              num += 1;
            }
          });
          setcounter(num);
          custom_toast("Items added");
        }
      },
    };
  }

  const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total ms-2">
      Showing {from} to {to} of {size} Results
    </span>
  );

  const options = {
    paginationSize: 4,
    pageStartIndex: 1,
    firstPageText: "First",
    showTotal: true,
    paginationTotalRenderer: customTotal,
    disablePageTitle: true,
    sizePerPageList: [
      {
        text: "10",
        value: 10,
      },
      {
        text: "20",
        value: 20,
      },
      {
        text: "All",
        value: data.length,
      },
    ], // A numeric array is also available. the purpose of above example is custom the text
  };

  const rowstyle = { height: "10px" };

  const rowClasses = (row, rowIndex) => {
    let classes = null;

    if (row.quantity === 0) {
      classes = "zero-quantity";
    }

    return classes;
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      style={{ zoom: ".7" }}
    >
      <Modal.Header closeButton>
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="d-flex align-items-md-center"
        >
          {text}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ToolkitProvider
          keyField="id"
          data={data}
          columns={columns}
          search
          exportCSV
        >
          {(props) => (
            <div>
              {text === "Products" ? (
                <div className="text-end mt-3">
                  <SearchBar {...props.searchProps} />
                </div>
              ) : (
                <div className="d-flex flex-row-reverse justify-content-between align-items-center mt-3">
                  <SearchBar {...props.searchProps} />
                </div>
              )}

              {isloading && (
                <div className="text-center">
                  <Spinner animation="border" variant="primary" />
                </div>
              )}

              <hr />
              <div style={{ height: "60vh", overflow: "auto" }}>
                <BootstrapTable
                  {...props.baseProps}
                  pagination={paginationFactory(options)}
                  rowStyle={rowstyle}
                  striped
                  bootstrap4
                  condensed
                  rowClasses={rowClasses}
                  selectRow={selectRow}
                  wrapperClasses="table-responsive"
                />
              </div>
            </div>
          )}
        </ToolkitProvider>
      </Modal.Body>
    </Modal>
  );
}

export default Saleform;
