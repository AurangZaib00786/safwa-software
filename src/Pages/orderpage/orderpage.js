import React, { useState, useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Order from "../../Container/orderContainer";
import Assignorderhistory from "../../Container/assignorderhistoryContainer";
import Assignorder from "../../Container/assiignorderContainer";
import { ToastContainer } from "react-toastify";

function Items_page({ current_user }) {
  const tabs = ["order", "assignorderhistory"];

  var current_tab = localStorage.getItem("activeTab");
  if (!tabs.includes(current_tab)) {
    current_tab = "order";
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
        <Tab eventKey="order" title="Order">
          {activeTab === "order" && <Order setActiveTab={setActiveTab} />}
        </Tab>
        <Tab eventKey={"assignorderhistory"} title="Assign Order">
          {activeTab === "assignorderhistory" && (
            <Assignorderhistory setActiveTab={setActiveTab} />
          )}
        </Tab>
        {activeTab === "assignorder" && (
          <Tab eventKey={"assignorder"} title="Assign Order">
            <Assignorder setActiveTab={setActiveTab} />
          </Tab>
        )}
      </Tabs>
      <ToastContainer autoClose={2000} hideProgressBar={true} theme="dark" />
    </div>
  );
}

export default Items_page;
