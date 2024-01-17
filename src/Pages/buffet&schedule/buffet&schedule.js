import React, { useState, useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Timing from "../../Container/timingContainer";
import Process from "../../Container/processContainer";

import Schedule from "../../Container/scheduleContainer";
import { ToastContainer } from "react-toastify";

function Buffet_page({ current_user }) {
  const tabs = ["Schedule", "Timing", "Process"];
  var current_tab = localStorage.getItem("activeTab");
  if (!tabs.includes(current_tab)) {
    current_tab = "Schedule";
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
        <Tab eventKey="Schedule" title={activeTab}>
          {activeTab === "Schedule" ? (
            <Schedule setActiveTab={setActiveTab} />
          ) : activeTab === "Timing" ? (
            <Timing setActiveTab={setActiveTab} />
          ) : (
            activeTab === "Process" && <Process setActiveTab={setActiveTab} />
          )}
        </Tab>
      </Tabs>
      <ToastContainer autoClose={2000} hideProgressBar={true} theme="dark" />
    </div>
  );
}

export default Buffet_page;
