import { connect } from "react-redux";
import Login from "../Pages/login";
import { setuser, Setcurrentinfo } from "../Service/Actions/action";

const dispatchpart = (dispatch) => ({
  SetUser: (data) => dispatch(setuser(data)),
  Setinfo_ofuser: (data) => dispatch(Setcurrentinfo(data)),
});

const getpart = (state) => ({
  state,
});

export default connect(getpart, dispatchpart)(Login);
