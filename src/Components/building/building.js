import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import "./building.css";
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
import went_wrong_toast from "../alerts/went_wrong_toast";
import success_toast from "../alerts/success_toast";
import Save_button from "../buttons/save_button";
import Select from "react-select";
import TextField from "@mui/material/TextField";
import custom_toast from "../alerts/custom_toast";
import AddIcon from "@material-ui/icons/Add";
import Spinner from "react-bootstrap/Spinner";
import Alert_before_delete from "../../Container/alertContainer";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import PrintIcon from "@material-ui/icons/Print";
import { useTranslation } from "react-i18next";

export default function Building(props) {
  const { t } = useTranslation();
  const user = props.state.setuser.user;
  const route = props.state.setuser.route;
  const selected_branch = props.state.Setcurrentinfo.selected_branch;
  const current_user = props.state.Setcurrentinfo.current_user;
  const all_customers = props.state.Settablehistory.table_history;
  const dispatch = props.Settable_history;
  const { SearchBar } = Search;
  const { ExportCSVButton } = CSVExport;
  const settings = props.state.Setcurrentinfo.settings;

  const [id, setid] = useState("");
  const [check_update, setcheck_update] = useState(false);
  const [delete_user, setdelete_user] = useState(false);
  const [url_to_delete, seturl_to_delete] = useState("");
  const [row_id, setrow_id] = useState("");

  const [building_number, setbuilding_number] = useState("");
  const [capacity, setcapacity] = useState("");
  const [opening_date, setopening_date] = useState("");
  const [closing_date, setclosing_date] = useState("");

  const [isloading, setisloading] = useState(false);

  useEffect(() => {
    dispatch({ type: "Set_table_history", data: [] });
    setisloading(true);
    dispatch({ type: "Set_menuitem", data: "building" });
    const fetchWorkouts = async () => {
      var url = `${route}/api/buildings/`;

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
  }, [selected_branch]);

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
            seturl_to_delete(`${route}/api/buildings/${row.id}/`);
            setdelete_user(true);
          }}
        >
          <DeleteRoundedIcon className="m-1" color="error" fontSize="small" />
        </IconButton>

        <IconButton
          style={{ border: "1px solid #003049", borderRadius: "5px" }}
          onClick={() => {
            setbuilding_number(row.building_number);
            setcapacity(row.capacity);
            setopening_date(row.opening_date);
            setclosing_date(row.closing_date);

            setid(row.id);
            setcheck_update(true);
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
      dataField: "building_number",
      text: "Number",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "capacity",
      text: "Capacity",
      sort: true,
      headerFormatter: headerstyle,
    },

    {
      dataField: "opening_date",
      text: "Opening Date",
      sort: true,
      headerFormatter: headerstyle,
    },

    {
      dataField: "closing_date",
      text: "Closing Date",
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
      return [
        index + 1,
        item.building_number,
        item.capacity,
        item.opening_date,
        item.closing_date,
      ];
    });
    body.splice(0, 0, [
      "#",
      "Number",
      "Capacity",
      "Opening Date",
      "Closing Date",
    ]);

    const documentDefinition = {
      content: [
        { text: "Buildings", style: "header" },
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
            widths: [30, "*", "*", "*", "*"],
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
    };
    return documentDefinition;
  };

  const download = () => {
    const documentDefinition = makepdf();
    pdfMake.createPdf(documentDefinition).download("Building.pdf");
  };

  const print = () => {
    const documentDefinition = makepdf();
    pdfMake.createPdf(documentDefinition).print();
  };

  const rowstyle = { height: "10px", paddingLeft: "30px" };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isloading) {
      setisloading(true);
      const formData = new FormData();
      formData.append("building_number", building_number);
      formData.append("capacity", capacity);
      formData.append("opening_date", opening_date);
      formData.append("closing_date", closing_date);

      const response = await fetch(`${route}/api/buildings/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.access}`,
        },
        body: formData,
      });
      const json = await response.json();

      if (!response.ok) {
        setisloading(false);
        went_wrong_toast();
      }

      if (response.ok) {
        dispatch({ type: "Create_table_history", data: json });
        setisloading(false);
        success_toast();

        setbuilding_number("");
        setcapacity("");
        setclosing_date("");
        setopening_date("");
      }
    }
  };

  const handleSubmit_update = async (e) => {
    e.preventDefault();
    if (!isloading) {
      setisloading(true);
      const formData = new FormData();
      formData.append("building_number", building_number);
      formData.append("capacity", capacity);
      formData.append("opening_date", opening_date);
      formData.append("closing_date", closing_date);
      const response = await fetch(`${route}/api/buildings/${id}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${user.access}`,
        },
        body: formData,
      });
      const json = await response.json();

      if (!response.ok) {
        setisloading(false);
        went_wrong_toast();
      }

      if (response.ok) {
        dispatch({ type: "Update_table_history", data: json });
        setisloading(false);
        success_toast();

        setbuilding_number("");
        setcapacity("");
        setclosing_date("");
        setopening_date("");
        setid("");
        setcheck_update(false);
      }
    }
  };

  const selectStyles = {
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };

  return (
    <div className="p-3 pt-2">
      <div className="card">
        <form onSubmit={check_update ? handleSubmit_update : handleSubmit}>
          <div className="card-header d-flex justify-content-between bg-white">
            <h3 className="mt-2 me-2">Add Buildings</h3>
            <div className="mt-2 me-2 d-flex flex-row-reverse">
              <Save_button isloading={isloading} />
            </div>
          </div>

          <div className="card-body pt-0">
            <div className="mt-4">
              <div className="row">
                <div className="col-md-3">
                  <TextField
                    className="form-control   mb-3"
                    label={"Building No."}
                    value={building_number}
                    onChange={(e) => {
                      setbuilding_number(e.target.value);
                    }}
                    size="small"
                    required
                    autoFocus
                  />
                </div>
                <div className="col-md-3">
                  <TextField
                    type="number"
                    className="form-control  mb-3"
                    label={"Capacity"}
                    value={capacity}
                    onChange={(e) => {
                      setcapacity(e.target.value);
                    }}
                    size="small"
                    required
                  />
                </div>

                <div className="col-md-3">
                  <TextField
                    type="date"
                    className="form-control  mb-3"
                    label={"Opening date"}
                    value={opening_date}
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => {
                      setopening_date(e.target.value);
                    }}
                    size="small"
                    required
                  />
                </div>

                <div className="col-md-3">
                  <TextField
                    type="date"
                    className="form-control  mb-3"
                    label={"Closing date"}
                    InputLabelProps={{ shrink: true }}
                    value={closing_date}
                    onChange={(e) => {
                      setclosing_date(e.target.value);
                    }}
                    size="small"
                  />
                </div>
              </div>
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
