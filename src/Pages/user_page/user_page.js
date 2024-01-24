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
  const tabs = [
    "User",
    "Assign Roles",
    "Permissions",
    "Assign Branch",
    "Branch",
  ];
  var current_tab = "User";

  const [activeTab, setActiveTab] = useState(current_tab);
  const [tabname, settabname] = useState(current_tab);
  const [additionalinfo, setadditionalinfo] = useState(null);

  useEffect(() => {
    if (activeTab !== "Branch" && activeTab !== "Assign Branch") {
      settabname(activeTab);
    }
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
        <Tab eventKey="User" title={tabname}>
          {activeTab === "User" ? (
            <User
              setActiveTab={setActiveTab}
              setadditionalinfo={setadditionalinfo}
            />
          ) : activeTab === "Assign Roles" ? (
            <Assign_role
              setActiveTab={setActiveTab}
              setadditionalinfo={setadditionalinfo}
              additionalinfo={additionalinfo}
            />
          ) : activeTab === "Permissions" ? (
            <RolePermission
              setActiveTab={setActiveTab}
              setadditionalinfo={setadditionalinfo}
            />
          ) : (
            activeTab === "Assign Branch" && (
              <Assign_Branch
                setActiveTab={setActiveTab}
                additionalinfo={additionalinfo}
              />
            )
          )}
        </Tab>

        <Tab eventKey="Branch" title="Branches">
          {activeTab === "Branch" ? (
            <Branch setActiveTab={setActiveTab} />
          ) : (
            activeTab === "Assign Branch" && (
              <Assign_Branch
                setActiveTab={setActiveTab}
                additionalinfo={null}
              />
            )
          )}
        </Tab>
      </Tabs>
      <ToastContainer autoClose={2000} hideProgressBar={true} theme="dark" />
    </div>
  );
}

export default User_page;
