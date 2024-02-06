import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { useReactToPrint } from "react-to-print";

import "./sale_invoice.css";

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
    {
      dataField: "description",
      text: "Description",
      formatter: name_column_formater,
      headerFormatter: headerstyle,
    },
    {
      dataField: "meal_type",
      text: "Meal Type",

      headerFormatter: headerstyle,
    },
    {
      dataField: "pax",
      text: "Pax",

      headerFormatter: headerstyle,
    },
    { dataField: "days", text: "Days", headerFormatter: headerstyle },
    { dataField: "price", text: "Price", headerFormatter: headerstyle },
    {
      dataField: "total",
      text: "Total",
      headerFormatter: headerstyle,
    },
  ];

  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    bodyClass: "printclass",
    onAfterPrint: () => {},
  });

  useEffect(() => {
    if (data) {
      handleprint();
    }
  }, [data]);

  return (
    <div className=" w-100 " ref={componentRef}>
      {data && (
        <div className="">
          <div className="d-flex">
            {company?.logo && (
              <div className="col-4 text-start">
                <img
                  src={company?.logo}
                  alt="logo"
                  width={"200"}
                  height={"100"}
                ></img>
              </div>
            )}

            <div className="col-4 text-center">
              <h5 className="mb-2 text-center">
                <strong>{company?.name}</strong>
              </h5>
              <h5 className="mb-2 text-center">
                <strong>{company?.arabic_name}</strong>
              </h5>
            </div>

            <div className="col-4  text-end">
              {company?.contact && (
                <p className="m-0 " style={{ fontSize: "0.8rem" }}>
                  <strong>Contact : </strong>
                  {company?.contact}
                </p>
              )}
              {company?.email && (
                <p className=" m-0 " style={{ fontSize: "0.8rem" }}>
                  <strong>Email : </strong>
                  {company?.email}
                </p>
              )}
              {company?.vat_number && (
                <p className=" m-0 " style={{ fontSize: "0.8rem" }}>
                  <strong>VAT No. : </strong>
                  {company?.vat_number}
                </p>
              )}
              {company?.address && (
                <p className=" m-0 " style={{ fontSize: "0.8rem" }}>
                  <strong>Address :</strong> {company?.address}
                </p>
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

          {(name === "sales" || name === "sales_return") && (
            <div
              className="d-flex justify-content-between mt-1 p-2 ms-1 me-1"
              style={{ border: "1px solid black", borderRadius: "5px" }}
            >
              <div className=" ">
                <h6 className="m-0">Customer Details :</h6>
                {customer?.name && <p className="m-0">{customer.name}</p>}
                {customer?.ntn && <p className="m-0">NTN: {customer.ntn}</p>}
                {customer?.strn && <p className="m-0">STRN: {customer.strn}</p>}
                {customer?.cnic && <p className="m-0">CNIC: {customer.cnic}</p>}
                {customer?.contact && (
                  <p className="m-0">Contact: {customer.contact}</p>
                )}
                {customer?.address && (
                  <p className="m-0">Address: {customer.address}</p>
                )}
              </div>
              <div className=" ">
                <p className="d-flex justify-content-between m-0">
                  <span className="  me-3">Invoive no:</span>
                  <span className="   me-3">{data.invoice}</span>
                </p>
                <p className="d-flex justify-content-between m-0">
                  <span className=" me-3">Invoice Date:</span>
                  <span className=" me-3">{data.date}</span>
                </p>
                <p className="d-flex justify-content-between m-0">
                  <span className=" me-3">Payment Type:</span>
                  <span className=" me-3">{data.payment_type} </span>
                </p>
                <p className="d-flex justify-content-between m-0">
                  <span className=" me-3">Sale Person:</span>
                  <span className=" me-3">{data.sale_person_name} </span>
                </p>
                <p className="d-flex justify-content-between m-0">
                  <span className=" me-3">Orders:</span>
                  <span className=" me-3">
                    {data.orders_detail.map(
                      (item) => `ID-${String(item.order).padStart(3, "0")}, `
                    )}{" "}
                  </span>
                </p>
              </div>
            </div>
          )}

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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Invoice;
