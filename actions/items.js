export const CHANGE_GARMENT = "CHANGE_GARMENT";
export const TOGGLE_FRONT_OR_BACK = "TOGGLE_FRONT_OR_BACK";

export const changeGarment = value => {
  // console.log("in change garment in items");
  return {
    type: CHANGE_GARMENT,
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
