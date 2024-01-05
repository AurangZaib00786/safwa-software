import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import "./subcatgory.css";
import { IconButton, Avatar } from "@material-ui/core";
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
import Subcategoriesform from "./subcatgoryform";
import Updatesubcategories from "./updatesubcatgoryform";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import custom_toast from "../alerts/custom_toast";
import Red_toast from "../alerts/red_toast";
import Spinner from "react-bootstrap/Spinner";
import Alert_before_delete from "../../Container/alertContainer";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import PrintIcon from "@material-ui/icons/Print";
import { useTranslation } from "react-i18next";
import Select from "../alerts/select";

export default function Subcategory(props) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  const { t } = useTranslation();
  const user = props.state.setuser.user;
  const route = props.state.setuser.route;
  const selected_branch = props.state.Setcurrentinfo.selected_branch;
  const current_user = props.state.Setcurrentinfo.current_user;
  const all_customers = props.state.Settablehistory.table_history;
  const dispatch = props.Settable_history;

  const { SearchBar } = Search;
  const { ExportCSVButton } = CSVExport;
  const [showmodel, setshowmodel] = useState(false);
  const [data, setdata] = useState("");
  const [showmodelupdate, setshowmodelupdate] = useState(false);
  const [delete_user, setdelete_user] = useState(false);
  const [url_to_delete, seturl_to_delete] = useState("");
  const [row_id, setrow_id] = useState("");
  const [isloading, setisloading] = useState(false);
  const [menu, setmenu] = useState({ value: "all", label: "All" });
  const [menulist, setmenulist] = useState([]);

  useEffect(() => {
    setisloading(true);
    dispatch({ type: "Set_table_history", data: [] });

    const fetchWorkouts = async () => {
      var url = `${route}/api/sub-categories/`;
      if (menu.value !== "all") {
        url = `${url}?category_id=${menu.value}`;
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
  }, [menu]);

  useEffect(() => {
    dispatch({ type: "Set_menuitem", data: "item" });
    const fetchmenus = async () => {
      dispatch({ type: "Set_table_history", data: [] });
      var url = `${route}/api/categories/`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        setisloading(false);
        const optmize = json.map((item) => {
          return { value: item.id, label: item.name };
        });

        setmenulist(optmize);
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
      fetchmenus();
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
          className="border border-danger rounded me-2"
          onClick={() => {
            setrow_id(row.id);
            seturl_to_delete(`${route}/api/sub-categories/${row.id}/`);
            setdelete_user(true);
          }}
        >
          <DeleteRoundedIcon className="m-1" color="error" fontSize="small" />
        </IconButton>

        <IconButton
          style={{ border: "1px solid #003049", borderRadius: "5px" }}
          onClick={() => {
            setdata(row);
            setshowmodelupdate(true);
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
      dataField: "category_name",
      text: t("Category"),
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "name",
      text: t("name"),
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
        { text: "Categories", style: "header" },
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
    pdfMake.createPdf(documentDefinition).download("categories.pdf");
  };

  const print = () => {
    const documentDefinition = makepdf();
    pdfMake.createPdf(documentDefinition).print();
  };

  const rowstyle = { height: "10px", paddingLeft: "30px" };

  return (
    <div className="p-3">
      <div className="card">
        <div className="card-header bg-white  d-flex justify-content-between ">
          <h1
            className="mb-3"
            style={{ fontSize: "1.3rem", fontWeight: "normal" }}
          >
            {t("Sub Category")}
          </h1>
          <Button
            type="button"
            className="mb-2"
            variant="outline-success"
            onClick={() => setshowmodel(!showmodel)}
          >
            <FontAwesomeIcon icon={faUserPlus} className="me-2" />
            {t("Add Submenu")}
          </Button>
        </div>

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
                <div className="col-md-2 mt-3">
                  <Select
                    options={[{ value: "all", label: "All" }, ...menulist]}
                    placeholder="Category"
                    value={menu}
                    funct={(e) => setmenu(e)}
                    required={true}
                  />
                </div>
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

      {showmodel && (
        <Subcategoriesform
          show={showmodel}
          onHide={() => setshowmodel(false)}
          user={user}
          route={route}
          callback={dispatch}
          selected_branch={selected_branch}
          menulist={menulist}
        />
      )}
      {showmodelupdate && (
        <Updatesubcategories
          show={showmodelupdate}
          onHide={() => setshowmodelupdate(false)}
          data={data}
          user={user}
          route={route}
          fun={custom_toast}
          callback={dispatch}
          menulist={menulist}
        />
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
    </div>
  );
}
