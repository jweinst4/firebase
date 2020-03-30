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
  ADD_ALL_IMAGES
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

      const url = action.payload[0];
      const urlKey = action.payload[1];

      let updatedState = state;

      if (updatedState.images === null) {
        console.log("currently no images");
        let key = urlKey;
        let firstImage = { [key]: url };
        updatedState.images = firstImage;
      } else {
        console.log("at least one image");
        console.log("default items below");
        console.log(defaultItems);
        updatedState.images["url" + urlKey] = url;
      }

      console.log("final state below");
      return updatedState;
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
    default:
      return state;
  }
};

const loading = (state = false, action) => {
  switch (action.type) {
    case TOGGLE_LOADING:
      console.log("toggle loading from index");
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
