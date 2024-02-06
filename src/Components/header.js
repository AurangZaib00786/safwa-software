import React, { useState, useRef, useEffect } from "react";
import Overlay from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";
import MenuIcon from "@material-ui/icons/Menu";
import { IconButton, Avatar } from "@material-ui/core";
import "../Pages/home.css";
import "./header.css";
import Dropdown from "react-bootstrap/Dropdown";
import jwtDecode from "jwt-decode";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import pdfMake from "pdfmake/build/pdfmake";
import SettingsIcon from "@material-ui/icons/Settings";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { font } from "./ArabicFont";
import Userupdate from "./users/userupdateform";
import { ToastContainer } from "react-toastify";
import custom_toast from "./alerts/custom_toast";
import Red_toast from "./alerts/red_toast";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
window.pdfMake.vfs["Arabic-Font.ttf"] = font;

function Header(props) {
  const { t } = useTranslation();
  const user = props.state.setuser.user;
  const route = props.state.setuser.route;
  const selected_branch = props.state.Setcurrentinfo.selected_branch;

  const current_user = props.state.Setcurrentinfo.current_user;
  const invoice_type = props.state.Setcurrentinfo.invoice_type;
  const dispatch = props.Setinfo_ofuser;
  const RemoveUser_fun = props.RemoveUser;
  const [show, setshow] = useState(false);
  const [target, setTarget] = useState(null);
  const [data, setdata] = useState("");
  const [showmodelupdate, setshowmodelupdate] = useState(false);
  const ref = useRef(null);

  const decodedToken = jwtDecode(user.access);
  const userId = decodedToken.user_id;

  pdfMake.fonts = {
    ArabicFont: {
      normal: "Arabic-Font.ttf",
      bold: "Arabic-Font.ttf",
      italics: "Arabic-Font.ttf",
      bolditalics: "Arabic-Font.ttf",
    },
  };

  useEffect(() => {
    const getuser = async () => {
      const response = await fetch(
        `${route}/api/users/${userId}/assign-account-head/`,
        {
          headers: { Authorization: `Bearer ${user.access}` },
        }
      );
      const json = await response.json();
      if (!response.ok) {
      }

      if (response.ok) {
        getpermission(json);
      }
    };

    if (user) {
      getuser();
    }
  }, [user]);

  const getpermission = async (input) => {
    var url = `${route}/api/user-permissions/${input.id}/`;

    const response = await fetch(`${url}`, {
      headers: { Authorization: `Bearer ${user.access}` },
    });
    const json = await response.json();
    if (!response.ok) {
    }

    if (response.ok) {
      dispatch({
        type: "SetCurrentUser",
        data: { ...input, permissions: json.permissions },
      });
    }
  };

  const handlestate = (event) => {
    setshow(!show);
    setTarget(event.target);
  };

  const handlecollapsefun = () => {
    props.collapsefun();
    props.statefun();
  };

  const handlesignout = (e) => {
    e.preventDefault();
    dispatch({ type: "Set_Branch_first", data: null });
    RemoveUser_fun();
  };

  const handleclick = (e) => {
    e.preventDefault();
    setdata(current_user);
    setshowmodelupdate(true);
    setshow(!show);
  };
  const settingslist = [
    { name: "A4 Invoice", code: "A4" },
    { name: "80mm Invoive", code: "80mm" },
  ];

  const clickonsettings = () => {
    document.getElementById("dropdown-autoclose-true").click();
  };

  return (
    <div>
      <div className="d-flex border-bottom justify-content-between header">
        {props.broken ? (
          <IconButton onClick={() => props.togglefun()}>
            <MenuIcon />
          </IconButton>
        ) : (
          <IconButton onClick={handlecollapsefun}>
            <MenuIcon />
          </IconButton>
        )}
        <div className="d-flex align-items-center  ">
          {selected_branch && (
            <span className="me-2">{selected_branch.name}</span>
          )}

          <div
            ref={ref}
            onClick={handlestate}
            className="d-flex align-items-center header_right pb-1 me-5 ps-1"
          >
            <Avatar className="mt-1" />
            <h6 className="mt-2 me-5 ms-4">
              {current_user && current_user.username}
            </h6>
          </div>

          <Dropdown>
            <Dropdown.Toggle split variant="" id="dropdown-autoclose-true" />
            <Dropdown.Menu>
              {settingslist?.map((item) => (
                <Dropdown.Item
                  key={item.id}
                  onClick={() => {
                    dispatch({ type: "Set_invoice_type", data: item });
                  }}
                  style={{
                    color:
                      invoice_type.code === item.code ? "royalblue" : "black",
                  }}
                >
                  {item.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <SettingsIcon className="me-3 setting" onClick={clickonsettings} />
        </div>

        <Overlay
          show={show}
          target={target}
          placement="bottom"
          container={ref}
          containerPadding={20}
          rootClose
          onHide={() => setshow(false)}
        >
          <Popover
            style={{ width: "500px" }}
            id="popover-contained"
            className="pop_over"
          >
            <Popover.Header className="bg-primary pop_over_header">
              <Avatar style={{ width: "50px", height: "50px" }} />
              <p className="mt-2 text-white">
                {current_user && current_user.username}
              </p>
            </Popover.Header>
            <Popover.Body>
              <div className="row">
                <div className="d-flex justify-content-between">
                  <button
                    type="button"
                    style={{ width: "180px" }}
                    className="border me-3"
                    onClick={handleclick}
                  >
                    {t("profile")}
                  </button>

                  <button
                    type="button"
                    className="border"
                    style={{ width: "180px" }}
                    onClick={handlesignout}
                  >
                    {t("signout")}
                  </button>
                </div>
              </div>
            </Popover.Body>
          </Popover>
        </Overlay>
      </div>
      {showmodelupdate && (
        <Userupdate
          show={showmodelupdate}
          onHide={() => setshowmodelupdate(false)}
          data={data}
          user={user}
          route={route}
          fun={custom_toast}
          callback={dispatch}
        />
      )}
      <ToastContainer autoClose={1000} hideProgressBar={true} theme="dark" />
    </div>
  );
}

export default Header;
