import { connect } from "react-redux";
import Salaries from "../Components/salaries/salaries";

import { Setproducthistory, Settablehistory } from "../Service/Actions/action";

const dispatchpart = (dispatch) => ({
  Setproduct_history: (data) => dispatch(Setproducthistory(data)),
  Settable_history: (data) => dispatch(Settablehistory(data)),
});

const getpart = (state) => ({
  state,
});

export default connect(getpart, dispatchpart)(Salaries);
