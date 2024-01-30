import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Select from "../alerts/select";
import "./schedule.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import Red_toast from "../alerts/red_toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import Spinner from "react-bootstrap/Spinner";
import PrintIcon from "@material-ui/icons/Print";
import { useReactToPrint } from "react-to-print";
export default function Sechule_History({
  user,
  route,
  selected_branch,
  current_user,
  setActiveTab,
  setview_stock,
}) {
  const [allmenu, setallmenu] = useState([]);
  const [menu, setmenu] = useState("");
  const [type, settype] = useState({ value: "all", label: "All" });

  const [data, setdata] = useState([]);
  const [print, setprint] = useState(false);

  const [isloading, setisloading] = useState(false);
  const componentRef = useRef();
  useEffect(() => {
    if (print) {
      handleprint();
    }
  }, [print]);
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    bodyClass: "printclass",
    onAfterPrint: () => {
      window.close();
      setprint(false);
    },
  });

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!type) {
        Red_toast("Select Time type First");
        return;
      }
      setisloading(true);

      var url = `${route}/api/schedule/?buffet_time_id=${menu.value}`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        setisloading(false);
        const response_data = json.shift();
        const cooking = response_data?.details?.filter((item) => {
          return item.process_type === "Cooking Opeation";
        });

        const delivery = response_data?.details?.filter((item) => {
          return item.process_type === "Delivery Opeation";
        });

        const recovery = response_data?.details?.filter((item) => {
          return item.process_type === "Recovery Opeation";
        });
        const maxLengthArray = [cooking, delivery, recovery].reduce(
          (max, arr) => (arr.length > max.length ? arr : max)
        );

        const optimize = maxLengthArray?.map((item, index) => {
          const cookingItem = index < cooking.length ? cooking[index] : null;
          const deliveryItem = index < delivery.length ? delivery[index] : null;
          const recoveryItem = index < recovery.length ? recovery[index] : null;

          return {
            id: item?.id,
            cooking: cookingItem,
            delivery: deliveryItem,
            recovery: recoveryItem,
          };
        });

        setdata(optimize);
      }
      if (!response.ok) {
        var error = Object.keys(json);
        if (error.length > 0) {
          Red_toast(`${error[0]}:${json[error[0]]}`);
        }
        setisloading(false);
      }
    };

    if (menu) {
      fetchWorkouts();
    }
  }, [menu, type]);

  useEffect(() => {
    const fetchmenu = async () => {
      var url = `${route}/api/buffet-timing/`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        const optimize = json.map((item) => {
          return { value: item.id, label: item.name };
        });

        setallmenu(optimize);
      }
    };

    if (user) {
      fetchmenu();
    }
  }, []);

  return (
    <div className="p-3">
      <div className="card">
        <div className="card-header bg-white  d-flex justify-content-between ">
          <h1
            className="mb-3"
            style={{ fontSize: "1.3rem", fontWeight: "normal" }}
          >
            Time Schedule
          </h1>
          <div className="mt-2 me-2 d-flex ">
            <Button
              className="me-2 mb-2"
              variant="outline-secondary"
              onClick={() => {
                setActiveTab("Timing");
              }}
            >
              {" "}
              Timings
            </Button>
            <Button
              className="me-2 mb-2"
              variant="outline-success"
              onClick={() => {
                setActiveTab("Process");
              }}
            >
              {" "}
              Process
            </Button>
            <Button
              type="button"
              className="mb-2"
              variant="outline-primary"
              onClick={setview_stock}
            >
              <FontAwesomeIcon className="me-2" icon={faRotate} />
              Save Schedule
            </Button>
          </div>
        </div>

        <div className="card-body pt-0">
          <div className="row mt-3">
            <div className="col-md-2 me-2">
              <Select
                options={allmenu}
                placeholder="Times"
                value={menu}
                funct={(e) => setmenu(e)}
              />
            </div>
            <div className="col-md-2 me-2">
              <Select
                options={[
                  { value: "all", label: "All" },
                  { value: "Breakfast", label: "Breakfast / إفطار" },
                  { value: "Lunch", label: " Lunch / غداء" },
                  { value: "Dinner", label: "Dinner / عشاء" },
                ]}
                placeholder="Type"
                value={type}
                funct={(e) => settype(e)}
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

          <div style={{ fontFamily: "Times New Roman" }} ref={componentRef}>
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
                  style={{ fontWeight: "bolder" }}
                  className="text-center text-decoration-underline"
                >
                  {menu?.label?.toUpperCase()} TIME
                </h4>

                <h4
                  style={{ fontWeight: "bolder" }}
                  className="text-center text-decoration-underline"
                >
                  {type.label}
                </h4>
              </>
            )}

            <hr />
            <div style={{ zoom: "0.8" }} className="table-responsive">
              <table
                className="table table-striped table-bordered "
                style={{ width: "100%" }}
              >
                <thead>
                  <tr>
                    <th colSpan={3} className=" text-center">
                      <h5 className="m-0" style={{ fontWeight: "bolder" }}>
                        Cooking Operation
                      </h5>
                    </th>
                    <th colSpan={3} className="  text-center">
                      <h5 className="m-0" style={{ fontWeight: "bolder" }}>
                        Delivery Operation
                      </h5>
                    </th>
                    <th colSpan={3} className=" text-center">
                      <h5 className="m-0" style={{ fontWeight: "bolder" }}>
                        Recovery Operation
                      </h5>
                    </th>
                  </tr>
                  <tr>
                    <th colSpan={3} className="text-center">
                      <h5 className="m-0" style={{ fontWeight: "bolder" }}>
                        توقيت الطبخ
                      </h5>
                    </th>
                    <th colSpan={3} className="text-center">
                      <h5 className="m-0" style={{ fontWeight: "bolder" }}>
                        توقيت خروج الوجبات{" "}
                      </h5>
                    </th>
                    <th colSpan={3} className="text-center">
                      <h5 className="m-0" style={{ fontWeight: "bolder" }}>
                        توقيت إسترجاع السخانات
                      </h5>
                    </th>
                  </tr>
                  <tr>
                    <th className="text-center">
                      <h5 className="m-0" style={{ fontWeight: "bolder" }}>
                        Detail / تفاصيل{" "}
                      </h5>
                    </th>
                    <th className="text-center">
                      <h5 className="m-0" style={{ fontWeight: "bolder" }}>
                        Start Time
                      </h5>
                    </th>
                    <th className="text-center">
                      <h5 className="m-0" style={{ fontWeight: "bolder" }}>
                        End Time
                      </h5>
                    </th>
                    <th className="text-center">
                      <h5 className="m-0" style={{ fontWeight: "bolder" }}>
                        Detail / تفاصيل{" "}
                      </h5>
                    </th>
                    <th className="text-center">
                      <h5 className="m-0" style={{ fontWeight: "bolder" }}>
                        Start Time
                      </h5>
                    </th>
                    <th className="text-center">
                      <h5 className="m-0" style={{ fontWeight: "bolder" }}>
                        End Time
                      </h5>
                    </th>
                    <th className="text-center">
                      <h5 className="m-0" style={{ fontWeight: "bolder" }}>
                        {" "}
                        Detail / تفاصيل{" "}
                      </h5>
                    </th>
                    <th className="text-center">
                      <h5 className="m-0" style={{ fontWeight: "bolder" }}>
                        Start Time
                      </h5>
                    </th>
                    <th className="text-center">
                      <h5 className="m-0" style={{ fontWeight: "bolder" }}>
                        End Time
                      </h5>
                    </th>
                  </tr>
                </thead>
                {type.value !== "all" ? (
                  <tbody>
                    {data.map((item) => {
                      return (
                        <tr key={item.day}>
                          <td className=" pt-0 pb-0 text-center">
                            <h5
                              className="m-0 p-2"
                              style={{ fontWeight: "normal" }}
                            >
                              {item.cooking?.process_name}
                            </h5>
                          </td>
                          <td className="pt-0 pb-0  text-center">
                            <h5
                              className="m-0 p-2"
                              style={{ fontWeight: "normal" }}
                            >
                              {type.value === "Breakfast"
                                ? item.cooking?.break_fast_start
                                : type.value === "Lunch"
                                ? item.cooking?.lunch_start
                                : item.cooking?.dinner_start}
                            </h5>
                          </td>
                          <td className="pt-0 pb-0  text-center">
                            <h5
                              className="m-0 p-2"
                              style={{ fontWeight: "normal" }}
                            >
                              {type.value === "Breakfast"
                                ? item.cooking?.break_fast_end
                                : type.value === "Lunch"
                                ? item.cooking?.lunch_end
                                : item.cooking?.dinner_end}
                            </h5>
                          </td>
                          <td className=" pt-0 pb-0 text-center">
                            <h5
                              className="m-0 p-2"
                              style={{ fontWeight: "normal" }}
                            >
                              {item.delivery?.process_name}
                            </h5>
                          </td>
                          <td className="pt-0 pb-0  text-center">
                            <h5
                              className="m-0 p-2"
                              style={{ fontWeight: "normal" }}
                            >
                              {type.value === "Breakfast"
                                ? item.delivery?.break_fast_start
                                : type.value === "Lunch"
                                ? item.delivery?.lunch_start
                                : item.delivery?.dinner_start}
                            </h5>
                          </td>
                          <td className="pt-0 pb-0  text-center">
                            <h5
                              className="m-0 p-2"
                              style={{ fontWeight: "normal" }}
                            >
                              {type.value === "Breakfast"
                                ? item.delivery?.break_fast_end
                                : type.value === "Lunch"
                                ? item.delivery?.lunch_end
                                : item.delivery?.dinner_end}
                            </h5>
                          </td>
                          <td className=" pt-0 pb-0 text-center">
                            <h5
                              className="m-0 p-2"
                              style={{ fontWeight: "normal" }}
                            >
                              {item.recovery?.process_name}
                            </h5>
                          </td>
                          <td className="pt-0 pb-0  text-center">
                            <h5
                              className="m-0 p-2"
                              style={{ fontWeight: "normal" }}
                            >
                              {type.value === "Breakfast"
                                ? item.recovery?.break_fast_start
                                : type.value === "Lunch"
                                ? item.recovery?.lunch_start
                                : item.recovery?.dinner_start}
                            </h5>
                          </td>
                          <td className="pt-0 pb-0  text-center">
                            <h5
                              className="m-0 p-2"
                              style={{ fontWeight: "normal" }}
                            >
                              {type.value === "Breakfast"
                                ? item.recovery?.break_fast_end
                                : type.value === "Lunch"
                                ? item.recovery?.lunch_end
                                : item.recovery?.dinner_end}
                            </h5>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                ) : (
                  <tbody>
                    <tr>
                      <td className="text-center" colSpan={9}>
                        <h4 className="m-0 p-2" style={{ fontWeight: "bold" }}>
                          {" "}
                          Breakfast / إفطار
                        </h4>
                      </td>
                    </tr>
                    {data.map((item) => {
                      return (
                        <tr key={item.day}>
                          <td className=" pt-0 pb-0 text-center">
                            <h5
                              className="m-0 p-2"
                              style={{ fontWeight: "normal" }}
                            >
                              {item.cooking?.process_name}
                            </h5>
                          </td>
                          <td className="pt-0 pb-0  text-center">
                            <h5
                              className="m-0 p-2"
                              style={{ fontWeight: "normal" }}
                            >
                              {item.cooking?.break_fast_start}
                            </h5>
                          </td>
                          <td className="pt-0 pb-0  text-center">
                            <h5
                              className="m-0 p-2"
                              style={{ fontWeight: "normal" }}
                            >
                              {item.cooking?.break_fast_end}
                            </h5>
                          </td>
                          <td className=" pt-0 pb-0 text-center">
                            <h5
                              className="m-0 p-2"
                              style={{ fontWeight: "normal" }}
                            >
                              {item.delivery?.process_name}
                            </h5>
                          </td>
                          <td className="pt-0 pb-0  text-center">
                            <h5
                              className="m-0 p-2"
                              style={{ fontWeight: "normal" }}
                            >
                              {item.delivery?.break_fast_start}
                            </h5>
                          </td>
                          <td className="pt-0 pb-0  text-center">
                            <h5
                              className="m-0 p-2"
                              style={{ fontWeight: "normal" }}
                            >
                              {item.delivery?.break_fast_end}
                            </h5>
                          </td>
                          <td className=" pt-0 pb-0 text-center">
                            <h5
                              className="m-0 p-2"
                              style={{ fontWeight: "normal" }}
                            >
                              {item.recovery?.process_name}
                            </h5>
                          </td>
                          <td className="pt-0 pb-0  text-center">
                            <h5
                              className="m-0 p-2"
                              style={{ fontWeight: "normal" }}
                            >
                              {item.recovery?.break_fast_start}
                            </h5>
                          </td>
                          <td className="pt-0 pb-0  text-center">
                            <h5
                              className="m-0 p-2"
                              style={{ fontWeight: "normal" }}
                            >
                              {item.recovery?.break_fast_end}
                            </h5>
                          </td>
                        </tr>
                      );
                    })}

                    <tr>
                      <td className="text-center" colSpan={9}>
                        <h4 className="m-0 p-2" style={{ fontWeight: "bold" }}>
                          {" "}
                          Lunch / غداء
                        </h4>
                      </td>
                    </tr>
                    {data.map((item) => {
                      return (
                        <tr key={item.day}>
                          <td className=" pt-0 pb-0 text-center">
                            <h5
                              className="m-0 p-2"
                              style={{ fontWeight: "normal" }}
                            >
                              {item.cooking?.process_name}
                            </h5>
                          </td>
                          <td className="pt-0 pb-0  text-center">
                            <h5
                              className="m-0 p-2"
                              style={{ fontWeight: "normal" }}
                            >
                              {item.cooking?.lunch_start}
                            </h5>
                          </td>
                          <td className="pt-0 pb-0  text-center">
                            <h5
                              className="m-0 p-2"
                              style={{ fontWeight: "normal" }}
                            >
                              {item.cooking?.lunch_end}
                            </h5>
                          </td>
                          <td className=" pt-0 pb-0 text-center">
                            <h5
                              className="m-0 p-2"
                              style={{ fontWeight: "normal" }}
                            >
                              {item.delivery?.process_name}
                            </h5>
                          </td>
                          <td className="pt-0 pb-0  text-center">
                            <h5
                              className="m-0 p-2"
                              style={{ fontWeight: "normal" }}
                            >
                              {item.delivery?.lunch_start}
                            </h5>
                          </td>
                          <td className="pt-0 pb-0  text-center">
                            <h5
                              className="m-0 p-2"
                              style={{ fontWeight: "normal" }}
                            >
                              {item.delivery?.lunch_end}
                            </h5>
                          </td>
                          <td className=" pt-0 pb-0 text-center">
                            <h5
                              className="m-0 p-2"
                              style={{ fontWeight: "normal" }}
                            >
                              {item.recovery?.process_name}
                            </h5>
                          </td>
                          <td className="pt-0 pb-0  text-center">
                            <h5
                              className="m-0 p-2"
                              style={{ fontWeight: "normal" }}
                            >
                              {item.recovery?.lunch_start}
                            </h5>
                          </td>
                          <td className="pt-0 pb-0  text-center">
                            <h5
                              className="m-0 p-2"
                              style={{ fontWeight: "normal" }}
                            >
                              {item.recovery?.lunch_end}
                            </h5>
                          </td>
                        </tr>
                      );
                    })}

                    <tr>
                      <td className="text-center" colSpan={9}>
                        <h4 className="m-0 p-2" style={{ fontWeight: "bold" }}>
                          {" "}
                          Dinner / عشاء
                        </h4>
                      </td>
                    </tr>
                    {data.map((item) => {
                      return (
                        <tr key={item.day}>
                          <td className=" pt-0 pb-0 text-center">
                            <h5
                              className="m-0 p-2"
                              style={{ fontWeight: "normal" }}
                            >
                              {item.cooking?.process_name}
                            </h5>
                          </td>
                          <td className="pt-0 pb-0  text-center">
                            <h5
                              className="m-0 p-2"
                              style={{ fontWeight: "normal" }}
                            >
                              {item.cooking?.dinner_start}
                            </h5>
                          </td>
                          <td className="pt-0 pb-0  text-center">
                            <h5
                              className="m-0 p-2"
                              style={{ fontWeight: "normal" }}
                            >
                              {item.cooking?.dinner_end}
                            </h5>
                          </td>
                          <td className=" pt-0 pb-0 text-center">
                            <h5
                              className="m-0 p-2"
                              style={{ fontWeight: "normal" }}
                            >
                              {item.delivery?.process_name}
                            </h5>
                          </td>
                          <td className="pt-0 pb-0  text-center">
                            <h5
                              className="m-0 p-2"
                              style={{ fontWeight: "normal" }}
                            >
                              {item.delivery?.dinner_start}
                            </h5>
                          </td>
                          <td className="pt-0 pb-0  text-center">
                            <h5
                              className="m-0 p-2"
                              style={{ fontWeight: "normal" }}
                            >
                              {item.delivery?.dinner_end}
                            </h5>
                          </td>
                          <td className=" pt-0 pb-0 text-center">
                            <h5
                              className="m-0 p-2"
                              style={{ fontWeight: "normal" }}
                            >
                              {item.recovery?.process_name}
                            </h5>
                          </td>
                          <td className="pt-0 pb-0  text-center">
                            <h5
                              className="m-0 p-2"
                              style={{ fontWeight: "normal" }}
                            >
                              {item.recovery?.dinner_start}
                            </h5>
                          </td>
                          <td className="pt-0 pb-0  text-center">
                            <h5
                              className="m-0 p-2"
                              style={{ fontWeight: "normal" }}
                            >
                              {item.recovery?.dinner_end}
                            </h5>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
