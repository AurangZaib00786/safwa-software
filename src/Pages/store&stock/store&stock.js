import React, { useState, useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Stock from "../../Container/stockContainer";
import Store from "../../Container/storeContainer";

import { ToastContainer } from "react-toastify";
import StockAdjustment from "../../Container/stockadjustment";
import Materialissueform from "../../Container/materialissueformContainer";

function Stockstore_page({ current_user }) {
  const tabs = ["Store", "Stock", "Stock Adjustment", "materialform"];
  var current_tab = localStorage.getItem("activeTab");
  if (!tabs.includes(current_tab)) {
    current_tab = "Stock";
  }

  const [activeTab, setActiveTab] = useState(current_tab);
  const [tabname, settabname] = useState(current_tab);

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
    if (activeTab !== "materialform") {
      settabname(activeTab);
    }
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
        <Tab eventKey="Stock" title={tabname}>
          {activeTab === "Stock" ? (
            <Stock setActiveTab={setActiveTab} />
          ) : activeTab === "Store" ? (
            <Store setActiveTab={setActiveTab} />
          ) : (
            activeTab === "Stock Adjustment" && (
              <StockAdjustment setActiveTab={setActiveTab} />
            )
          )}
        </Tab>

        <Tab eventKey="materialform" title="Material Issue Form">
          {activeTab === "materialform" && <Materialissueform />}
        </Tab>
      </Tabs>
      <ToastContainer autoClose={2000} hideProgressBar={true} theme="dark" />
    </div>
  );
}

export default Stockstore_page;
