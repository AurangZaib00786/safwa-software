import React, { useState, useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Category from "../../Container/categoryContainer";
import Item from "../../Container/itemContainer";
import Subcategory from "../../Container/subcategoryContainer";
import { ToastContainer } from "react-toastify";
import Units from "../../Container/unitContainer";

function Items_page({ current_user }) {
  const tabs = ["Items", "Category", "Subcategory", "Units"];
  var current_tab = localStorage.getItem("activeTab");
  if (!tabs.includes(current_tab)) {
    current_tab = "Items";
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
        <Tab eventKey="Items" title="Items">
          {activeTab === "Items" && <Item setActiveTab={setActiveTab} />}
        </Tab>
        {activeTab === "Category" && (
          <Tab eventKey="Category" title="Category">
            <Category setActiveTab={setActiveTab} />
          </Tab>
        )}

        {activeTab === "Subcategory" && (
          <Tab eventKey="Subcategory" title="Subcategory">
            <Subcategory setActiveTab={setActiveTab} />
          </Tab>
        )}

        {activeTab === "Units" && (
          <Tab eventKey="Units" title="Units">
            <Units setActiveTab={setActiveTab} />
          </Tab>
        )}
      </Tabs>
      <ToastContainer autoClose={2000} hideProgressBar={true} theme="dark" />
    </div>
  );
}

export default Items_page;
