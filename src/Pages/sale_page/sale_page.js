import React, { useState, useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { ToastContainer } from "react-toastify";
import Sale from "../../Container/saleContainer";
import Sale_history from "../../Container/salehistoryContainer";
import Sale_Edit from "../../Container/saleeditContainer";

function Sale_page({ current_user }) {
  const tabs = ["sale", "sale_history"];
  var current_tab = localStorage.getItem("activeTab");
  if (!tabs.includes(current_tab)) {
    current_tab = "sale";
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
        {current_user?.permissions?.includes("view_sale") && (
          <Tab eventKey="sale" title="Sale">
            {activeTab === "sale" && <Sale />}
          </Tab>
        )}
        {current_user?.permissions?.includes("view_sale_history") && (
          <Tab eventKey="sale_history" title="Sale History">
            {activeTab === "sale_history" ? (
              <Sale_history setActiveTab={setActiveTab} />
            ) : (
              activeTab === "sale_Edit" && (
                <Sale_Edit setActiveTab={setActiveTab} />
              )
            )}
          </Tab>
        )}
      </Tabs>

      <ToastContainer autoClose={2000} hideProgressBar={true} theme="dark" />
    </div>
  );
}

export default Sale_page;
