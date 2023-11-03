import React, { useState, useEffect, useRef } from "react";
import Widget from "./widget";
import "./dashboard.css";
import LocalAtmIcon from "@material-ui/icons/LocalAtm";
import LocalOfferOutlinedIcon from "@material-ui/icons/LocalOfferOutlined";
import ShoppingCartOutlinedIcon from "@material-ui/icons/ShoppingCartOutlined";
import AssessmentOutlinedIcon from "@material-ui/icons/AssessmentOutlined";
import TrendingDownOutlinedIcon from "@material-ui/icons/TrendingDownOutlined";
import { ResponsiveContainer } from "recharts";
import {
  PieChart,
  Pie,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell,
  ComposedChart,
  LabelList,
  Brush,
  ErrorBar,
} from "recharts";
import AttachMoneyOutlinedIcon from "@material-ui/icons/AttachMoneyOutlined";
import { useTranslation } from "react-i18next";
import { TextField } from "@material-ui/core";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css";
import {
  DateRangePicker,
  DefinedRange,
  defaultStaticRanges,
  staticRanges,
} from "react-date-range";
import Overlay from "react-bootstrap/Overlay";
import Tooltipp from "react-bootstrap/Tooltip";
import {
  endOfDay,
  startOfYear,
  endOfYear,
  addMonths,
  addYears,
  isSameDay,
} from "date-fns";

function Dashboard(props) {
  const { t } = useTranslation();
  const settings = props.state.Setcurrentinfo.settings;
  const [dashboard_data, setdashboard_data] = useState({
    sale_sb: 0.0,
    sale_sr: 0.0,
    net_sale: 0.0,
    purchase_pb: 0.0,
    purchase_pr: 0.0,
    net_purchase: 0.0,
    margin: 0.0,
    expense: 0.0,
    profit: 0.0,
    cash_in: 0.0,
    cash_out: 0.0,
    cash: 0.0,
    stock_cost: 0.0,
    stock_value: 0.0,
    top_selling_items: [],
    warning_stock: [],
    account_payable: 0,
    account_recievable: 0,
    balance: 0,
  });
  const user = props.state.setuser.user;
  const route = props.state.setuser.route;
  const selected_branch = props.state.Setcurrentinfo.selected_branch;
  const current_user = props.state.Setcurrentinfo.current_user;
  const dispatch = props.Settable_history;

  const [yearly_sale, setyearly_sale] = useState([]);

  const [yearly_purchase, setyearly_purchase] = useState([]);
  const [piechartdata, setpiechartdata] = useState([]);
  const [weekly_data, setweekly_data] = useState([]);

  const [start_date, setstart_date] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [end_date, setend_date] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [show, setshow] = useState(false);
  const [target, setTarget] = useState(null);
  const ref = useRef(null);
  const [date_range, setdate_range] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
      showDateDisplay: "false",
    },
  ]);

  useEffect(() => {
    dispatch({ type: "Set_menuitem", data: "dashboard" });
  }, []);

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

  const handleselectiochange = (e) => {
    setshow(!show);
    setTarget(e.target);
  };

  const componentRef = useRef();
  useEffect(() => {
    const fetchweekly = async () => {
      var url = `${route}/api/last-week-sale/?account_head=${selected_branch.id}`;
      if (!settings?.user_base?.account_base) {
        if (current_user?.profile.user_type === "user") {
          url = `${route}/api/last-week-sale/?user_id=${current_user?.profile?.parent_user}`;
        } else {
          url = `${route}/api/last-week-sale/?user_id=${current_user?.id}`;
        }
      }
      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });

      const json = await response.json();

      if (response.ok) {
        const optimize = json.dates.map((item, index) => {
          const fixed_sale = parseFloat(json.total_sales[index].toFixed(2));
          const fixed_invoice = parseFloat(
            json.total_invoices[index].toFixed(2)
          );
          return { name: item, Sales: fixed_sale, Invoices: fixed_invoice };
        });
        setweekly_data(optimize);
      }
    };

    const fetchsaleyearly = async () => {
      var url = `${route}/api/last-year-sale/?account_head=${selected_branch.id}`;
      if (!settings?.user_base?.account_base) {
        if (current_user?.profile.user_type === "user") {
          url = `${route}/api/last-year-sale/?user_id=${current_user?.profile?.parent_user}`;
        } else {
          url = `${route}/api/last-year-sale/?user_id=${current_user?.id}`;
        }
      }
      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });

      const json = await response.json();

      if (response.ok) {
        const optimize = json.months.map((item, index) => {
          const fixed_sale = parseFloat(json.total_sales[index].toFixed(2));
          const fixed_invoice = parseFloat(
            json.total_invoices[index].toFixed(2)
          );
          return { name: item, Sales: fixed_sale, Invoices: fixed_invoice };
        });
        setyearly_sale(optimize);
      }
    };

    const fetchpurchaseyearly = async () => {
      var url = `${route}/api/last-year-purchase/?account_head=${selected_branch.id}`;
      if (!settings?.user_base?.account_base) {
        if (current_user?.profile.user_type === "user") {
          url = `${route}/api/last-year-purchase/?user_id=${current_user?.profile?.parent_user}`;
        } else {
          url = `${route}/api/last-year-purchase/?user_id=${current_user?.id}`;
        }
      }
      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });

      const json = await response.json();

      if (response.ok) {
        const optimize = json.months.map((item, index) => {
          const fixed_sale = parseFloat(json.total_purchases[index].toFixed(2));
          const fixed_invoice = parseFloat(
            json.total_invoices[index].toFixed(2)
          );
          return { name: item, Purchases: fixed_sale, Invoices: fixed_invoice };
        });
        setyearly_purchase(optimize);
      }
    };

    const fetchpiedata = async () => {
      var url = `${route}/api/stock-by-company/?account_head=${selected_branch.id}`;
      if (!settings?.user_base?.account_base) {
        if (current_user?.profile.user_type === "user") {
          url = `${route}/api/stock-by-company/?user_id=${current_user?.profile?.parent_user}`;
        } else {
          url = `${route}/api/stock-by-company/?user_id=${current_user?.id}`;
        }
      }
      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });

      const json = await response.json();

      if (response.ok) {
        const optimize = json.map((item, index) => {
          var cost = item.cost;
          if (item.cost < 0) {
            cost = 0;
          }
          return { name: item.product__company__name, value: cost };
        });

        optimize.splice(0, 0, ["Company", "Stock"]);

        setpiechartdata(optimize);
      }
    };

    if (selected_branch && current_user && settings) {
      fetchweekly();
      fetchsaleyearly();
      fetchpurchaseyearly();
      fetchpiedata();
    }
  }, [selected_branch, settings]);

  useEffect(() => {
    const fetchdashboarddata = async () => {
      var url = `${route}/api/dashboard/?account_head=${selected_branch.id}&start_date=${start_date}&end_date=${end_date}`;
      if (!settings?.user_base?.account_base) {
        if (current_user?.profile.user_type === "user") {
          url = `${route}/api/dashboard/?user_id=${current_user?.profile?.parent_user}&start_date=${start_date}&end_date=${end_date}`;
        } else {
          url = `${route}/api/dashboard/?user_id=${current_user?.id}&start_date=${start_date}&end_date=${end_date}`;
        }
      }
      const response = await fetch(`${url}`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });

      const json = await response.json();

      if (response.ok) {
        setdashboard_data(json.resut);
      }
    };

    if (selected_branch && settings && current_user) {
      fetchdashboarddata();
    }
  }, [selected_branch, settings, date_range]);

  const options = {
    annotations: {
      textStyle: {
        color: "black",
      },
    },
    chartArea: { width: "90%" },
    series: {
      0: { targetAxisIndex: 0, type: "bars" },
      1: { targetAxisIndex: 1, type: "bars" },
    },
    hAxis: {
      format: "short",
      gridlines: {
        1: { color: "transparent" }, // Hide gridlines for axis 1
      },
    },
  };

  const renderCustomBarLabel = ({ payload, x, y, width, height, value }) => {
    if (value !== 0) {
      return (
        <text
          x={x + width / 2}
          y={y}
          fill="#666"
          textAnchor="middle"
          dy={-6}
          fontWeight={"bold"}
        >
          {value}
        </text>
      );
    }
  };
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const DataFormater = (number) => {
    const num = parseInt(number);
    if (num > 1000000000) {
      return (num / 1000000000).toString() + "B";
    } else if (num > 1000000) {
      return (num / 1000000).toString() + "M";
    } else if (num > 1000) {
      return (num / 1000).toString() + "K";
    } else {
      return num.toString();
    }
  };

  return (
    <div className="p-3">
      <div className="d-flex justify-content-end pe-2">
        <div className=" col-5 col-md-2">
          {date_range[0].endDate.getFullYear() -
            date_range[0].startDate.getFullYear() ===
          10 ? (
            <TextField
              ref={ref}
              type="button"
              style={{
                backgroundColor: "rgb(241, 245, 245)",
              }}
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
              style={{
                backgroundColor: "rgb(241, 245, 245)",
              }}
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
            placement="bottom"
            container={ref}
          >
            {(props) => (
              <Tooltipp id="overlay-example" {...props}>
                <div>
                  <DefinedRange
                    onChange={handleSelect}
                    showSelectionPreview={true}
                    showCalendarPreview={false}
                    dragSelectionEnabled={true}
                    moveRangeOnFirstSelection={false}
                    months={2}
                    ranges={date_range}
                    direction="vertcal"
                    preventSnapRefocus={true}
                    calendarFocus="backwards"
                    staticRanges={[
                      ...defaultStaticRanges,
                      {
                        label: "Last Year",
                        range: () => ({
                          startDate: startOfYear(addYears(new Date(), -1)),
                          endDate: endOfYear(addYears(new Date(), -1)),
                        }),
                        isSelected(range) {
                          const definedRange = this.range();
                          return (
                            isSameDay(
                              range.startDate,
                              definedRange.startDate
                            ) && isSameDay(range.endDate, definedRange.endDate)
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
                            ) && isSameDay(range.endDate, definedRange.endDate)
                          );
                        },
                      },
                      {
                        label: "From Start",
                        range: () => ({
                          startDate: startOfYear(addYears(new Date(), -10)),
                          endDate: endOfDay(new Date()),
                        }),
                        isSelected(range) {
                          const definedRange = this.range();
                          return (
                            isSameDay(
                              range.startDate,
                              definedRange.startDate
                            ) && isSameDay(range.endDate, definedRange.endDate)
                          );
                        },
                      },
                    ]}
                  />
                </div>
              </Tooltipp>
            )}
          </Overlay>
        </div>
      </div>

      <div className="row  p-2 pb-0">
        <div className="col-6 col-sm-2  mb-1">
          <Widget
            text_1={"Net Sale"}
            text_2={"Sale"}
            text_3={"Return"}
            value_1={parseInt(dashboard_data.net_sale)}
            value_2={parseInt(dashboard_data.sale_sb)}
            value_3={parseInt(dashboard_data.sale_sr)}
            icon_widget={<LocalAtmIcon fontSize="inherit" />}
            link="/sale_page"
            color="royalblue"
          />
        </div>
        <div className="col-6 col-sm-2 mb-1">
          <Widget
            text_1={"Net Purchase"}
            text_2={"Purchase"}
            text_3={"Return"}
            value_1={parseInt(dashboard_data.net_purchase)}
            value_2={parseInt(dashboard_data.purchase_pb)}
            value_3={parseInt(dashboard_data.purchase_pr)}
            icon_widget={<ShoppingCartOutlinedIcon fontSize="inherit" />}
            link="/purchase_page"
            color="#28a745"
          />
        </div>

        <div className="col-6 col-sm-2">
          <Widget
            text_1={"Cash"}
            text_2={"Cash In"}
            text_3={"Cash Out"}
            value_1={parseInt(dashboard_data.cash)}
            value_2={parseInt(dashboard_data.cash_in)}
            value_3={parseInt(dashboard_data.cash_out)}
            icon_widget={<AttachMoneyOutlinedIcon fontSize="inherit" />}
            link="/payments"
            color="#17a2b8"
          />
        </div>

        <div className="col-6 col-sm-2 mb-1">
          <Widget
            text_1={"Profit"}
            text_2={"Expense"}
            text_3={"Margin"}
            value_1={parseInt(dashboard_data.profit)}
            value_2={parseInt(dashboard_data.expense)}
            value_3={parseInt(dashboard_data.margin)}
            icon_widget={<AssessmentOutlinedIcon fontSize="inherit" />}
            link="/reports"
            color="#dc3545"
          />
        </div>

        <div className="col-6 col-sm-2 mb-1">
          <Widget
            text_1={"Stock Value"}
            text_2={"Stock Value"}
            text_3={"Stock Cost"}
            value_1={parseInt(dashboard_data.stock_value)}
            value_2={parseInt(dashboard_data.stock_value)}
            value_3={parseInt(dashboard_data.stock_cost)}
            icon_widget={<LocalOfferOutlinedIcon fontSize="inherit" />}
            link="/products"
            color="MediumSeaGreen"
          />
        </div>
        <div className="col-6 col-sm-2 mb-1">
          <Widget
            text_1={"Balance"}
            text_2={"Payable "}
            text_3={"Receivable"}
            value_1={parseInt(dashboard_data.balance)}
            value_2={parseInt(dashboard_data.account_payable)}
            value_3={parseInt(dashboard_data.account_recievable)}
            icon_widget={<TrendingDownOutlinedIcon fontSize="inherit" />}
            link="/expenses"
            color="SlateBlue"
          />
        </div>
      </div>

      <div className=" row p-2    mt-3">
        <div className="col-sm-6">
          <div className="card">
            <div className=" card-header bg-white">{"Last Week Sale "}</div>
            <div className=" card-body">
              <ResponsiveContainer height={400} width="100%">
                <BarChart
                  data={weekly_data}
                  margin={{ right: 10, left: 10, bottom: 50 }}
                >
                  <CartesianGrid
                    vertical={false}
                    horizontal={false}
                    stroke="gray"
                  />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" />
                  <YAxis
                    allowDataOverflow={false}
                    yAxisId="left"
                    label={{
                      value: "Sales",
                      angle: -90,
                      position: "insideLeft",
                    }}
                    domain={[0, 5000]}
                    tickFormatter={DataFormater}
                  />
                  <YAxis
                    allowDataOverflow={false}
                    yAxisId="right"
                    orientation="right"
                    label={{
                      value: "Invoice",
                      angle: 90,
                      position: "insideRight",
                    }}
                    domain={[0, 10]}
                    tickFormatter={DataFormater}
                  />

                  <Legend
                    layout="horizontal"
                    verticalAlign="top"
                    align="center"
                  />

                  <Bar
                    dataKey="Sales"
                    barSize={20}
                    fill="#318fb5"
                    yAxisId="left"
                    label={renderCustomBarLabel}
                  ></Bar>
                  <Bar
                    dataKey="Invoices"
                    barSize={20}
                    fill="#b0cac7"
                    yAxisId="right"
                    label={renderCustomBarLabel}
                  ></Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="card">
            <div className=" card-header bg-white">Most Selling Products</div>
            <div
              className="card-body"
              style={{ height: "430px", overflow: "auto" }}
            >
              <table className="table w-100">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Sold Qty</th>
                  </tr>
                </thead>
                <tbody style={{ height: "320px", overflow: "auto" }}>
                  {dashboard_data.top_selling_items.map((item) => {
                    return (
                      <tr style={{ height: "10px" }}>
                        <td>{item.stock__product__name}</td>
                        <td>{item.total_sold}</td>
                      </tr>
                    );
                  })}
                  <tr
                    style={{
                      height: "-40",
                    }}
                  ></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className=" row p-2    mt-3">
        <div className="col-sm-6">
          <div className="card">
            <div className=" card-header bg-white">Companies Stock</div>
            <div className=" card-body">
              <ResponsiveContainer height={400} width="100%">
                <PieChart>
                  <Pie
                    data={piechartdata}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {piechartdata.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend layout="vertical" verticalAlign="top" align="right" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-sm-6">
          <div className="card">
            <div className=" card-header bg-white">Stock Warning !</div>
            <div
              className="card-body"
              style={{ height: "430px", overflow: "auto" }}
            >
              <table className="table w-100">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody style={{ height: "320px", overflow: "auto" }}>
                  {dashboard_data.warning_stock.map((item) => {
                    return (
                      <tr style={{ height: "10px" }}>
                        <td>{item.product__name}</td>
                        <td>{item.quantity}</td>
                      </tr>
                    );
                  })}
                  <tr
                    style={{
                      height: "-40",
                    }}
                  ></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="row col-sm-12 p-2 mt-3">
        <div className="card ">
          <div className=" card-header bg-white">{"Monthly Sale"}</div>
          <div className=" card-body">
            <ResponsiveContainer height={400} width="100%">
              <BarChart
                data={yearly_sale}
                margin={{ right: 10, left: 10, bottom: 50 }}
              >
                <CartesianGrid
                  vertical={false}
                  horizontal={false}
                  stroke="gray"
                />
                <XAxis dataKey="name" angle={-45} textAnchor="end" />
                <YAxis
                  allowDataOverflow={false}
                  yAxisId="left"
                  label={{
                    value: "Sales",
                    angle: -90,
                    position: "insideLeft",
                  }}
                  domain={[0, 5000]}
                  tickFormatter={DataFormater}
                />
                <YAxis
                  allowDataOverflow={false}
                  yAxisId="right"
                  orientation="right"
                  label={{
                    value: "Invoice",
                    angle: 90,
                    position: "insideRight",
                  }}
                  domain={[0, 10]}
                  tickFormatter={DataFormater}
                />

                <Legend
                  layout="horizontal"
                  verticalAlign="top"
                  align="center"
                />
                <Bar
                  dataKey="Sales"
                  barSize={50}
                  fill="#318fb5"
                  yAxisId="left"
                  label={renderCustomBarLabel}
                ></Bar>
                <Bar
                  dataKey="Invoices"
                  barSize={50}
                  fill="#b0cac7"
                  yAxisId="right"
                  label={renderCustomBarLabel}
                ></Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="row col-sm-12 p-2 mt-3">
        <div className="col-sm-12">
          <div className="card">
            <div className=" card-header bg-white">Monthly Purchase</div>
            <div className=" card-body">
              <ResponsiveContainer height={400} width="100%">
                <BarChart
                  data={yearly_purchase}
                  margin={{ right: 10, left: 10, bottom: 50 }}
                >
                  <CartesianGrid
                    vertical={false}
                    horizontal={false}
                    stroke="gray"
                  />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" />
                  <YAxis
                    allowDataOverflow={false}
                    yAxisId="left"
                    label={{
                      value: "Purchases",
                      angle: -90,
                      position: "insideLeft",
                    }}
                    domain={[0, 5000]}
                    tickFormatter={DataFormater}
                  />
                  <YAxis
                    allowDataOverflow={false}
                    yAxisId="right"
                    orientation="right"
                    label={{
                      value: "Invoice",
                      angle: 90,
                      position: "insideRight",
                    }}
                    domain={[0, 10]}
                    tickFormatter={DataFormater}
                  />

                  <Legend
                    layout="horizontal"
                    verticalAlign="top"
                    align="center"
                  />
                  <Bar
                    dataKey="Purchases"
                    barSize={50}
                    fill="#318fb5"
                    yAxisId="left"
                    label={renderCustomBarLabel}
                  ></Bar>
                  <Bar
                    dataKey="Invoices"
                    barSize={50}
                    fill="#b0cac7"
                    yAxisId="right"
                    label={renderCustomBarLabel}
                  ></Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
