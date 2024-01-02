import React, { useState, useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { ToastContainer } from "react-toastify";
import Purchase from "../../Container/purchaseContainer";
import Purchase_history from "../../Container/purchasehistpryContainer";
import Purchase_Edit from "../../Container/purchaseeditContainer";

import Purchase_return from "../../Container/purchase_returnContainer";
import Purchase_return_history from "../../Container/purchase_returnhistoryContainer";
import Purchase_return_Edit from "../../Container/purchase_returneditContainer";
import Quotation from "../../Container/quotationContainer";
import Quotation_Edit from "../../Container/quotationeditContainer";
import Quotation_history from "../../Container/quotationhistoryContainer";

function Purchase_page({ current_user }) {
  const tabs = [
    "purchase",
    "purchase_history",
    "purchasereturn",
    "purchasereturn_history",
    "purchasequotation",
    "purchasequotation_history",
  ];
  var current_tab = localStorage.getItem("activeTab");
  if (!tabs.includes(current_tab)) {
    current_tab = "purchase";
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
        
          <Tab eventKey="purchase" title="Daily Meal">
            {activeTab === "purchase" && <Purchase />}
          </Tab>
        
       
          <Tab eventKey="purchase_history" title="Meal History">
            {activeTab === "purchase_history" ? (
              <Purchase_history setActiveTab={setActiveTab} />
            ) : (
              activeTab === "purchase_Edit" && (
                <Purchase_Edit setActiveTab={setActiveTab} />
              )
            )}
          </Tab>
        

        {current_user?.permissions?.includes("view_purchase_return") && (
          <Tab eventKey="purchasereturn" title="Purchase Return">
            {activeTab === "purchasereturn" && <Purchase_return />}
          </Tab>
        )}
        {current_user?.permissions?.includes(
          "view_purchase_return_history"
        ) && (
          <Tab eventKey="purchasereturn_history" title="Return History">
            {activeTab === "purchasereturn_history" ? (
              <Purchase_return_history setActiveTab={setActiveTab} />
            ) : (
              activeTab === "purchasereturn_Edit" && (
                <Purchase_return_Edit setActiveTab={setActiveTab} />
              )
            )}
          </Tab>
        )}

        {current_user?.permissions?.includes("view_purchase_quotation") && (
          <Tab eventKey="purchasequotation" title="Purchase Quotation">
            {activeTab === "purchasequotation" && <Quotation />}
          </Tab>
        )}
        {current_user?.permissions?.includes(
          "view_purchase_quotation_history"
        ) && (
          <Tab eventKey="purchasequotation_history" title="Quotation History">
            {activeTab === "purchasequotation_history" ? (
              <Quotation_history setActiveTab={setActiveTab} />
            ) : (
              activeTab === "purchasequotation_Edit" && (
                <Quotation_Edit setActiveTab={setActiveTab} />
              )
            )}
          </Tab>
        )}
      </Tabs>

      <ToastContainer autoClose={2000} hideProgressBar={true} theme="dark" />
    </div>
  );
}

export default Purchase_page;
