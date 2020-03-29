export const TOGGLE_LOADING = "TOGGLE_LOADING";

export const toggleLoading = value => {
  return {
    type: TOGGLE_LOADING,
    payload: value
  };
};
