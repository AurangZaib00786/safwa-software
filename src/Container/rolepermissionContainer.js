import { connect } from "react-redux";
import Branch_manage from "../Components/roels&permission/role&permission";
import { Settablehistory, Setcurrentinfo } from "../Service/Actions/action";

const dispatchpart = (dispatch) => ({
  Settable_history: (data) => dispatch(Settablehistory(data)),
  Setinfo_ofuser: (data) => dispatch(Setcurrentinfo(data)),
});

const getpart = (state) => ({
  state,
});

export default connect(getpart, dispatchpart)(Branch_manage);
