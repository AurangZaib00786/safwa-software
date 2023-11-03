import { connect } from "react-redux";
import BuffetMenu from "../Components/buffetmenu/buffetmenu";
import { Settablehistory } from "../Service/Actions/action";

const dispatchpart = (dispatch) => ({
  Settable_history: (data) => dispatch(Settablehistory(data)),
});

const getpart = (state) => ({
  state,
});

export default connect(getpart, dispatchpart)(BuffetMenu);
