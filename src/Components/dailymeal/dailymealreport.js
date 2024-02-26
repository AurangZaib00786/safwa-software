import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Red_toast from "../alerts/red_toast";
import Select from "../alerts/select";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import Spinner from "react-bootstrap/Spinner";
import PrintIcon from "@material-ui/icons/Print";
import { useReactToPrint } from "react-to-print";
import moment from "moment";
import TextField from "@mui/material/TextField";
import "./dailymeal.css";

export default function Dailymealreport(props) {
  const [allcustomer, setallcustomer] = useState([]);
  const [customer, setcustomer] = useState("");
  const user = props.state.setuser.user;
  const route = props.state.setuser.route;
  const selected_branch = props.state.Setcurrentinfo.selected_branch;
  const selected_year = props.state.Setcurrentinfo.selected_year;
  const [date, setdate] = useState(moment().format().substring(0, 10));
  const [print, setprint] = useState(false);

  const [breakfastdata, setbreakfastdata] = useState([]);
  const [breakfastcolumn, setbreakfastcolumn] = useState([]);
  const [lunchdata, setlunchdata] = useState([]);
  const [lunchcolumn, setlunchcolumn] = useState([]);
  const [dinnerdata, setdinnerdata] = useState([]);
  const [dinnercolumn, setdinnercolumn] = useState([]);
  const [breakfastdishes, setbreakfastdishes] = useState(null);
  const [lunchdishes, setlunchdishes] = useState(null);
  const [dinnerdishes, setdinnerdishes] = useState(null);

  const [isloading, setisloading] = useState(false);
  const componentRef = useRef();

  useEffect(() => {
    if (print) {
      handleprint();
    }
  }, [print]);

  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    bodyClass: "printclassmeal",
    onAfterPrint: () => {
      window.close();
      setprint(false);
    },
  });

  useEffect(() => {
    const fetchMeal = async () => {
      setisloading(true);
      setbreakfastdata([]);
      setbreakfastcolumn([]);
      setbreakfastdishes([]);

      setlunchdata([]);
      setlunchcolumn([]);
      setlunchdishes([]);

      setdinnerdata([]);
      setdinnercolumn([]);
      setdinnerdishes([]);
      var url = `${route}/api/daily-meals/?customer_id=${customer.value}&date=${date}`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        json.map((item) => {
          if (item.meal_type === "Breakfast") {
            setbreakfastdishes(item?.dish_details);
            setbreakfastdata(item?.building_details);
            const new_columns =
              item?.building_details?.length > 0
                ? item?.building_details[0]
                : null;
            setbreakfastcolumn(new_columns?.pot_details);
          } else if (item.meal_type === "Lunch") {
            setlunchdishes(item?.dish_details);
            setlunchdata(item?.building_details);
            const new_columns =
              item?.building_details?.length > 0
                ? item?.building_details[0]
                : null;
            setlunchcolumn(new_columns?.pot_details);
          } else if (item.meal_type === "Dinner") {
            setdinnerdishes(item?.dish_details);
            setdinnerdata(item?.building_details);
            const new_columns =
              item?.building_details?.length > 0
                ? item?.building_details[0]
                : null;
            setdinnercolumn(new_columns?.pot_details);
          }
        });

        setisloading(false);
      }
      if (!response.ok) {
        setisloading(false);
        Red_toast("Error");
      }
    };
    if (customer && date) {
      fetchMeal();
    }
  }, [customer, date]);

  useEffect(() => {
    const fetchcustomer = async () => {
      var url = `${route}/api/parties/?account_head=${selected_branch.id}&type=customer`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        const optimize = json.map((item) => {
          return { value: item.id, label: item.name };
        });

        setallcustomer(optimize);
      }
    };

    if (user) {
      fetchcustomer();
    }
  }, [selected_branch]);

  return (
    <div className="p-3">
      <div className="card">
        <div className="card-body pt-0">
          <div className="row mt-3">
            <div className="col-md-2 me-2">
              <TextField
                type="date"
                className="form-control  mb-3"
                label={"Date"}
                value={date}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => setdate(e.target.value)}
                InputProps={{
                  inputProps: {
                    min: `${selected_year.value}-01-01`,
                    max: `${selected_year.value}-12-31`,
                  },
                }}
                size="small"
              />
            </div>
            <div className="col-md-2 me-2">
              <Select
                options={allcustomer}
                placeholder="Customers"
                value={customer}
                funct={(e) => setcustomer(e)}
              />
            </div>
          </div>
          <div className="d-sm-flex justify-content-between align-items-center mt-3">
            <div>
              <Button
                type="button"
                className="p-1 ps-3 pe-3 mb-2"
                variant="outline-success"
                onClick={() => {
                  setprint(true);
                }}
              >
                <PrintIcon /> Print
              </Button>
            </div>
          </div>
          {isloading && (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
            </div>
          )}
          <div ref={componentRef}>
            <div style={{ fontFamily: "Times New Roman" }}>
              {print && (
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
                  <h4
                    className="text-center mt-3"
                    style={{ fontWeight: "bold" }}
                  >
                    Daily Meal Full Report
                  </h4>
                  <div className="d-flex justify-content-between">
                    <h5>
                      <strong>Customer :</strong> {customer.label}
                    </h5>
                    <h5>
                      <strong>Date :</strong> {date}
                    </h5>
                  </div>
                </>
              )}
            </div>

            <div style={{ zoom: "0.8" }} className="table-responsive">
              <table
                className="table dailymealtable  table-bordered "
                style={{ width: "100%" }}
              >
                <thead>
                  <tr>
                    <th className="text-center">
                      <h5 style={{ fontWeight: "bolder" }}>م</h5>
                    </th>
                    <th className="text-center">
                      <h5 style={{ fontWeight: "bolder" }}>فندق</h5>
                    </th>
                    <th
                      colSpan={breakfastcolumn?.length + 1}
                      className="text-center"
                    >
                      <h5
                        className="d-flex justify-content-around align-items-center"
                        style={{ fontWeight: "bolder" }}
                      >
                        <span className="me-2">Breakfast</span>
                        <span className="d-flex">
                          {breakfastdishes?.map((dish, index) => {
                            return (
                              <h5
                                key={dish.dish}
                                style={{ fontWeight: "normal" }}
                              >
                                {dish.dish_name}
                                {index < breakfastdishes?.length - 1
                                  ? " + "
                                  : ""}
                              </h5>
                            );
                          })}
                        </span>
                      </h5>
                    </th>

                    <th
                      colSpan={lunchcolumn?.length + 1}
                      className="text-center"
                    >
                      <h5
                        className="d-flex justify-content-around align-items-center"
                        style={{ fontWeight: "bolder" }}
                      >
                        <span className="me-2">Lunch</span>
                        <span className="d-flex">
                          {lunchdishes?.map((dish, index) => {
                            return (
                              <h5
                                key={dish.dish}
                                style={{ fontWeight: "normal" }}
                              >
                                {dish.dish_name}
                                {index < lunchdishes?.length - 1 ? " + " : ""}
                              </h5>
                            );
                          })}
                        </span>
                      </h5>
                    </th>

                    <th
                      colSpan={dinnercolumn?.length + 1}
                      className="text-center"
                    >
                      <h5
                        className="d-flex justify-content-around align-items-center"
                        style={{ fontWeight: "bolder" }}
                      >
                        <span className="me-2">Dinner</span>
                        <span className="d-flex">
                          {dinnerdishes?.map((dish, index) => {
                            return (
                              <h5
                                key={dish.dish}
                                style={{ fontWeight: "normal" }}
                              >
                                {dish.dish_name}
                                {index < dinnerdishes?.length - 1 ? " + " : ""}
                              </h5>
                            );
                          })}
                        </span>
                      </h5>
                    </th>
                  </tr>

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
                    {breakfastcolumn?.map((item) => {
                      return (
                        <th key={item.id} className="text-center">
                          <h5 style={{ fontWeight: "bolder" }}>
                            {item.arabic_name}
                          </h5>
                        </th>
                      );
                    })}
                    <th className="text-center">
                      <h5 style={{ fontWeight: "bolder" }}>حجاج</h5>
                    </th>

                    {lunchcolumn?.map((item) => {
                      return (
                        <th key={item.id} className="text-center">
                          <h5 style={{ fontWeight: "bolder" }}>
                            {item.arabic_name}
                          </h5>
                        </th>
                      );
                    })}

                    <th className="text-center">
                      <h5 style={{ fontWeight: "bolder" }}>حجاج</h5>
                    </th>

                    {dinnercolumn?.map((item) => {
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
                    {breakfastcolumn?.map((item) => {
                      return (
                        <th key={item.id} className="text-center">
                          <h5 style={{ fontWeight: "bolder" }}>{item.name}</h5>
                        </th>
                      );
                    })}
                    <th className="text-center">
                      <h5 style={{ fontWeight: "bolder" }}>Haji</h5>
                    </th>
                    {lunchcolumn?.map((item) => {
                      return (
                        <th key={item.id} className="text-center">
                          <h5 style={{ fontWeight: "bolder" }}>{item.name}</h5>
                        </th>
                      );
                    })}

                    <th className="text-center">
                      <h5 style={{ fontWeight: "bolder" }}>Haji</h5>
                    </th>
                    {dinnercolumn?.map((item) => {
                      return (
                        <th key={item.id} className="text-center">
                          <h5 style={{ fontWeight: "bolder" }}>{item.name}</h5>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {breakfastdata?.map((item, index) => {
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

                        <td
                          style={{ width: "2in" }}
                          className="pt-0 pb-0  text-center"
                        >
                          <h5 style={{ fontWeight: "normal" }}>
                            {lunchdata[index]?.hujaj}
                          </h5>
                        </td>

                        {lunchdata[index]?.pot_details?.map((pot) => {
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

                        <td
                          style={{ width: "2in" }}
                          className="pt-0 pb-0  text-center"
                        >
                          <h5 style={{ fontWeight: "normal" }}>
                            {dinnerdata[index]?.hujaj}
                          </h5>
                        </td>

                        {dinnerdata[index]?.pot_details?.map((pot) => {
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
