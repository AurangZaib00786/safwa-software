import { connect } from "react-redux";
import Dailymeal from "../Components/dailymeal/dailymeal";
import { Settablehistory, Setproducthistory } from "../Service/Actions/action";

const dispatchpart = (dispatch) => ({
  Settable_history: (data) => dispatch(Settablehistory(data)),
  Setproduct_history: (data) => dispatch(Setproducthistory(data)),
});

const getpart = (state) => ({
  state,
});

export default connect(getpart, dispatchpart)(Dailymeal);
