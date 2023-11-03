import React from 'react'
import { toast} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


const Red_toast=(msg)=>{
    toast.error(msg, {
        position: toast.POSITION.TOP_RIGHT,
        pauseOnHover: false,

      });
}


export default Red_toast