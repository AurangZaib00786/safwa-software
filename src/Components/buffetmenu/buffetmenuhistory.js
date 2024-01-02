import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Red_toast from "../alerts/red_toast";
import Select from "../alerts/select";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, {
  Search,
  CSVExport,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import went_wrong_toast from "../alerts/went_wrong_toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import Spinner from "react-bootstrap/Spinner";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import PrintIcon from "@material-ui/icons/Print";

export default function Stock_table({
  user,
  route,
  selected_branch,
  current_user,
  setview_stock,
}) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  const { SearchBar } = Search;
  const { ExportCSVButton } = CSVExport;
  const [allmenu, setallmenu] = useState([]);
  const [menu, setmenu] = useState("");

  const [data, setdata] = useState([]);

  const [isloading, setisloading] = useState(false);

  useEffect(() => {
    const fetchWorkouts = async () => {
      setisloading(true);
      var url = `${route}/api/buffet-menus/?menu_id=${menu.value}`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        setisloading(false);

        setdata(json);
      }
      if (!response.ok) {
        went_wrong_toast();
        setisloading(false);
      }
    };

    if (menu) {
      fetchWorkouts();
    }
  }, [menu]);

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

    if (user) {
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

  const fix_formatter = (cell, row) => {
    return <div>{parseFloat(cell).toFixed(2)}</div>;
  };

  const columns = [
    { dataField: "id", text: "Id", hidden: true, headerFormatter: headerstyle },
    {
      dataField: "product_code",
      text: "Code",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "product_name",
      text: "Product",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "product_barcode",
      text: "Barcode",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "quantity",
      text: "Qty",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "purchase_rate",
      text: "Purchase Rate",
      sort: true,
      formatter: fix_formatter,
      headerFormatter: headerstyle,
    },
    {
      dataField: "offer_rate",
      text: "Offer Rate",
      sort: true,
      headerFormatter: headerstyle,
      formatter: fix_formatter,
    },
    {
      dataField: "sale_rate",
      text: "Sale Rate",
      sort: true,
      headerFormatter: headerstyle,
      formatter: fix_formatter,
    },
    {
      dataField: "offer",
      text: "Offer",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "scheme",
      text: "Scheme",
      sort: true,
      headerFormatter: headerstyle,
      formatter: fix_formatter,
    },
    {
      dataField: "percentage",
      text: "%",
      sort: true,
      headerFormatter: headerstyle,
      formatter: fix_formatter,
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
        value: data.length,
      },
    ], // A numeric array is also available. the purpose of above example is custom the text
  };

  const makepdf = () => {
    var body = data.map((item, index) => {
      return [
        index + 1,
        item.product_code,
        item.product_name,
        item.product_barcode,
        item.quantity,
        item.purchase_rate,
        item.offer_rate,
        item.sale_rate,
        item.offer,
        item.scheme,
        item.percentage,
      ];
    });

    body.splice(0, 0, [
      "#",
      "Code",
      "Product",
      "Barcode",
      "Qty",
      "Purchase Rate",
      "Offer Rate",
      "Sale Rate",
      "Offer",
      "Scheme",
      "%",
    ]);

    const documentDefinition = {
      content: [
        { text: "Stock", style: "header" },
        { text: `Project Name: ${selected_branch.name}`, style: "body" },
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
            widths: [50, "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
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
          fontSize: 7,
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
    pdfMake.createPdf(documentDefinition).download("Stock.pdf");
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
            Stock
          </h1>
          <Button
            type="button"
            className="mb-2"
            variant="outline-success"
            onClick={setview_stock}
          >
            <FontAwesomeIcon className="me-2" icon={faRotate} />
            Update Menu
          </Button>
        </div>

        <div className="card-body pt-0">
          <ToolkitProvider
            keyField="id"
            data={data}
            columns={columns}
            search
            exportCSV
          >
            {(props) => (
              <div>
                <div className="row mt-3">
                  <div className="col-md-2 me-2">
                    <Select
                      options={allmenu}
                      placeholder="Menu"
                      value={menu}
                      funct={(e) => setmenu(e)}
                    />
                  </div>
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
    </div>
  );
}
