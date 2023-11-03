
import React from 'react'
import Modal from 'react-bootstrap/Modal';
import './sale.css'
import Button from 'react-bootstrap/Button';
import { ToastContainer } from 'react-toastify';
import TextField from '@mui/material/TextField';

function DeliverymanModel({show,onHide,delivery_no,delivery_date,po_number,po_date,payterm_terms,inco_terms,setdelivery_no,setdelivery_date,setpo_number,setpo_date,setpayterm_terms,setinco_terms}) {
    return (
        <Modal
          show={show}
          onHide={onHide}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          style={({zoom:'.8'})}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter" className='d-flex align-items-md-center'>
              Delivery Info
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='row'>
                <div className='col-sm-6'>
                    <TextField  className='form-control   mb-3' id="outlined-basic"  label='Delivery Number'  value={delivery_no} onChange={(e)=>{setdelivery_no(e.target.value)}} size='small'/>
                    <TextField  className='form-control   mb-3' id="outlined-basic"  label='PO Number'  value={po_number} onChange={(e)=>{setpo_number(e.target.value)}} size='small'/>
                    <TextField  className='form-control   mb-3' id="outlined-basic"  label='Payment Terms'  value={payterm_terms} onChange={(e)=>{setpayterm_terms(e.target.value)}} size='small'/>
                </div>

                <div className='col-sm-6'>
                    <TextField type='date' className='form-control   mb-3' id="outlined-basic" InputLabelProps={{shrink: true,}}  label='Delivery Date'  value={delivery_date} onChange={(e)=>{setdelivery_date(e.target.value)}} size='small'/>
                    <TextField type='date' className='form-control   mb-3' id="outlined-basic" InputLabelProps={{shrink: true,}}  label='PO Date'  value={po_date} onChange={(e)=>{setpo_date(e.target.value)}} size='small'/>
                    <TextField  className='form-control   mb-3' id="outlined-basic"  label='Incoterms'  value={inco_terms} onChange={(e)=>{setinco_terms(e.target.value)}} size='small'/>
                </div>
            </div>
           <hr></hr>
          <div className=' d-flex flex-row-reverse mt-2 me-2'>
          <Button type='button' variant='outline-primary' onClick={onHide} > Save</Button>
          </div>
          </Modal.Body>
        </Modal>
      );
      
      }
export default DeliverymanModel