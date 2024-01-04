import React, { useState, useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { ToastContainer } from "react-toastify";
import Dailymeal from "../../Container/dailymealContainer";
import Dailymeal_history from "../../Container/dailymealhistpryContainer";
import Dailymeal_Edit from "../../Container/dailymealeditContainer";

function Dailymeal_page({ current_user }) {
  const tabs = ["dailymeal", "dailymeal_history"];
  var current_tab = localStorage.getItem("activeTab");
  if (!tabs.includes(current_tab)) {
    current_tab = "dailymeal";
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
        <Tab eventKey="dailymeal" title="Daily Meal">
          {activeTab === "dailymeal" && <Dailymeal />}
        </Tab>

        <Tab eventKey="dailymeal_history" title="Meal History">
          {activeTab === "dailymeal_history" ? (
            <Dailymeal_history setActiveTab={setActiveTab} />
          ) : (
            activeTab === "dailymeal_Edit" && (
              <Dailymeal_Edit setActiveTab={setActiveTab} />
            )
          )}
        </Tab>
      </Tabs>

      <ToastContainer autoClose={2000} hideProgressBar={true} theme="dark" />
    </div>
  );
}

export default Dailymeal_page;
