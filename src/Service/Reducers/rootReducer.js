import { combineReducers } from "redux";
import setuser from "./login_reducer";
import Setcurrentinfo from "./header_reducer";
import Settablehistory from "./tablehistory_reducer";
import Setproducthistory from "./producthistory_reducer";
import Setsavedata from "./savedataContainer";

export default combineReducers({
    setuser,
    Setcurrentinfo,
    Settablehistory,
    Setproducthistory,
    Setsavedata
})