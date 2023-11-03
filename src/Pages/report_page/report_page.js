import React, { useState, useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Sale_Report from "../../Container/salerportContainer";
import Purchase_Report from "../../Container/purchasereportContainer";
import Cash_Report from "../../Container/cashreportContainer";

import Stock_report from "../../Container/stockreportContainer";
import { ToastContainer } from "react-toastify";

function Report_page({ current_user }) {
  const tabs = [
    "sale_report",
    "purchase_report",
    "stock_report",
    "cash_report",
  ];
  var current_tab = localStorage.getItem("activeTab");
  if (!tabs.includes(current_tab)) {
    current_tab = "sale_report";
  }

  const [activeTab, setActiveTab] = useState(current_tab);

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  const handleTabSelect = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <Tabs
        defaultActiveKey={activeTab}
        transition={true}
        onSelect={handleTabSelect}
        id="noanim-tab-example"
        className="mb-3"
      >
        {current_user?.permissions?.includes("view_sale_report") && (
          <Tab eventKey="sale_report" title="Sale Report">
            {activeTab === "sale_report" && <Sale_Report />}
          </Tab>
        )}

        {current_user?.permissions?.includes("view_purchase_report") && (
          <Tab eventKey="purchase_report" title="Purchase Report">
            {activeTab === "purchase_report" && <Purchase_Report />}
          </Tab>
        )}

        {current_user?.permissions?.includes("view_purchase_report") && (
          <Tab eventKey="stock_report" title="Stock Report">
            {activeTab === "stock_report" && <Stock_report />}
          </Tab>
        )}

        {current_user?.permissions?.includes("view_purchase_report") && (
          <Tab eventKey="cash_report" title="Cash Report">
            {activeTab === "cash_report" && <Cash_Report />}
          </Tab>
        )}
      </Tabs>
      <ToastContainer autoClose={2000} hideProgressBar={true} theme="dark" />
    </div>
  );
}

export default Report_page;
