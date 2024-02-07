import React, { useState, useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { ToastContainer } from "react-toastify";
import Purchase from "../../Container/purchaseContainer";
import Purchase_history from "../../Container/purchasehistpryContainer";
import Purchase_Edit from "../../Container/purchaseeditContainer";

function Purchase_page({ current_user }) {
  const tabs = ["purchase", "purchase_history", "purchase_Edit"];
  var current_tab = localStorage.getItem("activeTab");
  if (!tabs.includes(current_tab)) {
    current_tab = "purchase";
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
        activeKey={activeTab}
        transition={true}
        onSelect={handleTabSelect}
        id="noanim-tab-example"
        className="mb-3"
      >
        {!current_user?.permissions?.includes("view_purchase") && (
          <Tab eventKey="purchase" title="Purchase">
            {activeTab === "purchase" && <Purchase />}
          </Tab>
        )}
        {!current_user?.permissions?.includes("view_purchase_history") && (
          <Tab eventKey="purchase_history" title="Purchase History">
            {activeTab === "purchase_history" && (
              <Purchase_history setActiveTab={setActiveTab} />
            )}
          </Tab>
        )}

        {activeTab === "purchase_Edit" && (
          <Tab eventKey="purchase_Edit" title="Purchase Edit">
            <Purchase_Edit setActiveTab={setActiveTab} />
          </Tab>
        )}
      </Tabs>

      <ToastContainer autoClose={2000} hideProgressBar={true} theme="dark" />
    </div>
  );
}

export default Purchase_page;
