import { connect } from "react-redux";
import Purchase_Report from "../Components/reports/purchase_report";
import { Settablehistory } from "../Service/Actions/action";

const dispatchpart=dispatch=>({
    Settable_history:data=>dispatch(Settablehistory(data))
})
    
const getpart=state=>({
        state
    })
    
export default connect(getpart,dispatchpart)(Purchase_Report)