import { connect } from "react-redux";
import Deliver_man from "../Components/delivery_man/delivery_man";
import { Settablehistory } from "../Service/Actions/action";

const dispatchpart=dispatch=>({
    Settable_history:data=>dispatch(Settablehistory(data))
})
    
const getpart=state=>({
        state
    })
    
export default connect(getpart,dispatchpart)(Deliver_man)