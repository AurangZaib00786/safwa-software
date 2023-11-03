const initialstates = {
  product_history: [],
};
export default function Setproducthistory(state = initialstates, action) {
  switch (action.type) {
    case "Set_product_history":
      return {
        product_history: action.payload,
      };
    case "Create_product_history":
      return {
        product_history: [...state.product_history, action.payload],
      };
    case "Delete_product_history":
      return {
        product_history: state.product_history.filter(
          (u) => u.prod_id !== action.payload.prod_id
        ),
      };
    case "Update_product_history":
      return {
        product_history: state.product_history.map((u) => {
          return u.stock !== action.payload.stock ? u : action.payload;
        }),
      };

    default:
      return {
        ...state,
      };
  }
}
