import { connect } from "react-redux";
import Routing from "../Pages/routing";
import { setuser } from "../Service/Actions/action";


const dispatchpart=dispatch=>({
        
    })
    
const getpart=state=>({
        state
    })
    
export default connect(getpart,dispatchpart)(Routing)