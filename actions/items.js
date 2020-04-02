export const CHANGE_GARMENT = "CHANGE_GARMENT";
export const GET_DEFAULT_ITEMS = "GET_DEFAULT_ITEMS";
export const TOGGLE_FRONT_OR_BACK = "TOGGLE_FRONT_OR_BACK";
export const CHOOSE_LOGO = "CHOOSE_LOGO";

export const changeGarment = value => {
  // console.log("in change garment in items");
  return {
    type: CHANGE_GARMENT,
    payload: value
  };
};

export const getDefaultItems = () => {
  // console.log("in get default items in items");
  return {
    type: GET_DEFAULT_ITEMS,
    payload: ""
  };
};

export const toggleFrontOrBack = () => {
  // console.log("in toggle front or back in items");
  return {
    type: TOGGLE_FRONT_OR_BACK,
    payload: ""
  };
};

export const chooseLogo = value => {
  // console.log("in toggle front or back in items");
  return {
    type: CHOOSE_LOGO,
    payload: value
  };
};
