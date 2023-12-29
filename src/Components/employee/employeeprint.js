import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { useReactToPrint } from "react-to-print";
import QRCode from "react-qr-code";
import numberToWords from "number-to-words";
import "./employeeprint.css";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import RoomIcon from "@material-ui/icons/Room";
import DraftsIcon from "@material-ui/icons/Drafts";

function EmployeePrint(props) {
  const company = JSON.parse(localStorage.getItem("selected_branch"));

  const data = JSON.parse(localStorage.getItem("data"));

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
    <div className="mydiv p-3" ref={componentRef}>
      {data && (
        <>
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
                  <strong>Mail : </strong>
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

          <h4 className=" mb-4 text-center">
            <strong className="ps-3 pe-3 border-bottom border-dark ">
              Employee Form
            </strong>
          </h4>

          <div className="border border-dark pe-2 ps-2 ">
            <h4 className="text-center">
              <strong className="ps-3 pe-3 border-bottom border-dark ">
                Employee Data
              </strong>
            </h4>

            <div className="d-flex mt-3 ">
              <div className="col-6 me-2 ">
                <p className="d-flex m-0" style={{ fontSize: "0.8rem" }}>
                  <div className="col-4">Name : </div>
                  <strong className="col-8">{data.name}</strong>
                </p>

                <p className="d-flex m-0" style={{ fontSize: "0.8rem" }}>
                  <div className="col-4">Contact : </div>
                  <strong className="col-8">{data.contact}</strong>
                </p>
              </div>
              <div className="col-6 ">
                <p className="d-flex m-0" style={{ fontSize: "0.8rem" }}>
                  <div className="col-4">Arabic Name : </div>
                  <strong className="col-8">{data.arabic_name}</strong>
                </p>
                <p className="d-flex m-0" style={{ fontSize: "0.8rem" }}>
                  <div className="col-4">Nationality : </div>
                  <strong className="col-8">{data.country}</strong>
                </p>
              </div>
            </div>

            <div className=" mt-2 ">
              <p className=" m-0" style={{ fontSize: "0.8rem" }}>
                Address :<strong className="ms-2">{data.address}</strong>
              </p>
            </div>

            <div className="d-flex justify-content-between  mt-2">
              <p
                className="d-flex justify-content-between col-6 m-0"
                style={{ fontSize: "0.8rem" }}
              >
                <p className="col-6 m-0">
                  Passport No. :
                  <strong className="ms-2">{data.passport_number}</strong>
                </p>
                <p className="col-6 m-0">
                  Expiry Date. :
                  <strong className="ms-2">{data.passport_expiry_date}</strong>
                </p>
              </p>

              <p
                className="d-flex justify-content-between col-6 m-0"
                style={{ fontSize: "0.8rem" }}
              >
                <p className="col-6 m-0">
                  Muncipilaty No. :
                  <strong className="ms-2">{data.identity_number}</strong>
                </p>
                <p className="col-6 m-0">
                  Expiry Date. :
                  <strong className="ms-2">{data.identity_expiry_date}</strong>
                </p>
              </p>
            </div>
            <div className="d-flex justify-content-between  mt-2">
              <p
                className="d-flex justify-content-between col-6 m-0"
                style={{ fontSize: "0.8rem" }}
              >
                <p className="col-6 m-0">
                  Driving License :
                  <strong className="ms-2">
                    {data.driving_license_number}
                  </strong>
                </p>
                <p className="col-6 m-0">
                  Expiry Date. :
                  <strong className="ms-2">{data.driving_license_date}</strong>
                </p>
              </p>

              <p
                className="d-flex justify-content-between col-6 m-0"
                style={{ fontSize: "0.8rem" }}
              >
                <p className="col-6 m-0">
                  Work Permit No. :
                  <strong className="ms-2">{data.work_permit_number}</strong>
                </p>
                <p className="col-6 m-0">
                  Expiry Date. :
                  <strong className="ms-2">{data.work_permit_date}</strong>
                </p>
              </p>
            </div>

            <div className="d-flex mt-3 ">
              <div className="col-6 me-2 ">
                <p className="d-flex m-0" style={{ fontSize: "0.8rem" }}>
                  <div className="col-6">Category : </div>
                  <strong className="col-6">{data.category_name}</strong>
                </p>
                <p className="d-flex m-0" style={{ fontSize: "0.8rem" }}>
                  <div className="col-6">Working Hours : </div>
                  <strong className="col-6">{data.working_hours}</strong>
                </p>
                {data.type !== "Daily Wage" && (
                  <p className="d-flex m-0" style={{ fontSize: "0.8rem" }}>
                    <div className="col-6">Transport Allowance : </div>
                    <strong className="col-6">
                      {data.transport_allowance}
                    </strong>
                  </p>
                )}
                {data.type !== "Daily Wage" && (
                  <p className="d-flex m-0" style={{ fontSize: "0.8rem" }}>
                    <div className="col-6">Accomodation Allowance : </div>
                    <strong className="col-6">
                      {data.accomodation_allowance}
                    </strong>
                  </p>
                )}
                {data.type !== "Daily Wage" && (
                  <p className="d-flex m-0" style={{ fontSize: "0.8rem" }}>
                    <div className="col-6">Extra Allowance : </div>
                    <strong className="col-6">{data.extra_allowance}</strong>
                  </p>
                )}
              </div>

              <div className="col-6 ">
                <p className="d-flex m-0" style={{ fontSize: "0.8rem" }}>
                  <div className="col-4">Wage Type: </div>
                  <strong className="col-8">{data.type}</strong>
                </p>
                <p className="d-flex m-0" style={{ fontSize: "0.8rem" }}>
                  <div className="col-4">Salary : </div>
                  <strong className="col-8">{data.salary}</strong>
                </p>
                {data.type !== "Daily Wage" && (
                  <p className="d-flex m-0" style={{ fontSize: "0.8rem" }}>
                    <div className="col-4">Food Allowance : </div>
                    <strong className="col-8">{data.food_allowance}</strong>
                  </p>
                )}
                {data.type !== "Daily Wage" && (
                  <p className="d-flex m-0" style={{ fontSize: "0.8rem" }}>
                    <div className="col-4">PR Allowance : </div>
                    <strong className="col-8">{data.pr_allowance}</strong>
                  </p>
                )}
              </div>
            </div>

            <div className="d-flex mt-3 ">
              <div className="col-6 me-2 ">
                <p className="d-flex m-0" style={{ fontSize: "0.8rem" }}>
                  <div className="col-6">Hire Date : </div>
                  <strong className="col-6">{data.hiring_date}</strong>
                </p>
              </div>

              <div className="col-6 ">
                <p className="d-flex m-0" style={{ fontSize: "0.8rem" }}>
                  <div className="col-4">Fire Date: </div>
                  <strong className="col-8">{data.expelled_date}</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="d-flex border border-dark mb-3">
            <div style={{ width: "20%" }} className="border-end border-dark">
              <div className="border-bottom border-dark text-center">
                Employee
              </div>
              <div style={{ height: "0.7in" }}></div>
            </div>
            <div style={{ width: "20%" }} className="border-end border-dark">
              <div className="border-bottom border-dark text-center">
                Manager
              </div>
              <div style={{ height: "0.7in" }}></div>
            </div>
            <div style={{ width: "20%" }} className="border-end border-dark">
              <div className="border-bottom border-dark text-center">
                Accountant
              </div>
              <div style={{ height: "0.7in" }}></div>
            </div>
            <div style={{ width: "20%" }} className="border-end border-dark">
              <div className="border-bottom border-dark text-center">
                HR Dept.
              </div>
              <div style={{ height: "0.7in" }}></div>
            </div>
            <div style={{ width: "20%" }} className="border-end border-dark">
              <div className="border-bottom border-dark text-center">
                Dept.Head
              </div>
              <div style={{ height: "0.7in" }}></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default EmployeePrint;
