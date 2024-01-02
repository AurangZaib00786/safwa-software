import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, {
  Search,
  CSVExport,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { Avatar } from "@material-ui/core";
import "./Purchase.css";
import { ToastContainer } from "react-toastify";
import custom_toast from "../alerts/custom_toast";
import went_wrong_toast from "../alerts/went_wrong_toast";
import Spinner from "react-bootstrap/Spinner";
import Select from "react-select";
import { useTranslation } from "react-i18next";

function Purchaseform({
  show,
  onHide,
  callback,
  text,
  data_,
  column,
  setcolumn,
  table_data
}) {
  
  const [isloading, setisloading] = useState(false);
 
  

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

  const addproduct = (row, num) => {

      setcolumn([...column,{id:row.id,name:row.name}])
      const optimize=table_data.map(item=>{
        item[row.name]=''
        return item
      })

      callback({ type: "Set_product_history", data: optimize });
    
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
      onSelect: (row, isSelect, rowIndex, e) => {
         addproduct(row);
        custom_toast("Pot added");
        
      },
      onSelectAll: (isSelect, rows, e) => {
        if (isSelect) {
         

          rows.forEach((row) => {
             addproduct(row);
            
          });
          
          custom_toast("Pots added");
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

              {isloading && (
                <div className="text-center">
                  <Spinner animation="border" variant="primary" />
                </div>
              )}

             
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

export default Purchaseform;
