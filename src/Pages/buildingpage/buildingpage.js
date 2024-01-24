import React, { useState, useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Building from "../../Container/buildingContainer";
import BuildingManagement from "../../Container/buildingmanagmentContainer";
import { ToastContainer } from "react-toastify";

function Items_page({ current_user }) {
  const tabs = ["building", "buildingmanagement"];
  var current_tab = localStorage.getItem("activeTab");
  if (!tabs.includes(current_tab)) {
    current_tab = "building";
  }

  const [activeTab, setActiveTab] = useState(current_tab);
  const [additionalinfo, setadditionalinfo] = useState(null);

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
        <Tab eventKey="building" title="Building">
          {activeTab === "building" && (
            <Building
              setActiveTab={setActiveTab}
              setadditionalinfo={setadditionalinfo}
            />
          )}
        </Tab>
        <Tab eventKey="buildingmanagement" title="Building Management">
          {activeTab === "buildingmanagement" && (
            <BuildingManagement
              setActiveTab={setActiveTab}
              additionalinfo={additionalinfo}
              setadditionalinfo={setadditionalinfo}
            />
          )}
        </Tab>
      </Tabs>
      <ToastContainer autoClose={2000} hideProgressBar={true} theme="dark" />
    </div>
  );
}

export default Items_page;
