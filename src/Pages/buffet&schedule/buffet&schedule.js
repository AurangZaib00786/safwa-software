import React, { useState, useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Menu from "../../Container/menuContainer";
import BuffetMenu from "../../Container/buffetmenuContainer";
import { ToastContainer } from "react-toastify";

function Buffet_page({ current_user }) {
  const tabs = ["Buffet Menu", "Schedule"];
  var current_tab = localStorage.getItem("activeTab");
  if (!tabs.includes(current_tab)) {
    current_tab = "Buffet Menu";
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
        <Tab eventKey="Buffet Menu" title="Buffet Menu">
          {activeTab === "Buffet Menu" && <BuffetMenu />}
        </Tab>
        <Tab eventKey="Schedule" title="Schedule"></Tab>
      </Tabs>
      <ToastContainer autoClose={2000} hideProgressBar={true} theme="dark" />
    </div>
  );
}

export default Buffet_page;
