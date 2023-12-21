import { Avatar } from '@material-ui/core'
import React, { useState } from 'react'
import './login.css'
import TextField from '@mui/material/TextField';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from 'react-i18next';

function Login(props) {
    const {t} = useTranslation()
    const route = props.state.setuser.route
    const dispatch = props.SetUser
    
    const [email , setemail] = useState('')
    const [password , setpassword] = useState('')
    const [show , setshow] = useState(false)
    const [error , seterror] = useState('')
    
    const [islodding , setislodding] = useState(null)
    

    const handleSubmit = async(e) => {
        e.preventDefault()
        setislodding(true)
        const response= await fetch(`${route}/api/token/`,{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username:email, password }),
        })
        const json=await response.json()
        
        if (!response.ok){
            setislodding(false)
            seterror(json.detail)
              toasts()
            
        }

        if (response.ok){
            localStorage.setItem('user' , JSON.stringify(json))
            dispatch(json)
            setislodding(false)
        }
        
    }

    const toasts=()=>{
        toast.error("Something went Wrong!", {
            position: toast.POSITION.TOP_RIGHT,
            pauseOnHover: false,
            
  
          });
    }

    const handleshow=(e)=>{
        setshow(!show)
    }

  return (
    <div className='d-flex align-items-center justify-content-center' style={{minHeight:'125vh'}}>
        <div className='card col-sm-4 p-5 min-vh-70 login' >
            <div className='card-body '>
                <div className='d-flex justify-content-center'>
                <Avatar style={{ width: '100px', height: '100px' }}></Avatar>
                </div>
                <h3 className='d-flex justify-content-center mt-3 mb-5'>{t('login')}</h3>
                
                <form onSubmit={handleSubmit}>
                    <div className=' text-center text-danger'>{error}</div>
                    <div className='mb-3 mt-5'>
                        <TextField  className='form-control'  label={t("username")} value={email} onChange={(e)=>{
                            setemail(e.target.value)
                            seterror('')
                            }}  required/>
                        
                        

                    </div>

                    <div className='mb-2 mt-3 inputclass'>
                        <TextField type={show ? "text" : "password"}  className='form-control '  label={t("password")} value={password} onChange={(e)=>{
                            setpassword(e.target.value)
                            seterror('')
                            }} required/>
                        
                        

                    </div>

                    <div className="form-check mb-5">
                    <label className="form-check-label">
                        <input className="form-check-input" type="checkbox" name="remember" onChange={handleshow}/> {t('show_password')}
                    </label>
                    </div>
                    <div className="text-center">
                    <button type="submit" className="btn btn-primary mb-3 ps-5 pe-5" disabled={islodding}><strong>{t('login')}</strong></button>
                    </div>

                </form>
            
            </div>
            <ToastContainer autoClose={2000} hideProgressBar={true} theme="dark"/>
        </div>
    </div>
   
  )
}

export default Login