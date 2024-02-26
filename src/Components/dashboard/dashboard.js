import React, { useState, useRef } from "react";
import "./dashboard.css";
import Select from "../alerts/select";
import Overlay from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css";
import { DefinedRange, defaultStaticRanges } from "react-date-range";
import {
  endOfDay,
  startOfYear,
  endOfYear,
  addMonths,
  addYears,
  isSameDay,
} from "date-fns";
import TextField from "@mui/material/TextField";
import Tooltipp from "react-bootstrap/Tooltip";
import Widget from "./widget";

export default function Dashboard() {
  const [meal_type, setmeal_type] = useState({
    value: "all",
    label: "All Orders",
  });
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
  const filter_options = [
    { value: "all", label: "All Orders" },
    { value: "breakfast", label: "Breakfast" },
    { value: "lunch", label: "Lunch" },
    { value: "dinner", label: "Dinner" },
  ];

  const data = [
    {
      customer_name: "Nasir ALi",
      date: "12-01-2024",
      menu: "Pakistani",
      timing: "Saudi Arabia",
      pax: 1109,
      id: 112,
      order_details: [
        {
          name: "Cooking",
          type: "breakfast",
          time: "12:00",
          time_type: "Start",
        },
        {
          name: "Cooking",
          type: "breakfast",
          time: "03:00",
          time_type: "End",
        },
        {
          name: "Packing",
          type: "breakfast",
          time: "04:00",
          time_type: "Start",
        },
        {
          name: "Packing",
          type: "breakfast",
          time: "04:30",
          time_type: "End",
        },
        {
          name: "Cooking",
          type: "breakfast",
          time: "12:00",
          time_type: "Start",
        },
        {
          name: "Cooking",
          type: "breakfast",
          time: "03:00",
          time_type: "End",
        },
      ],
    },
    {
      customer_name: "Ali Akhtar",
      date: "12-01-2024",
      menu: "Pakistani",
      timing: "Saudi Arabia",
      pax: 1109,
      id: 112,
      order_details: [
        {
          name: "Cooking",
          type: "breakfast",
          time: "12:00",
          time_type: "Start",
        },
        {
          name: "Cooking",
          type: "breakfast",
          time: "03:00",
          time_type: "End",
        },
        {
          name: "Packing",
          type: "breakfast",
          time: "04:00",
          time_type: "Start",
        },
        {
          name: "Packing",
          type: "breakfast",
          time: "04:30",
          time_type: "End",
        },
        {
          name: "Cooking",
          type: "breakfast",
          time: "12:00",
          time_type: "Start",
        },
        {
          name: "Cooking",
          type: "breakfast",
          time: "03:00",
          time_type: "End",
        },
      ],
    },
  ];
  return (
    <div className="p-3">
      <div className="d-flex justify-content-end align-items-center">
        <h6 className="me-3">Filters:</h6>
        <div style={{ zoom: 0.8 }} className="col-6 col-md-1 me-3">
          <Select
            options={filter_options}
            value={meal_type}
            placeholder={""}
            funct={(e) => setmeal_type(e)}
          />
        </div>

        <div style={{ zoom: 0.8 }} className=" col-6 col-md-2">
          {date_range[0].endDate.getFullYear() -
            date_range[0].startDate.getFullYear() ===
          10 ? (
            <TextField
              ref={ref}
              type="button"
              style={{
                backgroundColor: "white",
              }}
              className="form-control  mb-3"
              label={"Date"}
              value="From Start"
              onClick={handleselectiochange}
              size="small"
            />
          ) : (
            <TextField
              ref={ref}
              type="button"
              style={{
                backgroundColor: "white",
              }}
              className="form-control  mb-3 "
              label={"Date"}
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
            rootClose
            onHide={() => setshow(false)}
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
      {data.map((item) => {
        return <Widget order={item} />;
      })}
    </div>
  );
}
