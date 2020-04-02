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
  TOGGLE_FRONT_OR_BACK,
  CHOOSE_LOGO
} from "../actions/items";
import { defaultItems } from "../data/defaultItems";

let logoMaxPixelsDefault = 200;
let logoWidth = 0;
let logoHeight = 0;
let url = "";
let urlKey = "";
let imageWidth = 0;
let imageHeight = 0;

const initialItemState = {
  shirtUrl: defaultItems[0].url,
  text: {
    text1: "",
    text2: "",
    text3: "",
    text4: "",
    text5: "",
    text6: ""
  },
  front: true,
  logos: {
    logo1: "",
    logo2: "",
    logo3: "",
    logo4: "",
    logo5: "",
    logo6: ""
  }
};

let newState = {};

const user = (state = { logos: {} }, action) => {
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
      // console.log(state);
      // console.log(action.payload);

      url = action.payload[0];
      logoWidth = action.payload[1];
      logoHeight = action.payload[2];
      urlKey = action.payload[3];

      let newLogos = state.logos;

      if (logoWidth > logoHeight) {
        logoWidthDefault = logoMaxPixelsDefault;
        logoHeightDefault = (logoHeight / logoWidth) * logoMaxPixelsDefault;
      } else {
        logoHeightDefault = logoMaxPixelsDefault;
        logoWidthDefault = (logoWidth / logoHeight) * logoMaxPixelsDefault;
      }

      if (!state.logos) {
        console.log("first logo");
        // console.log(newImages);
        // console.log(urlKey);
        // console.log(url);
        let firstLogo = {
          urlKey: {
            url: url,
            width: logoWidth,
            height: logoHeight,
            widthDefault: logoWidthDefault,
            heightDefault: logoHeightDefault
          }
        };
        newLogos = firstLogo;
        // console.log(newLogos);
      } else {
        // console.log("at least one image");
        newLogos[urlKey] = {
          url: url,
          width: logoWidth,
          height: logoHeight,
          widthDefault: logoWidthDefault,
          heightDefault: logoHeightDefault
        };
        // console.log(newLogos);
      }
      return { ...state, logos: newLogos };
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
      console.log("at get user logos in index.js/reducer");

      let logoWidthDefault = 0;
      let logoHeightDefault = 0;

      let priorLogos = action.payload;
      if (priorLogos) {
        let logoKeys = Object.keys(priorLogos);

        for (let i = 0; i < logoKeys.length; i++) {
          logoWidth = priorLogos[logoKeys[i]].width;
          logoHeight = priorLogos[logoKeys[i]].height;

          if (logoWidth > logoHeight) {
            logoWidthDefault = logoMaxPixelsDefault;
            logoHeightDefault = (logoHeight / logoWidth) * logoMaxPixelsDefault;
          } else {
            logoHeightDefault = logoMaxPixelsDefault;
            logoWidthDefault = (logoWidth / logoHeight) * logoMaxPixelsDefault;
          }
          priorLogos[logoKeys[i]].widthDefault = logoWidthDefault;
          priorLogos[logoKeys[i]].heightDefault = logoHeightDefault;
        }
      }

      return { ...state, logos: priorLogos };
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
        backShirtUrl: defaultItems[0].backURL
      };
    case TOGGLE_FRONT_OR_BACK:
      console.log("toggling front or back at index");
      return {
        ...state,
        front: !state.front
      };
    case CHOOSE_LOGO:
      console.log("at choose logo in index.js reducer");
      console.log(state);
      // console.log(state);
      console.log(action);

      let currentLogo = action.payload[0];

      let newLogos = state.logos;

      if (!state.logos.logo1) {
        console.log("first logo");
        newLogos.logo1 = action.payload[0];
        console.log(newLogos);
      } else if (!state.logos.logo2) {
        console.log("second logo");
        newLogos.logo2 = action.payload[0];
      } else if (!state.logos.logo3) {
        // console.log("second logo");
        newLogos.logo3 = action.payload[0];
      } else if (!state.logos.logo4) {
        // console.log("second logo");
        newLogos.logo4 = action.payload[0];
      } else if (!state.logos.logo5) {
        // console.log("second logo");
        newLogos.logo5 = action.payload[0];
      } else if (!state.logos.logo6) {
        // console.log("second logo");
        newLogos.logo6 = action.payload[0];
      } else {
        console.log("no logos");
      }

      return { ...state, logos: newLogos };

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
