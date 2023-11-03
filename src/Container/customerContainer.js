import { connect } from "react-redux";
import Customer from "../Components/customers/customer";
import { Settablehistory } from "../Service/Actions/action";

const dispatchpart=dispatch=>({
    Settable_history:data=>dispatch(Settablehistory(data))
})
    
const getpart=state=>({
        state
    })
    
export default connect(getpart,dispatchpart)(Customer)