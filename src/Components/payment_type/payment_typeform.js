import React,{useState,useRef} from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './payment_type.css'
import { ToastContainer } from 'react-toastify';
import TextField from '@mui/material/TextField';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { Avatar } from '@material-ui/core';
import went_wrong_toast from '../alerts/went_wrong_toast';
import success_toast from '../alerts/success_toast';
import Save_button from '../buttons/save_button';
import { useTranslation } from 'react-i18next';

function Payment_typeform({show,onHide,user,route,callback,selected_branch}) {
    
  const {t} = useTranslation()
    const [name,setname] = useState('')
    
    const [isloading , setisloading] = useState(false)


    const handleSubmit=async(e)=>{
        e.preventDefault()
        if (selected_branch){
          setisloading(true)
        const formData = new FormData();
        
        formData.append('name', name);
        formData.append('branch', selected_branch.id);
     
        
       
       

          const response= await fetch(`${route}/api/payment-types/`,{
            method: "POST",
            headers: { 
              Authorization : `Bearer ${user.access}`
             },
            body: formData,
        })
        const json=await response.json();
        
        if (!response.ok){
          setisloading(false)
          went_wrong_toast()
      }

      if (response.ok){
        callback({type:'Create_table_history',data: json})
        setisloading(false)
        success_toast()
          setname('')
          
          
          

        }}

        
    }
    


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
            <FontAwesomeIcon className='me-2' icon={faUserPlus}/>  {t('add_paymenttype')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {!selected_branch && <div className='text-center text-danger mb-2'>Please Select Branch!</div>}
          <form onSubmit={handleSubmit}>
          
          

            <div className='col-md-12'>
                <TextField className='form-control   mb-3' id="outlined-basic" label={t("name")}   value={name} onChange={(e)=>{setname(e.target.value)}} size='small' required/>
                
            </div>

            
            

          
          
              
                 
              <hr></hr>
              <div className=' d-flex flex-row-reverse mt-2 me-2'>
              <Save_button isloading={isloading}/>
              </div>
        </form>
        
        </Modal.Body>
      </Modal>
    );
  }


export default Payment_typeform


    