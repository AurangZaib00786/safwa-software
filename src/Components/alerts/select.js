import React from "react";
import Select from "react-select";
import "./select.css";

function Select_field({
  options,
  placeholder,
  value,
  funct,
  required,
  margin,
}) {
  const selectStyles = {
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };
  return (
    <div className={margin ? "wrapper " : "wrapper mb-3"}>
      {required ? (
        <div
          className={value && "select_class"}
          data-content={placeholder && `${placeholder} *`}
        >
          <Select
            className="form-control selector"
            styles={selectStyles}
            options={options}
            placeholder={placeholder && `${placeholder} *`}
            value={value}
            onChange={funct}
            required
          ></Select>
        </div>
      ) : (
        <div className={value && "select_class"} data-content={placeholder}>
          <Select
            className="form-control selector"
            styles={selectStyles}
            options={options}
            placeholder={placeholder}
            value={value}
            onChange={funct}
          ></Select>
        </div>
      )}
    </div>
  );
}

export default Select_field;
