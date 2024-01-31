import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import "./dish.css";
import Select from "../alerts/select";
import Red_toast from "../alerts/red_toast";
import Spinner from "react-bootstrap/Spinner";
import SaveIcon from "@material-ui/icons/Save";
import PrintIcon from "@material-ui/icons/Print";
import { useReactToPrint } from "react-to-print";

export default function Dish_View({ user, route, setview }) {
  const [data, setdata] = useState([]);
  const [submenu, setsubmenu] = useState({ value: "all", label: "All" });
  const [menu, setmenu] = useState("");
  const [allmenu, setallmenu] = useState([]);
  const [allsubmenu, setallsubmenu] = useState([]);
  const [isloading, setisloading] = useState(false);
  const [print, setprint] = useState(false);
  const componentRef = useRef(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      setisloading(true);
      var url = `${route}/api/dishes/`;
      if (menu) {
        url = `${url}?menu_id=${menu.value}`;
        if (submenu.value !== "all") {
          url = `${url}&sub_menu_id=${submenu.value}`;
        }
      } else if (submenu.value !== "all") {
        url = `${url}?sub_menu_id=${submenu.value}`;
      }

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        setisloading(false);
        setdata(json);
      }
      if (!response.ok) {
        var error = Object.keys(json);
        if (error.length > 0) {
          Red_toast(`${error[0]}:${json[error[0]]}`);
        }
        setisloading(false);
      }
    };

    if (menu || submenu) {
      fetchWorkouts();
    }
  }, [menu, submenu]);

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

  useEffect(() => {
    const fetchsubmenu = async () => {
      var url = `${route}/api/sub-menu/`;
      if (menu) {
        url = `${url}?menu_id=${menu.value}`;
      }

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        const optimize = json.map((item) => {
          return { value: item.id, label: item.name };
        });

        setallsubmenu(optimize);
      }
    };

    if (user) {
      fetchsubmenu();
    }
  }, [menu]);
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
  return (
    <div className="p-3 pt-2">
      <div className="card">
        <div className="card-header d-flex justify-content-between bg-white">
          <h3 className="mt-2 me-2">View Dish</h3>
          <div className="mt-2 me-2 d-flex">
            <Button variant="outline-primary" onClick={setview}>
              {isloading && (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              )}
              <SaveIcon /> Save
            </Button>
          </div>
        </div>

        <div className="card-body pt-0" style={{ minHeight: "100vh" }}>
          <div className="row mt-4">
            <div className="col-md-3">
              <Select
                options={allmenu}
                placeholder={"Menu"}
                value={menu}
                funct={(e) => setmenu(e)}
                required={true}
              />
            </div>
            <div className="col-md-3">
              <Select
                options={[{ value: "all", label: "All" }, ...allsubmenu]}
                placeholder={"Sub Menu"}
                value={submenu}
                funct={(e) => setsubmenu(e)}
                required={true}
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

          <div className="mb-4" ref={componentRef}>
            <h4 className="text-center">Dishes</h4>
            {print && (
              <div className="d-flex justify-content-between">
                <h6>
                  <strong className="me-3">Menu : </strong>
                  {menu.label}
                </h6>
                <h6>
                  <strong className="me-3">Submenu : </strong>
                  {submenu.label}
                </h6>
              </div>
            )}
            <table
              className="table table-striped table-bordered "
              style={{ width: "100%" }}
            >
              <thead className="border-0 ">
                <tr>
                  <th style={{ width: "30px" }}>#</th>
                  <th>Name</th>
                  <th>اسم الطبق</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => {
                  return (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.arabic_name}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
