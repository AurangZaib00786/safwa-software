import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "./dailymeal.css";
import custom_toast from "../alerts/custom_toast";

import Red_toast from "../alerts/red_toast";

function Dailymealeditform({
  show,
  onHide,
  callback,
  text,
  data_,
  column,
  setcolumn,
  table_data,
}) {
  
  const [selected, setselected] = useState(column?.map((item,index)=>{return index+1}));

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

  const addproduct = (row,rowIndex) => {
    const optimize = column?.filter((item) => {
      return item.pot === row.id;
    });
    setselected([...selected,rowIndex+1])
    if (optimize.length > 0) {
      Red_toast(`${row.name} pot already Added`);
      return false;
    } else {
      setcolumn([...column, { ...row,pot: row.id, }]);
      const optimizetable = table_data.map((item) => {
        return {
          ...item,
          pot_details: [
            ...item.pot_details,
            {
              pot: row.id,
              name: row.name,
              arabic_name: row.arabic_name,
              qty: 0,
            },
          ],
        };
      });
      callback({ type: "Set_product_history", data: optimizetable });
      return true;
    }
  };

  const addallproduct = (rows) => {
    var newcolumn = column;
    var newtabeldata = table_data;
    var flag = false;
    rows.map((row) => {
      const optimize = column?.filter((item) => {
        return item.pot === row.id;
      });
      if (optimize.length > 0) {
        Red_toast(`${row.name} pot already Added`);
        return false;
      } else {
        newcolumn = [...newcolumn, { ...row,pot: row.id,}];
        newtabeldata = newtabeldata.map((item) => {
          return {
            ...item,
            pot_details: [
              ...item.pot_details,
              {
                pot: row.id,
                name: row.name,
                arabic_name: row.arabic_name,
                qty: 0,
              },
            ],
          };
        });
        flag = true;
      }
    });
    setselected(rows.map((item,index)=> index+1))
    setcolumn(newcolumn);
    callback({ type: "Set_product_history", data: newtabeldata });
    return flag;
  };

  const deleteproduct = (row,rowIndex) => {

    setselected(selected.filter(item=>{return item!==rowIndex+1}))
    const optimize = column?.filter((item) => {
      return item.pot !== row.id;
    });
    const optimizetable = table_data?.map((item) => {
      const new_data=item.pot_details.filter(pot=>{
        return pot.pot!==row.id
      })
      return {...item,pot_details:new_data}
      
    });
    setcolumn(optimize);
    callback({ type: "Set_product_history", data: optimizetable });
    return true;
    
  };
  const deleteallproduct = (rows) => {
    setcolumn([]);
    setselected([])
    const optimizetable = table_data?.map((item) => {
      return {...item,pot_details:[]}
    });
    callback({ type: "Set_product_history", data: optimizetable });
    return true;
  };

  const columns = [
    {
      dataField: "id",
      text: "Id",
      hidden: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "name",
      text: "Name",
      sort: true,
      headerFormatter: headerstyle,
    },
  ];

  const selectRow = {
    mode: "checkbox",
    clickToSelect: true,
    selected:selected,
    onSelect: (row, isSelect, rowIndex, e) => {
      if (isSelect) {
        const response = addproduct(row,rowIndex);
        if (response) {
          custom_toast(`${row.name} pot added`);
        }
      }else{
       
        const response = deleteproduct(row,rowIndex);
        if (response) {
          custom_toast(`${row.name} pot deleted`);
        }
      }
    },
    onSelectAll: (isSelect, rows, e) => {
      if (isSelect) {
        const response = addallproduct(rows);
        if (response) {
          custom_toast("Pots added");
        }
      }else{
        const response = deleteallproduct(rows);
        if (response) {
          custom_toast("Pots Deleted");
        }
      }
    },
  };

  const rowstyle = { height: "10px" };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      style={{ zoom: ".7" }}
    >
      <Modal.Header closeButton>
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="d-flex align-items-md-center"
        >
          {text}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ToolkitProvider
          keyField="id"
          data={data_}
          columns={columns}
          search
          exportCSV
        >
          {(props) => (
            <div>
              {/* <div className="d-flex flex-row-reverse justify-content-between align-items-center mt-3">
                <SearchBar {...props.searchProps} />
              </div> */}

              

              <div>
                <BootstrapTable
                  {...props.baseProps}
                  rowStyle={rowstyle}
                  striped
                  bootstrap4
                  condensed
                  selectRow={selectRow}
                  wrapperClasses="table-responsive"
                />
              </div>
            </div>
          )}
        </ToolkitProvider>
      </Modal.Body>
    </Modal>
  );
}

export default Dailymealeditform;
