export const CHANGE_GARMENT = "CHANGE_GARMENT";
export const GET_DEFAULT_ITEMS = "GET_DEFAULT_ITEMS";
export const CHOOSE_LOGO = "CHOOSE_LOGO";
export const CHANGE_LOGO_DIMENSIONS = "CHANGE_LOGO_DIMENSIONS";
export const REMEMBER_LOGO_LOCATION = "REMEMBER_LOGO_LOCATION";
export const CHANGE_LOGO_POSITION = "CHANGE_LOGO_POSITION";
export const TOGGLE_FRONT_OR_BACK = "TOGGLE_FRONT_OR_BACK";

export const changeGarment = value => {
  // console.log("in change garment in items");
  return {
    type: CHANGE_GARMENT,
    payload: value
  };
};

export const changeLogoDimensions = value => {
  // console.log("in change garment in items");
  return {
    type: CHANGE_LOGO_DIMENSIONS,
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

export const chooseLogo = value => {
  // console.log("in toggle front or back in items");
  return {
    type: CHOOSE_LOGO,
    payload: value
  };
};

export const rememberLogoLocation = value => {
  // console.log("in toggle front or back in items");
  return {
    type: REMEMBER_LOGO_LOCATION,
    payload: value
  };
};

export const changeLogoPosition = value => {
  // console.log("in toggle front or back in items");
  return {
    type: CHANGE_LOGO_POSITION,
    payload: value
  };
};

export const toggleFrontOrBack = () => {
  // console.log("in toggle front or back in items");
  return {
    type: TOGGLE_FRONT_OR_BACK,
    payload: ""
  };
};
