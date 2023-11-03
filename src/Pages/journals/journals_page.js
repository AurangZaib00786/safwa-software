import React, { useState, useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Supplier_Journal from "../../Container/supplierjournalContiner";
import Customer_Journal from "../../Container/customerjournalContainer";
import { ToastContainer } from "react-toastify";

function Journal_page({ current_user }) {
  const tabs = ["Jcustomers", "Jsuppliers"];
  var current_tab = localStorage.getItem("activeTab");
  if (!tabs.includes(current_tab)) {
    current_tab = "Jcustomers";
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
        {current_user?.permissions?.includes("view_customer_journal") && (
          <Tab eventKey="Jcustomers" title="Customer Journals">
            {activeTab === "Jcustomers" && <Customer_Journal />}
          </Tab>
        )}

        {current_user?.permissions?.includes("view_supplier_journal") && (
          <Tab eventKey="Jsuppliers" title="Supplier Journals">
            {activeTab === "Jsuppliers" && <Supplier_Journal />}
          </Tab>
        )}
      </Tabs>
      <ToastContainer autoClose={2000} hideProgressBar={true} theme="dark" />
    </div>
  );
}

export default Journal_page;
