import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import "./employee.css";
import { IconButton, Avatar } from "@material-ui/core";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import PrintRoundedIcon from "@material-ui/icons/PrintRounded";
import ToolkitProvider, {
  Search,
  CSVExport,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import Red_toast from "../alerts/red_toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer } from "react-toastify";
import custom_toast from "../alerts/custom_toast";
import went_wrong_toast from "../alerts/went_wrong_toast";
import Spinner from "react-bootstrap/Spinner";
import Alert_before_delete from "../../Container/alertContainer";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import PrintIcon from "@material-ui/icons/Print";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Save_button from "../buttons/save_button";
import Select from "../alerts/select";
import TextField from "@mui/material/TextField";
import success_toast from "../alerts/success_toast";

export default function CustomerType(props) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  const user = props.state.setuser.user;
  const { t } = useTranslation();
  const route = props.state.setuser.route;
  const selected_branch = props.state.Setcurrentinfo.selected_branch;
  const current_user = props.state.Setcurrentinfo.current_user;
  const all_customers = props.state.Settablehistory.table_history;
  const dispatch = props.Settable_history;
  const settings = props.state.Setcurrentinfo.settings;
  const { SearchBar } = Search;
  const { ExportCSVButton } = CSVExport;
  const [delete_user, setdelete_user] = useState(false);
  const [url_to_delete, seturl_to_delete] = useState("");
  const [row_id, setrow_id] = useState("");

  const [name, setname] = useState("");
  const [arabicname, setarabicname] = useState("");
  const [contact, setcontact] = useState("");
  const [prdaywage, setprdaywage] = useState("");
  const [address, setaddress] = useState("");
  const [type, settype] = useState("");
  const [workinghours, setworkinghours] = useState("");
  const [hiredate, sethiredate] = useState("");
  const [firedate, setfiredate] = useState("");
  const [nationality, setnationality] = useState("");
  const [basicsalary, setbasicsalary] = useState("");
  const [transportallowance, settransportallowance] = useState("");
  const [foodallowance, setfoodallowance] = useState("");
  const [prallowance, setprallowance] = useState("");
  const [accomallowance, setaccomallowance] = useState("");
  const [extraallowance, setextraallowance] = useState("");
  const [passport, setpassport] = useState("");
  const [passportdate, setpassportdate] = useState("");
  const [municipalno, setmunicipalno] = useState("");
  const [municipaldate, setmunicipaldate] = useState("");
  const [drivinglicense, setdrivinglicense] = useState("");
  const [drivinglicensedate, setdrivinglicensedate] = useState("");
  const [workpermit, setworkpermit] = useState("");
  const [workpermitdate, setworkpermitdate] = useState("");
  const [allcategory, setallcategory] = useState([]);
  const [allcountries, setallcountries] = useState([]);
  const [category, setcategory] = useState("");
  const [isloading, setisloading] = useState(false);
  const [salary, setsalary] = useState("");
  const [id, setid] = useState("");
  const [check_update, setcheck_update] = useState(false);

  useEffect(() => {
    setisloading(true);

    const fetchWorkouts = async () => {
      dispatch({ type: "Set_table_history", data: [] });

      var url = `${route}/api/employee/`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        setisloading(false);
        dispatch({ type: "Set_table_history", data: json });
      }
      if (!response.ok) {
        went_wrong_toast();
        setisloading(false);
      }
    };

    if (user) {
      fetchWorkouts();
    }
  }, []);

  useEffect(() => {
    dispatch({ type: "Set_menuitem", data: "employee" });
    const fetchcategory = async () => {
      var url = `${route}/api/employee-categories/`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        const optimize = json.map((item) => {
          return { value: item.id, label: item.name };
        });

        setallcategory(optimize);
      }
      if (!response.ok) {
        went_wrong_toast();
      }
    };

    const fetchcountries = async () => {
      var url = `https://restcountries.com/v3.1/all`;

      const response = await fetch(`${url}`);
      const json = await response.json();

      if (response.ok) {
        const optimize = json.map((item) => {
          return { value: item.name.common, label: item.name.common };
        });

        setallcountries(optimize);
      }
      if (!response.ok) {
        went_wrong_toast();
      }
    };

    if (user) {
      fetchcategory();
      fetchcountries();
    }
  }, []);

  const handleconfirm = (row) => {
    dispatch({ type: "Delete_table_history", data: { id: row } });
    custom_toast("Delete");
  };

  const Action = (cell, row, rowIndex, formatExtraData) => {
    return (
      <span className="action d-flex">
        <IconButton
          className="border border-primary rounded me-2"
          onClick={() => {
            localStorage.setItem("data", JSON.stringify(row));

            window.open("/employeeprint", "_blank");
          }}
        >
          <PrintRoundedIcon className="m-1" color="primary" fontSize="medium" />
        </IconButton>
        <IconButton
          className="border border-danger rounded me-2"
          onClick={() => {
            setrow_id(row.id);
            seturl_to_delete(`${route}/api/employee/${row.id}/`);
            setdelete_user(true);
          }}
        >
          <DeleteRoundedIcon className="m-1" color="error" fontSize="small" />
        </IconButton>

        <IconButton
          style={{ border: "1px solid #003049", borderRadius: "5px" }}
          onClick={() => {
            setid(row.id);
            setcheck_update(true);
            setname(row.name);
            setworkinghours(row.working_hours);
            setcontact(row.contact);
            setcategory({ value: row.category, label: row.category_name });
            settype({ value: row.type, label: row.type });
            setnationality({ value: row.country, label: row.country });
            setaddress(row.address);
            sethiredate(row.hiring_date);
            setfiredate(row.expelled_date);
            settransportallowance(row.transport_allowance);
            setfoodallowance(row.food_allowance);
            setprallowance(row.pr_allowance);
            setextraallowance(row.extra_allowance);
            setsalary(row.salary);
            setaccomallowance(row.accomodation_allowance);
            setpassport(row.passport_number);
            setpassportdate(row.passport_expiry_date);
            setmunicipaldate(row.identity_expiry_date);
            setmunicipalno(row.identity_number);
            setdrivinglicense(row.driving_license_number);
            setdrivinglicensedate(row.driving_license_date);
            setworkpermit(row.work_permit_number);
            setworkpermitdate(row.work_permit_date);
          }}
        >
          <EditOutlinedIcon
            className="m-1"
            style={{ color: "#003049" }}
            fontSize="small"
          />
        </IconButton>
      </span>
    );
  };

  const headerstyle = (column, colIndex, { sortElement }) => {
    return (
      <div
        className="d-flex justify-content-between align-items-center"
        style={{ minHeight: "2.5rem" }}
      >
        {column.text}
        {sortElement}
      </div>
    );
  };

  const columns = [
    { dataField: "id", text: "Id", hidden: true, headerFormatter: headerstyle },
    {
      dataField: "name",
      text: t("name"),
      sort: true,
      headerFormatter: headerstyle,
    },

    {
      dataField: "category_name",
      text: t("Category"),
      sort: true,
      headerFormatter: headerstyle,
    },

    {
      dataField: "wage_per_day",
      text: t("Pr Day Wage"),
      sort: true,
      headerFormatter: headerstyle,
    },

    {
      dataField: "type",
      text: t("type"),
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "contact",
      text: t("Cell"),
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "basic_salary",
      text: t("Salary"),
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "hiring_date",
      text: t("Hire Date"),
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "country",
      text: t("Nationality"),
      sort: true,
      headerFormatter: headerstyle,
    },

    {
      dataField: "action",
      text: t("action"),
      formatter: Action,
      headerFormatter: headerstyle,
    },
  ];

  const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total ms-2">
      Showing {from} to {to} of {size} Results
    </span>
  );

  const options = {
    paginationSize: 4,
    pageStartIndex: 1,
    firstPageText: "First",
    showTotal: true,
    paginationTotalRenderer: customTotal,
    disablePageTitle: true,
    sizePerPageList: [
      {
        text: "10",
        value: 10,
      },
      {
        text: "20",
        value: 20,
      },
      {
        text: "All",
        value: all_customers.length,
      },
    ], // A numeric array is also available. the purpose of above example is custom the text
  };

  const makepdf = () => {
    const body = all_customers.map((item, index) => {
      return [index + 1, item.name];
    });
    body.splice(0, 0, ["#", "Name"]);

    const documentDefinition = {
      content: [
        { text: "Customers Type", style: "header" },

        {
          canvas: [
            { type: "line", x1: 0, y1: 10, x2: 510, y2: 10, lineWidth: 1 },
          ],
        },

        {
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: [50, "*"],
            body: body,
          },
          style: "tableStyle",
        },
      ],
      defaultStyle: {
        font: "ArabicFont",
      },
      styles: {
        tableStyle: {
          width: "100%", // Set the width of the table to 100%
          marginTop: 20,
          font: "ArabicFont",
        },

        header: {
          fontSize: 22,
          bold: true,
          alignment: "center",
        },
        body: {
          fontSize: 12,
          bold: true,
          alignment: "center",
          marginBottom: 10,
        },
      },
    };
    return documentDefinition;
  };

  const download = () => {
    const documentDefinition = makepdf();
    pdfMake.createPdf(documentDefinition).download("Customers Type.pdf");
  };

  const print = () => {
    const documentDefinition = makepdf();
    pdfMake.createPdf(documentDefinition).print();
  };

  const rowstyle = { height: "10px", paddingLeft: "30px" };
  const selectStyles = {
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };

  const handleSubmit = async (e) => {
    if (!isloading) {
      setisloading(true);
      const formData = new FormData();

      formData.append("name", name);
      formData.append("contact", contact);
      formData.append("country", nationality?.value);
      formData.append("address", address);
      formData.append("working_hours", workinghours);

      formData.append("type", type.value);
      formData.append("salary", salary);
      formData.append("transport_allowance", transportallowance);
      formData.append("food_allowance", foodallowance);
      formData.append("accomodation_allowance", accomallowance);
      formData.append("pr_allowance", prallowance);
      formData.append("extra_allowance", extraallowance);
      formData.append("hiring_date", hiredate);
      formData.append("expelled_date", firedate);
      formData.append("passport_number", passport);
      formData.append("passport_expiry_date", passportdate);
      formData.append("identity_number", municipalno);
      formData.append("identity_expiry_date", municipaldate);
      formData.append("driving_license_number", drivinglicense);
      formData.append("driving_license_date", drivinglicensedate);
      formData.append("work_permit_number", workpermit);
      formData.append("work_permit_date", workpermitdate);
      formData.append("account_head", selected_branch.id);
      formData.append("user", current_user.id);
      formData.append("category", category.value);

      const response = await fetch(`${route}/api/employee/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.access}`,
        },
        body: formData,
      });
      const json = await response.json();

      if (!response.ok) {
        setisloading(false);
        var error = Object.keys(json);
        if (error.length > 0) {
          Red_toast(`${json[error[0]]}`);
        }
      }

      if (response.ok) {
        dispatch({ type: "Create_table_history", data: json });
        setisloading(false);
        success_toast();
        setworkinghours("");
        setname("");
        setarabicname("");
        setcontact("");

        setcategory("");
        settype("");
        setnationality("");
        setaddress("");
        sethiredate("");
        setfiredate("");
        settransportallowance("");
        setfoodallowance("");
        setprallowance("");
        setextraallowance("");
        setsalary("");
        setaccomallowance("");
        setpassport("");
        setpassportdate("");
        setmunicipaldate("");
        setmunicipalno("");
        setdrivinglicense("");
        setdrivinglicensedate("");
        setworkpermit("");
        setworkpermitdate("");
        if (e) {
          localStorage.setItem("data", JSON.stringify(json));
          window.open("/employeeprint", "_blank");
        }
      }
    }
  };

  const handleSubmit_update = async (e) => {
    if (!isloading) {
      setisloading(true);
      const formData = new FormData();

      formData.append("name", name);
      formData.append("contact", contact);
      formData.append("country", nationality?.value);
      formData.append("address", address);
      formData.append("working_hours", workinghours);

      formData.append("type", type.value);
      formData.append("salary", salary);
      formData.append("transport_allowance", transportallowance);
      formData.append("food_allowance", foodallowance);
      formData.append("accomodation_allowance", accomallowance);
      formData.append("pr_allowance", prallowance);
      formData.append("extra_allowance", extraallowance);
      formData.append("hiring_date", hiredate ? hiredate : "");
      formData.append("expelled_date", firedate ? firedate : "");
      formData.append("passport_number", passport);
      formData.append("passport_expiry_date", passportdate ? passportdate : "");
      formData.append("identity_number", municipalno);
      formData.append(
        "identity_expiry_date",
        municipaldate ? municipaldate : ""
      );
      formData.append("driving_license_number", drivinglicense);
      formData.append(
        "driving_license_date",
        drivinglicensedate ? drivinglicensedate : ""
      );
      formData.append("work_permit_number", workpermit);
      formData.append("work_permit_date", workpermitdate ? workpermitdate : "");

      formData.append("category", category.value);

      const response = await fetch(`${route}/api/employee/${id}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${user.access}`,
        },
        body: formData,
      });
      const json = await response.json();

      if (!response.ok) {
        setisloading(false);
        var error = Object.keys(json);
        if (error.length > 0) {
          Red_toast(`${json[error[0]]}`);
        }
      }

      if (response.ok) {
        dispatch({ type: "Update_table_history", data: json });
        setisloading(false);
        success_toast();
        setworkinghours("");
        setname("");
        setarabicname("");
        setcontact("");

        setcategory("");
        settype("");
        setnationality("");
        setaddress("");
        sethiredate("");
        setfiredate("");
        settransportallowance("");
        setfoodallowance("");
        setprallowance("");
        setextraallowance("");
        setsalary("");
        setaccomallowance("");
        setpassport("");
        setpassportdate("");
        setmunicipaldate("");
        setmunicipalno("");
        setdrivinglicense("");
        setdrivinglicensedate("");
        setworkpermit("");
        setworkpermitdate("");

        setid("");
        setcheck_update(false);
        if (e) {
          localStorage.setItem("data", JSON.stringify(json));
          window.open("/employeeprint", "_blank");
        }
      }
    }
  };

  return (
    <div className="p-3">
      <div className="card">
        <form
          onSubmit={
            check_update
              ? (e) => {
                  e.preventDefault();
                  if (document.activeElement.name === "printbtn") {
                    handleSubmit_update(true);
                  } else {
                    handleSubmit_update(false);
                  }
                }
              : (e) => {
                  e.preventDefault();
                  if (document.activeElement.name === "printbtn") {
                    handleSubmit(true);
                  } else {
                    handleSubmit(false);
                  }
                }
          }
        >
          <div className="card-header d-flex justify-content-between bg-white">
            <h3 className="mt-2 me-2">Add Employee</h3>
            <div className="mt-2 me-2 d-flex flex-row-reverse">
              <Button name="savebtn" variant="outline-primary" type="submit">
                {isloading && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                )}
                <FontAwesomeIcon icon={faRotate} className="me-1" />{" "}
                {check_update ? "Update" : "Save"}
              </Button>

              <Button
                name="printbtn"
                type="submit"
                variant="outline-success me-2"
              >
                {isloading && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                )}
                <PrintRoundedIcon className="me-1" /> Print
              </Button>
            </div>
          </div>

          <div className="card-body pt-0">
            <div className="mt-4">
              <div className="row">
                <div className="col-6 col-md-3">
                  <TextField
                    className="form-control   mb-3"
                    label={"Name"}
                    value={name}
                    onChange={(e) => {
                      setname(e.target.value);
                    }}
                    size="small"
                    required
                    autoFocus
                  />
                </div>
                <div className="col-6 col-md-3">
                  <TextField
                    className="form-control  mb-3"
                    label={"اسم"}
                    value={arabicname}
                    onChange={(e) => {
                      setarabicname(e.target.value);
                    }}
                    size="small"
                  />
                </div>

                <div className="col-6  col-md-3">
                  <TextField
                    className="form-control  mb-3"
                    label={"Cell"}
                    value={contact}
                    onChange={(e) => {
                      setcontact(e.target.value);
                    }}
                    size="small"
                  />
                </div>
                <div className=" col-6  col-md-3">
                  <TextField
                    multiline
                    className="form-control  mb-3"
                    label={t("address")}
                    value={address}
                    onChange={(e) => {
                      setaddress(e.target.value);
                    }}
                    size="small"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-6  col-md-3 mb-3">
                  <Select
                    options={allcategory}
                    placeholder={"Category"}
                    value={category}
                    funct={(e) => setcategory(e)}
                    required={true}
                  ></Select>
                </div>
                <div className="col-6  col-md-3 mb-3">
                  <Select
                    options={[
                      { value: "Daily Wage", label: "Daily Wage" },
                      { value: "Monthly Wage", label: "Monthly Wage" },
                    ]}
                    placeholder={"Wage Type"}
                    value={type}
                    funct={(e) => settype(e)}
                    required={true}
                  ></Select>
                </div>

                <div className="col-6  col-md-3">
                  <TextField
                    className="form-control   mb-3"
                    label={"Working Hours"}
                    value={workinghours}
                    onChange={(e) => {
                      setworkinghours(e.target.value);
                    }}
                    size="small"
                  />
                </div>
                <div className="col-6  col-md-3">
                  <TextField
                    className="form-control   mb-3"
                    label={"Salary"}
                    value={salary}
                    onChange={(e) => {
                      setsalary(e.target.value);
                    }}
                    size="small"
                  />
                </div>
              </div>

              {type?.value === "Monthly Wage" && (
                <div className="row">
                  <div className="col-6 col-md-3">
                    <TextField
                      type="number"
                      className="form-control  mb-3"
                      label={t("Transport Allowance")}
                      value={transportallowance}
                      onChange={(e) => {
                        settransportallowance(e.target.value);
                      }}
                      size="small"
                    />
                  </div>

                  <div className="col-6 col-md-3">
                    <TextField
                      type="number"
                      className="form-control  mb-3"
                      label={t("Food Allowance")}
                      value={foodallowance}
                      onChange={(e) => {
                        setfoodallowance(e.target.value);
                      }}
                      size="small"
                    />
                  </div>

                  <div className="col-6 col-md-3">
                    <TextField
                      type="number"
                      className="form-control  mb-3"
                      label={t("Accomodation Allowance")}
                      value={accomallowance}
                      onChange={(e) => {
                        setaccomallowance(e.target.value);
                      }}
                      size="small"
                    />
                  </div>

                  <div className="col-6 col-md-3">
                    <TextField
                      type="Number"
                      className="form-control  mb-3"
                      label={t("PR Allowance")}
                      value={prallowance}
                      onChange={(e) => {
                        setprallowance(e.target.value);
                      }}
                      size="small"
                    />
                  </div>
                </div>
              )}

              <div className="row">
                {type?.value === "Monthly Wage" && (
                  <div className="col-6 col-md-3">
                    <TextField
                      type="number"
                      className="form-control  mb-3"
                      label={t("Extra Allowance")}
                      value={extraallowance}
                      onChange={(e) => {
                        setextraallowance(e.target.value);
                      }}
                      size="small"
                    />
                  </div>
                )}
                {type?.value === "Monthly Wage" && (
                  <div className="col-6 col-md-3">
                    <TextField
                      type="number"
                      className="form-control  mb-3"
                      label={t("Total")}
                      value={
                        Number(extraallowance) +
                        Number(transportallowance) +
                        Number(foodallowance) +
                        Number(accomallowance) +
                        Number(prallowance) +
                        Number(salary)
                      }
                      size="small"
                    />
                  </div>
                )}

                <div className="col-6 col-md-3">
                  <Select
                    options={allcountries}
                    placeholder={"Country"}
                    value={nationality}
                    funct={(e) => setnationality(e)}
                    required={true}
                  ></Select>
                </div>

                <div className="d-flex col-6 col-md-3">
                  <div className=" col-6">
                    <TextField
                      className="form-control   mb-3"
                      label={t("Passport No")}
                      value={passport}
                      onChange={(e) => {
                        setpassport(e.target.value);
                      }}
                      size="small"
                    />
                  </div>
                  <div className="ps-3 col-6 ">
                    <TextField
                      type="Date"
                      className="form-control  mb-3"
                      label={t("Expiry")}
                      InputLabelProps={{ shrink: true }}
                      value={passportdate}
                      onChange={(e) => {
                        setpassportdate(e.target.value);
                      }}
                      size="small"
                    />
                  </div>
                </div>

                {type?.value !== "Monthly Wage" && (
                  <div className="d-flex col-6 col-md-3 ">
                    <div className="col-6">
                      <TextField
                        className="form-control  mb-3"
                        label={t("Muncipilaty Card")}
                        value={municipalno}
                        onChange={(e) => {
                          setmunicipalno(e.target.value);
                        }}
                        size="small"
                      />
                    </div>
                    <div className="ps-3 col-6 ">
                      <TextField
                        type="Date"
                        className="form-control  mb-3"
                        label={t("Expiry")}
                        InputLabelProps={{ shrink: true }}
                        value={municipaldate}
                        onChange={(e) => {
                          setmunicipaldate(e.target.value);
                        }}
                        size="small"
                      />
                    </div>
                  </div>
                )}

                {type?.value !== "Monthly Wage" && (
                  <div className="d-flex col-6 col-md-3 ">
                    <div className=" col-6">
                      <TextField
                        className="form-control  mb-3"
                        label={t("Driving License")}
                        value={drivinglicense}
                        onChange={(e) => {
                          setdrivinglicense(e.target.value);
                        }}
                        size="small"
                      />
                    </div>
                    <div className="ps-3 col-6">
                      <TextField
                        type="Date"
                        className="form-control  mb-3"
                        label={t("Expiry")}
                        InputLabelProps={{ shrink: true }}
                        value={drivinglicensedate}
                        onChange={(e) => {
                          setdrivinglicensedate(e.target.value);
                        }}
                        size="small"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="row">
                {type?.value === "Monthly Wage" && (
                  <div className="d-flex col-6 col-md-3 ">
                    <div className="col-6">
                      <TextField
                        className="form-control  mb-3"
                        label={t("Muncipilaty Card")}
                        value={municipalno}
                        onChange={(e) => {
                          setmunicipalno(e.target.value);
                        }}
                        size="small"
                      />
                    </div>
                    <div className="ps-3 col-6 ">
                      <TextField
                        type="Date"
                        className="form-control  mb-3"
                        label={t("Expiry")}
                        InputLabelProps={{ shrink: true }}
                        value={municipaldate}
                        onChange={(e) => {
                          setmunicipaldate(e.target.value);
                        }}
                        size="small"
                      />
                    </div>
                  </div>
                )}
                {type?.value === "Monthly Wage" && (
                  <div className="d-flex col-6 col-md-3 ">
                    <div className=" col-6">
                      <TextField
                        className="form-control  mb-3"
                        label={t("Driving License")}
                        value={drivinglicense}
                        onChange={(e) => {
                          setdrivinglicense(e.target.value);
                        }}
                        size="small"
                      />
                    </div>
                    <div className="ps-3 col-6">
                      <TextField
                        type="Date"
                        className="form-control  mb-3"
                        label={t("Expiry")}
                        InputLabelProps={{ shrink: true }}
                        value={drivinglicensedate}
                        onChange={(e) => {
                          setdrivinglicensedate(e.target.value);
                        }}
                        size="small"
                      />
                    </div>
                  </div>
                )}
                <div className="d-flex col-6 col-md-3">
                  <div className=" col--6">
                    <TextField
                      className="form-control   mb-3"
                      label={t("ID No.")}
                      value={workpermit}
                      onChange={(e) => {
                        setworkpermit(e.target.value);
                      }}
                      size="small"
                    />
                  </div>
                  <div className="ps-3 col-6 ">
                    <TextField
                      type="Date"
                      className="form-control  mb-3"
                      label={t("Expiry")}
                      InputLabelProps={{ shrink: true }}
                      value={workpermitdate}
                      onChange={(e) => {
                        setworkpermitdate(e.target.value);
                      }}
                      size="small"
                    />
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <TextField
                    type="Date"
                    className="form-control  mb-3"
                    label={t("Hiring Date")}
                    InputLabelProps={{ shrink: true }}
                    value={hiredate}
                    onChange={(e) => {
                      sethiredate(e.target.value);
                    }}
                    size="small"
                  />
                </div>

                {type?.value !== "Monthly Wage" && (
                  <div className="col-6 col-md-3">
                    <TextField
                      type="Date"
                      className="form-control  mb-3"
                      label={t("Firing Date")}
                      InputLabelProps={{ shrink: true }}
                      value={firedate}
                      onChange={(e) => {
                        setfiredate(e.target.value);
                      }}
                      size="small"
                    />
                  </div>
                )}
              </div>

              {type?.value === "Monthly Wage" && (
                <div className="row">
                  <div className="col-6 col-md-3">
                    <TextField
                      type="Date"
                      className="form-control  mb-3"
                      label={t("Firing Date")}
                      InputLabelProps={{ shrink: true }}
                      value={firedate}
                      onChange={(e) => {
                        setfiredate(e.target.value);
                      }}
                      size="small"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>

      <div className="card mt-3">
        <div className="card-body pt-0">
          <ToolkitProvider
            keyField="id"
            data={all_customers}
            columns={columns}
            search
            exportCSV
          >
            {(props) => (
              <div>
                <div className="d-sm-flex justify-content-between align-items-center mt-3">
                  {/* <div>
                    <ExportCSVButton
                      {...props.csvProps}
                      className="csvbutton  border bg-secondary text-light me-2 mb-2"
                    >
                      Export CSV
                    </ExportCSVButton>
                    <Button
                      type="button"
                      className="p-1 ps-3 pe-3 me-2 mb-2"
                      variant="outline-primary"
                      onClick={download}
                    >
                      <PictureAsPdfIcon /> PDF
                    </Button>
                    <Button
                      type="button"
                      className="p-1 ps-3 pe-3 mb-2"
                      variant="outline-success"
                      onClick={print}
                    >
                      <PrintIcon /> Print
                    </Button>
                  </div> */}
                  <SearchBar {...props.searchProps} />
                </div>
                {isloading && (
                  <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                  </div>
                )}

                <hr />
                <div style={{ zoom: ".9" }}>
                  <BootstrapTable
                    {...props.baseProps}
                    pagination={paginationFactory(options)}
                    rowStyle={rowstyle}
                    striped
                    bootstrap4
                    condensed
                    wrapperClasses="table-responsive"
                  />
                </div>
              </div>
            )}
          </ToolkitProvider>
        </div>
      </div>

      {delete_user && (
        <Alert_before_delete
          show={delete_user}
          onHide={() => setdelete_user(false)}
          url={url_to_delete}
          dis_fun={handleconfirm}
          row_id={row_id}
        />
      )}
      <ToastContainer autoClose={1000} hideProgressBar={true} theme="dark" />
    </div>
  );
}
