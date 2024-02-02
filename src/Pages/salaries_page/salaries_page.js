import React, { useState, useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import Salaries from "../../Container/salariesContainer";
import Salalrieshistory from "../../Container/salarieshistoryContainer";
import Salalries_edit from "../../Container/salarieseditContainer";

function Salaries_page({ current_user }) {
  const tabs = ["salaries", "salaries_history", "salaries_edit"];
  var current_tab = localStorage.getItem("activeTab");
  if (!tabs.includes(current_tab)) {
    current_tab = "salaries";
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
        {current_user?.permissions?.includes("add_salaries") && (
          <Tab eventKey="salaries" title="Salaries">
            {activeTab === "salaries" && <Salaries />}
          </Tab>
        )}

        {current_user?.permissions?.includes("view_salaries") && (
          <Tab eventKey="salaries_history" title="History ">
            {activeTab === "salaries_history" && (
              <Salalrieshistory setActiveTab={setActiveTab} />
            )}
          </Tab>
        )}
        {activeTab === "salaries_edit" && (
          <Tab eventKey="salaries_edit" title="Edit ">
            <Salalries_edit setActiveTab={setActiveTab} />
          </Tab>
        )}
      </Tabs>
    </div>
  );
}

export default Salaries_page;
