import { SetCurrentUser, Set_Branch_first, Set_Branch } from "../constants";

const branch = JSON.parse(localStorage.getItem("selected_branch"));
const type = JSON.parse(localStorage.getItem("invoice_type"));

if (branch) {
  var user_branch = branch;
} else {
  var user_branch = null;
}
if (type) {
  var user_invoice_type = type;
} else {
  var user_invoice_type = { name: "A4 Invoice", code: "A4" };
  localStorage.setItem(
    "invoice_type",
    JSON.stringify({ name: "A4 Invoice", code: "A4" })
  );
}

const initialstates = {
  current_user: null,
  selected_branch: user_branch,
  settings: null,
  invoice_type: user_invoice_type,
};
export default function Setcurrentinfo(state = initialstates, action) {
  switch (action.type) {
    case SetCurrentUser:
      return {
        selected_branch: state.selected_branch,
        current_user: action.payload,
        settings: state.settings,
        invoice_type: state.invoice_type,
      };

    case Set_Branch:
      const branch = action.payload.current_user?.branch_list?.filter(
        (item) => item.name === action.payload.value
      );
      localStorage.setItem("selected_branch", JSON.stringify(branch[0]));
      return {
        selected_branch: branch[0],
        current_user: state.current_user,
        settings: state.settings,
        invoice_type: state.invoice_type,
      };

    case Set_Branch_first:
      return {
        selected_branch: action.payload,
        current_user: state.current_user,
        settings: state.settings,
        invoice_type: state.invoice_type,
      };
    case "Set_settings":
      return {
        selected_branch: state.selected_branch,
        current_user: state.current_user,
        settings: action.payload,
        invoice_type: state.invoice_type,
      };

    case "Set_invoice_type":
      localStorage.setItem("invoice_type", JSON.stringify(action.payload));
      return {
        invoice_type: action.payload,
        selected_branch: state.selected_branch,
        current_user: state.current_user,
        settings: state.settings,
      };

    default:
      return {
        ...state,
      };
  }
}
