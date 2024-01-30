import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Red_toast from "../alerts/red_toast";
import Select from "../alerts/select";
import "./buffetmenu.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import Spinner from "react-bootstrap/Spinner";

import PrintIcon from "@material-ui/icons/Print";
import { useReactToPrint } from "react-to-print";
export default function Stock_table({
  user,
  route,
  selected_branch,
  current_user,
  setview_stock,
}) {
  const [allmenu, setallmenu] = useState([]);
  const [menu, setmenu] = useState("");

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
      setisloading(true);
      var url = `${route}/api/buffet-menus/?menu_id=${menu.value}`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        setisloading(false);
        const buffetmenu = [
          { day: "Saturday", breakfast: "", lunch: "", dinner: "" },
          { day: "Sunday", breakfast: "", lunch: "", dinner: "" },
          { day: "Monday", breakfast: "", lunch: "", dinner: "" },
          { day: "Tuesday", breakfast: "", lunch: "", dinner: "" },
          { day: "Wednesday", breakfast: "", lunch: "", dinner: "" },
          { day: "Thursday", breakfast: "", lunch: "", dinner: "" },
          { day: "Friday", breakfast: "", lunch: "", dinner: "" },
        ];

        json.map((item) => {
          const day = item.title.split("_").shift();
          const time = item.title.split("_").pop();

          switch (day) {
            case "Saturday":
              if (time === "Breakfast") {
                buffetmenu[0]["breakfast"] = `${item.buffet_dishes.map(
                  (dish) => {
                    return `${dish.dish_name}`;
                  }
                )}`;
                return;
              } else if (time === "Lunch") {
                buffetmenu[0]["lunch"] = `${item.buffet_dishes.map((dish) => {
                  return `${dish.dish_name}`;
                })}`;
                return;
              } else if (time === "Dinner") {
                buffetmenu[0]["dinner"] = `${item.buffet_dishes.map((dish) => {
                  return `${dish.dish_name}`;
                })}`;
                return;
              }
            case "Sunday":
              if (time === "Breakfast") {
                buffetmenu[1]["breakfast"] = `${item.buffet_dishes.map(
                  (dish) => {
                    return `${dish.dish_name}`;
                  }
                )}`;
                return;
              } else if (time === "Lunch") {
                buffetmenu[1]["lunch"] = `${item.buffet_dishes.map((dish) => {
                  return `${dish.dish_name}`;
                })}`;
                return;
              } else if (time === "Dinner") {
                buffetmenu[1]["dinner"] = `${item.buffet_dishes.map((dish) => {
                  return `${dish.dish_name}`;
                })}`;
                return;
              }
            case "Monday":
              if (time === "Breakfast") {
                buffetmenu[2]["breakfast"] = `${item.buffet_dishes.map(
                  (dish) => {
                    return `${dish.dish_name}`;
                  }
                )}`;
                return;
              } else if (time === "Lunch") {
                buffetmenu[2]["lunch"] = `${item.buffet_dishes.map((dish) => {
                  return `${dish.dish_name}`;
                })}`;
                return;
              } else if (time === "Dinner") {
                buffetmenu[2]["dinner"] = `${item.buffet_dishes.map((dish) => {
                  return `${dish.dish_name}`;
                })}`;
                return;
              }
            case "Tuesday":
              if (time === "Breakfast") {
                buffetmenu[3]["breakfast"] = `${item.buffet_dishes.map(
                  (dish) => {
                    return `${dish.dish_name}`;
                  }
                )}`;
                return;
              } else if (time === "Lunch") {
                buffetmenu[3]["lunch"] = `${item.buffet_dishes.map((dish) => {
                  return `${dish.dish_name}`;
                })}`;
                return;
              } else if (time === "Dinner") {
                buffetmenu[3]["dinner"] = `${item.buffet_dishes.map((dish) => {
                  return `${dish.dish_name}`;
                })}`;
                return;
              }
            case "Wednesday":
              if (time === "Breakfast") {
                buffetmenu[4]["breakfast"] = `${item.buffet_dishes.map(
                  (dish) => {
                    return `${dish.dish_name}`;
                  }
                )}`;
                return;
              } else if (time === "Lunch") {
                buffetmenu[4]["lunch"] = `${item.buffet_dishes.map((dish) => {
                  return `${dish.dish_name}`;
                })}`;
                return;
              } else if (time === "Dinner") {
                buffetmenu[4]["dinner"] = `${item.buffet_dishes.map((dish) => {
                  return `${dish.dish_name}`;
                })}`;
                return;
              }
            case "Thursday":
              if (time === "Breakfast") {
                buffetmenu[5]["breakfast"] = `${item.buffet_dishes.map(
                  (dish) => {
                    return `${dish.dish_name}`;
                  }
                )}`;
                return;
              } else if (time === "Lunch") {
                buffetmenu[5]["lunch"] = `${item.buffet_dishes.map((dish) => {
                  return `${dish.dish_name}`;
                })}`;
                return;
              } else if (time === "Dinner") {
                buffetmenu[5]["dinner"] = `${item.buffet_dishes.map((dish) => {
                  return `${dish.dish_name}`;
                })}`;
                return;
              }
            case "Friday":
              if (time === "Breakfast") {
                buffetmenu[6]["breakfast"] = `${item.buffet_dishes.map(
                  (dish) => {
                    return `${dish.dish_name}`;
                  }
                )}`;
                return;
              } else if (time === "Lunch") {
                buffetmenu[6]["lunch"] = `${item.buffet_dishes.map((dish) => {
                  return `${dish.dish_name}`;
                })}`;
                return;
              } else if (time === "Dinner") {
                buffetmenu[6]["dinner"] = `${item.buffet_dishes.map((dish) => {
                  return `${dish.dish_name}`;
                })}`;
                return;
              }
          }
        });

        setdata(buffetmenu);
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
  }, [menu]);

  useEffect(() => {
    const fetchmenu = async () => {
      var url = `${route}/api/menu/`;

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
            Buffet Menu
          </h1>
          <Button
            type="button"
            className="mb-2"
            variant="outline-success"
            onClick={setview_stock}
          >
            <FontAwesomeIcon className="me-2" icon={faRotate} />
            Save Menu
          </Button>
        </div>

        <div className="card-body pt-0">
          <div className="row mt-3">
            <div className="col-md-2 me-2">
              <Select
                options={allmenu}
                placeholder="Menu"
                value={menu}
                funct={(e) => setmenu(e)}
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
                  PROPOSED TWO DISHES Buffet MENU{" "}
                </h4>

                <h4
                  style={{ fontWeight: "bolder" }}
                  className="text-center text-decoration-underline"
                >
                  {menu.label?.toUpperCase()} MENU
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
                    <th className="text-center">
                      <h5 style={{ fontWeight: "bolder" }}>Day</h5>
                    </th>
                    <th className="text-center">
                      <div className="d-flex flex-column">
                        <h5 style={{ fontWeight: "bolder" }}>Breakfast</h5>
                        <h5 style={{ fontWeight: "bolder" }}>0600 to 0900</h5>
                      </div>
                    </th>
                    <th className="text-center">
                      <div className="d-flex flex-column">
                        <h5 style={{ fontWeight: "bolder" }}>Lunch</h5>
                        <h5 style={{ fontWeight: "bolder" }}>
                          1300:00 to 1500:00
                        </h5>
                      </div>
                    </th>
                    <th className="text-center">
                      <div className="d-flex flex-column">
                        <h5 style={{ fontWeight: "bolder" }}>Dinner</h5>
                        <h5 style={{ fontWeight: "bolder" }}>2100 to 2330</h5>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => {
                    return (
                      <tr key={item.day}>
                        <td style={{ width: "10%" }} className="pt-0 pb-0 ">
                          <h5
                            className="d-flex align-items-center "
                            style={{ height: "0.7in", fontWeight: "normal" }}
                          >
                            {item.day}
                          </h5>
                        </td>
                        <td
                          style={{ width: "30%" }}
                          className=" pt-0 pb-0 text-center"
                        >
                          <h5 style={{ fontWeight: "normal" }}>
                            {item.breakfast}
                          </h5>
                        </td>
                        <td
                          style={{ width: "30%" }}
                          className="pt-0 pb-0  text-center"
                        >
                          <h5 style={{ fontWeight: "normal" }}>{item.lunch}</h5>
                        </td>
                        <td
                          style={{ width: "30%" }}
                          className="pt-0 pb-0  text-center"
                        >
                          <h5 style={{ fontWeight: "normal" }}>
                            {item.dinner}
                          </h5>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {print && (
              <div className="ps-3">
                <h5>
                  <strong className="text-decoration-underline">
                    IMPORTANT NOTES
                  </strong>
                </h5>
                <p className="m-0">
                  1. Water two (2) bottles of 300 ml with each meal.
                </p>
                <p className="m-0">2. Skinless chicken in all curries.</p>{" "}
                <p className="m-0"> 3. Goat meat only.</p>
                <p className="m-0">
                  {" "}
                  4. 70% Roti (Maida:Bur 70:30) and 30 % Khubz will be provided
                  in each building.{" "}
                </p>
                <p className="m-0">
                  5. Use of dry milk for morning tea is not allowed.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
