import { combineReducers } from "redux";
import {
  LOGIN,
  SIGNUP,
  UPDATE_EMAIL,
  UPDATE_PASSWORD,
  UPDATE_USER,
  CLEAR_USER,
  UPDATE_NAME,
  ADD_IMAGE,
  ADD_ALL_IMAGES,
  ADD_USER_LOGOS_TO_REDUCER
} from "../actions/user";
import { TOGGLE_LOADING } from "../actions/loading";
import {
  CHANGE_GARMENT,
  GET_DEFAULT_ITEMS,
  TOGGLE_FRONT_OR_BACK
} from "../actions/items";
import { defaultItems } from "../data/defaultItems";

const initialItemState = {
  shirtUrl: defaultItems[0].url,
  logo1: "",
  logo2: "",
  logo3: "",
  text1: "",
  text2: "",
  text3: "",
  front: true
};

let newState = {};

const user = (state = { images: {} }, action) => {
  switch (action.type) {
    case LOGIN:
      return action.payload;
    case SIGNUP:
      return action.payload;
    case UPDATE_EMAIL:
      return { ...state, email: action.payload };
    case UPDATE_PASSWORD:
      return { ...state, password: action.payload };
    case UPDATE_NAME:
      return { ...state, name: action.payload };
    case ADD_IMAGE:
      console.log("in add image in reducer");
      // console.log(state.images);

      const url = action.payload[0];
      const urlKey = "url" + action.payload[1];

      let newImages = state.images;

      if (!state.images) {
        console.log("first image");
        // console.log(newImages);
        // console.log(urlKey);
        // console.log(url);
        let firstImage = { [urlKey]: url };
        newImages = firstImage;
        // console.log(newImages);
      } else {
        console.log("at least one image");
        newImages[urlKey] = url;
      }
      return { ...state, images: newImages };
    case ADD_ALL_IMAGES:
      // console.log("in add all images in reducer");
      return { ...state, images: action.payload };
    case UPDATE_USER:
      // console.log("in update user at index");
      // console.log(action.payload);
      return action.payload;
    case CLEAR_USER:
      newState = { email: state.email };
      return { ...state, email: state.email };
    case ADD_USER_LOGOS_TO_REDUCER:
      let newLogos = action.payload;
      return { ...state, logos: newLogos };
    default:
      return state;
  }
};

const loading = (state = false, action) => {
  switch (action.type) {
    case TOGGLE_LOADING:
      // console.log("toggle loading from index");
      return action.payload;
    default:
      return state;
  }
};

const items = (state = initialItemState, action) => {
  switch (action.type) {
    case CHANGE_GARMENT:
      console.log("changin garment from index");
      return {
        ...state,
        shirtUrl: action.payload.url,
        backShirtUrl: action.payload.backURL
      };
    case GET_DEFAULT_ITEMS:
      console.log("getting default items at index");
      return {
        ...state,
        shirtUrl: defaultItems[0].url,
        backShirtUrl: defaultItems[0].backURL,
        defaultItems: defaultItems
      };
    case TOGGLE_FRONT_OR_BACK:
      console.log("toggling front or back at index");

      return {
        ...state,
        front: !state.front
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  user,
  loading,
  items
});

export default rootReducer;
