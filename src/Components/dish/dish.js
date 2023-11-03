import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import "./dish.css";
import Select from "../alerts/select";
import { IconButton, Avatar } from "@material-ui/core";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { ToastContainer } from "react-toastify";
import custom_toast from "../alerts/custom_toast";
import went_wrong_toast from "../alerts/went_wrong_toast";
import Spinner from "react-bootstrap/Spinner";
import Alert_before_delete from "../../Container/alertContainer";
import ToolkitProvider, {
  Search,
  CSVExport,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import PrintIcon from "@material-ui/icons/Print";
import { useTranslation } from "react-i18next";
import TextField from "@mui/material/TextField";
import Save_button from "../buttons/save_button";
import success_toast from "../alerts/success_toast";
import SaveIcon from "@material-ui/icons/Save";

export default function Product(props) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  const { t } = useTranslation();
  const user = props.state.setuser.user;
  const route = props.state.setuser.route;
  const selected_branch = props.state.Setcurrentinfo.selected_branch;
  const current_user = props.state.Setcurrentinfo.current_user;
  const all_products = props.state.Settablehistory.table_history;
  const dispatch = props.Settable_history;
  const { SearchBar } = Search;
  const settings = props.state.Setcurrentinfo.settings;
  const { ExportCSVButton } = CSVExport;
  const [showmodel, setshowmodel] = useState(false);
  const [data, setdata] = useState("");
  const [showmodelupdate, setshowmodelupdate] = useState(false);
  const inputFile = useRef(null);
  const [p_category, setp_category] = useState("");
  const [submenu, setsubmenu] = useState("");
  const [name, setname] = useState("");
  const [arabicname, setarabicname] = useState("");
  const [menu, setmenu] = useState("");
  const [allmenu, setallmenu] = useState([]);
  const [allsubmenu, setallsubmenu] = useState([]);

  const [delete_user, setdelete_user] = useState(false);
  const [url_to_delete, seturl_to_delete] = useState("");
  const [row_id, setrow_id] = useState("");
  const [isloading, setisloading] = useState(false);

  const [Fileurl, setFileurl] = useState("");
  const [check_update, setcheck_update] = useState(true);

  useEffect(() => {
    dispatch({ type: "Set_table_history", data: [] });
    const fetchWorkouts = async () => {
      setisloading(true);
      var url = `${route}/api/dishes/`;
      if (menu) {
        url = `${url}?menu_id=${menu.value}`;
        if (submenu) {
          url = `${url}&submenu_id=${submenu.value}`;
        }
      } else if (submenu) {
        url = `${url}?submenu_id=${submenu.value}`;
      }

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

    if (menu || submenu) {
      fetchWorkouts();
    }
  }, [menu, submenu]);

  useEffect(() => {
    const fetchmenu = async () => {
      var url = `${route}/api/menu/`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        const optimize = json.map((item) => {
          return { value: item.id, label: item.name };
        });
        setallmenu(optimize);
      }
    };

    const fetchsubmenu = async () => {
      var url = `${route}/api/sub-menu/`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        const optimize = json.map((item) => {
          return { value: item.id, label: item.name };
        });

        setallsubmenu(optimize);
      }
    };

    if (user) {
      fetchsubmenu();
      fetchmenu();
    }
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

  const Action = (cell, row, rowIndex, formatExtraData) => {
    return (
      <span className="action d-flex">
        <IconButton
          className="border border-danger rounded me-2"
          onClick={() => {
            const optimize = all_products.filter((u) => u.name !== row.name);
            dispatch({ type: "Set_table_history", data: optimize });
          }}
        >
          <DeleteRoundedIcon className="m-1" color="error" fontSize="medium" />
        </IconButton>
      </span>
    );
  };

  const columns = [
    {
      dataField: "id",
      text: "Id",
      hidden: true,
      headerFormatter: headerstyle,
      csvExport: false,
    },

    {
      dataField: "name",
      text: t("name"),
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "arabic_name",
      text: t("	اسم الطبق"),
      sort: true,
      headerFormatter: headerstyle,
    },

    {
      dataField: "action",
      text: t("action"),
      formatter: Action,
      headerFormatter: headerstyle,
      csvExport: false,
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
        value: all_products.length,
      },
    ], // A numeric array is also available. the purpose of above example is custom the text
  };

  const makepdf = () => {
    const body = all_products.map((item, index) => {
      return [
        index + 1,
        item.category_name,
        item.submenu_name,
        item.name,
        item.arabicname,

        item.menu,
      ];
    });
    body.splice(0, 0, [
      "#",
      "Category",
      "submenu",
      "Name",
      "arabicname",
      "menu",
    ]);

    const documentDefinition = {
      content: [
        { text: "Products", style: "header" },
        { text: `Account Head: ${selected_branch.name}`, style: "body" },
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
            widths: [30, "*", "*", "*", "*", "*"],
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
    pdfMake.createPdf(documentDefinition).download("Products.pdf");
  };

  const print = () => {
    const documentDefinition = makepdf();
    pdfMake.createPdf(documentDefinition).print();
  };

  const rowstyle = { height: "10px" };

  const selectStyles = {
    submenu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    if (check_update) {
      setisloading(true);

      const optimize = all_products.map((item) => {
        delete item["sub_menu_name"];
        delete item["menu_name"];
        return item;
      });

      const formData = new FormData();
      const response = await fetch(`${route}/api/bulk-dishes/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access}`,
        },
        body: JSON.stringify(optimize),
      });
      const json = await response.json();

      if (!response.ok) {
        setisloading(false);
        went_wrong_toast();
      }

      if (response.ok) {
        setisloading(false);
        dispatch({ type: "Create_table_history", data: json });
        success_toast();
        setname("");
        setarabicname("");
        setmenu("");

        setsubmenu("");
        setp_category("");
      }
    }
  };

  const handleadd = (e) => {
    e.preventDefault();
    if (menu && submenu && arabicname && name) {
      dispatch({
        type: "Create_table_history",
        data: {
          sub_menu: submenu.value,
          menu: menu.value,
          name: name,
          arabic_name: arabicname,
          menu_name: menu.label,
          sub_menu_name: submenu.label,
        },
      });
      setname("");
      setarabicname("");
    }
  };

  const onButtonClick = () => {
    // `current` points to the mounted file input element
    inputFile.current.click();
  };

  const handleimageselection = (event) => {
    const file = event.target.files[0];

    if (file) {
      handlefileupload(file);
    }
  };

  const handlefileupload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${route}/api/upload-dishes/`, {
      method: "POST",
      headers: {
        "content-type": "multipart/form-data",
        Authorization: `Bearer ${user.access}`,
      },
      body: formData,
    });
    const json = await response.json();

    if (!response.ok) {
      went_wrong_toast();
    }

    if (response.ok) {
      success_toast();
    }
  };

  return (
    <div className="p-3 pt-2">
      <div className="card">
        <div className="card-header d-flex justify-content-between bg-white">
          <h3 className="mt-2 me-2">Add Dish</h3>
          <div className="mt-2 me-2 d-flex flex-row-reverse">
            <Button variant="outline-primary" onClick={handlesubmit}>
              {isloading && (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              )}
              <SaveIcon /> {t("save")}
            </Button>
            <div>
              <input
                onChange={handleimageselection}
                id="select-file"
                type="file"
                accept=".csv,.xml"
                ref={inputFile}
                style={{ display: "none" }}
              />

              <Button
                className="me-2"
                variant="outline-primary"
                onClick={onButtonClick}
              >
                {t("Import File")}
              </Button>
            </div>
          </div>
        </div>

        <div className="card-body pt-0">
          <div className="row mt-4">
            <div className="col-md-3">
              <Select
                options={allmenu}
                placeholder={"Menu"}
                value={menu}
                funct={(e) => setmenu(e)}
                required={true}
              />
            </div>
            <div className="col-md-3">
              <Select
                options={allsubmenu}
                placeholder={"Sub Menu"}
                value={submenu}
                funct={(e) => setsubmenu(e)}
                required={true}
              />
            </div>
            <div className="col-md-2">
              <TextField
                className="form-control   mb-3"
                label={"Dish Name"}
                value={name}
                onChange={(e) => {
                  setname(e.target.value);
                }}
                size="small"
                required
              />
            </div>
            <div className="col-md-2">
              <TextField
                type="text"
                className="form-control  mb-3"
                label={"	اسم الطبق"}
                value={arabicname}
                onChange={(e) => {
                  setarabicname(e.target.value);
                }}
                size="small"
              />
            </div>

            <div className="col-md-1">
              <Button variant="outline-dark" onClick={handleadd}>
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-3">
        <div className="card-body pt-0">
          <ToolkitProvider
            keyField="id"
            data={all_products}
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
