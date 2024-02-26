import React, { useState } from "react";
import "./dashboard.css";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox } from "@fortawesome/free-solid-svg-icons";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";

function Widget(props) {
  const [show_details, setshowdetails] = useState(false);
  console.log(props);
  const handleclick = (e) => {
    console.log(show_details);
    setshowdetails(!show_details);
  };
  return (
    <div className="card mb-3">
      <div className="card-body p-0">
        <div className="row p-2">
          <div className="col-3 border-end ">
            <p style={{ opacity: 0.7 }} className="m-0">
              Customer Name
            </p>
            <h6>{props.order?.customer_name}</h6>
            <p style={{ opacity: 0.7 }} className="m-0">
              Order Date
            </p>
            <h6 className="m-0">{props.order?.date}</h6>
          </div>

          <div className="col-6 border-end d-flex justify-content-around">
            <div>
              <p style={{ opacity: 0.7 }} className="m-0">
                Order ID
              </p>
              <h6>{props.order?.id}</h6>
              <p style={{ opacity: 0.7 }} className="m-0">
                Total No. of Pax
              </p>
              <h6 className="m-0">{props.order?.pax}</h6>
            </div>
            <div>
              <p style={{ opacity: 0.7 }} className="m-0">
                Menu
              </p>
              <h6>{props.order?.menu}</h6>
              <p style={{ opacity: 0.7 }} className="m-0">
                Timing
              </p>
              <h6 className="m-0">{props.order?.timing}</h6>
            </div>
          </div>

          <div className="col-3  d-flex align-items-center justify-content-center">
            <Button onClick={handleclick} variant="dark">
              TRACK ORDER DETAILS
            </Button>
          </div>
        </div>

        {show_details && (
          <div
            style={{
              backgroundColor: "rgb(216, 239, 248)",
            }}
          >
            <hr />
            <div className=" d-flex justify-content-between align-items-center p-2 mt-3">
              {props.order?.order_details?.map((item, index) => {
                return (
                  <>
                    <div className=" d-flex flex-column justify-content-center align-items-center">
                      <p
                        style={{ fontSize: "12px", opacity: 0.7 }}
                        className="m-0"
                      >
                        {item.name} ({item.type})
                      </p>
                      <div className="box">
                        <FontAwesomeIcon
                          size="2xl"
                          color="royalblue"
                          icon={faBox}
                        />
                        {index < 3 ? (
                          <CheckCircleOutlineIcon
                            style={{
                              color:
                                item.time_type === "Start" ? "green" : "yellow",
                            }}
                            className="box-status"
                          />
                        ) : (
                          <CancelIcon
                            style={{
                              color: "red",
                            }}
                            className="box-status"
                          />
                        )}
                      </div>
                      <p
                        style={{ fontSize: "12px", opacity: 0.7 }}
                        className="m-0"
                      >
                        {item.time_type} {item.time}
                      </p>
                    </div>
                    {props.order?.order_details.length - 1 !== index && (
                      <span className="centerlines"></span>
                    )}
                  </>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Widget;
