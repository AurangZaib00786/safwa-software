import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Select from "../alerts/select";
import { IconButton } from "@material-ui/core";
import InputGroup from "react-bootstrap/InputGroup";
import AddIcon from "@material-ui/icons/Add";
import Spinner from "react-bootstrap/Spinner";
import Red_toast from "../alerts/red_toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import TextField from "@mui/material/TextField";
import success_toast from "../alerts/success_toast";
import ClearIcon from "@material-ui/icons/Clear";

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
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Alert_before_delete from "../../Container/alertContainer";
import custom_toast from "../alerts/custom_toast";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import PrintIcon from "@material-ui/icons/Print";
import Overlay from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css";
import { DateRangePicker, defaultStaticRanges } from "react-date-range";
import {
  endOfDay,
  startOfYear,
  endOfYear,
  addMonths,
  addYears,
  isSameDay,
} from "date-fns";

export default function Materialissueform(props) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  const { t } = useTranslation();
  const { SearchBar } = Search;
  const { ExportCSVButton } = CSVExport;
  const user = props.state.setuser.user;
  const route = props.state.setuser.route;
  const selected_branch = props.state.Setcurrentinfo.selected_branch;
  const current_user = props.state.Setcurrentinfo.current_user;
  const all_stock = props.state.Settablehistory.table_history;
  const dispatch = props.Settable_history;

  const [id, setid] = useState("");
  const [check_update, setcheck_update] = useState(false);
  const [delete_user, setdelete_user] = useState(false);
  const [url_to_delete, seturl_to_delete] = useState("");
  const [row_id, setrow_id] = useState("");
  const [isloading, setisloading] = useState(false);
  var curr = new Date();
  var curdate = curr.toISOString().substring(0, 10);
  const [date, setdate] = useState(curdate);
  const [type, settype] = useState("");
  const [govthajj, setgovthajj] = useState("");
  const [pvthajj, setpvthajj] = useState("");
  const [extra, setextra] = useState("");
  const [staff, setstaff] = useState("");

  const [cooker, setcooker] = useState("");
  const [preparedby, setpreparedby] = useState("");
  const [incharge, setincharge] = useState("");
  const [approvedby, setapprovedby] = useState("");
  const [remarks, setremarks] = useState("");

  const [allemployee, setallemployee] = useState([]);

  const [allstock, setallstock] = useState([]);
  const [stock, setstock] = useState("");
  const [quantity, setquantity] = useState("");
  const [unit, setunit] = useState("");
  const [notes, setnotes] = useState("");

  const [data, setdata] = useState([]);

  const [dish, setdish] = useState("");
  const [alldish, setalldish] = useState([]);
  const [dishdata, setdishdata] = useState([]);

  const [start_date, setstart_date] = useState(
    addMonths(new Date(), -1).toISOString().substring(0, 10)
  );
  const [end_date, setend_date] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [show, setshow] = useState(false);
  const [target, setTarget] = useState(null);
  const ref = useRef(null);
  const [date_range, setdate_range] = useState([
    {
      startDate: addMonths(new Date(), -1),
      endDate: new Date(),
      key: "selection",
      showDateDisplay: "false",
    },
  ]);

  const handleSelect = (item) => {
    const get_date = item.selection;
    setdate_range([item.selection]);
    setstart_date(get_date.startDate.toISOString().substring(0, 10));
    setend_date(get_date.endDate.toISOString().substring(0, 10));
    if (
      get_date.startDate.toISOString().substring(0, 10) !==
      get_date.endDate.toISOString().substring(0, 10)
    ) {
      setshow(!show);
    }
  };

  useEffect(() => {
    dispatch({ type: "Set_table_history", data: [] });
    setisloading(true);

    const fetchWorkouts = async () => {
      var url = `${route}/api/issued-stock/?account_head=${selected_branch.id}&start_date=${start_date}&end_date=${end_date}`;

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
          Red_toast(`${json[error[0]]}`);
        }
        setisloading(false);
      }
    };

    if (user) {
      fetchWorkouts();
    }
  }, [selected_branch, date_range]);

  useEffect(() => {
    const fetchemployee = async () => {
      var url = `${route}/api/employee/`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        const optimize = json.map((item) => {
          return { value: item.id, label: item.name };
        });

        setallemployee(optimize);
      }
    };

    const fetchdishes = async () => {
      var url = `${route}/api/dishes/`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        const optimize = json.map((item) => {
          return { value: item.id, label: item.name };
        });

        setalldish(optimize);
      }
    };

    if (user) {
      fetchemployee();
      fetchdishes();
    }
  }, []);

  useEffect(() => {
    const fetchmaterial = async () => {
      var url = `${route}/api/stock/?account_head=${selected_branch.id}`;

      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      const json = await response.json();

      if (response.ok) {
        const optimize = json.map((item) => {
          return {
            value: item,
            label: `${item.product_name}`,
          };
        });

        setallstock(optimize);
      }
    };
    if (user) {
      fetchmaterial();
    }
  }, [selected_branch]);

  const handlesubmit = async (e) => {
    e.preventDefault();

    const optimizedata = data.map((item) => {
      return {
        ...item,
        stock: item.stock.id,
      };
    });

    const optimizedishdata = dishdata.map((item) => {
      return {
        ...item,
        dish: item.dish.value,
      };
    });

    const response = await fetch(`${route}/api/issued-stock/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.access}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_details: optimizedata,
        dish_details: optimizedishdata,
        date: date,
        meal_type: type.value,
        govt_hujjaj: govthajj,
        private_hujjaj: pvthajj,
        staff: staff,
        extra: extra,
        remarks: remarks,
        cook: cooker.value,
        prepared_by: preparedby.value,
        approved_by: approvedby.value,
        store_incharge: incharge.value,
        account_head: selected_branch.id,
        user: current_user.id,
      }),
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
      success_toast();
      setdata([]);
      setdishdata([]);
      setdate(curdate);
      settype("");
      setgovthajj("");
      setpvthajj("");
      setextra("");
      setstaff("");
      setcooker("");
      setpreparedby("");
      setincharge("");
      setapprovedby("");
      setremarks("");
    }
  };

  const handleupdate = async (e) => {
    e.preventDefault();

    const optimizedata = data.map((item) => {
      return {
        ...item,
        stock: item.stock.id,
      };
    });

    const optimizedishdata = dishdata.map((item) => {
      return {
        ...item,
        dish: item.dish.value,
      };
    });

    const response = await fetch(`${route}/api/issued-stock/${id}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${user.access}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_details: optimizedata,
        dish_details: optimizedishdata,
        date: date,
        meal_type: type.value,
        govt_hujjaj: govthajj,
        private_hujjaj: pvthajj,
        staff: staff,
        extra: extra,
        remarks: remarks,
        cook: cooker.value,
        prepared_by: preparedby.value,
        approved_by: approvedby.value,
        store_incharge: incharge.value,
      }),
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
      success_toast();
      setdata([]);
      setdishdata([]);
      setdate(curdate);
      settype("");
      setgovthajj("");
      setpvthajj("");
      setextra("");
      setstaff("");
      setcooker("");
      setpreparedby("");
      setincharge("");
      setapprovedby("");
      setremarks("");
      setcheck_update(false);
    }
  };

  const handleaddclick = (e) => {
    e.preventDefault();

    const optimize = data.filter((item) => {
      return item.stock.id === stock.value.id;
    });
    if (optimize.length > 0) {
      let pitem = optimize.shift();
      let newdata = data.map((item) => {
        if (item.stock.id === pitem.stock.id) {
          item["quantity"] = parseInt(pitem.quantity) + parseInt(quantity);

          return item;
        } else {
          return item;
        }
      });
      setdata(newdata);
    } else {
      setdata([
        ...data,
        {
          stock: stock.value,
          quantity: quantity,
          remarks: notes,
        },
      ]);
    }

    setstock("");
    setquantity("");
    setnotes("");
  };

  const handleadddishclick = (e) => {
    e.preventDefault();

    const optimize = dishdata.filter((item) => {
      return item.dish.value === dish.value;
    });
    if (optimize.length > 0) {
      Red_toast("Dish already Selected !");
    } else {
      setdishdata([
        ...dishdata,
        {
          dish: dish,
        },
      ]);
    }

    setdish("");
  };

  const handlesavequantitychange = (value, row) => {
    const optimize = data.map((item) => {
      if (item.stock.value.id == row.stock.value.id) {
        item["quantity"] = value;
        return item;
      }
      return item;
    });
    setdata(optimize);
  };

  const handledelete = (stock) => {
    const optimize = data.filter((item) => {
      return item.stock.value.id !== stock.value.id;
    });
    setdata(optimize);
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
            setrow_id(row.id);
            seturl_to_delete(`${route}/api/issued-stock/${row.id}/`);
            setdelete_user(true);
          }}
        >
          <DeleteRoundedIcon className="m-1" color="error" fontSize="small" />
        </IconButton>

        <IconButton
          style={{ border: "1px solid #003049", borderRadius: "5px" }}
          onClick={() => {
            setdate(row.date);
            settype({ value: row.meal_type, label: row.meal_type });
            setgovthajj(row.govt_hujjaj);
            setpvthajj(row.private_hujjaj);
            setextra(row.extra);
            setstaff(row.staff);
            setcooker({ value: row.cook, label: row.cook_name });
            setpreparedby({
              value: row.prepared_by,
              label: row.prepared_by_name,
            });
            setincharge({
              value: row.store_incharge,
              label: row.store_incharge_name,
            });
            setapprovedby({
              value: row.approved_by,
              label: row.approved_by_name,
            });
            setremarks(row.remarks);

            setdishdata(
              row.dish_details.map((item) => {
                return {
                  ...item,
                  dish: { value: item.dish, label: item.dish_name },
                };
              })
            );
            setdata(
              row.product_details.map((item) => {
                return {
                  ...item,
                  stock: {
                    id: item.stock,
                    product_name: item.stock_name,
                    unit_name: item.unit_name,
                  },
                };
              })
            );
            setcheck_update(true);
            setid(row.id);
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
      dataField: "date",
      text: "Date",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "meal_type",
      text: "Meal",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "govt_hujjaj",
      text: "Govt. Hajj",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "private_hujjaj",
      text: "Pvt.Hajj",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "extra",
      text: "Extra",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "staff",
      text: "Staff",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "cook_name",
      text: "Cook",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "prepared_by_name",
      text: "Prepared By",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "approved_by_name",
      text: "Approved By",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "store_incharge_name",
      text: "Incharge",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "remarks",
      text: "Remarks",
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
        value: all_stock.length,
      },
    ], // A numeric array is also available. the purpose of above example is custom the text
  };

  const makepdf = () => {
    const body = all_stock.map((item, index) => {
      return [index + 1, item.date, item.remarks, item.user_name];
    });
    body.splice(0, 0, ["#", "Date", "Remarks", "User"]);

    const documentDefinition = {
      content: [
        { text: "Stock Adjustment", style: "header" },
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
            widths: [30, "*", "*", "*"],
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
    pdfMake.createPdf(documentDefinition).download("Stock Adjustment.pdf");
  };

  const print = () => {
    const documentDefinition = makepdf();
    pdfMake.createPdf(documentDefinition).print();
  };

  const handleselectiochange = (e) => {
    setshow(!show);
    setTarget(e.target);
  };

  const rowstyle = { height: "10px", paddingLeft: "30px" };

  return (
    <div className="p-3 pt-2">
      <div className="card">
        <div className="card-header d-flex justify-content-between bg-white">
          <h3 className="mt-2 me-2">Stock Adjustment</h3>
          <div className="mt-2 me-2 d-flex flex-row-reverse">
            <Button
              variant="outline-primary"
              onClick={check_update ? handleupdate : handlesubmit}
              disabled={
                !(
                  data.length > 0 &&
                  dishdata.length > 0 &&
                  type &&
                  cooker &&
                  preparedby &&
                  approvedby &&
                  incharge
                )
              }
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
              <FontAwesomeIcon icon={faRotate} />{" "}
              {check_update ? "Update" : "Save"}
            </Button>
          </div>
        </div>

        <div className="card-body pt-0">
          <div>
            <div className="mt-3">
              {isloading && (
                <div className="text-center">
                  <Spinner animation="border" variant="primary" />
                </div>
              )}

              <div className="row d-sm-flex  align-items-center mt-md-3">
                <div className="col-6 col-md-3 pe-3">
                  <TextField
                    type="date"
                    className="form-control   mb-3"
                    label={"Date"}
                    InputLabelProps={{ shrink: true }}
                    value={date}
                    onChange={(e) => setdate(e.target.value)}
                    size="small"
                  />
                </div>
                <div className="col-6 col-md-3 pe-3">
                  <Select
                    options={[
                      { value: "Breakfast", label: "Breakfast" },
                      { value: "Lunch", label: "Lunch" },
                      { value: "Dinner", label: "Dinner" },
                    ]}
                    placeholder={"Type"}
                    value={type}
                    funct={(e) => settype(e)}
                    required={true}
                  />
                </div>
                <div className="col-6 col-md-3 pe-3">
                  <TextField
                    type="number"
                    className="form-control mb-3"
                    label={"Govt. Hajj"}
                    value={govthajj}
                    onChange={(e) => setgovthajj(e.target.value)}
                    size="small"
                  />
                </div>
                <div className="col-6 col-md-3 pe-3">
                  <TextField
                    type="number"
                    className="form-control mb-3"
                    label={"Pvt. Hajj"}
                    value={pvthajj}
                    onChange={(e) => setpvthajj(e.target.value)}
                    size="small"
                  />
                </div>
              </div>

              <div className="row d-sm-flex  align-items-center mt-md-3">
                <div className="col-6 col-md-3 pe-3">
                  <TextField
                    type="number"
                    className="form-control mb-3"
                    label={"Staff"}
                    value={staff}
                    onChange={(e) => setstaff(e.target.value)}
                    size="small"
                  />
                </div>
                <div className="col-6 col-md-3 pe-3">
                  <TextField
                    type="number"
                    className="form-control mb-3"
                    label={"Extra"}
                    value={extra}
                    onChange={(e) => setextra(e.target.value)}
                    size="small"
                  />
                </div>
                <div className="col-6 col-md-3 pe-3">
                  <Select
                    options={allemployee}
                    placeholder={"Cook Name"}
                    value={cooker}
                    funct={(e) => setcooker(e)}
                    required={true}
                  />
                </div>
                <div className="col-6 col-md-3 pe-3">
                  <Select
                    options={allemployee}
                    placeholder={"Prepared By"}
                    value={preparedby}
                    funct={(e) => setpreparedby(e)}
                    required={true}
                  />
                </div>
              </div>

              <div className="row d-sm-flex  align-items-center mt-md-3">
                <div className="col-6 col-md-3 pe-3">
                  <Select
                    options={allemployee}
                    placeholder={"Store Incharge"}
                    value={incharge}
                    funct={(e) => setincharge(e)}
                    required={true}
                  />
                </div>
                <div className="col-6 col-md-3 pe-3">
                  <Select
                    options={allemployee}
                    placeholder={"Approved By"}
                    value={approvedby}
                    funct={(e) => setapprovedby(e)}
                    required={true}
                  />
                </div>

                <div className="col-6 col-md-3 pe-3">
                  <TextField
                    multiline
                    className="form-control mb-3"
                    label={"Remarks"}
                    value={remarks}
                    onChange={(e) => setremarks(e.target.value)}
                    size="small"
                  />
                </div>
              </div>

              <div className=" d-sm-flex mb-4">
                <div className="col-md-8 me-md-5">
                  <table className="table">
                    <thead className="border-0">
                      <tr>
                        <th className="d-flex align-items-center border-0 p-0">
                          <h6 className="col-3 p-2 ps-0 pb-0 m-0">Stock</h6>

                          <h6 className=" col-2  p-2 pb-0 m-0">Unit</h6>

                          <h6 className="col-3 p-2 pb-0 m-0">Qty</h6>
                          <h6 className="col-4 p-2 pb-0 m-0">Remarks</h6>
                        </th>
                      </tr>
                      {data?.map((item) => {
                        return (
                          <tr key={item.stock.id}>
                            <th className="d-flex align-items-center p-0 border-0">
                              <div className="col-3">
                                <TextField
                                  className="form-control"
                                  size="small"
                                  value={item.stock.product_name}
                                />
                              </div>

                              <div className="col-2">
                                <TextField
                                  className="form-control"
                                  size="small"
                                  value={item.stock.unit_name}
                                />
                              </div>

                              <div className="col-3">
                                <TextField
                                  type="number"
                                  className="form-control"
                                  size="small"
                                  value={item.quantity}
                                  onChange={(e) => {
                                    handlesavequantitychange(
                                      e.target.value,
                                      item
                                    );
                                  }}
                                />
                              </div>
                              <div className="col-4">
                                <InputGroup>
                                  <TextField
                                    className="form-control"
                                    size="small"
                                    value={item.remarks}
                                  />

                                  <IconButton
                                    className="p-0 ps-2 pe-2"
                                    style={{
                                      backgroundColor: "red",
                                      borderRadius: "0",
                                    }}
                                    onClick={() => handledelete(item.stock)}
                                  >
                                    <ClearIcon
                                      style={{
                                        color: "white",
                                        height: "fit-content",
                                      }}
                                      fontSize="medium"
                                    />
                                  </IconButton>
                                </InputGroup>
                              </div>
                            </th>
                          </tr>
                        );
                      })}
                    </thead>
                    <tbody>
                      <tr>
                        <td className=" p-0 border-0">
                          <form onSubmit={handleaddclick} className="d-flex ">
                            <div className="col-3">
                              <Select
                                options={allstock}
                                placeholder={""}
                                value={stock}
                                funct={(e) => setstock(e)}
                                margin={true}
                                required={true}
                              />
                            </div>

                            <div className="col-2">
                              <TextField
                                placeholder={"Unit"}
                                size="small"
                                className="form-control"
                                value={stock?.value?.unit_name}
                                required
                              />
                            </div>

                            <div className="col-3">
                              <TextField
                                type="number"
                                placeholder={"Qty"}
                                size="small"
                                className="form-control"
                                value={quantity}
                                onChange={(e) => {
                                  setquantity(e.target.value);
                                }}
                                required
                              />
                            </div>
                            <div className="col-4">
                              <InputGroup>
                                <TextField
                                  placeholder={"Remarks"}
                                  size="small"
                                  className="form-control"
                                  value={notes}
                                  onChange={(e) => {
                                    setnotes(e.target.value);
                                  }}
                                />

                                <IconButton
                                  className="p-0 ps-2 pe-2"
                                  style={{
                                    backgroundColor: "#0d6efd",
                                    borderRadius: "0",
                                  }}
                                  type="submit"
                                >
                                  <AddIcon
                                    style={{
                                      color: "white",
                                      height: "fit-content",
                                    }}
                                    fontSize="medium"
                                  />
                                </IconButton>
                              </InputGroup>
                            </div>
                          </form>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="col-md-4 ">
                  <h6 className="col-6 p-2 ps-0 pb-0 m-0">Dishes</h6>

                  <div>
                    {dishdata?.map((item) => {
                      return (
                        <div key={item.dish.value} className="col-8">
                          <InputGroup>
                            <div className="col-10">
                              <TextField
                                className="form-control"
                                size="small"
                                value={item.dish.label}
                              />
                            </div>
                            <IconButton
                              className="p-0 ps-2 pe-2"
                              style={{
                                backgroundColor: "red",
                                borderRadius: "0",
                              }}
                              onClick={() => handledelete(item.stock)}
                            >
                              <ClearIcon
                                style={{
                                  color: "white",
                                  height: "fit-content",
                                }}
                                fontSize="medium"
                              />
                            </IconButton>
                          </InputGroup>
                        </div>
                      );
                    })}
                  </div>

                  <form onSubmit={handleadddishclick} className="col-8">
                    <InputGroup>
                      <div className="col-10">
                        <Select
                          options={alldish}
                          placeholder={""}
                          value={dish}
                          funct={(e) => setdish(e)}
                          margin={true}
                          required={true}
                        />
                      </div>
                      <IconButton
                        className="p-0 ps-2 pe-2"
                        style={{
                          backgroundColor: "#0d6efd",
                          borderRadius: "0",
                        }}
                        type="submit"
                      >
                        <AddIcon
                          style={{
                            color: "white",
                            height: "fit-content",
                          }}
                          fontSize="medium"
                        />
                      </IconButton>
                    </InputGroup>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-3">
        <div className="card-body pt-0">
          <ToolkitProvider
            keyField="id"
            data={all_stock}
            columns={columns}
            search
            exportCSV
          >
            {(props) => (
              <div>
                <div className="col-sm-6 d-sm-flex align-items-start mt-3">
                  <div className="col-sm-4  me-3">
                    {date_range[0].endDate.getFullYear() -
                      date_range[0].startDate.getFullYear() ===
                    10 ? (
                      <TextField
                        ref={ref}
                        type="button"
                        className="form-control  mb-3"
                        label={t("date")}
                        value="From Start"
                        onClick={handleselectiochange}
                        size="small"
                      />
                    ) : (
                      <TextField
                        ref={ref}
                        type="button"
                        className="form-control  mb-3 "
                        label={t("date")}
                        value={`${date_range[0].startDate
                          .toLocaleString("en-GB")
                          .substring(0, 10)} - ${date_range[0].endDate
                          .toLocaleString("en-GB")
                          .substring(0, 10)}`}
                        onClick={handleselectiochange}
                        size="small"
                      />
                    )}
                    <Overlay
                      show={show}
                      target={target}
                      placement="bottom-start"
                      container={ref}
                    >
                      <Popover id="popover-contained" className="pop_over">
                        <Popover.Body>
                          <div>
                            <DateRangePicker
                              onChange={handleSelect}
                              showSelectionPreview={true}
                              showCalendarPreview={false}
                              dragSelectionEnabled={true}
                              moveRangeOnFirstSelection={false}
                              months={2}
                              ranges={date_range}
                              direction="horizontal"
                              preventSnapRefocus={true}
                              calendarFocus="backwards"
                              staticRanges={[
                                ...defaultStaticRanges,
                                {
                                  label: "Last Year",
                                  range: () => ({
                                    startDate: startOfYear(
                                      addYears(new Date(), -1)
                                    ),
                                    endDate: endOfYear(
                                      addYears(new Date(), -1)
                                    ),
                                  }),
                                  isSelected(range) {
                                    const definedRange = this.range();
                                    return (
                                      isSameDay(
                                        range.startDate,
                                        definedRange.startDate
                                      ) &&
                                      isSameDay(
                                        range.endDate,
                                        definedRange.endDate
                                      )
                                    );
                                  },
                                },
                                {
                                  label: "This Year",
                                  range: () => ({
                                    startDate: startOfYear(new Date()),
                                    endDate: endOfDay(new Date()),
                                  }),
                                  isSelected(range) {
                                    const definedRange = this.range();
                                    return (
                                      isSameDay(
                                        range.startDate,
                                        definedRange.startDate
                                      ) &&
                                      isSameDay(
                                        range.endDate,
                                        definedRange.endDate
                                      )
                                    );
                                  },
                                },
                                {
                                  label: "From Start",
                                  range: () => ({
                                    startDate: startOfYear(
                                      addYears(new Date(), -10)
                                    ),
                                    endDate: endOfDay(new Date()),
                                  }),
                                  isSelected(range) {
                                    const definedRange = this.range();
                                    return (
                                      isSameDay(
                                        range.startDate,
                                        definedRange.startDate
                                      ) &&
                                      isSameDay(
                                        range.endDate,
                                        definedRange.endDate
                                      )
                                    );
                                  },
                                },
                              ]}
                            />
                          </div>
                        </Popover.Body>
                      </Popover>
                    </Overlay>
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
