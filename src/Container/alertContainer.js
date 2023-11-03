import { connect } from "react-redux";
import Alert_before_delete from "../Components/alerts/alert_before_delete";


const dispatchpart=dispatch=>({
        
    })
    
const getpart=state=>({
        state
    })
    
export default connect(getpart,dispatchpart)(Alert_before_delete)