import { Set_User } from "../constants";

export const setuser = (data) => {
  return {
    type: Set_User,
    payload: data,
  };
};

export const setmenu = (data) => {
  return {
    type: "Set_menuitem",
    payload: data,
  };
};

export const removeuser = () => {
  return {
    type: "Remove_User",
  };
};

export const Setcurrentinfo = ({ type, data }) => {
  return {
    type: type,
    payload: data,
  };
};

export const Settablehistory = ({ type, data }) => {
  return {
    type: type,
    payload: data,
  };
};

export const Setproducthistory = ({ type, data }) => {
  return {
    type: type,
    payload: data,
  };
};

export const Setsavedata = ({ type, data }) => {
  return {
    type: type,
    payload: data,
  };
};
