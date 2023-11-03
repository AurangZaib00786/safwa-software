import { connect } from "react-redux";
import Payment_type from "../Components/payment_type/payment_type";
import { Settablehistory } from "../Service/Actions/action";

const dispatchpart=dispatch=>({
    Settable_history:data=>dispatch(Settablehistory(data))
})
    
const getpart=state=>({
        state
    })
    
export default connect(getpart,dispatchpart)(Payment_type)