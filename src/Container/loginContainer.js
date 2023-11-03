import { connect } from "react-redux";
import Login from "../Pages/login";
import { setuser } from "../Service/Actions/action";

const dispatchpart=dispatch=>({
    SetUser:data=>dispatch(setuser(data))
})

const getpart=state=>({
    state

})

export default connect(getpart,dispatchpart)(Login)