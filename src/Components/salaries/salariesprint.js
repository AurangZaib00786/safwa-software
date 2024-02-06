import React, { useState, useEffect, useRef } from "react";
import numberToWords from "number-to-words";
import { useReactToPrint } from "react-to-print";

function Salary_Print() {
  const company = JSON.parse(localStorage.getItem("selected_branch"));
  const data = JSON.parse(localStorage.getItem("data"));

  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    bodyClass: "printclass",
    onAfterPrint: () => {
      // window.close();
    },
  });

  useEffect(() => {
    if (data) {
      handleprint();
    }
  }, [data]);

  const changetonumber = () => {
    const words = numberToWords.toWords(data?.total_salary).split(" ");
    const camel_case = words.map((item) => {
      const word = item[0].toUpperCase() + item.substring(1);
      return word;
    });
    return camel_case.join(" ");
  };

  return (
    <div className=" w-100 " ref={componentRef}>
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
            <strong>PaySlip</strong>
          </h4>

          <div className="d-flex justify-content-between mt-1 p-2 ">
            <div className="col-6 text-left">
              <p className="d-flex justify-content-between m-0">
                <span className="col-6 me-3">Date of Joining:</span>
                <span className="col-6 me-3">
                  {data.employee_info?.hiring_date}
                </span>
              </p>
              <p className="d-flex justify-content-between m-0">
                <span className="col-6 me-3">Pay Period:</span>
                <span className="col-6 me-3">{data.month}</span>
              </p>
              <p className="d-flex justify-content-between m-0">
                <span className="col-6 me-3">Worked Days:</span>
                <span className="col-6 me-3">{data.working_days}</span>
              </p>
              <p className="d-flex justify-content-between m-0">
                <span className="col-6 me-3">Absent Days:</span>
                <span className="col-6 me-3">{data.absent_days}</span>
              </p>
            </div>
            <div className="col-6  text-left">
              <p className="d-flex justify-content-between m-0">
                <span className="col-6 me-3">Employee Name:</span>
                <span className="col-6 me-3">{data.employee_info?.name}</span>
              </p>
              <p className="d-flex justify-content-between m-0">
                <span className="col-6 me-3">Deesignation:</span>
                <span className="col-6 me-3">
                  {data.employee_info?.category_name}
                </span>
              </p>
              <p className="d-flex justify-content-between m-0">
                <span className="col-6 me-3">Type</span>
                <span className="col-6 me-3">{data.employee_info?.type}</span>
              </p>
            </div>
          </div>

          <div>
            <table className="table table-bordered border-dark">
              <thead>
                <tr>
                  <th>Earnings</th>
                  <th>Amount</th>
                  <th>Deductions</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Salary</td>
                  <td className="text-end">{data?.employee_info?.salary}</td>
                  <td>Absent Days</td>
                  <td className="text-end">
                    {data?.salary * data?.absent_days}
                  </td>
                </tr>
                <tr>
                  <td>Food Allowance</td>
                  <td className="text-end">
                    {data?.employee_info?.food_allowance}
                  </td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Accomodation Allowance</td>
                  <td className="text-end">
                    {data?.employee_info?.accomodation_allowance}
                  </td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Transport Allowance</td>
                  <td className="text-end">
                    {data?.employee_info?.transport_allowance}
                  </td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>PR Allowance</td>
                  <td className="text-end">
                    {data?.employee_info?.pr_allowance}
                  </td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Extra Allowance</td>
                  <td className="text-end">
                    {data?.employee_info?.extra_allowance}
                  </td>
                  <td></td>
                  <td></td>
                </tr>
                <tr style={{ height: "40px" }}>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr style={{ fontWeight: "bold" }}>
                  <td className="text-end">Total Earnings</td>
                  <td className="text-end">
                    {data?.salary * data?.working_days}
                  </td>
                  <td className="text-end">Total Deductions</td>
                  <td className="text-end">
                    {data?.salary * data?.absent_days}
                  </td>
                </tr>
                <tr style={{ fontWeight: "bold" }}>
                  <td className="text-end"></td>
                  <td className="text-end"></td>
                  <td className="text-end">Net Pay</td>
                  <td className="text-end">{data?.total_salary}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h5 className=" mb-0 text-center">
            <strong>{data?.total_salary}</strong>
          </h5>
          <h5 className=" mb-5 text-center">
            <strong>{changetonumber()}</strong>
          </h5>
          <div className="d-flex justify-content-between">
            <div className="col-6 d-flex flex-column align-items-center">
              <h6 className=" mb-5">Employer Signature</h6>
              <h5 className="col-10 border-bottom border-dark"></h5>
            </div>
            <div className="col-6 d-flex flex-column align-items-center">
              <h6 className=" mb-5">Employee Signature</h6>
              <h5 className="col-10 border-bottom border-dark"></h5>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Salary_Print;
