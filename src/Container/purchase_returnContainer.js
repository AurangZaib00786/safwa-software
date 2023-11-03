import { connect } from "react-redux";
import Purchase_return from "../Components/purchase_return/Purchase_return";
import { Settablehistory, Setproducthistory } from "../Service/Actions/action";

const dispatchpart = (dispatch) => ({
  Settable_history: (data) => dispatch(Settablehistory(data)),
  Setproduct_history: (data) => dispatch(Setproducthistory(data)),
});

const getpart = (state) => ({
  state,
});

export default connect(getpart, dispatchpart)(Purchase_return);
