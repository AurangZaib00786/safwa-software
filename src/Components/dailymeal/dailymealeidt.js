import React, { useEffect, useState, useRef } from "react";
import "./dailymeal.css";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import SaveIcon from "@material-ui/icons/Save";
import PrintRoundedIcon from "@material-ui/icons/PrintRounded";
import TextField from "@mui/material/TextField";
import AddIcon from "@material-ui/icons/Add";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import Dailymealeditform from "./dailymealeditform";
import { useTranslation } from "react-i18next";
import Red_toast from "../alerts/red_toast";
import custom_toast from "../alerts/custom_toast";

function Dailymeal_edit(props) {
  const user = props.state.setuser.user;
  const { t } = useTranslation();
  const route = props.state.setuser.route;
  const table_data = props.state.Setproducthistory.product_history;
  const settable_data = props.Setproduct_history;
  const saved_data=JSON.parse(localStorage.getItem("data"))
  const [text, settext] = useState("");
  const [type, settype] = useState("");
  
  const [customer, setcustomer] = useState("");

  const [showmodel, setshowmodel] = useState(false);
  const [isloading, setisloading] = useState(false);

  const [potsdata, setpotsdata] = useState([]);
  const [data, setdata] = useState("");
  const [column, setcolumn] = useState([]);
  const [ids, setids] = useState(null);
  const [dishes, setdishes] = useState(null);
  


  useEffect(()=>{
    setdishes(saved_data?.dish_details)  
      settable_data({ type: "Set_product_history", data: saved_data?.building_details });
      const new_columns= saved_data?.building_details?.length>0 ?saved_data?.building_details[0]:null
      setcolumn(new_columns?.pot_details)
      setcustomer(saved_data.customer_name)
      settype(saved_data.meal_type)
      setids(new_columns?.pot_details.map(item=> item.pot))

  },[])

  useEffect(() => {
    const fetchProducts = async () => {
      var url = `${route}/api/pots/`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        setpotsdata(json);
      }
      if (!response.ok) {
        var error = Object.keys(json);
        if (error.length > 0) {
          Red_toast(`${json[error[0]]}`);
        }
      }
    };

    if (user) {
      fetchProducts();
    }
  }, []);

  const handlepotqtychange = (row, pot, value) => {
    const newdata = table_data.map((item) => {
      if (item.id === row.id) {
        const changepot = item.pot_details.map((item2) => {
          if (item2.pot === pot.pot) {
            item2["qty"] = value;
            return item2;
          }
          return item2;
        });
        item["pot_details"] = changepot;
        return item;
      }
      return item;
    });
    settable_data({ type: "Set_product_history", data: newdata });
  };

  

  const handlesubmit = async (e) => {
    e.preventDefault();
    const ids_to_add=[]
    const itemtomap=table_data.length>0?table_data[0]:null
    itemtomap?.pot_details?.map((item) => {
     
      if(!ids.includes(item.pot)){
        ids_to_add.push(item.pot)
       
        return
      }else{
        const index = ids.indexOf(item.pot);

        if (index !== -1) {
          ids.splice(index, 1);
        }
        return
      }
    });


    
    

    const response = await fetch(`${route}/api/update-pots/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.access}`,
      },
      body: JSON.stringify({
        
        meal_id: saved_data.id,
        pot_ids_to_add: ids_to_add,
        pot_ids_to_remove: ids,
      }),
    });
    const json = await response.json();
    setisloading(false);
    if (!response.ok) {
      var error = Object.keys(json);
      if (error.length > 0) {
        Red_toast(`${json[error[0]]}`);
      }
    }

    if (response.ok) {
      custom_toast('Update')
      
    }
  };

  return (
    <div className="p-3">
      <div className="card">
        <div className="card-header  d-flex justify-content-end">
          <Button className="me-2" type="button" variant="outline-dark">
            <AddIcon /> {t("new")}
          </Button>

          <Button onClick={handlesubmit} variant="outline-primary">
            {isloading && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            )}
            <SaveIcon /> {t("save")}
          </Button>
          <Button className="ms-2" variant="outline-success">
            <PrintRoundedIcon /> {t("print")}
          </Button>
        </div>

        <div className="card-body">
          <div className="row  d-sm-flex align-items-start mt-1">
            
            <div className="col-6 col-md-2 mb-2">
            <TextField
                className="form-control   mb-3"
                id="outlined-basic"
                label="Customer"
                value={customer}
                size="small"
              />
            </div>
            <div className="col-6 col-md-2 mb-2">
            <TextField
                className="form-control   mb-3"
                id="outlined-basic"
                label="Type"
                value={type}
                size="small"
              />
            </div>

            <div className="d-flex col-md-3">
            
            <div className="col-6 col-md-5 mb-2">
              <Button
                className="ms-2"
                variant="outline-primary"
                onClick={() => {
                  if (table_data) {
                    settext("POTS");
                    
                    setshowmodel(!showmodel);
                    setdata(potsdata);
                  } else {
                    Red_toast("Generate order first!");
                  }
                }}
              >
                <VisibilityIcon  className="me-2"/>
                Add Pots
              </Button>
            </div>
            <div className="col-6 col-md-6 mb-2">
              <Button
                className="ms-2"
                variant="outline-secondary"
                onClick={() => {
                  if (table_data) {
                    settext("POTS");
                    setshowmodel(!showmodel);
                    setdata(potsdata);
                  } else {
                    Red_toast("Generate order first!");
                  }
                }}
              >
                <FontAwesomeIcon icon={faRotate}  className="me-2"/>
                Reload
              </Button>
            </div>
            </div>
          </div>

          <div style={{ zoom: "0.8" }} className="table-responsive">
            <table className="table  table-bordered " style={{ width: "100%" }}>
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
                        <span className="me-2">{type}</span>
                        <span className="d-flex">
                          {dishes?.map((dish, index) => {
                            return (
                              <h5
                                key={dish.dish}
                                style={{ fontWeight: "normal" }}
                              >
                                {dish.dish_name}
                                {index < dishes?.length - 1
                                  ? " + "
                                  : ""}
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
                      <td style={{ width: "5%" }}>{index + 1}</td>

                      <td className=" pt-0 pb-0 text-center">
                        <h5 style={{ fontWeight: "normal" }}>
                          {item.building_number}
                        </h5>
                      </td>

                      <td className="pt-0 pb-0  text-center">
                        <h5 style={{ fontWeight: "normal" }}>
                          {item.hujaj}
                        </h5>
                      </td>

                      {item?.pot_details?.map((pot) => {
                        return (
                          <td
                            style={{ width: "1.4in" }}
                            key={pot.pot}
                            className="text-center"
                          >
                            <input
                              type="number"
                              value={pot.qty}
                              className="form-control border-0"
                              onChange={(e) => {
                                handlepotqtychange(item, pot, e.target.value);
                              }}
                            ></input>
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

      {showmodel && (
        <Dailymealeditform
          show={showmodel}
          onHide={() => setshowmodel(false)}
          user={user}
          callback={settable_data}
          text={text}
          data_={data}
          column={column}
          setcolumn={setcolumn}
          table_data={table_data}
        />
      )}
    </div>
  );
}

export default Dailymeal_edit;
