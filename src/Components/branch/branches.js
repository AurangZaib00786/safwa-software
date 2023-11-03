import React, { useState, useEffect, useRef, memo } from "react";
import "./account_heads.css";
import { IconButton, Avatar } from "@material-ui/core";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, {
  Search,
  CSVExport,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import Button from "react-bootstrap/Button";
import Alert_before_delete from "../../Container/alertContainer";

import custom_toast from "../alerts/custom_toast";
import went_wrong_toast from "../alerts/went_wrong_toast";
import Spinner from "react-bootstrap/Spinner";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import PrintIcon from "@material-ui/icons/Print";
import { useTranslation } from "react-i18next";
import TextField from "@mui/material/TextField";
import Save_button from "../buttons/save_button";
import success_toast from "../alerts/success_toast";
import Red_toast from "../alerts/red_toast";
function Accounts(props) {
  const { t } = useTranslation();

  const user = props.state.setuser.user;
  const route = props.state.setuser.route;
  const selected_branch = props.state.Setcurrentinfo.selected_branch;
  const current_user = props.state.Setcurrentinfo.current_user;

  const all_users = props.state.Settablehistory.table_history;
  const dispatch_1 = props.Setinfo_ofuser;
  const dispatch = props.Settable_history;
  const { SearchBar } = Search;
  const { ExportCSVButton } = CSVExport;
  const [id, setid] = useState("");
  const [check_update, setcheck_update] = useState(true);
  const [delete_user, setdelete_user] = useState(false);
  const [url_to_delete, seturl_to_delete] = useState("");
  const [row_id, setrow_id] = useState("");
  const [isloading, setisloading] = useState(false);
  const inputFile = useRef(null);
  const [picture, setpicture] = useState("");
  const [Fileurl, setFileurl] = useState("");
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [contact, setcontact] = useState("");
  const [bank_details, setbank_details] = useState("");
  const [address, setaddress] = useState("");

  const [vatno, setvatno] = useState("");
  const [arabicname, setarabicname] = useState("");
  const [tax_percentage, settax_percentage] = useState("");
  const [balance, setbalance] = useState(0);
  const [terms, setterms] = useState("");

  useEffect(() => {
    setisloading(true);

    const fetchWorkouts = async () => {
      const response = await fetch(`${route}/api/account-heads/`, {
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

    fetchWorkouts();
  }, []);

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

  const handleconfirm = (row) => {
    dispatch({ type: "Delete_table_history", data: { id: row } });
    custom_toast("Delete");
  };

  const linkFollow = (cell, row, rowIndex, formatExtraData) => {
    return (
      <span className="action d-flex">
        <IconButton
          className="me-2 border border-danger rounded"
          onClick={() => {
            setrow_id(row.id);
            seturl_to_delete(`${route}/api/account-heads/${row.id}/`);
            setdelete_user(true);
          }}
        >
          <DeleteRoundedIcon className="m-1" color="error" fontSize="medium" />
        </IconButton>

        <IconButton
          style={{ border: "1px solid #003049", borderRadius: "5px" }}
          onClick={() => {
            setname(row.name);
            setemail(row.email);
            setcontact(row.contact);

            setbank_details(row.bank_details);
            setaddress(row.address);
            setFileurl(row.logo);
            setvatno(row.vat_number);
            setarabicname(row.arabic_name);

            setterms(row.terms);
            settax_percentage(row.vat_percentage);
            setid(row.id);
            setcheck_update(false);
          }}
        >
          <EditOutlinedIcon
            className="m-1"
            style={{ color: "#003049" }}
            fontSize="medium"
          />
        </IconButton>
      </span>
    );
  };

  const loadimage = (cell, row, rowIndex, formatExtraData) => {
    return (
      <div className="d-flex justify-content-center">
        <Avatar src={cell} alt="logo" />
      </div>
    );
  };

  const columns = [
    { dataField: "id", text: "Id", hidden: true, headerFormatter: headerstyle },
    {
      dataField: "logo",
      text: t("logo"),
      sort: true,
      formatter: loadimage,
      headerFormatter: headerstyle,
    },

    {
      dataField: "name",
      text: t("name"),
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "arabic_name",
      text: t("Arabic Name"),
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "email",
      text: "Email",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "contact",
      text: "Contact",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "vat_number",
      text: "VAT No",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "vat_percentage",
      text: "VAT %",
      sort: true,
      headerFormatter: headerstyle,
    },

    {
      dataField: "address",
      text: t("address"),
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "action",
      text: t("action"),
      formatter: linkFollow,
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
        value: all_users.length,
      },
    ], // A numeric array is also available. the purpose of above example is custom the text
  };

  const makepdf = () => {
    const body = all_users.map((item, index) => {
      return [
        { text: index + 1 },
        { text: item.name },
        { text: item.email },
        { text: item.contact },
        { text: item.vatno },
        { text: item.strn },
        { text: item.tax_percentage },
        { text: item.bank_details },
        { text: item.address },
      ];
    });
    body.splice(0, 0, [
      "#",
      "Name",
      "Email",
      "Contact",
      "vatno",
      "STRN",
      "Tax %",
      "Bank Details",
      "Address",
    ]);

    const documentDefinition = {
      content: [
        { text: "Acccount Heads", style: "header" },

        {
          canvas: [
            { type: "line", x1: 0, y1: 10, x2: 760, y2: 10, lineWidth: 1 },
          ],
        },

        {
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: [30, "*", "*", "*", "*", "*", "*", "*", "*"],
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
          fontSize: 8,
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
      pageOrientation: "landscape",
    };

    return documentDefinition;
  };

  const download = () => {
    const documentDefinition = makepdf();
    pdfMake.createPdf(documentDefinition).download("Account_Heads.pdf");
  };

  const print = () => {
    const documentDefinition = makepdf();
    pdfMake.createPdf(documentDefinition).print();
  };

  const rowstyle = { height: "10px" };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (check_update) {
      if (!isloading) {
        setisloading(true);
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("contact", contact);
        formData.append("logo", picture);
        formData.append("address", address);
        formData.append("bank_details", bank_details);
        formData.append("vat_number", vatno);
        formData.append("arabic_name", arabicname);

        formData.append("vat_percentage", tax_percentage);

        formData.append("terms", terms);

        const response = await fetch(`${route}/api/account-heads/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.access}`,
          },
          body: formData,
        });
        const json = await response.json();

        if (!response.ok) {
          setisloading(false);
          Red_toast(`${json.error}`);
        }

        if (response.ok) {
          dispatch({ type: "Create_table_history", data: json });
          setisloading(false);
          success_toast();
          setname("");
          setemail("");
          setcontact("");
          setvatno("");
          setarabicname("");
          setaddress("");
          setbank_details("");
          setpicture("");
          setFileurl("");

          setterms("");
          settax_percentage("");
          dispatch_1({
            type: "SetCurrentUser",
            data: {
              ...current_user,
              account_heads: [
                ...current_user?.account_heads,
                { id: json.id, name: json.name },
              ],
            },
          });
        }
      }
    } else {
      handleSubmit_update(e);
    }
  };

  const handleSubmit_update = async (e) => {
    e.preventDefault();
    setisloading(true);
    const formData = new FormData();

    formData.append("name", name);
    formData.append("email", email);
    formData.append("contact", contact);

    formData.append("address", address);
    formData.append("bank_details", bank_details);
    formData.append("vat_number", vatno);
    formData.append("arabic_name", arabicname);

    formData.append("vat_percentage", tax_percentage);

    formData.append("terms", terms);
    if (picture) {
      formData.append("logo", picture);
    }

    const response = await fetch(`${route}/api/account-heads/${id}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${user.access}`,
      },
      body: formData,
    });
    const json = await response.json();

    if (!response.ok) {
      setisloading(false);
      Red_toast(`${json.error}`);
      setcheck_update(false);
    }

    if (response.ok) {
      setisloading(false);
      dispatch({ type: "Update_table_history", data: json });
      success_toast();
      setname("");
      setemail("");
      setcontact("");
      setaddress("");
      setbank_details("");
      settax_percentage("");
      setpicture("");
      setFileurl("");
      setvatno("");
      setarabicname("");

      setterms("");
      setcheck_update(true);
      if (json.id === selected_branch.id) {
        localStorage.setItem("selected_branch", JSON.stringify(json));
        dispatch_1({ type: "Set_Branch_first", data: json });
      }
    }
  };

  const onButtonClick = () => {
    // `current` points to the mounted file input element
    inputFile.current.click();
  };

  const handleimageselection = (event) => {
    const file = event.target.files[0];

    setpicture(file);

    const reader = new FileReader();
    reader.onload = () => {
      setFileurl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-3 pt-2">
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="card-header d-flex justify-content-between bg-white">
            <h3 className="mt-2 me-2">Add Branch</h3>
            <div className="mt-2 me-2 d-flex flex-row-reverse">
              <Save_button isloading={isloading} />
            </div>
          </div>

          <div className="card-body pt-0">
            <div className="row mt-4">
              <div className="col-md-9">
                <div className="row">
                  <div className="col-md-4">
                    <TextField
                      className="form-control   mb-3"
                      label="Name"
                      value={name}
                      onChange={(e) => {
                        setname(e.target.value);
                      }}
                      size="small"
                      required
                      autoFocus
                    />
                  </div>
                  <div className="col-md-4">
                    <TextField
                      className="form-control  mb-3"
                      label="Arabic Name"
                      value={arabicname}
                      onChange={(e) => {
                        setarabicname(e.target.value);
                      }}
                      size="small"
                    />
                  </div>

                  <div className="col-md-4">
                    <TextField
                      className="form-control  mb-3"
                      label="Contact"
                      value={contact}
                      onChange={(e) => {
                        setcontact(e.target.value);
                      }}
                      size="small"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4">
                    <TextField
                      type="email"
                      className="form-control   mb-3"
                      label="Email"
                      value={email}
                      onChange={(e) => {
                        setemail(e.target.value);
                      }}
                      size="small"
                    />
                  </div>
                  <div className="col-md-4">
                    <TextField
                      className="form-control  mb-3"
                      label="VAT Number"
                      value={vatno}
                      onChange={(e) => {
                        setvatno(e.target.value);
                      }}
                      size="small"
                    />
                  </div>

                  <div className="col-md-4">
                    <TextField
                      className="form-control  mb-3"
                      label="VAT"
                      value={tax_percentage}
                      onChange={(e) => {
                        settax_percentage(e.target.value);
                      }}
                      size="small"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4">
                    <TextField
                      multiline
                      className="form-control   mb-3"
                      label="Address"
                      value={address}
                      onChange={(e) => {
                        setaddress(e.target.value);
                      }}
                      size="small"
                    />
                  </div>

                  <div className="col-md-4">
                    <TextField
                      multiline
                      className="form-control   mb-3"
                      label="Banks"
                      value={bank_details}
                      onChange={(e) => {
                        setbank_details(e.target.value);
                      }}
                      size="small"
                    />
                  </div>

                  <div className="col-md-4">
                    <TextField
                      multiline
                      className="form-control   mb-3"
                      label="Terms & Conditions"
                      value={terms}
                      onChange={(e) => {
                        setterms(e.target.value);
                      }}
                      size="small"
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-3 d-flex flex-column align-items-center">
                {Fileurl && (
                  <img
                    style={{ width: "100px", height: "100px" }}
                    src={Fileurl}
                  />
                )}
                <input
                  onChange={handleimageselection}
                  id="select-file"
                  type="file"
                  ref={inputFile}
                  style={{ display: "none" }}
                />
                <Button onClick={onButtonClick} shadow>
                  {t("choose_file")}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="card mt-3">
        <div className="card-body pt-0">
          <ToolkitProvider
            keyField="id"
            data={all_users}
            columns={columns}
            search
            exportCSV
          >
            {(props) => (
              <div>
                <div className="d-sm-flex justify-content-between align-items-center mt-3">
                  <div>
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
                  </div>
                  <SearchBar {...props.searchProps} />
                </div>
                {isloading && (
                  <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                  </div>
                )}
                <hr />
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
    </div>
  );
}

export default memo(Accounts);
