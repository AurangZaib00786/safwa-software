import React, { useState, useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Menu from "../../Container/menuContainer";
import Dish from "../../Container/dishContainer";
import Submenu from "../../Container/submenuContainer";
import { ToastContainer } from "react-toastify";
import Pots from "../../Container/potsContainer";

function Product_page({ current_user }) {
  const tabs = ["pots", "menu", "submenu", "dish"];
  var current_tab = localStorage.getItem("activeTab");
  if (!tabs.includes(current_tab)) {
    current_tab = "dish";
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
        <Tab eventKey="dish" title="Dish">
          {activeTab === "dish" && <Dish setActiveTab={setActiveTab} />}
        </Tab>
        {activeTab === "menu" && (
          <Tab eventKey="menu" title="Menu">
            <Menu setActiveTab={setActiveTab} />
          </Tab>
        )}

        {activeTab === "submenu" && (
          <Tab eventKey="submenu" title="SubMenu">
            <Submenu setActiveTab={setActiveTab} />
          </Tab>
        )}

        <Tab eventKey="pots" title="Pots">
          {activeTab === "pots" && <Pots />}
        </Tab>
      </Tabs>
      <ToastContainer autoClose={2000} hideProgressBar={true} theme="dark" />
    </div>
  );
}

export default Product_page;
