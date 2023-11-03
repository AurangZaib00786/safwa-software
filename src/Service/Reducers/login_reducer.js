import { Set_User } from "../constants";

const token = JSON.parse(localStorage.getItem("user"));

if (token) {
  var user_token = token;
} else {
  var user_token = null;
}

const initialstates = {
  user: user_token,
  route: "https://checking.eavenir.com",
};

export default function setuser(state = initialstates, action) {
  switch (action.type) {
    case Set_User:
      return {
        route: state.route,
        user: action.payload,
      };

    case "Remove_User":
      localStorage.removeItem("user");
      localStorage.removeItem("selected_branch");
      localStorage.removeItem("data");
      localStorage.removeItem("i18nextLng");
      return {
        route: state.route,
        user: null,
      };
    default:
      return {
        ...state,
      };
  }
}
