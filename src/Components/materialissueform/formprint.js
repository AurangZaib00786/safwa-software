import React, { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import "./formprint.css";

function Issueform(props) {
  const data = JSON.parse(localStorage.getItem("data"));

  const dishdetails = data.dish_details;
  const proddetails = data.product_details;

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
          <div
            className="d-flex border border-dark border-2 mb-2"
            style={{ backgroundColor: "rgb(175, 209, 183)" }}
          >
            <h4 className="col-4 text-center mt-2">Material Issue Form</h4>
            <h4 className="col-4 text-center  mt-2">{data.meal_type}</h4>
            <h4 className="col-4 text-center mt-2">{data.date}</h4>
          </div>

          <h4
            style={{ backgroundColor: "rgb(201, 230, 243)" }}
            className="border border-dark border-2 text-center m-0 pt-2 pb-2"
          >
            Numbers Of Hujjaj / عددالحجاج
          </h4>

          <div className="d-flex">
            <strong
              style={{ backgroundColor: "rgb(223, 228, 228)" }}
              className="col-1 m-0 border border-top-0  border-end-0 borderblack border-1 d-flex flex-column justify-content-center text-center"
            >
              M
            </strong>
            <strong
              style={{ height: "0.7in", backgroundColor: "rgb(223, 228, 228)" }}
              className="col-3 m-0 border border-top-0 border-end-0 borderblack border-1 d-flex flex-column justify-content-center text-center"
            >
              <span>Govt. Haji</span>
              <span>حجاج البعثة</span>
            </strong>
            <strong
              style={{ backgroundColor: "rgb(223, 228, 228)" }}
              className="col-2 m-0 border border-top-0 border-end-0 borderblack border-1 d-flex flex-column justify-content-center text-center"
            >
              <span>Pvt. Haji</span>
              <span>حجاج الشركات</span>
            </strong>
            <strong
              style={{ backgroundColor: "rgb(223, 228, 228)" }}
              className="col-2 m-0 border border-top-0 border-end-0 borderblack border-1 d-flex flex-column justify-content-center text-center"
            >
              <span>Staff</span>
              <span>عمال</span>
            </strong>
            <strong
              style={{ backgroundColor: "rgb(223, 228, 228)" }}
              className="col-2 m-0 border border-top-0 border-end-0 borderblack border-1 d-flex flex-column justify-content-center text-center"
            >
              <span>Extra</span>
              <span>١ضافي</span>
            </strong>
            <strong
              style={{ backgroundColor: "rgb(223, 228, 228)" }}
              className="col-2 m-0 border border-top-0  borderblack border-1 d-flex flex-column justify-content-center text-center"
            >
              <span>Total</span>
              <span>١ضافي</span>
            </strong>
          </div>

          <div className="d-flex mb-2">
            <p
              style={{ height: "0.4in" }}
              className="col-1 d-flex align-items-center m-0 border border-end-0 borderblack border-1  justify-content-center"
            ></p>
            <p className="col-3 d-flex align-items-center m-0 border border-end-0 borderblack border-1  justify-content-center">
              {data.govt_hujjaj}
            </p>
            <p className="col-2 d-flex align-items-center m-0 border border-end-0 borderblack border-1  justify-content-center">
              {data.private_hujjaj}
            </p>
            <p className="col-2 d-flex align-items-center m-0 border border-end-0 borderblack border-1  justify-content-center">
              {data.staff}
            </p>
            <p className="col-2 d-flex align-items-center m-0 border border-end-0 borderblack border-1  justify-content-center">
              {data.extra}
            </p>
            <p className="col-2 d-flex align-items-center m-0 border borderblack border-1  justify-content-center">
              {data.extra + data.staff + data.private_hujjaj + data.govt_hujjaj}
            </p>
          </div>

          <div className="d-flex border border-dark border-2 mb-2">
            <h4
              style={{ backgroundColor: "rgb(201, 230, 243)" }}
              className="col-6  text-center m-0"
            >
              اسم الطباخ / Cook Name
            </h4>

            <h4 className="col-6  ps-4 m-0">{data.cook_name}</h4>
          </div>

          <h4
            style={{
              minHeight: "0.7in",
              backgroundColor: "rgb(175, 209, 183)",
            }}
            className="d-flex border border-dark border-2 justify-content-center m-0"
          >
            <span className="me-1">{data.meal_type} / </span>
            {dishdetails.map((item) => {
              return <span className="me-1">{item.dish_name} - </span>;
            })}
          </h4>

          <div className="d-flex">
            <strong
              style={{ backgroundColor: "rgb(223, 228, 228)" }}
              className="col-1 m-0 border border-top-0  border-end-0 borderblack border-1 d-flex flex-column justify-content-center text-center"
            >
              <span>Sr</span>
              <span>م</span>
            </strong>
            <strong
              style={{ height: "0.7in", backgroundColor: "rgb(223, 228, 228)" }}
              className="col-2 m-0 border border-top-0  border-end-0 borderblack border-1 d-flex flex-column justify-content-center text-center"
            >
              <span>ITEMS</span>
            </strong>
            <strong
              style={{ backgroundColor: "rgb(223, 228, 228)" }}
              className="col-2 m-0 border border-top-0  border-end-0 borderblack border-1 d-flex flex-column justify-content-center text-center"
            >
              <span> الأصناف</span>
            </strong>
            <strong
              style={{ backgroundColor: "rgb(223, 228, 228)" }}
              className="col-1 m-0 border border-top-0  border-end-0 borderblack border-1 d-flex flex-column justify-content-center text-center"
            >
              <span>QTY</span>
              <span> الكميه</span>
            </strong>
            <strong
              style={{ backgroundColor: "rgb(223, 228, 228)" }}
              className="col-2 m-0 border border-top-0  border-end-0 borderblack border-1 d-flex flex-column justify-content-center text-center"
            >
              <span>Units</span>
              <span> واحدات</span>
            </strong>
            <strong
              style={{ backgroundColor: "rgb(223, 228, 228)" }}
              className="col-4 m-0 border border-top-0   borderblack border-1 d-flex flex-column justify-content-center text-center"
            >
              <span>Remarks</span>
              <span> ملاحظات </span>
            </strong>
          </div>

          {proddetails.map((item, index) => {
            return (
              <div className="d-flex">
                <p
                  style={{ height: "0.4in" }}
                  className="col-1 d-flex align-items-center m-0 border border-bottom-0 border-end-0 borderblack  border-1  justify-content-center "
                >
                  {index + 1}
                </p>
                <p className="col-2 d-flex align-items-center m-0 border border-bottom-0 border-end-0 borderblack  border-1  justify-content-start ps-2">
                  {item.stock_name}
                </p>
                <p className="col-2 d-flex align-items-center m-0 border border-bottom-0 border-end-0 borderblack  border-1  justify-content-end pe-2">
                  {item.arabic_name}
                </p>
                <p className="col-1 d-flex align-items-center m-0 border border-bottom-0 border-end-0 borderblack  border-1  justify-content-center ">
                  {item.quantity}
                </p>
                <p className="col-2 d-flex align-items-center m-0 border border-bottom-0 border-end-0 borderblack  border-1  justify-content-center ">
                  {item.unit_name}
                </p>
                <p className="col-4 d-flex align-items-center m-0 border border-bottom-0 borderblack  border-1  justify-content-center ">
                  {item.remarks}
                </p>
              </div>
            );
          })}

          <div className="d-flex">
            <strong
              style={{ backgroundColor: "rgb(223, 228, 228)" }}
              className="col-6 m-0 border border-end-0 borderblack border-1 d-flex flex-column justify-content-center text-center"
            >
              <span>Prepared By</span>
              <span>أعدت بواسطة </span>
            </strong>
            <strong
              style={{ height: "0.7in", backgroundColor: "rgb(223, 228, 228)" }}
              className="col-3 m-0 border border-end-0 borderblack border-1 d-flex flex-column justify-content-center text-center"
            >
              <span>Store Incharge</span>
              <span>أمين المستودع </span>
            </strong>
            <strong
              style={{ backgroundColor: "rgb(223, 228, 228)" }}
              className="col-3 m-0 border  borderblack border-1 d-flex flex-column justify-content-center text-center"
            >
              <span>Approved By</span>
              <span> المدير </span>
            </strong>
          </div>

          <div className="d-flex mb-2">
            <p
              style={{ height: "0.4in" }}
              className="col-6 d-flex align-items-center m-0 border border-end-0 borderblack border-1  justify-content-center"
            >
              <strong>{data.prepared_by_name}</strong>
            </p>
            <p className="col-3 d-flex align-items-center m-0 border border-end-0 borderblack border-1  justify-content-center">
              <strong>{data.store_incharge_name} </strong>
            </p>
            <p className="col-3 d-flex align-items-center m-0 border  borderblack border-1  justify-content-center">
              <strong>{data.approved_by_name} </strong>
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default Issueform;
