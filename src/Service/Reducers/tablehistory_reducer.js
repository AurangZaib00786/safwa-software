const initialstates = {
  table_history: [],
  menu_status: "dashboard",
};
export default function Settablehistory(state = initialstates, action) {
  switch (action.type) {
    case "Set_table_history":
      return {
        table_history: action.payload,
        menu_status: state.menu_status,
      };
    case "Create_table_history":
      return {
        table_history: [...state.table_history, action.payload],
        menu_status: state.menu_status,
      };
    case "Delete_table_history":
      if (action.payload.filter) {
        return {
          table_history: state.table_history.filter(
            (u) => u.name !== action.payload.row.name
          ),
          menu_status: state.menu_status,
        };
      } else {
        return {
          table_history: state.table_history.filter(
            (u) => u.id !== action.payload.id
          ),
          menu_status: state.menu_status,
        };
      }
    case "Update_table_history":
      return {
        table_history: state.table_history.map((u) => {
          return u.id !== action.payload.id ? u : action.payload;
        }),
        menu_status: state.menu_status,
      };
    case "Set_menuitem":
      return {
        menu_status: action.payload,
        table_history: [],
      };

    default:
      return {
        ...state,
      };
  }
}
