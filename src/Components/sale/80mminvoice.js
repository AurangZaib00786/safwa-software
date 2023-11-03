import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { useReactToPrint } from "react-to-print";
import "./80mminvoice.css";

function Invoice80mm(props) {
  const { name } = useParams();
  const [company, setcompany] = useState(
    JSON.parse(localStorage.getItem("selected_branch"))
  );
  const response = JSON.parse(localStorage.getItem("data"));
  const [data, setdata] = useState(response);
  const [customer, setcustomer] = useState(response.customer_info);
  const [details, setdetails] = useState(response.details);

  const headerstyle = (column, colIndex, { sortElement }) => {
    return <div className="d-flex align-items-center">{column.text}</div>;
  };
  const columns = [
    {
      dataField: "product_name",
      text: "Name",
      headerFormatter: headerstyle,
    },
    { dataField: "quantity", text: "Qty", headerFormatter: headerstyle },
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
    bodyClass: "printclass1",
    // pageStyle: "@page { width:80mm;height:auto }",
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
    <div style={{ width: "80mm", height: "auto" }} ref={componentRef}>
      {data && (
        <div className="container_1 p-2">
          <div className=" text-center">
            {company?.logo && (
              <img
                src={company.logo}
                alt="logo"
                width={"100"}
                height={"80"}
              ></img>
            )}
          </div>

          <h5 className="text-center m-0">
            <strong>{company.name}</strong>
          </h5>

          <div className="text-center">
            {company?.contact && (
              <p className="m-0" style={{ fontWeight: "normal" }}>
                {company.contact}
              </p>
            )}

            {company?.address && (
              <p className="m-0" style={{ fontWeight: "normal" }}>
                {company.address}
              </p>
            )}
          </div>

          {name === "sales" && (
            <h5
              className="text-center ms-1 me-1"
              style={{ border: "1px solid black", borderRadius: "5px" }}
            >
              Sale Invoice
            </h5>
          )}

          {name === "sales_return" && (
            <h5
              className="text-center  ms-1 me-1"
              style={{ border: "1px solid black", borderRadius: "5px" }}
            >
              Sale Return
            </h5>
          )}

          {name === "purchases" && (
            <h5
              className="text-center  ms-1 me-1"
              style={{ border: "1px solid black", borderRadius: "5px" }}
            >
              Purchase Invoice
            </h5>
          )}
          {name === "purchases_return" && (
            <h5
              className="text-center  ms-1 me-1"
              style={{
                border: "1px solid black",
                borderRadius: "5px",
              }}
            >
              Purchase Return
            </h5>
          )}
          {name === "quotation" && (
            <h5
              className="text-center  ms-1 me-1"
              style={{ border: "1px solid black", borderRadius: "5px" }}
            >
              Quotation
            </h5>
          )}

          {(name === "sales" || name === "sales_return") && (
            <div
              className="d-flex justify-content-between mt-1 p-2 "
              style={{ border: "1px solid black", borderRadius: "5px" }}
            >
              <div className=" text-left">
                <p className="m-0">Party : {customer.name}</p>
              </div>
              <div className=" text-left">
                <p className=" m-0">Bill No : {data.invoice}</p>
                <p className=" m-0">Date : {data.date}</p>
              </div>
            </div>
          )}

          {(name === "purchases" || name === "purchases_return") && (
            <div
              className="d-flex justify-content-between mt-1 p-2 "
              style={{ border: "1px solid black", borderRadius: "5px" }}
            >
              <div className=" text-left">
                <p className="m-0">Party : {data.supplier_name}</p>
              </div>
              <div className=" text-left">
                <p className=" m-0">Bill No : {data.invoice}</p>
                <p className=" m-0">Date : {data.date}</p>
              </div>
            </div>
          )}

          <div className="mt-2 ">
            <BootstrapTable
              keyField="id"
              data={details}
              columns={columns}
              bordered={false}
              bootstrap4
              condensed
              classes="table_class_80mm"
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
          <h4 className=" text-center mt-3">Thanks For Visiting ! </h4>
        </div>
      )}
    </div>
  );
}

export default Invoice80mm;
