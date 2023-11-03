import React, { useState, useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { ToastContainer } from "react-toastify";
import Sale from "../../Container/saleContainer";
import Sale_history from "../../Container/salehistoryContainer";
import Sale_Edit from "../../Container/saleeditContainer";

import Sale_Return from "../../Container/salereturnContainer";
import Sale_Return_edit from "../../Container/salereturneditContainer";
import Sale_Return_history from "../../Container/salereturnhistory";

import Sale_Quotation from "../../Container/salequotationContainer";
import Sale_Quotation_edit from "../../Container/salequotationeditContainer";
import Sale_Quotation_history from "../../Container/salequotationhistoryContainer";

function Sale_page({ current_user }) {
  const tabs = [
    "sale",
    "sale_history",
    "salereturn",
    "salereturn_history",
    "salequotation",
    "salequotation_history",
  ];
  var current_tab = localStorage.getItem("activeTab");
  if (!tabs.includes(current_tab)) {
    current_tab = "sale";
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
        {current_user?.permissions?.includes("view_sale") && (
          <Tab eventKey="sale" title="Sale">
            {activeTab === "sale" && <Sale />}
          </Tab>
        )}
        {current_user?.permissions?.includes("view_sale_history") && (
          <Tab eventKey="sale_history" title="Sale History">
            {activeTab === "sale_history" ? (
              <Sale_history setActiveTab={setActiveTab} />
            ) : (
              activeTab === "sale_Edit" && (
                <Sale_Edit setActiveTab={setActiveTab} />
              )
            )}
          </Tab>
        )}

        {current_user?.permissions?.includes("view_sale_return") && (
          <Tab eventKey="salereturn" title="Sale Return">
            {activeTab === "salereturn" && <Sale_Return />}
          </Tab>
        )}
        {current_user?.permissions?.includes("view_sale_return_history") && (
          <Tab eventKey="salereturn_history" title="Return History">
            {activeTab === "salereturn_history" ? (
              <Sale_Return_history setActiveTab={setActiveTab} />
            ) : (
              activeTab === "salereturn_Edit" && (
                <Sale_Return_edit setActiveTab={setActiveTab} />
              )
            )}
          </Tab>
        )}

        {current_user?.permissions?.includes("view_sale_quotation") && (
          <Tab eventKey="salequotation" title="Sale Quotation">
            {activeTab === "salequotation" && <Sale_Quotation />}
          </Tab>
        )}
        {current_user?.permissions?.includes("view_sale_quotation_history") && (
          <Tab eventKey="salequotation_history" title="Quotation History">
            {activeTab === "salequotation_history" ? (
              <Sale_Quotation_history setActiveTab={setActiveTab} />
            ) : (
              activeTab === "salequotation_Edit" && (
                <Sale_Quotation_edit setActiveTab={setActiveTab} />
              )
            )}
          </Tab>
        )}
      </Tabs>

      <ToastContainer autoClose={2000} hideProgressBar={true} theme="dark" />
    </div>
  );
}

export default Sale_page;
