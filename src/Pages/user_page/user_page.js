import React, { useState, useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import User from "../../Container/userContainer";
import RolePermission from "../../Container/rolepermissionContainer";
import Assign_role from "../../Container/assign_roleContainer";
import Assign_Branch from "../../Container/assignbranchesContiner";
import Branch from "../../Container/branchesContainer";

import { ToastContainer } from "react-toastify";

function User_page() {
  const tabs = ["User", "Role", "Group", "Assign Branch", "Branch"];
  var current_tab = localStorage.getItem("activeTab");
  if (!tabs.includes(current_tab)) {
    current_tab = "User";
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
        <Tab eventKey="User" title="Users">
          {activeTab === "User" && <User setActiveTab={setActiveTab} />}
        </Tab>

        {activeTab === "Role" && (
          <Tab eventKey="Role" title="Assign Roles">
            <Assign_role setActiveTab={setActiveTab} />
          </Tab>
        )}

        {activeTab === "Group" && (
          <Tab eventKey="Group" title="Roles & Permissions">
            <RolePermission setActiveTab={setActiveTab} />
          </Tab>
        )}

        <Tab eventKey="Branch" title="Branches">
          {activeTab === "Branch" && <Branch setActiveTab={setActiveTab} />}
        </Tab>

        {activeTab === "Assign Branch" && (
          <Tab eventKey="Assign Branch" title="Assign Branches">
            <Assign_Branch setActiveTab={setActiveTab} />
          </Tab>
        )}
      </Tabs>
      <ToastContainer autoClose={2000} hideProgressBar={true} theme="dark" />
    </div>
  );
}

export default User_page;
