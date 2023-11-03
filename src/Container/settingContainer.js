import { connect } from "react-redux";
import Settings from "../Components/settings/settings";
import { Setcurrentinfo } from "../Service/Actions/action";

const dispatchpart = (dispatch) => ({
  Setinfo_ofuser: (data) => dispatch(Setcurrentinfo(data)),
});

const getpart = (state) => ({
  state,
});

export default connect(getpart, dispatchpart)(Settings);
