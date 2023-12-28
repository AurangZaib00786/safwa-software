import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { useReactToPrint } from "react-to-print";
import QRCode from "react-qr-code";
import numberToWords from "number-to-words";
import "./sale_invoice.css";
import { toArabicWord } from "number-to-arabic-words/dist/index-node.js";

function Invoice(props) {
  const { name } = useParams();
  const company = JSON.parse(localStorage.getItem("selected_branch"));

  const data = JSON.parse(localStorage.getItem("data"));

  const customer = data.customer_info;
  const details = data.details;

  const name_column_formater = (cell, row) => {
    return <div style={{ width: "20vw" }}>{cell}</div>;
  };
  const headerstyle = (column, colIndex, { sortElement }) => {
    return (
      <div
        className="d-flex align-items-center"
        style={{ minHeight: "2.5rem" }}
      >
        {column.text}
      </div>
    );
  };
  const columns = [
    {
      dataField: "id",
      text: "#",
      formatter: (cell, row, rowIndex) => {
        return rowIndex + 1;
      },
    },
    { dataField: "product_code", text: "Code", headerFormatter: headerstyle },
    {
      dataField: "product_name",
      text: "Name",
      formatter: name_column_formater,
      headerFormatter: headerstyle,
    },
    { dataField: "quantity", text: "Qty", headerFormatter: headerstyle },
    { dataField: "price", text: "Price", headerFormatter: headerstyle },
  ];
  var offeer = 0;
  var scheme = 0;
  var discount = 0;
  data.details.map((item) => {
    offeer += item.offer_value;
    scheme += item.scheme_value;
    discount += item.discount_amount;
  });
  if (offeer > 0) {
    columns.push({
      dataField: "offer_value",
      text: "Offer Value",
      headerFormatter: headerstyle,
    });
  }
  if (scheme > 0) {
    columns.push({
      dataField: "scheme_value",
      text: "Scheme Value",
      headerFormatter: headerstyle,
    });
  }
  if (discount > 0) {
    columns.push({
      dataField: "discount_amount",
      text: "Discount Value",
      headerFormatter: headerstyle,
    });
  }
  columns.push({
    dataField: "total",
    text: "Total",
    headerFormatter: headerstyle,
  });

  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    bodyClass: "printclass",
    onAfterPrint: () => {
      window.close();
    },
  });

  useEffect(() => {
    if (data) {
      handleprint();
    }
  }, [data]);

  return (
    <div className=" w-100 " ref={componentRef}>
      {data && (
        <div className="container_1 p-4">
          <div className="row  ms-1 me-1">
            <div className="col-sm-4 text-start">
              {company?.ntn && (
                <p className="m-0" style={{ fontWeight: "normal" }}>
                  NTN : {company.ntn}
                </p>
              )}
              {company?.strn && (
                <p className="m-0" style={{ fontWeight: "normal" }}>
                  STRN: {company.strn}
                </p>
              )}
              {company?.strn && (
                <p className="m-0" style={{ fontWeight: "normal" }}>
                  Contact: {company.contact}
                </p>
              )}
              {company?.address && (
                <p className="m-0" style={{ fontWeight: "normal" }}>
                  Adresss: {company.address}
                </p>
              )}
              {company?.email && (
                <p className="m-0" style={{ fontWeight: "normal" }}>
                  Email: {company.email}
                </p>
              )}
              {company?.bank_details && (
                <p className="m-0" style={{ fontWeight: "normal" }}>
                  Bank Details: {company.bank_details}
                </p>
              )}
            </div>
            <div className="col-sm-4 d-flex justify-content-center align-items-center">
              <h5 className="m-0">
                <strong>{company.name}</strong>
              </h5>
            </div>
            <div className="col-sm-4 text-end">
              {company?.logo && (
                <img
                  src={company.logo}
                  alt="logo"
                  width={"100"}
                  height={"80"}
                ></img>
              )}
            </div>
          </div>

          {name === "sales" && (
            <h5
              className="text-center mt-2 ms-1 me-1"
              style={{ border: "1px solid black", borderRadius: "5px" }}
            >
              Sale Invoice
            </h5>
          )}

          {name === "sales_return" && (
            <h5
              className="text-center mt-2 ms-1 me-1"
              style={{ border: "1px solid black", borderRadius: "5px" }}
            >
              Sale Return
            </h5>
          )}

          {name === "purchases" && (
            <h5
              className="text-center mt-4 ms-1 me-1"
              style={{ border: "1px solid black", borderRadius: "5px" }}
            >
              Purchase Invoice
            </h5>
          )}
          {name === "purchases_return" && (
            <h5
              className="text-center mt-4 ms-1 me-1"
              style={{ border: "1px solid black", borderRadius: "5px" }}
            >
              Purchase Return
            </h5>
          )}
          {name === "quotation" && (
            <h5
              className="text-center mt-4 ms-1 me-1"
              style={{ border: "1px solid black", borderRadius: "5px" }}
            >
              Quotation
            </h5>
          )}

          {name === "sales" ||
            (name === "sales_return" && (
              <div
                className="d-flex justify-content-between mt-1 p-2 ms-1 me-1"
                style={{ border: "1px solid black", borderRadius: "5px" }}
              >
                <div className=" text-left">
                  <h6 className="m-0">Customer Details :</h6>
                  {customer?.name && <p className="m-0">{customer.name}</p>}
                  {customer?.ntn && <p className="m-0">NTN: {customer.ntn}</p>}
                  {customer?.strn && (
                    <p className="m-0">STRN: {customer.strn}</p>
                  )}
                  {customer?.cnic && (
                    <p className="m-0">CNIC: {customer.cnic}</p>
                  )}
                  {customer?.contact && (
                    <p className="m-0">Contact: {customer.contact}</p>
                  )}
                  {customer?.address && (
                    <p className="m-0">Address: {customer.address}</p>
                  )}
                </div>
                <div className=" text-left">
                  <p className="d-flex justify-content-between m-0">
                    <span className="me-3">Invoive no:</span>
                    <span className="me-3">{data.invoice}</span>
                  </p>
                  <p className="d-flex justify-content-between m-0">
                    <span className="me-3">Invoive Date:</span>
                    <span className="me-3">{data.date}</span>
                  </p>
                  <p className="d-flex justify-content-between m-0">
                    <span className="me-3">Payment Type:</span>
                    <span className="me-3">{data.payment_type} </span>
                  </p>
                  <p className="d-flex justify-content-between m-0">
                    <span className="me-3">Sale Person:</span>
                    <span className="me-3">{data.sale_person_name} </span>
                  </p>
                  <p className="d-flex justify-content-between m-0">
                    <span className="me-3">User:</span>
                    <span className="me-3">{data.user_name} </span>
                  </p>
                </div>
              </div>
            ))}

          {name === "purchases" ||
            (name === "purchases_return" && (
              <div
                className="d-flex justify-content-between mt-1 p-2 ms-1 me-1"
                style={{ border: "1px solid black", borderRadius: "5px" }}
              >
                <div className=" text-left">
                  <h6 className="m-0">Supplier Details :</h6>
                  <p className="m-0">{data.supplier_name}</p>
                </div>
                <div className=" text-left">
                  <p className="d-flex justify-content-between m-0">
                    <span className="me-3">Invoive no:</span>
                    <span className="me-3">{data.invoice}</span>
                  </p>
                  <p className="d-flex justify-content-between m-0">
                    <span className="me-3">Invoive Date:</span>
                    <span className="me-3">{data.date}</span>
                  </p>
                  <p className="d-flex justify-content-between m-0">
                    <span className="me-3">Payment Type:</span>
                    <span className="me-3">{data.payment_type} </span>
                  </p>

                  <p className="d-flex justify-content-between m-0">
                    <span className="me-3">User:</span>
                    <span className="me-3">{data.user_name} </span>
                  </p>
                </div>
              </div>
            ))}

          <div className="m-1 mt-2 ">
            <BootstrapTable
              keyField="id"
              data={details}
              columns={columns}
              bordered={true}
              bootstrap4
              condensed
              classes="table_class_11"
            />
          </div>
          <div className="d-flex">
            <div className="col-sm-6 p-2 ">
              <p className="m-0" style={{ minHeight: "3vh" }}>
                <strong className="me-2">Notes:</strong>
                {data.remarks}
              </p>
              {company?.terms && (
                <>
                  <h6 className="m-0">Terms & Condition</h6>
                  {company.terms}
                </>
              )}
            </div>
            <div
              className="col-sm-6 p-2 d-flex justify-content-between"
              style={{ border: "1px solid black", borderRadius: "5px" }}
            >
              <div>
                {data.sub_total > 0 && <p className="m-0">SubTotal</p>}
                {data.offer_amount > 0 && <p className="m-0">Offer Value</p>}
                {data.scheme_amount > 0 && <p className="m-0">Scheme Value</p>}
                {data.discount_amount > 0 && <p className="m-0">Discount</p>}
                {data.tax_amount > 0 && <p className="m-0">Tax</p>}
                {data.total > 0 && <p className="m-0">Total</p>}
              </div>

              <div className="text-end">
                {data.sub_total > 0 && <p className="m-0">{data.sub_total}</p>}
                {data.offer_amount > 0 && (
                  <p className="m-0">{data.offer_amount}</p>
                )}
                {data.scheme_amount > 0 && (
                  <p className="m-0">{data.scheme_amount}</p>
                )}
                {data.discount_amount > 0 && (
                  <p className="m-0">{data.discount_amount}</p>
                )}
                {data.tax_amount > 0 && (
                  <p className="m-0">{data.tax_amount}</p>
                )}
                {data.total > 0 && <p className="m-0">{data.total}</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Invoice;
