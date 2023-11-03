import { connect } from "react-redux";
import Company from "../Components/company/company";
import { Settablehistory , Setcurrentinfo } from "../Service/Actions/action";

const dispatchpart=dispatch=>({
    Settable_history:data=>dispatch(Settablehistory(data)),
    Setinfo_ofuser:data=>dispatch(Setcurrentinfo(data))
})
    
const getpart=state=>({
        state
    })
    
export default connect(getpart,dispatchpart)(Company)