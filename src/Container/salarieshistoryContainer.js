import { connect } from "react-redux";
import Salalrieshistory from "../Components/salaries/salarieshistory";
import { Settablehistory } from "../Service/Actions/action";

const dispatchpart = (dispatch) => ({
  Settable_history: (data) => dispatch(Settablehistory(data)),
});

const getpart = (state) => ({
  state,
});

export default connect(getpart, dispatchpart)(Salalrieshistory);
