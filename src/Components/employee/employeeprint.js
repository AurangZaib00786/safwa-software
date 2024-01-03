import React, { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import "./employeeprint.css";

function EmployeePrint(props) {
  const company = JSON.parse(localStorage.getItem("selected_branch"));

  const data = JSON.parse(localStorage.getItem("data"));

  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    bodyClass: "printclass",
    onAfterPrint: (e) => {
      // console.log(e)
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

          <h4 className=" mb-4 text-center">
            <strong>Employee Form</strong>
          </h4>

          <div className="border border-dark pe-2 ps-2 ">
            <div className="d-flex mt-3 ">
              <div className="col-6 me-2 ">
                <p className="d-flex m-0" style={{ fontSize: "0.8rem" }}>
                  <div className="col-6">Name : </div>
                  <strong className="col-6">{data.name}</strong>
                </p>

                <p className="d-flex m-0" style={{ fontSize: "0.8rem" }}>
                  <div className="col-6">Contact : </div>
                  <strong className="col-6">{data.contact}</strong>
                </p>
              </div>
              <div className="col-6 ">
                <p className="d-flex m-0" style={{ fontSize: "0.8rem" }}>
                  <div className="col-6">اسم : </div>
                  <strong className="col-6">{data.arabic_name}</strong>
                </p>
                <p className="d-flex m-0" style={{ fontSize: "0.8rem" }}>
                  <div className="col-6">Nationality : </div>
                  <strong className="col-6">{data.country}</strong>
                </p>
              </div>
            </div>

            <div className=" ">
              <p className=" m-0" style={{ fontSize: "0.8rem" }}>
                Address :<strong className="ms-2">{data.address}</strong>
              </p>
            </div>

            <div className="d-flex mt-3 mb-2">
              <div className="col-6 me-2 ">
                <p className="d-flex m-0" style={{ fontSize: "0.8rem" }}>
                  <div className="col-6">Category : </div>
                  <strong className="col-6">{data.category_name}</strong>
                </p>
                <p className="d-flex m-0" style={{ fontSize: "0.8rem" }}>
                  <div className="col-6">Working Hours : </div>
                  <strong className="col-6">{data.working_hours}</strong>
                </p>
                <p className="d-flex m-0" style={{ fontSize: "0.8rem" }}>
                  <div className="col-6">Wage Type: </div>
                  <strong className="col-6">{data.type}</strong>
                </p>
                <p className="d-flex m-0" style={{ fontSize: "0.8rem" }}>
                  <div className="col-6">Salary : </div>
                  <strong className="col-6">{data.salary}</strong>
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

                {data.type !== "Daily Wage" && (
                  <p className="d-flex m-0" style={{ fontSize: "0.8rem" }}>
                    <div className="col-6">Food Allowance : </div>
                    <strong className="col-6">{data.food_allowance}</strong>
                  </p>
                )}
                {data.type !== "Daily Wage" && (
                  <p className="d-flex m-0" style={{ fontSize: "0.8rem" }}>
                    <div className="col-6">PR Allowance : </div>
                    <strong className="col-6">{data.pr_allowance}</strong>
                  </p>
                )}
                <p className="d-flex m-0" style={{ fontSize: "0.8rem" }}>
                  <div className="col-6">Hire Date : </div>
                  <strong className="col-6">{data.hiring_date}</strong>
                </p>
                <p className="d-flex m-0" style={{ fontSize: "0.8rem" }}>
                  <div className="col-6">Fire Date: </div>
                  <strong className="col-6">{data.expelled_date}</strong>
                </p>
              </div>

              <div className="col-6 ">
                <p className="d-flex m-0" style={{ fontSize: "0.8rem" }}>
                  <div className="col-6">Passport No. : </div>
                  <strong className="col-6">{data.passport_number}</strong>
                </p>
                <p className="d-flex m-0" style={{ fontSize: "0.8rem" }}>
                  <div className="col-6">Passport Expire Date : </div>
                  <strong className="col-6">{data.passport_expiry_date}</strong>
                </p>

                <p className="d-flex m-0" style={{ fontSize: "0.8rem" }}>
                  <div className="col-6">Muncipilaty No : </div>
                  <strong className="col-6">{data.identity_number}</strong>
                </p>
                <p className="d-flex m-0" style={{ fontSize: "0.8rem" }}>
                  <div className="col-6">Muncipilaty Expire Date : </div>
                  <strong className="col-6">{data.identity_expiry_date}</strong>
                </p>

                <p className="d-flex m-0" style={{ fontSize: "0.8rem" }}>
                  <div className="col-6">Driving License : </div>
                  <strong className="col-6">
                    {data.driving_license_number}
                  </strong>
                </p>
                <p className="d-flex m-0" style={{ fontSize: "0.8rem" }}>
                  <div className="col-6">License Expire Date : </div>
                  <strong className="col-6">{data.driving_license_date}</strong>
                </p>

                <p className="d-flex m-0" style={{ fontSize: "0.8rem" }}>
                  <div className="col-6"> Work Permit No : </div>
                  <strong className="col-6">{data.work_permit_number}</strong>
                </p>
                <p className="d-flex m-0" style={{ fontSize: "0.8rem" }}>
                  <div className="col-6">Permit Expire Date : </div>
                  <strong className="col-6">{data.work_permit_date}</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between  mt-5 ">
            <p className="border-top border-dark ps-3 pe-3 me-2 text-center">
              Employee{" "}
            </p>
            <p className="border-top border-dark ps-3 pe-3 me-2 text-center">
              Manager{" "}
            </p>
            <p className="border-top border-dark ps-3 pe-3 me-2 text-center">
              Accountant{" "}
            </p>
            <p className="border-top border-dark ps-3 pe-3 me-2 text-center">
              HR Dept.{" "}
            </p>
            <p className="border-top border-dark ps-3 pe-3 me-2 text-center">
              Dept.Head{" "}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default EmployeePrint;
