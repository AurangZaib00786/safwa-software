import React, { useState, useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import Employee from "../../Container/employeeContainer";
import Employeecategory from "../../Container/employeecategoryContainer";
import { ToastContainer } from "react-toastify";

function Parties_page({ current_user }) {
  const tabs = ["employee", "Employeecategory"];
  var current_tab = localStorage.getItem("activeTab");
  if (!tabs.includes(current_tab)) {
    current_tab = "employee";
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
        <Tab eventKey="employee" title="Employees">
          {activeTab === "employee" && <Employee />}
        </Tab>

        <Tab eventKey="Employeecategory" title="Category">
          {activeTab === "Employeecategory" && <Employeecategory />}
        </Tab>
      </Tabs>
      <ToastContainer autoClose={2000} hideProgressBar={true} theme="dark" />
    </div>
  );
}

export default Parties_page;
