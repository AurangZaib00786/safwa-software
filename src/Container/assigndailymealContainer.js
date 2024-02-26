import { connect } from "react-redux";
import AssignDailymeal from "../Components/dailymeal/assigndailymeal";
import { Settablehistory } from "../Service/Actions/action";

const dispatchpart = (dispatch) => ({
  Settable_history: (data) => dispatch(Settablehistory(data)),
});

const getpart = (state) => ({
  state,
});

export default connect(getpart, dispatchpart)(AssignDailymeal);
