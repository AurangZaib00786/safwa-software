import React, { useState, useRef } from "react";
import "./home.css";
import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  useProSidebar,
} from "react-pro-sidebar";
import { Outlet } from "react-router-dom";
import { Avatar } from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import DashboardIcon from "@material-ui/icons/Dashboard";
import LocalAtmIcon from "@material-ui/icons/LocalAtm";
import { Link } from "react-router-dom";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import Header from "../Container/headerContainer";
import Footer from "../Components/footer";
import ShoppingBasketIcon from "@material-ui/icons/ShoppingBasket";
import TurnedInIcon from "@material-ui/icons/TurnedIn";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import StoreIcon from "@material-ui/icons/Store";
import { useTranslation } from "react-i18next";
import BusinessIcon from "@material-ui/icons/Business";

function Layout(props) {
  const { t } = useTranslation();
  const user = props.state.setuser.user;
  const menu_status = props.state.Settablehistory.menu_status;

  const current_user = props.state.Setcurrentinfo.current_user;

  const { collapseSidebar, toggleSidebar, broken, collapsed } = useProSidebar();
  const [checkcollapse, setcheckcollapse] = useState(true);

  const handlemouseleave = () => {
    if (checkcollapse && !collapsed) {
      collapseSidebar();
    }
  };

  const handlemouseenter = () => {
    if (checkcollapse && collapsed) {
      collapseSidebar();
    }
  };
  return (
    <div id="app" className="d-flex" style={{ zoom: ".7" }}>
      {user && (
        <Sidebar
          breakPoint="md"
          defaultCollapsed={true}
          rootStyles={{ color: "whitesmoke" }}
          backgroundColor="#000"
        >
          <div
            style={{
              textAlign: "center",
              borderBottom: "3px solid #757575",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Avatar className="mt-1 mb-1 ms-3 me-4" />
            <h5>{current_user && current_user.username}</h5>
          </div>
          <Menu
            className="sidebarclass"
            onMouseEnter={handlemouseenter}
            onMouseLeave={handlemouseleave}
            style={{ height: "135vh", overflow: "auto" }}
            menuItemStyles={{
              button: ({ level, active, disabled }) => {
                if (level === 0 || level === 1) {
                  return {
                    color: active ? "skyblue" : undefined,
                    "&:hover": {
                      backgroundColor: "#335B8C !important",
                      color: "white !important",
                      borderRadius: "8px !important",
                      fontWeight: "bold !important",
                    },
                  };
                }
              },
            }}
          >
            <MenuItem
              active={menu_status === "dashboard"}
              icon={<DashboardIcon />}
              component={<Link to="/dashboard" />}
            >
              {t("side_bar_dashboard")}
            </MenuItem>

            <MenuItem
              active={menu_status === "user"}
              icon={<PersonIcon />}
              component={<Link to="/user" />}
              rootStyles={{ color: "whitesmoke", backgroundColor: "#000" }}
            >
              User Management
            </MenuItem>

            <MenuItem
              active={menu_status === "customer"}
              icon={<SupervisorAccountIcon />}
              component={<Link to={`/customers`} />}
              rootStyles={{ color: "whitesmoke", backgroundColor: "#000" }}
            >
              Customers
            </MenuItem>
            <MenuItem
              active={menu_status === "supplier"}
              icon={<SupervisorAccountIcon />}
              component={<Link to={`/suppliers`} />}
              rootStyles={{ color: "whitesmoke", backgroundColor: "#000" }}
            >
              Vendors
            </MenuItem>
            <MenuItem
              active={menu_status === "employee"}
              icon={<SupervisorAccountIcon />}
              component={<Link to={`/employees`} />}
              rootStyles={{ color: "whitesmoke", backgroundColor: "#000" }}
            >
              Employees
            </MenuItem>

            <SubMenu
              active={
                menu_status === "dish" ||
                menu_status === "buffet" ||
                menu_status === "buffet menu"
              }
              icon={<TurnedInIcon />}
              label={"Menu Managment"}
            >
              <MenuItem
                active={menu_status === "dish"}
                icon={<TurnedInIcon />}
                component={<Link to="/menu_page" />}
                rootStyles={{ color: "whitesmoke", backgroundColor: "#000" }}
              >
                Dishes
              </MenuItem>

              <MenuItem
                active={menu_status === "buffet"}
                icon={<TurnedInIcon />}
                component={<Link to="/buffet&schedule" />}
                rootStyles={{ color: "whitesmoke", backgroundColor: "#000" }}
              >
                Schedule
              </MenuItem>
              <MenuItem
                active={menu_status === "buffet menu"}
                icon={<TurnedInIcon />}
                component={<Link to="/buffetmenu" />}
                rootStyles={{ color: "whitesmoke", backgroundColor: "#000" }}
              >
                Buffet Menu
              </MenuItem>
            </SubMenu>

            <SubMenu
              active={menu_status === "item" || menu_status === "store"}
              icon={<StoreIcon />}
              label={"Store Managment"}
            >
              <MenuItem
                active={menu_status === "item"}
                icon={<TurnedInIcon />}
                component={<Link to="/items" />}
                rootStyles={{ color: "whitesmoke", backgroundColor: "#000" }}
              >
                Items
              </MenuItem>

              <MenuItem
                active={menu_status === "store"}
                icon={<StoreIcon />}
                component={<Link to="/store&stock" />}
                rootStyles={{ color: "whitesmoke", backgroundColor: "#000" }}
              >
                Stock
              </MenuItem>
            </SubMenu>

            <MenuItem
              active={menu_status === "building"}
              icon={<StoreIcon />}
              component={<Link to="/building_page" />}
              rootStyles={{ color: "whitesmoke", backgroundColor: "#000" }}
            >
              Building
            </MenuItem>

            <MenuItem
              active={menu_status === "order"}
              icon={<StoreIcon />}
              component={<Link to="/order" />}
              rootStyles={{ color: "whitesmoke", backgroundColor: "#000" }}
            >
              Order
            </MenuItem>

            <MenuItem
              active={menu_status === "purchase"}
              icon={<ShoppingBasketIcon />}
              component={<Link to="/daily_meal" />}
              rootStyles={{ color: "whitesmoke", backgroundColor: "#000" }}
            >
              Daily Meal
            </MenuItem>

            {/* {current_user?.permissions?.includes("view_payments") && (
              <MenuItem
                active={menu_status === "payment_customer"}
                icon={<AccountBalanceWalletIcon />}
                component={<Link to="/payments" />}
                rootStyles={{ color: "whitesmoke", backgroundColor: "#000" }}
              >
                Payments
              </MenuItem>
            )}

            {current_user?.permissions?.includes("view_journals") && (
              <MenuItem
                active={menu_status === "journal_customer"}
                icon={<AccountBalanceWalletIcon />}
                component={<Link to="/journal_page" />}
                rootStyles={{ color: "whitesmoke", backgroundColor: "#000" }}
              >
                Journals
              </MenuItem>
            )}

            {current_user?.permissions?.includes("view_purchase_page") && (
              <MenuItem
                active={menu_status === "purchase"}
                icon={<ShoppingBasketIcon />}
                component={<Link to="/purchase_page" />}
                rootStyles={{ color: "whitesmoke", backgroundColor: "#000" }}
              >
                Purchase
              </MenuItem>
            )}

            {current_user?.permissions?.includes("view_sale_page") && (
              <MenuItem
                active={menu_status === "sale"}
                icon={<LocalAtmIcon />}
                rootStyles={{ color: "whitesmoke", backgroundColor: "#000" }}
                component={<Link to="/sale_page" />}
              >
                Sale
              </MenuItem>
            )}
            {current_user?.permissions?.includes("view_expenses") && (
              <MenuItem
                active={menu_status === "expenses"}
                icon={<LocalAtmIcon />}
                rootStyles={{ color: "whitesmoke", backgroundColor: "#000" }}
                component={<Link to="/expenses" />}
              >
                Expenses
              </MenuItem>
            )}
            {current_user?.permissions?.includes("view_report_page") && (
              <MenuItem
                active={menu_status === "sale_report"}
                icon={<ReceiptIcon />}
                rootStyles={{ color: "whitesmoke", backgroundColor: "#000" }}
                component={<Link to="/reports" />}
              >
                Reports
              </MenuItem>
            )} */}
          </Menu>
        </Sidebar>
      )}

      <div className="w-100 ">
        <div className="header ">
          {user && (
            <Header
              togglefun={toggleSidebar}
              collapsefun={collapseSidebar}
              broken={broken}
              statefun={() => setcheckcollapse(!checkcollapse)}
            />
          )}
        </div>

        {user ? (
          <div
            style={{
              minHeight: "126vh",
              backgroundColor: "rgb(241, 245, 245)",
            }}
          >
            <Outlet />
          </div>
        ) : (
          <div
            style={{
              minHeight: "125vh",
              backgroundColor: "rgb(241, 245, 245)",
            }}
          >
            <Outlet />
          </div>
        )}

        <div className="footer">{user && <Footer />}</div>
      </div>
    </div>
  );
}

export default Layout;
