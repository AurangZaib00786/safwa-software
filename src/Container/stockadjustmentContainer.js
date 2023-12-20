import { connect } from "react-redux";
import StockAdjustment from "../Components/stockadjustment/stockadjustment";
import { Settablehistory } from "../Service/Actions/action";

const dispatchpart = (dispatch) => ({
  Settable_history: (data) => dispatch(Settablehistory(data)),
});

const getpart = (state) => ({
  state,
});

export default connect(getpart, dispatchpart)(StockAdjustment);
