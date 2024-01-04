import React, { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import "./dailymeal.css";

function Mealform(props) {
  const data = JSON.parse(localStorage.getItem("data"));
  const selected_branch = JSON.parse(localStorage.getItem("selected_branch"));
  const dishes = data?.dish_details;
  const table_data = data?.building_details;

  const new_columns =
    data?.building_details?.length > 0 ? data?.building_details[0] : null;
  const column = new_columns?.pot_details;

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
    <div
      style={{ fontFamily: "Times New Roman" }}
      className=" w-100 p-3"
      ref={componentRef}
    >
      {data && (
        <>
          <div className="d-flex mb-3">
            {selected_branch?.logo && (
              <div className="col-4 text-start">
                <img
                  src={selected_branch?.logo}
                  alt="logo"
                  width={"200"}
                  height={"100"}
                ></img>
              </div>
            )}

            <div className="col-4 text-center">
              <h5 className="mb-2 text-center">
                <strong>{selected_branch?.name}</strong>
              </h5>
              <h5 className="mb-2 text-center">
                <strong>{selected_branch?.arabic_name}</strong>
              </h5>
            </div>

            <div className="col-4  text-end">
              {selected_branch?.contact && (
                <p className="m-0 " style={{ fontSize: "0.8rem" }}>
                  <strong>Contact : </strong>
                  {selected_branch?.contact}
                </p>
              )}
              {selected_branch?.email && (
                <p className=" m-0 " style={{ fontSize: "0.8rem" }}>
                  <strong>Email : </strong>
                  {selected_branch?.email}
                </p>
              )}
              {selected_branch?.vat_number && (
                <p className=" m-0 " style={{ fontSize: "0.8rem" }}>
                  <strong>VAT No. : </strong>
                  {selected_branch?.vat_number}
                </p>
              )}
              {selected_branch?.address && (
                <p className=" m-0 " style={{ fontSize: "0.8rem" }}>
                  <strong>Address :</strong> {selected_branch?.address}
                </p>
              )}
            </div>
          </div>

          <h4 className="text-center mt-2">
            <strong>Daily Meals Report</strong>
          </h4>
          <div className="d-flex justify-content-between mb-2">
            <div>
              <h4 className=" mt-2">
                <strong className="me-3">Customer :</strong>
                {data.customer_name}
              </h4>
              <h4 className=" mt-2">
                <strong className="me-3">Date :</strong>
                {data.date}
              </h4>
            </div>
            <h4 className="mt-2">
              <strong className="me-3">Meal Type :</strong>
              {data.meal_type}
            </h4>
          </div>

          <table
            className="table dailymealtable  table-bordered "
            style={{ width: "100%" }}
          >
            <thead>
              {dishes && (
                <tr>
                  <th className="text-center">
                    <h5 style={{ fontWeight: "bolder" }}>م</h5>
                  </th>
                  <th className="text-center">
                    <h5 style={{ fontWeight: "bolder" }}>فندق</h5>
                  </th>
                  <th colSpan={column.length + 1} className="text-center">
                    <h5
                      className="d-flex justify-content-around align-items-center"
                      style={{ fontWeight: "bolder" }}
                    >
                      <span className="me-2">{data.meal_type}</span>
                      <span className="d-flex">
                        {dishes?.map((dish, index) => {
                          return (
                            <h5
                              key={dish.dish}
                              style={{ fontWeight: "normal" }}
                            >
                              {dish.dish_name}
                              {index < dishes?.length - 1 ? " + " : ""}
                            </h5>
                          );
                        })}
                      </span>
                    </h5>
                  </th>
                </tr>
              )}

              <tr>
                <th rowSpan={2} className="text-center">
                  <h5 style={{ fontWeight: "bolder" }}>Sr. No</h5>
                </th>
                <th rowSpan={2} className="text-center">
                  <h5 style={{ fontWeight: "bolder" }}>Build No.</h5>
                </th>
                <th className="text-center">
                  <h5 style={{ fontWeight: "bolder" }}>حجاج</h5>
                </th>
                {column?.map((item) => {
                  return (
                    <th key={item.id} className="text-center">
                      <h5 style={{ fontWeight: "bolder" }}>
                        {item.arabic_name}
                      </h5>
                    </th>
                  );
                })}
              </tr>

              <tr>
                <th className="text-center">
                  <h5 style={{ fontWeight: "bolder" }}>Haji</h5>
                </th>
                {column?.map((item) => {
                  return (
                    <th key={item.id} className="text-center">
                      <h5 style={{ fontWeight: "bolder" }}>{item.name}</h5>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {table_data?.map((item, index) => {
                return (
                  <tr key={item.id}>
                    <td style={{ width: "0.5in" }}>{index + 1}</td>

                    <td
                      style={{ width: "3in" }}
                      className=" pt-0 pb-0 text-center"
                    >
                      <h5 style={{ fontWeight: "normal" }}>
                        {item.building_number}
                      </h5>
                    </td>

                    <td
                      style={{ width: "2in" }}
                      className="pt-0 pb-0  text-center"
                    >
                      <h5 style={{ fontWeight: "normal" }}>{item.hujaj}</h5>
                    </td>

                    {item?.pot_details?.map((pot) => {
                      return (
                        <td
                          style={{ width: "1.4in" }}
                          key={pot.pot}
                          className="text-center"
                        >
                          {pot.qty}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default Mealform;
