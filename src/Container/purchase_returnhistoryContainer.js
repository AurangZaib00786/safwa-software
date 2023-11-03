import { connect } from "react-redux";
import Purchase_return_history from "../Components/purchase_return/purchase_return_history";
import {
  Settablehistory,
  Setproducthistory,
  Setsavedata,
} from "../Service/Actions/action";

const dispatchpart = (dispatch) => ({
  Settable_history: (data) => dispatch(Settablehistory(data)),
  Setproduct_history: (data) => dispatch(Setproducthistory(data)),
  Setsavedata: (data) => dispatch(Setsavedata(data)),
});

const getpart = (state) => ({
  state,
});

export default connect(getpart, dispatchpart)(Purchase_return_history);
