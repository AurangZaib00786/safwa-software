import React, { useState, useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { ToastContainer } from "react-toastify";
import Dailymeal from "../../Container/dailymealContainer";
import Dailymeal_history from "../../Container/dailymealhistpryContainer";
import Dailymeal_Edit from "../../Container/dailymealeditContainer";
import Dailymealreport from "../../Container/mealreportContainer";
import AssignDailymeal from "../../Container/assigndailymealContainer";

function Dailymeal_page({ current_user }) {
  const tabs = [
    "dailymeal",
    "dailymeal_history",
    "dailymeal_Edit",
    '"dailymeal_report',
    "assignmeal",
  ];
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
        activeKey={activeTab}
        transition={true}
        onSelect={handleTabSelect}
        id="noanim-tab-example"
        className="mb-3"
      >
        {current_user?.permissions?.includes("add_daily_meal") && (
          <Tab eventKey="dailymeal" title="Daily Meal">
            {activeTab === "dailymeal" && <Dailymeal />}
          </Tab>
        )}

        {current_user?.permissions?.includes("view_daily_meal") && (
          <Tab eventKey="dailymeal_history" title="Meal History">
            {activeTab === "dailymeal_history" && (
              <Dailymeal_history setActiveTab={setActiveTab} />
            )}
          </Tab>
        )}
        {activeTab === "assignmeal" && (
          <Tab eventKey="assignmeal" title="Assign Meal">
            {activeTab === "assignmeal" && (
              <AssignDailymeal setActiveTab={setActiveTab} />
            )}
          </Tab>
        )}

        {activeTab === "dailymeal_Edit" && (
          <Tab eventKey="dailymeal_Edit" title="Meal Edit">
            <Dailymeal_Edit />
          </Tab>
        )}
        <Tab eventKey="dailymeal_report" title="Meal Report">
          {activeTab === "dailymeal_report" && <Dailymealreport />}
        </Tab>
      </Tabs>

      <ToastContainer autoClose={2000} hideProgressBar={true} theme="dark" />
    </div>
  );
}

export default Dailymeal_page;
