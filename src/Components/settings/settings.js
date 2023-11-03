import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import "./settings.css";
import Select from "../alerts/select";
import custom_toast from "../alerts/custom_toast";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Update_button from "../buttons/update_button";
import { useTranslation } from "react-i18next";
import Switch from "@mui/material/Switch";
import Red_toast from "../alerts/red_toast";

export default function Settings(props) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  const user = props.state.setuser.user;
  const { t } = useTranslation();
  const route = props.state.setuser.route;
  const settings = props.state.Setcurrentinfo.settings;

  const dispatch = props.Setinfo_ofuser;
  const [account_base, setaccount_base] = useState(false);
  const [invoice_version, setinvoice_version] = useState();
  const [all_invoice_version, setall_invoice_version] = useState([
    { value: "Version 01", label: "Version 01" },
    { value: "Version 02", label: "Version 02" },
    { value: "Version 03", label: "Version 03" },
  ]);
  const [offer, setoffer] = useState(false);
  const [scheme, setscheme] = useState(false);
  const [percentage, setpercentage] = useState(false);
  const [item_wise_tax, setitem_wise_tax] = useState(false);
  const [negative_setting, setnegative_setting] = useState(false);
  const [isloading, setisloading] = useState(false);
  const [id_user, setid_user] = useState("");
  const [id_account, setid_accoount] = useState("");

  useEffect(() => {
    setaccount_base(settings?.user_base?.account_base);
    setid_user(settings?.user_base?.id);

    setnegative_setting(settings?.account_base?.negative_stock);
    setoffer(settings?.account_base?.offer);
    setscheme(settings?.account_base?.scheme);
    setpercentage(settings?.account_base?.percentage);
    setitem_wise_tax(settings?.account_base?.item_wise_tax);
    setinvoice_version({
      value: settings?.account_base?.invoice_version,
      label: settings?.account_base?.invoice_version,
    });
    setid_accoount(settings?.account_base?.id);
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setisloading(true);
    const formData1 = new FormData();
    formData1.append("account_base", account_base);

    const response = await fetch(`${route}/api/settings/${id_user}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${user.access}`,
      },
      body: formData1,
    });
    const json = await response.json();

    if (!response.ok) {
      setisloading(false);
      Red_toast("User Settings does not Updated!");
      handleSubmit_account();
    }
    if (response.ok) {
      setisloading(false);
      custom_toast("User Settings Save");
      handleSubmit_account(json);
    }
  };

  const handleSubmit_account = async (json) => {
    const formData2 = new FormData();
    formData2.append("negative_stock", negative_setting);
    formData2.append("offer", offer);
    formData2.append("scheme", scheme);
    formData2.append("percentage", percentage);
    formData2.append("item_wise_tax", item_wise_tax);
    formData2.append("invoice_version", invoice_version.value);
    const response2 = await fetch(
      `${route}/api/account-settings/${id_account}/`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${user.access}`,
        },
        body: formData2,
      }
    );
    const json2 = await response2.json();

    if (!response2.ok) {
      setisloading(false);
      Red_toast("Account Settings does not Updated!");
    }
    if (response2.ok) {
      setisloading(false);
      custom_toast("Account Settings Save");
      dispatch({
        type: "Set_settings",
        data: { user_base: json, account_base: json2 },
      });
    }
  };

  return (
    <div className="p-3">
      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-header bg-white d-flex justify-content-end">
            <Update_button isloading={isloading} />
          </div>
          <div className="card-body">
            <h4 className="mb-3">User Base Settings</h4>
            <div style={{ fontSize: "20px", opacity: ".8" }}>
              <label className="col-2">Account Base</label>
              <Switch
                className="ms-3"
                checked={account_base}
                onChange={() => setaccount_base(!account_base)}
                inputProps={{ "aria-label": "controlled" }}
              />
            </div>
            <hr />
            <h4 className="mt-4 mb-3">Account Base Settings</h4>
            <div style={{ fontSize: "20px", opacity: ".8" }}>
              <label className="col-2 ">Negative Stock</label>
              <Switch
                className="ms-3"
                checked={negative_setting}
                onChange={() => setnegative_setting(!negative_setting)}
                inputProps={{ "aria-label": "controlled" }}
              />
            </div>
            <div style={{ fontSize: "20px", opacity: ".8" }}>
              <label className="col-2 ">Offer</label>
              <Switch
                className="ms-3"
                checked={offer}
                onChange={() => setoffer(!offer)}
                inputProps={{ "aria-label": "controlled" }}
              />
            </div>
            <div style={{ fontSize: "20px", opacity: ".8" }}>
              <label className="col-2 ">Scheme</label>
              <Switch
                className="ms-3"
                checked={scheme}
                onChange={() => setscheme(!scheme)}
                inputProps={{ "aria-label": "controlled" }}
              />
            </div>
            <div style={{ fontSize: "20px", opacity: ".8" }}>
              <label className="col-2 ">Percentage</label>
              <Switch
                className="ms-3"
                checked={percentage}
                onChange={() => setpercentage(!percentage)}
                inputProps={{ "aria-label": "controlled" }}
              />
            </div>
            <div style={{ fontSize: "20px", opacity: ".8" }}>
              <label className="col-2 ">Item Wise Tax</label>
              <Switch
                className="ms-3"
                checked={item_wise_tax}
                onChange={() => setitem_wise_tax(!item_wise_tax)}
                inputProps={{ "aria-label": "controlled" }}
              />
            </div>
            <div
              className="d-flex mt-2"
              style={{ fontSize: "20px", opacity: ".8" }}
            >
              <label className="col-2 ">Invoice Version</label>
              <div className="col-2">
                <Select
                  options={all_invoice_version}
                  placeholder={""}
                  value={invoice_version}
                  funct={(e) => {
                    setinvoice_version(e);
                  }}
                ></Select>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
