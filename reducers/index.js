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
  CHOOSE_LOGO,
  CHANGE_LOGO_DIMENSIONS
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
    text1Front: "",
    text2Front: "",
    text3Front: "",
    text4Front: "",
    text5Front: "",
    text6Front: "",
    text1Back: "",
    text2Back: "",
    text3Back: "",
    text4Back: "",
    text5Back: "",
    text6Back: ""
  },
  front: true,
  logos: {
    front: {
      logo1: "",
      logo2: "",
      logo3: "",
      logo4: "",
      logo5: "",
      logo6: ""
    },
    back: {
      logo1: "",
      logo2: "",
      logo3: "",
      logo4: "",
      logo5: "",
      logo6: ""
    }
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

      let newLogos = state.logos;

      if (state.front) {
        if (!state.logos.front.logo1) {
          console.log("first logo front");
          newLogos.front.logo1 = action.payload[0];
          console.log(newLogos);
        } else if (!state.logos.front.logo2) {
          console.log("second logo front");
          newLogos.front.logo2 = action.payload[0];
        } else if (!state.logos.front.logo3) {
          // console.log("second logo");
          newLogos.front.logo3 = action.payload[0];
        } else if (!state.logos.front.logo4) {
          // console.log("second logo");
          newLogos.front.logo4 = action.payload[0];
        } else if (!state.logos.front.logo5) {
          // console.log("second logo");
          newLogos.front.logo5 = action.payload[0];
        } else if (!state.logos.front.logo6) {
          // console.log("second logo");
          newLogos.front.logo6 = action.payload[0];
        } else {
          console.log("no logos front");
        }
      } else {
        if (!state.logos.back.logo1) {
          console.log("first logo back");
          newLogos.back.logo1 = action.payload[0];
          console.log(newLogos);
        } else if (!state.logos.back.logo2) {
          console.log("second logo back");
          newLogos.back.logo2 = action.payload[0];
        } else if (!state.logos.back.logo3) {
          // console.log("second logo");
          newLogos.back.logo3 = action.payload[0];
        } else if (!state.logos.back.logo4) {
          // console.log("second logo");
          newLogos.back.logo4 = action.payload[0];
        } else if (!state.logos.back.logo5) {
          // console.log("second logo");
          newLogos.back.logo5 = action.payload[0];
        } else if (!state.logos.back.logo6) {
          // console.log("second logo");
          newLogos.back.logo6 = action.payload[0];
        } else {
          console.log("no logos back");
        }
      }

      return { ...state, logos: newLogos };
    case CHANGE_LOGO_DIMENSIONS:
      console.log("changing logo dimensions at index.js/reducer");
      console.log(action);
      console.log(state.logos);

      let scalar = 0;

      if (action.payload.type === "inc") {
        scalar = 1.1;
      } else {
        scalar = 1 / 1.1;
      }

      let newLogoDimensions = state.logos;
      currentKeyDimensions = "logo" + action.payload.logoId;

      if (state.front) {
        newLogoDimensions.front[currentKeyDimensions].widthDefault =
          newLogoDimensions.front[currentKeyDimensions].widthDefault * scalar;

        newLogoDimensions.front[currentKeyDimensions].heightDefault =
          newLogoDimensions.front[currentKeyDimensions].heightDefault * scalar;
      } else {
        newLogoDimensions.back[currentKeyDimensions].widthDefault =
          newLogoDimensions.back[currentKeyDimensions].widthDefault * scalar;

        newLogoDimensions.back[currentKeyDimensions].heightDefault =
          newLogoDimensions.back[currentKeyDimensions].heightDefault * scalar;
      }

      let currentKeyDimensions = "logo" + action.payload.logoId;

      console.log(newLogoDimensions);

      return { ...state, logos: newLogoDimensions };

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
