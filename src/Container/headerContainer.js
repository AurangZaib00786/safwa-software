import { connect } from "react-redux";
import Header from "../Components/header";
import { Setcurrentinfo ,removeuser} from "../Service/Actions/action";

const dispatchpart=dispatch=>({
        Setinfo_ofuser:data=>dispatch(Setcurrentinfo(data)),
        RemoveUser:()=>dispatch(removeuser())
    })
    
const getpart=state=>({
        state
    })
    
export default connect(getpart,dispatchpart)(Header)