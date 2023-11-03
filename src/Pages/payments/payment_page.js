import React, { useState, useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Payement_customer from "../../Container/payemntConatiner";
import Payement_supplier from "../../Container/sales_paymentContainer";
import Banks from "../../Container/bankContainer";
import CashBook from "../../Container/cashbookContainer";
import { ToastContainer } from "react-toastify";
import Cash_Report from "../../Container/cashreportContainer";

function Payment_page({ current_user }) {
  const tabs = ["Pcustomers", "Psuppliers", "banks", "cashbook", "cash_report"];
  var current_tab = localStorage.getItem("activeTab");
  if (!tabs.includes(current_tab)) {
    current_tab = "Pcustomers";
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
        {current_user?.permissions?.includes("view_customer_payments") && (
          <Tab eventKey="Pcustomers" title="Customer Payments">
            {activeTab === "Pcustomers" && <Payement_customer />}
          </Tab>
        )}

        {current_user?.permissions?.includes("view_supplier_payments") && (
          <Tab eventKey="Psuppliers" title="Vendor Payments">
            {activeTab === "Psuppliers" && <Payement_supplier />}
          </Tab>
        )}
        {current_user?.permissions?.includes("view_supplier_payments") && (
          <Tab eventKey="banks" title="Banks">
            {activeTab === "banks" && <Banks />}
          </Tab>
        )}

        {current_user?.permissions?.includes("view_supplier_payments") && (
          <Tab eventKey="cashbook" title="CashBook">
            {activeTab === "cashbook" && <CashBook />}
          </Tab>
        )}

        {current_user?.permissions?.includes("view_purchase_report") && (
          <Tab eventKey="cash_report" title="Cash Report">
            {activeTab === "cash_report" && <Cash_Report />}
          </Tab>
        )}
      </Tabs>

      <ToastContainer autoClose={2000} hideProgressBar={true} theme="dark" />
    </div>
  );
}

export default Payment_page;
