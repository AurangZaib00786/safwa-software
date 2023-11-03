import React, { useState, useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Expenses from "../../Container/expenseContainer";
import Expense_type from "../../Container/expensetypeContainer";
import { ToastContainer } from "react-toastify";

function Expense_page({ current_user }) {
  const tabs = ["expenses", "expensetype"];
  var current_tab = localStorage.getItem("activeTab");
  if (!tabs.includes(current_tab)) {
    current_tab = "expenses";
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
          <Tab eventKey="expenses" title="Expenses">
            {activeTab === "expenses" && <Expenses />}
          </Tab>
        )}

        {current_user?.permissions?.includes("view_supplier_payments") && (
          <Tab eventKey="expensetype" title="Expense Type">
            {activeTab === "expensetype" && <Expense_type />}
          </Tab>
        )}
      </Tabs>
      <ToastContainer autoClose={2000} hideProgressBar={true} theme="dark" />
    </div>
  );
}

export default Expense_page;
