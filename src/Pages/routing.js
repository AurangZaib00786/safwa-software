import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProSidebarProvider } from "react-pro-sidebar";
import Layout from "../Container/homeContainer";
import User_page from "./user_page/user_page";
import Parties_page from "./parties_page/parties_page";
import Menu_page from "./menu_page/menu_page";
import Buffet_page from "./buffet&schedule/buffet&schedule";
import Items_page from "./itempage/itempage";
import Stockstore_page from "./store&stock/store&stock";
import Building_page from "./buildingpage/buildingpage";
import Orderpage from "./orderpage/orderpage";
import Customer from "../Container/customerContainer";
import Supplier from "../Container/supplierContainer";
import Dailymeal_page from "./dailymeal_page/dailymeal_page";
import Mealform from "../Components/dailymeal/dailmealprint";
import BuffetMenu from "../Container/buffetmenuContainer";
import Sale_page from "./sale_page/sale_page";
import Purchase_page from "./purchase_page/purchase_page";
import Sale_invoice from "../Components/sale/sale_invoice";
import Dashboard from "../Container/dashboardContainer";
import Report_page from "./report_page/report_page";
import Login from "../Container/loginContainer";

import Invoice_3 from "../Components/sale/invoice_3";
import Journal_page from "./journals/journals_page";
import Expense_page from "./expenses_page/expense_page";
import Invoice80mm from "../Components/sale/80mminvoice";
import { useState } from "react";
import Issueform from "../Components/materialissueform/formprint";
import EmployeePrint from "../Components/employee/employeeprint";
import Salaries_page from "./salaries_page/salaries_page";
import Salary_Print from "../Components/salaries/salariesprint";

function Routing(props) {
  const user = props.state.setuser.user;
  const current_user = props.state.Setcurrentinfo.current_user;
  const [route, setroute] = useState("dashboard");
  const permissions = [
    { code: "view_dashboard", route: "dashboard" },
    { code: "view_parties", route: "parties" },
    { code: "view_product_page", route: "products" },
    { code: "view_payments", route: "payments" },
    { code: "view_journals", route: "journal_page" },
    { code: "view_purchase_page", route: "purchase_page" },
    { code: "view_sale_page", route: "sale_page" },
    { code: "view_expenses", route: "expenses" },
    { code: "view_report_page", route: "reports" },
  ];
  // useEffect(() => {
  //   const optimize = permissions.filter((item) => {
  //     return current_user?.permissions.includes(item.code);
  //   });
  //   if (optimize.length > 0) {
  //     setroute(optimize[0].route);
  //   }
  // }, [current_user]);

  return (
    <BrowserRouter>
      <ProSidebarProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route
              index
              element={!user ? <Login /> : <Navigate to={`/${route}`} />}
            ></Route>
            <Route
              path="/dashboard"
              element={user ? <Dashboard /> : <Navigate to={"/"} />}
            ></Route>
            <Route
              path="/user"
              element={user ? <User_page /> : <Navigate to={"/"} />}
            ></Route>

            <Route
              path="/customers"
              element={user ? <Customer /> : <Navigate to={"/"} />}
            ></Route>
            <Route
              path="/suppliers"
              element={user ? <Supplier /> : <Navigate to={"/"} />}
            ></Route>

            <Route
              path="/employees"
              element={
                user ? (
                  <Parties_page current_user={current_user} />
                ) : (
                  <Navigate to={"/"} />
                )
              }
            ></Route>

            <Route
              path="/menu_page"
              element={
                user ? (
                  <Menu_page current_user={current_user} />
                ) : (
                  <Navigate to={"/"} />
                )
              }
            ></Route>
            <Route
              path="/salaries_page"
              element={
                user ? (
                  <Salaries_page current_user={current_user} />
                ) : (
                  <Navigate to={"/"} />
                )
              }
            ></Route>
            <Route
              path="/buffetmenu"
              element={user ? <BuffetMenu /> : <Navigate to={"/"} />}
            ></Route>
            <Route
              path="/buffet&schedule"
              element={
                user ? (
                  <Buffet_page current_user={current_user} />
                ) : (
                  <Navigate to={"/"} />
                )
              }
            ></Route>

            <Route
              path="/items"
              element={
                user ? (
                  <Items_page current_user={current_user} />
                ) : (
                  <Navigate to={"/"} />
                )
              }
            ></Route>

            <Route
              path="/store&stock"
              element={
                user ? (
                  <Stockstore_page current_user={current_user} />
                ) : (
                  <Navigate to={"/"} />
                )
              }
            ></Route>
            <Route
              path="/building_page"
              element={
                user ? (
                  <Building_page current_user={current_user} />
                ) : (
                  <Navigate to={"/"} />
                )
              }
            ></Route>
            <Route
              path="/order"
              element={
                user ? (
                  <Orderpage current_user={current_user} />
                ) : (
                  <Navigate to={"/"} />
                )
              }
            ></Route>

            <Route
              path="/daily_meal"
              element={
                user ? (
                  <Dailymeal_page current_user={current_user} />
                ) : (
                  <Navigate to={"/"} />
                )
              }
            ></Route>

            <Route
              path="/sale_page"
              element={
                user ? (
                  <Sale_page current_user={current_user} />
                ) : (
                  <Navigate to={"/"} />
                )
              }
            ></Route>
            <Route
              path="/purchase_page"
              element={
                user ? (
                  <Purchase_page current_user={current_user} />
                ) : (
                  <Navigate to={"/"} />
                )
              }
            ></Route>

            {/* <Route
              path="/payments"
              element={
                user ? (
                  <Payment_page current_user={current_user} />
                ) : (
                  <Navigate to={"/"} />
                )
              }
            ></Route>

            <Route
              path="/journal_page"
              element={
                user ? (
                  <Journal_page current_user={current_user} />
                ) : (
                  <Navigate to={"/"} />
                )
              }
            ></Route>

            

            <Route
              path="/sale_page"
              element={
                user ? (
                  <Sale_page current_user={current_user} />
                ) : (
                  <Navigate to={"/"} />
                )
              }
            ></Route>

            <Route
              path="/expenses"
              element={
                user ? (
                  <Expense_page current_user={current_user} />
                ) : (
                  <Navigate to={"/"} />
                )
              }
            ></Route>

            <Route
              path="/reports"
              element={
                user ? (
                  <Report_page current_user={current_user} />
                ) : (
                  <Navigate to={"/"} />
                )
              }
            ></Route> */}
          </Route>
          <Route
            path="/invoice/:name"
            element={user && <Sale_invoice />}
          ></Route>
          <Route path="/issueform" element={user && <Issueform />}></Route>
          <Route path="/mealform" element={user && <Mealform />}></Route>
          <Route
            path="/salary_print"
            element={user && <Salary_Print />}
          ></Route>
          <Route
            path="/employeeprint"
            element={user && <EmployeePrint />}
          ></Route>
        </Routes>
      </ProSidebarProvider>
    </BrowserRouter>
  );
}

export default Routing;
