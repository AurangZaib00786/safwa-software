import React from "react";
import "./dashboard.css";
import { Link } from "react-router-dom";

function Widget({
  text_1,
  text_2,
  text_3,
  value_1,
  value_2,
  value_3,
  icon_widget,
  link,
  color,
  text,
}) {
  return (
    <div className="card">
      {!text ? (
        <Link to={link}>
          <div
            className="widget card-body p-0 d-flex flex-column  justify-content-start"
            style={{
              height: "10rem",
            }}
          >
            <div
              className=" ps-3 pe-3  d-flex align-items-center justify-content-between"
              style={{ height: "8rem" }}
            >
              <h6 className="text-dark m-0 d-flex flex-column align-items-center  justify-content-between  bordered-0">
                <strong style={{ fontSize: "30px" }}>{value_1}</strong>
                <span>{text_1}</span>
              </h6>
              <div className="icon me-3 ">{icon_widget}</div>
            </div>
            <div
              className="d-flex justify-content-around p-2"
              style={{
                backgroundColor: `${color}`,
                borderBottomLeftRadius: "5px",
                borderBottomRightRadius: "5px",
              }}
            >
              <h6 className="text-white m-0  d-flex flex-column align-items-center  justify-content-between bordered-0">
                <span style={{ fontSize: "20px" }}>{value_2}</span>
                <span>{text_2}</span>
              </h6>
              <h6 className="text-white m-0 d-flex flex-column align-items-center  justify-content-between bordered-0">
                <span style={{ fontSize: "20px" }}>{value_3}</span>
                <span>{text_3}</span>
              </h6>
            </div>
          </div>
        </Link>
      ) : (
        <div
          className="card-body p-3 d-flex flex-column align-items-center justify-content-start"
          style={{ backgroundColor: `${color}` }}
        >
          <h1
            className="text-center text-dark"
            style={{ fontSize: "1rem", fontWeight: "normal" }}
          >
            {text}
          </h1>
          <h2 className="text-dark">{text_2}</h2>
        </div>
      )}
    </div>
  );
}

export default Widget;
