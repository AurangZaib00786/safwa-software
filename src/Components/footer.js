import React from "react";
import "./footer.css";

function Footer() {
  const handleclick = () => {
    window.open("https://www.eavenir.com", "_blank");
  };
  return (
    <div>
      <div className="border-top footer ps-3">
        <span>
          <p className="mt-3">
            <span className="fw-bold">
              Copyright © 2014-2021
              <span
                className="footer-hover"
                style={{ color: "#007aff", fontWeight: "bold" }}
                onClick={handleclick}
              >
                eAvenir.com
              </span>{" "}
            </span>{" "}
            All rights reserved.
          </p>
        </span>
      </div>
    </div>
  );
}

export default Footer;
