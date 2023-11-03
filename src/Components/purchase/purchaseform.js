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
import { Avatar } from "@material-ui/core";
import "./Purchase.css";
import { ToastContainer } from "react-toastify";
import custom_toast from "../alerts/custom_toast";
import went_wrong_toast from "../alerts/went_wrong_toast";
import Spinner from "react-bootstrap/Spinner";
import Select from "react-select";
import { useTranslation } from "react-i18next";

function Purchaseform({
  show,
  onHide,
  callback,
  text,
  counter,
  setcounter,
  setsupplier,
  table_data,
  tax_perc,
  data_,
}) {
  const { t } = useTranslation();
  const [isloading, setisloading] = useState(false);
  const [data, setdata] = useState(data_);
  const { SearchBar } = Search;

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

    if (item_present.length === 0) {
      var filter_data = data.filter((item) => {
        if (item.id === row.id) {
          return item;
        }
      });

      filter_data = filter_data.map((item) => {
        return {
          stock: item.id,
          prod_id: num,
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
      callback({ type: "Create_product_history", data: filter_data[0] });
      return true;
    } else {
      const item = item_present[0];
      item.quantity = item.quantity + 1;
      item.sub_total = item.quantity * item.price;
      item.tax_amount = (item.sub_total / 100) * item.tax_percentage;
      item.total = item.sub_total + item.tax_amount;
      callback({ type: "Update_product_history", data: item });
      return false;
    }
  };

  if (text === "Suppliers") {
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
          setsupplier({ value: row.id, label: row.name });
          onHide();
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
        const flag = addproduct(row, counter);
        custom_toast("Item added");
        if (flag) {
          setcounter(counter + 1);
        }
      },
      onSelectAll: (isSelect, rows, e) => {
        if (isSelect) {
          var num = counter;

          rows.forEach((row) => {
            const flag = addproduct(row, num);
            if (flag) {
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
              <div className="d-flex flex-row-reverse justify-content-between align-items-center mt-3">
                <SearchBar {...props.searchProps} />
              </div>

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

export default Purchaseform;
