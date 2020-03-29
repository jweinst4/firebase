export const CHANGE_GARMENT = "CHANGE_GARMENT";

export const changeGarment = value => {
  console.log("in change garment in items");
  return {
    type: CHANGE_GARMENT,
    payload: value
  };
};
