import React, { useState, useEffect, useRef } from "react";
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
import { ToastContainer } from "react-toastify";
import custom_toast from "../alerts/custom_toast";
import Spinner from "react-bootstrap/Spinner";
import Alert_before_delete from "../../Container/alertContainer";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Badge from "@mui/material/Badge";
import { useTranslation } from "react-i18next";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Select from "../alerts/select";
import TextField from "@mui/material/TextField";
import success_toast from "../alerts/success_toast";
import { MuiThemeProvider, createTheme } from "@material-ui/core/styles";
import { differenceInDays, intervalToDuration } from "date-fns";

export default function CustomerType(props) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  const user = props.state.setuser.user;
  const { t } = useTranslation();
  const route = props.state.setuser.route;
  const selected_branch = props.state.Setcurrentinfo.selected_branch;
  const current_user = props.state.Setcurrentinfo.current_user;
  const all_customers = props.state.Settablehistory.table_history;
  const dispatch = props.Settable_history;
  const selected_year = props.state.Setcurrentinfo.selected_year;
  const { SearchBar } = Search;

  const [delete_user, setdelete_user] = useState(false);
  const [url_to_delete, seturl_to_delete] = useState("");
  const [row_id, setrow_id] = useState("");
  const inputFileidcard = useRef(null);
  const inputFilepassport = useRef(null);
  const inputFileliecence = useRef(null);
  const inputFilemunicipality = useRef(null);

  const [all_files, setall_files] = useState([]);
  const [name, setname] = useState("");
  const [arabicname, setarabicname] = useState("");
  const [contact, setcontact] = useState("");

  const [address, setaddress] = useState("");
  const [type, settype] = useState("");
  const [workinghours, setworkinghours] = useState("");
  const [hiredate, sethiredate] = useState("");
  const [firedate, setfiredate] = useState("");
  const [nationality, setnationality] = useState("");

  const [transportallowance, settransportallowance] = useState("");
  const [foodallowance, setfoodallowance] = useState("");
  const [prallowance, setprallowance] = useState("");
  const [accomallowance, setaccomallowance] = useState("");
  const [extraallowance, setextraallowance] = useState("");

  const [transportallowancepercenage, settransportallowancepercenage] =
    useState("");
  const [foodallowancepercenage, setfoodallowancepercenage] = useState("");
  const [prallowancepercenage, setprallowancepercenage] = useState("");
  const [accomallowancepercenage, setaccomallowancepercenage] = useState("");
  const [extraallowancepercenage, setextraallowancepercenage] = useState("");

  const [passport, setpassport] = useState("");
  const [passportdate, setpassportdate] = useState("");
  const [passportcheck, setpassportcheck] = useState(false);

  const [municipalno, setmunicipalno] = useState("");
  const [municipaldate, setmunicipaldate] = useState("");
  const [municipalnocheck, setmunicipalnocheck] = useState(false);

  const [drivinglicense, setdrivinglicense] = useState("");
  const [drivinglicensedate, setdrivinglicensedate] = useState("");
  const [drivinglicensecheck, setdrivinglicensecheck] = useState(false);

  const [workpermit, setworkpermit] = useState("");
  const [workpermitdate, setworkpermitdate] = useState("");
  const [workpermitcheck, setworkpermitcheck] = useState(false);

  const [allcategory, setallcategory] = useState([]);
  const [allcountries, setallcountries] = useState([]);
  const [category, setcategory] = useState("");
  const [isloading, setisloading] = useState(false);
  const [salary, setsalary] = useState("");
  const [absentdays, setabsentdays] = useState("");
  const [id, setid] = useState("");
  const [check_update, setcheck_update] = useState(false);
  const [remainingdays, setremainingdays] = useState(0);
  const theme = createTheme({
    direction: "rtl", // Both here and <body dir="rtl">
  });

  useEffect(() => {
    setisloading(true);

    const fetchWorkouts = async () => {
      dispatch({ type: "Set_table_history", data: [] });

      var url = `${route}/api/employee/?account_head=${selected_branch.id}`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        setisloading(false);
        dispatch({ type: "Set_table_history", data: json });
      }
      if (!response.ok) {
        var error = Object.keys(json);
        if (error.length > 0) {
          Red_toast(`${error[0]}:${json[error[0]]}`);
        }
        setisloading(false);
      }
    };

    if (user) {
      fetchWorkouts();
    }
  }, [selected_branch]);

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
        var error = Object.keys(json);
        if (error.length > 0) {
          Red_toast(`${error[0]}:${json[error[0]]}`);
        }
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
        var error = Object.keys(json);
        if (error.length > 0) {
          Red_toast(`${error[0]}:${json[error[0]]}`);
        }
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
          className="border border-primary rounded me-2 tooltipclass"
          onClick={() => {
            localStorage.setItem("data", JSON.stringify(row));

            window.open("/employeeprint", "_blank");
          }}
        >
          <PrintRoundedIcon className="m-1" color="primary" fontSize="medium" />
          <span className="tooltip-textclass">Print</span>
        </IconButton>
        {current_user?.permissions?.includes("delete_employee") && (
          <IconButton
            className="border border-danger rounded me-2 tooltipclass"
            onClick={() => {
              setrow_id(row.id);
              seturl_to_delete(`${route}/api/employee/${row.id}/`);
              setdelete_user(true);
            }}
          >
            <DeleteRoundedIcon className="m-1" color="error" fontSize="small" />
            <span className="tooltip-textclass">Delete</span>
          </IconButton>
        )}

        {current_user?.permissions?.includes("change_employee") && (
          <IconButton
            style={{ border: "1px solid #003049", borderRadius: "5px" }}
            className="tooltipclass"
            onClick={() => {
              setid(row.id);
              setcheck_update(true);
              setname(row.name);
              setarabicname(row.arabic_name);
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

              settransportallowancepercenage(
                row.transport_allowance_percentage
              );
              setfoodallowancepercenage(row.food_allowance_percentage);
              setprallowancepercenage(row.pr_allowance_percentage);
              setextraallowancepercenage(row.extra_allowance_percentage);
              setaccomallowancepercenage(row.accomodation_allowance_percentage);
              setabsentdays(row.absent_days);

              setpassport(row.passport_number);
              setpassportdate(row.passport_expiry_date);
              setmunicipaldate(row.identity_expiry_date);
              setmunicipalno(row.identity_number);
              setdrivinglicense(row.driving_license_number);
              setdrivinglicensedate(row.driving_license_date);
              setworkpermit(row.work_permit_number);
              setworkpermitdate(row.work_permit_date);

              setall_files(
                row.documents.map((item) => {
                  switch (item.document_name) {
                    case "Id Card":
                      setworkpermit(item.document_number);
                      setworkpermitcheck(true);
                      setworkpermitdate(item.expiry_date);
                      return {
                        id: item.id,
                        picture: { name: item.file.split("/").pop() },
                        type: item.type,
                        url: item.file,
                        file: "",
                        document_name: "Id Card",
                      };
                    case "passport":
                      setpassport(item.document_number);
                      setpassportcheck(true);
                      setpassportdate(item.expiry_date);
                      return {
                        id: item.id,
                        picture: { name: item.file.split("/").pop() },
                        type: item.type,
                        url: item.file,
                        file: "",
                        document_name: "passport",
                      };
                    case "municipality":
                      setmunicipalno(item.document_number);
                      setmunicipalnocheck(true);
                      setmunicipaldate(item.expiry_date);
                      return {
                        id: item.id,
                        picture: { name: item.file.split("/").pop() },
                        type: item.type,
                        url: item.file,
                        file: "",
                        document_name: "municipality",
                      };
                    case "liecence":
                      setdrivinglicense(item.document_number);
                      setdrivinglicensecheck(true);
                      setdrivinglicensedate(item.expiry_date);
                      return {
                        id: item.id,
                        picture: { name: item.file.split("/").pop() },
                        type: item.type,
                        url: item.file,
                        file: "",
                        document_name: "liecence",
                      };
                  }
                })
              );
            }}
          >
            <EditOutlinedIcon
              className="m-1"
              style={{ color: "#003049" }}
              fontSize="small"
            />
            <span className="tooltip-textclass">Edit</span>
          </IconButton>
        )}
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
    { dataField: "id", text: "Id", headerFormatter: headerstyle },
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
      dataField: "contact",
      text: "Contact No.",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "address",
      text: "Address",
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
      dataField: "salary",
      text: "Salary",
      sort: true,
      headerFormatter: headerstyle,
    },

    {
      dataField: "hiring_date",
      text: t("Join Date"),
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

  const handleSubmit = async (e) => {
    if (!isloading && current_user?.permissions?.includes("add_employee")) {
      setisloading(true);
      const formData = new FormData();

      formData.append("name", name);
      formData.append("arabic_name", arabicname);
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

      formData.append(
        "transport_allowance_percentage",
        transportallowancepercenage
      );
      formData.append("food_allowance_percentage", foodallowancepercenage);
      formData.append(
        "accomodation_allowance_percentage",
        accomallowancepercenage
      );
      formData.append("pr_allowance_percentage", prallowancepercenage);
      formData.append("extra_allowance_percentage", extraallowancepercenage);

      formData.append("hiring_date", hiredate);
      formData.append("expelled_date", firedate);
      formData.append("absent_days", absentdays);

      formData.append("account_head", selected_branch.id);
      formData.append("user", current_user.id);
      formData.append("category", category.value);
      all_files.forEach((item, index) => {
        switch (item.document_name) {
          case "Id Card":
            if (workpermitcheck) {
              formData.append(`documents[${index}]file`, item.picture);
              formData.append(`documents[${index}]type`, item.type);
              formData.append(
                `documents[${index}]document_name`,
                item.document_name
              );
              formData.append(`documents[${index}]document_number`, workpermit);
              formData.append(`documents[${index}]expiry_date`, workpermitdate);
            }
            return;
          case "passport":
            if (passportcheck) {
              formData.append(`documents[${index}]file`, item.picture);
              formData.append(`documents[${index}]type`, item.type);
              formData.append(
                `documents[${index}]document_name`,
                item.document_name
              );
              formData.append(`documents[${index}]document_number`, passport);
              formData.append(`documents[${index}]expiry_date`, passportdate);
            }
            return;
          case "municipality":
            if (municipalnocheck) {
              formData.append(`documents[${index}]file`, item.picture);
              formData.append(`documents[${index}]type`, item.type);
              formData.append(
                `documents[${index}]document_name`,
                item.document_name
              );
              formData.append(
                `documents[${index}]document_number`,
                municipalno
              );
              formData.append(`documents[${index}]expiry_date`, municipaldate);
            }
            return;
          case "liecence":
            if (drivinglicensecheck) {
              formData.append(`documents[${index}]file`, item.picture);
              formData.append(`documents[${index}]type`, item.type);
              formData.append(
                `documents[${index}]document_name`,
                item.document_name
              );
              formData.append(
                `documents[${index}]document_number`,
                drivinglicense
              );
              formData.append(
                `documents[${index}]expiry_date`,
                drivinglicensedate
              );
            }
            return;
        }
      });

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
        setall_files([]);
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
        setabsentdays("");
        setworkpermitcheck(false);
        setdrivinglicensecheck(false);
        setmunicipalnocheck(false);
        setpassportcheck(false);
        settransportallowancepercenage("");
        setfoodallowancepercenage("");
        setprallowancepercenage("");
        setextraallowancepercenage("");
        setaccomallowancepercenage("");

        if (e) {
          localStorage.setItem("data", JSON.stringify(json));
          window.open("/employeeprint", "_blank");
        }
      }
    }
  };

  const handleSubmit_update = async (e) => {
    if (!isloading && current_user?.permissions?.includes("change_employee")) {
      setisloading(true);
      const formData = new FormData();

      formData.append("name", name);
      formData.append("arabic_name", arabicname);
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

      formData.append(
        "transport_allowance_percentage",
        transportallowancepercenage
      );
      formData.append("food_allowance_percentage", foodallowancepercenage);
      formData.append(
        "accomodation_allowance_percentage",
        accomallowancepercenage
      );
      formData.append("pr_allowance_percentage", prallowancepercenage);
      formData.append("extra_allowance_percentage", extraallowancepercenage);

      formData.append("hiring_date", hiredate ? hiredate : "");
      formData.append("expelled_date", firedate ? firedate : "");
      formData.append("absent_days", absentdays);
      formData.append("user", current_user.id);
      formData.append("category", category.value);

      all_files.forEach((item, index) => {
        switch (item.document_name) {
          case "Id Card":
            if (workpermitcheck) {
              if (item.id) {
                formData.append(`documents[${index}]id`, item.id);
              }
              if (item.file) {
                formData.append(`documents[${index}]file`, item.file);
              }
              formData.append(`documents[${index}]type`, item.type);
              formData.append(
                `documents[${index}]document_name`,
                item.document_name
              );
              formData.append(`documents[${index}]document_number`, workpermit);
              formData.append(
                `documents[${index}]expiry_date`,
                workpermitdate ? workpermitdate : ""
              );
            }
            return;
          case "passport":
            if (passportcheck) {
              if (item.id) {
                formData.append(`documents[${index}]id`, item.id);
              }
              if (item.file) {
                formData.append(`documents[${index}]file`, item.file);
              }
              formData.append(`documents[${index}]type`, item.type);
              formData.append(
                `documents[${index}]document_name`,
                item.document_name
              );
              formData.append(`documents[${index}]document_number`, passport);
              formData.append(
                `documents[${index}]expiry_date`,
                passportdate ? passportdate : ""
              );
            }
            return;
          case "municipality":
            if (municipalnocheck) {
              if (item.id) {
                formData.append(`documents[${index}]id`, item.id);
              }
              if (item.file) {
                formData.append(`documents[${index}]file`, item.file);
              }
              formData.append(`documents[${index}]type`, item.type);
              formData.append(
                `documents[${index}]document_name`,
                item.document_name
              );
              formData.append(
                `documents[${index}]document_number`,
                municipalno
              );
              formData.append(
                `documents[${index}]expiry_date`,
                municipaldate ? municipaldate : ""
              );
            }
            return;
          case "liecence":
            if (drivinglicensecheck) {
              if (item.id) {
                formData.append(`documents[${index}]id`, item.id);
              }
              if (item.file) {
                formData.append(`documents[${index}]file`, item.file);
              }
              formData.append(`documents[${index}]type`, item.type);
              formData.append(
                `documents[${index}]document_name`,
                item.document_name
              );
              formData.append(
                `documents[${index}]document_number`,
                drivinglicense
              );
              formData.append(
                `documents[${index}]expiry_date`,
                drivinglicensedate ? drivinglicensedate : ""
              );
            }
            return;
        }
      });

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
        setall_files([]);
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
        setabsentdays("");
        setworkpermitcheck(false);
        setdrivinglicensecheck(false);
        setmunicipalnocheck(false);
        setpassportcheck(false);
        settransportallowancepercenage("");
        setfoodallowancepercenage("");
        setprallowancepercenage("");
        setextraallowancepercenage("");
        setaccomallowancepercenage("");

        setid("");
        setcheck_update(false);
        if (e) {
          localStorage.setItem("data", JSON.stringify(json));
          window.open("/employeeprint", "_blank");
        }
      }
    }
  };

  const onButtonClick = (text) => {
    // `current` points to the mounted file input element
    switch (text) {
      case "Id Card":
        inputFileidcard.current.click();
        return;
      case "passport":
        inputFilepassport.current.click();
        return;
      case "liecence":
        inputFileliecence.current.click();
        return;
      case "municipality":
        inputFilemunicipality.current.click();
        return;
    }
  };

  const handlepictureselection = (event, text) => {
    const file = event.target.files[0];

    if (file) {
      const type = file.type.split("/").shift();
      const item_present = all_files.filter((item) => {
        return item.document_name === text;
      });
      if (item_present.length === 0) {
        if (type === "application") {
          setall_files([
            ...all_files,
            {
              picture: file,
              type: type,
              url: file,
              file: file,
              document_name: text,
            },
          ]);
        } else if (type === "image") {
          const reader = new FileReader();
          reader.onload = () => {
            setall_files([
              ...all_files,
              {
                picture: file,
                type: type,
                url: reader.result,
                file: file,
                document_name: text,
              },
            ]);
          };
          reader.readAsDataURL(file);
        }
      } else {
        if (type === "application") {
          setall_files(
            all_files.map((item) => {
              if (item.document_name === item_present[0].document_name) {
                item["picture"] = file;
                item["url"] = file;
                item["file"] = file;
                item["type"] = type;
              }
              return item;
            })
          );
        } else if (type === "image") {
          const reader = new FileReader();
          reader.onload = () => {
            setall_files(
              all_files.map((item) => {
                if (item.document_name === item_present[0].document_name) {
                  item["picture"] = file;
                  item["url"] = file;
                  item["file"] = file;
                  item["type"] = type;
                }
                return item;
              })
            );
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const handledeleteClick = (file) => {
    const optimize = all_files.filter((item) => {
      return item.document_name !== file.document_name;
    });

    setall_files(optimize);
  };

  const handleimageclick = (item) => {
    if (item.file instanceof File) {
      const fileURL = URL.createObjectURL(item.file);
      window.open(fileURL, "_blank");
    } else {
      window.open(item.url, "_blank");
    }
  };
  const handlesalary = (e) => {
    setsalary(e.target.value);
    settransportallowance(
      ((Number(e.target.value) / 100) * transportallowancepercenage).toFixed(2)
    );
    setfoodallowance(
      ((Number(e.target.value) / 100) * foodallowancepercenage).toFixed(2)
    );
    setprallowance(
      ((Number(e.target.value) / 100) * prallowancepercenage).toFixed(2)
    );
    setaccomallowance(
      ((Number(e.target.value) / 100) * accomallowancepercenage).toFixed(2)
    );
    setextraallowance(
      ((Number(e.target.value) / 100) * extraallowancepercenage).toFixed(2)
    );
  };

  const handleidcardchange = (e) => {
    setworkpermitcheck(e.target.checked);
  };

  const handlepassportchange = (e) => {
    setpassportcheck(e.target.checked);
  };

  const handledrivingchange = (e) => {
    setdrivinglicensecheck(e.target.checked);
  };

  const handlemunicipalitychange = (e) => {
    setmunicipalnocheck(e.target.checked);
  };

  const finddatedifferenc = (date1, date2) => {
    if (date1 && date2) {
      const a = differenceInDays(new Date(date2), new Date(date1));

      setremainingdays(a + 1);
    }
  };

  return (
    <div className="p-3">
      {(current_user?.permissions?.includes("add_employee") ||
        current_user?.permissions?.includes("change_employee")) && (
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
                  <FontAwesomeIcon icon={faRotate} className="me-1" /> Save
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

            <div className="card-body pt-0" style={{ minHeight: "50vh" }}>
              <Tabs
                defaultActiveKey={"information"}
                transition={true}
                id="noanim-tab-example"
                className="mb-3"
              >
                <Tab eventKey="information" title="Information">
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
                      <MuiThemeProvider theme={theme}>
                        <div dir="rtl" className="col-6 col-md-3">
                          <TextField
                            className="form-control  mb-3"
                            label={"اسم"}
                            value={arabicname}
                            onChange={(e) => {
                              setarabicname(e.target.value);
                            }}
                            size="small"
                            required
                          />
                        </div>
                      </MuiThemeProvider>

                      <div className="col-6  col-md-3">
                        <TextField
                          type="number"
                          className="form-control  mb-3"
                          label={"Mobile"}
                          value={contact}
                          onChange={(e) => {
                            if (e.target.value.length < 11) {
                              setcontact(e.target.value);
                            } else {
                              Red_toast("Mobile digits must be between 0~10");
                            }
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

                      <div className="col-6  col-md-3 ">
                        <Select
                          options={allcategory}
                          placeholder={"Category"}
                          value={category}
                          funct={(e) => setcategory(e)}
                          required={true}
                        ></Select>
                      </div>
                      <div className="col-6  col-md-3 ">
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
                      {type && (
                        <div className="col-6  col-md-3">
                          <TextField
                            className="form-control   mb-3"
                            label={
                              type.value === "Daily Wage" ? "Wages" : "Salary"
                            }
                            value={salary}
                            onChange={
                              type.value === "Daily Wage"
                                ? (e) => {
                                    setsalary(e.target.value);
                                  }
                                : handlesalary
                            }
                            size="small"
                          />
                        </div>
                      )}

                      {type?.value === "Monthly Wage" && (
                        <div className="d-flex col-6 col-md-3">
                          <div className=" col-6 ">
                            <TextField
                              type="number"
                              className="form-control  mb-3"
                              label={t("Transport Allowance %")}
                              value={transportallowancepercenage}
                              onChange={(e) => {
                                settransportallowancepercenage(e.target.value);
                                settransportallowance(
                                  (
                                    (Number(salary) / 100) *
                                    e.target.value
                                  ).toFixed(2)
                                );
                              }}
                              size="small"
                            />
                          </div>
                          <div className=" col-6 ps-3">
                            <TextField
                              type="number"
                              className="form-control  mb-3"
                              label={t("Transport Allowance")}
                              value={transportallowance}
                              onChange={(e) => {
                                settransportallowance(e.target.value);
                                settransportallowancepercenage(
                                  (
                                    (Number(e.target.value) / Number(salary)) *
                                    100
                                  )?.toFixed(2)
                                );
                              }}
                              size="small"
                            />
                          </div>
                        </div>
                      )}

                      {type?.value === "Monthly Wage" && (
                        <div className="d-flex col-6 col-md-3">
                          <div className="col-6 ">
                            <TextField
                              type="number"
                              className="form-control  mb-3"
                              label={t("Food Allowance %")}
                              value={foodallowancepercenage}
                              onChange={(e) => {
                                setfoodallowancepercenage(e.target.value);
                                setfoodallowance(
                                  (
                                    (Number(salary) / 100) *
                                    e.target.value
                                  ).toFixed(2)
                                );
                              }}
                              size="small"
                            />
                          </div>
                          <div className="col-6 ps-3">
                            <TextField
                              type="number"
                              className="form-control  mb-3"
                              label={t("Food Allowance")}
                              value={foodallowance}
                              onChange={(e) => {
                                setfoodallowance(e.target.value);
                                setfoodallowancepercenage(
                                  (
                                    (Number(e.target.value) / Number(salary)) *
                                    100
                                  )?.toFixed(2)
                                );
                              }}
                              size="small"
                            />
                          </div>
                        </div>
                      )}

                      {type?.value === "Monthly Wage" && (
                        <div className="d-flex col-6 col-md-3">
                          <div className="col-6 ">
                            <TextField
                              type="number"
                              className="form-control  mb-3"
                              label={t("Accomod. Allowance %")}
                              value={accomallowancepercenage}
                              onChange={(e) => {
                                setaccomallowancepercenage(e.target.value);
                                setaccomallowance(
                                  (
                                    (Number(salary) / 100) *
                                    e.target.value
                                  ).toFixed(2)
                                );
                              }}
                              size="small"
                            />
                          </div>
                          <div className="col-6 ps-3">
                            <TextField
                              type="number"
                              className="form-control  mb-3"
                              label={t("Accomodation Allowance")}
                              value={accomallowance}
                              onChange={(e) => {
                                setaccomallowance(e.target.value);
                                setaccomallowancepercenage(
                                  (
                                    (Number(e.target.value) / Number(salary)) *
                                    100
                                  )?.toFixed(2)
                                );
                              }}
                              size="small"
                            />
                          </div>
                        </div>
                      )}

                      {type?.value === "Monthly Wage" && (
                        <div className="d-flex col-6 col-md-3">
                          <div className="col-6">
                            <TextField
                              type="Number"
                              className="form-control  mb-3"
                              label={t("PR Allowance %")}
                              value={prallowancepercenage}
                              onChange={(e) => {
                                setprallowancepercenage(e.target.value);
                                setprallowance(
                                  (
                                    (Number(salary) / 100) *
                                    e.target.value
                                  ).toFixed(2)
                                );
                              }}
                              size="small"
                            />
                          </div>
                          <div className="col-6 ps-3">
                            <TextField
                              type="Number"
                              className="form-control  mb-3"
                              label={t("PR Allowance")}
                              value={prallowance}
                              onChange={(e) => {
                                setprallowance(e.target.value);
                                setprallowancepercenage(
                                  (
                                    (Number(e.target.value) / Number(salary)) *
                                    100
                                  )?.toFixed(2)
                                );
                              }}
                              size="small"
                            />
                          </div>
                        </div>
                      )}

                      {type?.value === "Monthly Wage" && (
                        <div className="d-flex col-6 col-md-3">
                          <div className="col-6">
                            <TextField
                              type="number"
                              className="form-control  mb-3"
                              label={t("Extra Allowance %")}
                              value={extraallowancepercenage}
                              onChange={(e) => {
                                setextraallowancepercenage(e.target.value);
                                setextraallowance(
                                  (
                                    (Number(salary) / 100) *
                                    e.target.value
                                  ).toFixed(2)
                                );
                              }}
                              size="small"
                            />
                          </div>
                          <div className="col-6 ps-3">
                            <TextField
                              type="number"
                              className="form-control  mb-3"
                              label={t("Extra Allowance")}
                              value={extraallowance}
                              onChange={(e) => {
                                setextraallowance(e.target.value);
                                setextraallowancepercenage(
                                  (
                                    (Number(e.target.value) / Number(salary)) *
                                    100
                                  )?.toFixed(2)
                                );
                              }}
                              size="small"
                            />
                          </div>
                        </div>
                      )}
                      {type?.value === "Monthly Wage" && (
                        <div className="col-6 col-md-3">
                          <TextField
                            type="number"
                            className="form-control  mb-3"
                            label={t("Total")}
                            value={(
                              Number(extraallowance) +
                              Number(transportallowance) +
                              Number(foodallowance) +
                              Number(accomallowance) +
                              Number(prallowance) +
                              Number(salary)
                            ).toFixed(2)}
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
                      <div className="col-6 col-md-3">
                        <TextField
                          type="Date"
                          className="form-control  mb-3"
                          label={t("Joining Date")}
                          InputLabelProps={{ shrink: true }}
                          value={hiredate}
                          InputProps={{
                            inputProps: {
                              min: `${selected_year.value}-01-01`,
                              max: `${selected_year.value}-12-31`,
                            },
                          }}
                          onChange={(e) => {
                            sethiredate(e.target.value);
                            if (type?.value !== "Monthly Wage") {
                              finddatedifferenc(e.target.value, firedate);
                            }
                          }}
                          size="small"
                        />
                      </div>

                      <div className="col-6 col-md-3">
                        <TextField
                          type="Date"
                          className="form-control  mb-3"
                          label={t("End Date")}
                          InputLabelProps={{ shrink: true }}
                          value={firedate}
                          InputProps={{
                            inputProps: {
                              min: `${selected_year.value}-01-01`,
                              max: `${selected_year.value}-12-31`,
                            },
                          }}
                          onChange={(e) => {
                            setfiredate(e.target.value);
                            if (type?.value !== "Monthly Wage") {
                              finddatedifferenc(hiredate, e.target.value);
                            }
                          }}
                          size="small"
                        />
                      </div>

                      {type?.value !== "Monthly Wage" && type && (
                        <div className="col-6 col-md-3">
                          <TextField
                            type="number"
                            className="form-control  mb-3"
                            label={t("Days")}
                            value={remainingdays}
                            size="small"
                          />
                        </div>
                      )}

                      <div className="col-6 col-md-3">
                        <TextField
                          type="number"
                          className="form-control  mb-3"
                          label={"Absent Days"}
                          value={absentdays}
                          onChange={(e) => {
                            setabsentdays(e.target.value);
                          }}
                          size="small"
                        />
                      </div>
                      {type?.value !== "Monthly Wage" && type && (
                        <div className="col-6 col-md-3">
                          <TextField
                            type="number"
                            className="form-control  mb-3"
                            label={t("Total Days")}
                            value={Number(remainingdays) - Number(absentdays)}
                            size="small"
                          />
                        </div>
                      )}
                      {type?.value !== "Monthly Wage" && type && (
                        <div className="col-6 col-md-3">
                          <TextField
                            type="number"
                            className="form-control  mb-3"
                            label={t("Total")}
                            value={
                              Number(salary) *
                              (Number(remainingdays) - Number(absentdays))
                            }
                            size="small"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </Tab>
                <Tab eventKey="documents" title="Documents">
                  <div className="row">
                    <div className="col-3 mb-3 ps-2 pe-2">
                      <label className="mb-3">
                        <input
                          type="checkbox"
                          checked={workpermitcheck}
                          onChange={handleidcardchange}
                        ></input>
                        <strong className="ms-3">ID Card</strong>
                      </label>
                      {workpermitcheck && (
                        <>
                          <TextField
                            className="form-control   mb-3"
                            variant="standard"
                            label={"ID Number"}
                            InputLabelProps={{ shrink: true }}
                            value={workpermit}
                            onChange={(e) => {
                              setworkpermit(e.target.value);
                            }}
                            size="small"
                          />
                          <TextField
                            type="date"
                            className="form-control   mb-3"
                            variant="standard"
                            label={"Expiry Date"}
                            value={workpermitdate}
                            InputProps={{
                              inputProps: {
                                min: `${selected_year.value}-01-01`,
                                max: `${selected_year.value}-12-31`,
                              },
                            }}
                            InputLabelProps={{ shrink: true }}
                            onChange={(e) => {
                              setworkpermitdate(e.target.value);
                            }}
                            size="small"
                          />
                          <div>
                            <input
                              onChange={(e) =>
                                handlepictureselection(e, "Id Card")
                              }
                              id="select-file"
                              type="file"
                              accept=".docx,.pdf,.txt,.png,.jpg,.jpeg"
                              ref={inputFileidcard}
                              style={{ display: "none" }}
                            />
                            <Button
                              onClick={(e) => onButtonClick("Id Card")}
                              variant="outline-primary"
                              shadow
                            >
                              Choose file
                            </Button>
                          </div>
                          {all_files
                            .filter((item) => item.document_name === "Id Card")
                            .map((item) => {
                              return (
                                <>
                                  {item.type !== "image" ? (
                                    <span className="d-flex mt-3">
                                      <span
                                        className="col-1 mb-2"
                                        style={{ width: "fit-content" }}
                                        onClick={() => {
                                          handleimageclick(item);
                                        }}
                                        key={item.document_name}
                                      >
                                        <span className="file p-2">
                                          {item.picture.name}
                                        </span>
                                      </span>
                                      <Badge
                                        color="error"
                                        className="me-3 badgee pointer"
                                        overlap="circular"
                                        badgeContent="X"
                                        onClick={() => {
                                          handledeleteClick(item);
                                        }}
                                      ></Badge>
                                    </span>
                                  ) : (
                                    <div
                                      className="col-1 mb-2 me-3 mt-3 d-flex claas-images"
                                      key={item.document_name}
                                    >
                                      <Avatar
                                        src={item.url}
                                        className="avatar"
                                        style={{
                                          width: "100px",
                                          height: "100px",
                                        }}
                                        alt="image"
                                        onClick={() => {
                                          handleimageclick(item);
                                        }}
                                      />
                                      <Badge
                                        color="error"
                                        overlap="circular"
                                        className="badgeepic me-3 badgee pointer"
                                        badgeContent="X"
                                        onClick={() => {
                                          handledeleteClick(item);
                                        }}
                                      ></Badge>
                                    </div>
                                  )}
                                </>
                              );
                            })}
                        </>
                      )}
                    </div>
                    <div className="col-3 mb-3">
                      <label className="mb-3">
                        <input
                          type="checkbox"
                          checked={passportcheck}
                          onChange={handlepassportchange}
                        ></input>
                        <strong className="ms-3">Passport</strong>
                      </label>
                      {passportcheck && (
                        <>
                          <TextField
                            className="form-control   mb-3"
                            variant="standard"
                            label={"Passport No"}
                            InputLabelProps={{ shrink: true }}
                            value={passport}
                            onChange={(e) => {
                              setpassport(e.target.value);
                            }}
                            size="small"
                          />
                          <TextField
                            type="date"
                            className="form-control   mb-3"
                            variant="standard"
                            label={"Expiry Date"}
                            InputProps={{
                              inputProps: {
                                min: `${selected_year.value}-01-01`,
                                max: `${selected_year.value}-12-31`,
                              },
                            }}
                            value={passportdate}
                            InputLabelProps={{ shrink: true }}
                            onChange={(e) => {
                              setpassportdate(e.target.value);
                            }}
                            size="small"
                          />
                          <div>
                            <input
                              onChange={(e) =>
                                handlepictureselection(e, "passport")
                              }
                              id="select-file"
                              type="file"
                              accept=".docx,.pdf,.txt,.png,.jpg,.jpeg"
                              ref={inputFilepassport}
                              style={{ display: "none" }}
                            />
                            <Button
                              onClick={(e) => onButtonClick("passport")}
                              variant="outline-primary"
                              shadow
                            >
                              Choose file
                            </Button>
                          </div>
                          {all_files
                            .filter((item) => item.document_name === "passport")
                            .map((item) => {
                              return (
                                <>
                                  {item.type !== "image" ? (
                                    <span className="d-flex mt-3">
                                      <span
                                        className="col-1 mb-2"
                                        style={{ width: "fit-content" }}
                                        onClick={() => {
                                          handleimageclick(item);
                                        }}
                                        key={item.document_name}
                                      >
                                        <span className="file p-2">
                                          {item.picture.name}
                                        </span>
                                      </span>
                                      <Badge
                                        color="error"
                                        className="me-3 badgee pointer"
                                        overlap="circular"
                                        badgeContent="X"
                                        onClick={() => {
                                          handledeleteClick(item);
                                        }}
                                      ></Badge>
                                    </span>
                                  ) : (
                                    <div
                                      className="col-1 mb-2 me-3 mt-3 d-flex claas-images"
                                      key={item.document_name}
                                    >
                                      <Avatar
                                        src={item.url}
                                        className="avatar"
                                        style={{
                                          width: "100px",
                                          height: "100px",
                                        }}
                                        alt="image"
                                        onClick={() => {
                                          handleimageclick(item);
                                        }}
                                      />
                                      <Badge
                                        color="error"
                                        overlap="circular"
                                        className="badgeepic me-3 badgee pointer"
                                        badgeContent="X"
                                        onClick={() => {
                                          handledeleteClick(item);
                                        }}
                                      ></Badge>
                                    </div>
                                  )}
                                </>
                              );
                            })}
                        </>
                      )}
                    </div>
                    <div className="col-3 mb-3">
                      <label className="mb-3">
                        <input
                          type="checkbox"
                          checked={municipalnocheck}
                          onChange={handlemunicipalitychange}
                        ></input>
                        <strong className="ms-3">Municipality Card</strong>
                      </label>
                      {municipalnocheck && (
                        <>
                          <TextField
                            className="form-control   mb-3"
                            variant="standard"
                            label={"Municipality No"}
                            InputLabelProps={{ shrink: true }}
                            value={municipalno}
                            onChange={(e) => {
                              setmunicipalno(e.target.value);
                            }}
                            size="small"
                          />
                          <TextField
                            type="date"
                            className="form-control   mb-3"
                            variant="standard"
                            label={"Expiry Date"}
                            value={municipaldate}
                            InputProps={{
                              inputProps: {
                                min: `${selected_year.value}-01-01`,
                                max: `${selected_year.value}-12-31`,
                              },
                            }}
                            InputLabelProps={{ shrink: true }}
                            onChange={(e) => {
                              setmunicipaldate(e.target.value);
                            }}
                            size="small"
                          />
                          <div>
                            <input
                              onChange={(e) =>
                                handlepictureselection(e, "municipality")
                              }
                              id="select-file"
                              type="file"
                              accept=".docx,.pdf,.txt,.png,.jpg,.jpeg"
                              ref={inputFilemunicipality}
                              style={{ display: "none" }}
                            />
                            <Button
                              onClick={(e) => onButtonClick("municipality")}
                              variant="outline-primary"
                              shadow
                            >
                              Choose file
                            </Button>
                          </div>
                          {all_files
                            .filter(
                              (item) => item.document_name === "municipality"
                            )
                            .map((item) => {
                              return (
                                <>
                                  {item.type !== "image" ? (
                                    <span className="d-flex mt-3">
                                      <span
                                        className="col-1 mb-2"
                                        style={{ width: "fit-content" }}
                                        onClick={() => {
                                          handleimageclick(item);
                                        }}
                                        key={item.document_name}
                                      >
                                        <span className="file p-2">
                                          {item.picture.name}
                                        </span>
                                      </span>
                                      <Badge
                                        color="error"
                                        className="me-3 badgee pointer"
                                        overlap="circular"
                                        badgeContent="X"
                                        onClick={() => {
                                          handledeleteClick(item);
                                        }}
                                      ></Badge>
                                    </span>
                                  ) : (
                                    <div
                                      className="col-1 mb-2 me-3 mt-3 d-flex claas-images"
                                      key={item.document_name}
                                    >
                                      <Avatar
                                        src={item.url}
                                        className="avatar"
                                        style={{
                                          width: "100px",
                                          height: "100px",
                                        }}
                                        alt="image"
                                        onClick={() => {
                                          handleimageclick(item);
                                        }}
                                      />
                                      <Badge
                                        color="error"
                                        overlap="circular"
                                        className="badgeepic me-3 badgee pointer"
                                        badgeContent="X"
                                        onClick={() => {
                                          handledeleteClick(item);
                                        }}
                                      ></Badge>
                                    </div>
                                  )}
                                </>
                              );
                            })}
                        </>
                      )}
                    </div>
                    <div className="col-3 mb-3">
                      <label className="mb-3">
                        <input
                          type="checkbox"
                          checked={drivinglicensecheck}
                          onChange={handledrivingchange}
                        ></input>
                        <strong className="ms-3">Driving License</strong>
                      </label>
                      {drivinglicensecheck && (
                        <>
                          <TextField
                            className="form-control   mb-3"
                            variant="standard"
                            label={"Driving License"}
                            value={drivinglicense}
                            InputLabelProps={{ shrink: true }}
                            onChange={(e) => {
                              setdrivinglicense(e.target.value);
                            }}
                            size="small"
                          />
                          <TextField
                            type="date"
                            className="form-control   mb-3"
                            variant="standard"
                            label={"Expiry Date"}
                            value={drivinglicensedate}
                            InputProps={{
                              inputProps: {
                                min: `${selected_year.value}-01-01`,
                                max: `${selected_year.value}-12-31`,
                              },
                            }}
                            InputLabelProps={{ shrink: true }}
                            onChange={(e) => {
                              setdrivinglicensedate(e.target.value);
                            }}
                            size="small"
                          />
                          <div>
                            <input
                              onChange={(e) =>
                                handlepictureselection(e, "liecence")
                              }
                              id="select-file"
                              type="file"
                              accept=".docx,.pdf,.txt,.png,.jpg,.jpeg"
                              ref={inputFileliecence}
                              style={{ display: "none" }}
                            />
                            <Button
                              onClick={(e) => onButtonClick("liecence")}
                              variant="outline-primary"
                              shadow
                            >
                              Choose file
                            </Button>
                          </div>
                          {all_files
                            .filter((item) => item.document_name === "liecence")
                            .map((item) => {
                              return (
                                <>
                                  {item.type !== "image" ? (
                                    <span className="d-flex mt-3">
                                      <span
                                        className="col-1 mb-2"
                                        style={{ width: "fit-content" }}
                                        onClick={() => {
                                          handleimageclick(item);
                                        }}
                                        key={item.document_name}
                                      >
                                        <span className="file p-2">
                                          {item.picture.name}
                                        </span>
                                      </span>
                                      <Badge
                                        color="error"
                                        className="me-3 badgee pointer"
                                        overlap="circular"
                                        badgeContent="X"
                                        onClick={() => {
                                          handledeleteClick(item);
                                        }}
                                      ></Badge>
                                    </span>
                                  ) : (
                                    <div
                                      className="col-1 mb-2 me-3 mt-3 d-flex claas-images"
                                      key={item.document_name}
                                    >
                                      <Avatar
                                        src={item.url}
                                        className="avatar"
                                        style={{
                                          width: "100px",
                                          height: "100px",
                                        }}
                                        alt="image"
                                        onClick={() => {
                                          handleimageclick(item);
                                        }}
                                      />
                                      <Badge
                                        color="error"
                                        overlap="circular"
                                        className="badgeepic me-3 badgee pointer"
                                        badgeContent="X"
                                        onClick={() => {
                                          handledeleteClick(item);
                                        }}
                                      ></Badge>
                                    </div>
                                  )}
                                </>
                              );
                            })}
                        </>
                      )}
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </div>
          </form>
        </div>
      )}

      {current_user?.permissions?.includes("view_employee") && (
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
      )}

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
