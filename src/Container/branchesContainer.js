import { connect } from "react-redux";
import Accounts from "../Components/branch/branches";
import { Settablehistory, Setcurrentinfo } from "../Service/Actions/action";

const dispatchpart = (dispatch) => ({
  Settable_history: (data) => dispatch(Settablehistory(data)),
  Setinfo_ofuser: (data) => dispatch(Setcurrentinfo(data)),
});

const getpart = (state) => ({
  state,
});

export default connect(getpart, dispatchpart)(Accounts);
