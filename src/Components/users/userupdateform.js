import React,{useState,useEffect,useRef} from 'react'
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ToastContainer } from 'react-toastify';
import TextField from '@mui/material/TextField';
import { Avatar } from '@material-ui/core';
import went_wrong_toast from '../alerts/went_wrong_toast';
import Update_button from '../buttons/update_button';
import { useTranslation } from 'react-i18next';

function Userupdate({show,onHide,data,user,route,fun,callback}) {
  const { t } = useTranslation()
    const inputFile = useRef(null)
    const [picture , setpicture] = useState('')
    const [Fileurl , setFileurl] = useState('')
    const [isloading , setisloading] = useState(false)
    const [username,setusername] = useState('')
    const [email,setemail] = useState('')
    const [password,setpassword] = useState('')
    const [phone_number,setphone_number] = useState('')
    const [address,setaddress] = useState('')
    const [cnic_iqama_number,setcnic_iqama_number] = useState('')

    useEffect(()=>{
        setusername(data.username)
        setemail(data.email)
        if (data.profile){
          setFileurl(data.profile.picture)
        setphone_number(data.profile.phone_number)
        setaddress(data.profile.address)
        setcnic_iqama_number(data.profile.cnic_iqama_number)
        }
        
    },[])
    
    

    const handleSubmit=async(e)=>{
        e.preventDefault()
        setisloading(true)
        const formData = new FormData();
        
        
        if (password.length>0){
          formData.append('username', username);
          formData.append('email', email);
          formData.append('password', password);
          formData.append('profile.picture', picture);
          formData.append('profile.address', address);
          formData.append('profile.phone_number', phone_number);
          formData.append('profile.cnic_iqama_number', cnic_iqama_number);
        }else{
          formData.append('username', username);
          formData.append('email', email);
          formData.append('profile.picture', picture);
          formData.append('profile.address', address);
          formData.append('profile.phone_number', phone_number);
          formData.append('profile.cnic_iqama_number', cnic_iqama_number);
        }
        
        const response = await fetch(`${route}/api/users/${data.id}/`,{
            method: "PATCH",
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
            setisloading(false)
            callback({type:'Update_table_history',data: json})
            onHide()
            fun('Update')
        }

    }

    const onButtonClick = () => {
      inputFile.current.click();
    };

    const handleimageselection =(event)=>{
      console.log(event.target)
      if (event.target.files){
        const file = event.target.files[0];
      
      setpicture(file);
     

      const reader = new FileReader();
      reader.onload = () => {
        setFileurl(reader.result);
     
      };
      reader.readAsDataURL(file);
      }
    }

    return (
      <Modal
        show={show}
        onHide={onHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        style={({zoom:'.8'})}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter" className='d-flex align-items-center'>
            <PersonAddIcon className='me-2'/>
            {t('edit_user')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
        <form onSubmit={handleSubmit}>
        <div className='row'>
          <div className='col-md-2 d-flex flex-column align-items-center'>
                <Avatar src={Fileurl} className='mb-3' style={{width:'100px', height:'100px'}} alt='image' variant='rounded'/>
                <input
                  onChange={handleimageselection}
                  id="select-file"
                  type="file"
                  ref={inputFile}
                  style={{display: 'none'}}
              />
              <Button onClick={onButtonClick} shadow>
              {t('choose_file')}
              </Button>
            </div>

            <div className='col-md-5'>
                <TextField className='form-control   mb-3' id="outlined-basic" label={t('username')}  value={username} onChange={(e)=>{setusername(e.target.value)}} size='small' required/>
                <TextField type='email' className='form-control  mb-3' id="outlined-basic" label={t("email")}  value={email} onChange={(e)=>{setemail(e.target.value)}} size='small' required/>
                <TextField type='password' className='form-control  mb-3' id="outlined-basic" label={t('password')}  value={password} onChange={(e)=>{setpassword(e.target.value)}} size='small'/>


            </div>
            <div className='col-md-5'>
                <TextField className='form-control   mb-3' id="outlined-basic" label={t('phone')}  value={phone_number} onChange={(e)=>{setphone_number(e.target.value)}} size='small' />
                <TextField className='form-control  mb-3' id="outlined-basic" label={t("cnic/iqama")} value={cnic_iqama_number} onChange={(e)=>{setcnic_iqama_number(e.target.value)}} size='small' />
                <TextField multiline className='form-control  mb-3' id="outlined-basic" label={t('address')}  value={address} onChange={(e)=>{setaddress(e.target.value)}} size='small' />

            </div>

          </div >
            
            <hr/>
            <div className='d-flex flex-row-reverse mt-2 me-2'>
            <Update_button isloading={isloading}/>
            </div>
        </form>
       
        </Modal.Body>
      </Modal>
    );
  }


export default Userupdate


    