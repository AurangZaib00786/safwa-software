import { connect } from "react-redux";
import Sale_returnhistory from "../Components/sale return/sale_returnhistory";
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

export default connect(getpart, dispatchpart)(Sale_returnhistory);
