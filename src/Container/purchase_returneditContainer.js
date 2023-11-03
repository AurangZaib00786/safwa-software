import { connect } from "react-redux";
import Purchase_return_Edit from "../Components/purchase_return/purchase_returneidt";
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

export default connect(getpart, dispatchpart)(Purchase_return_Edit);
