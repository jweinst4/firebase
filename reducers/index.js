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
  CHOOSE_LOGO,
  CHANGE_LOGO_DIMENSIONS,
  REMEMBER_LOGO_LOCATION,
  CHANGE_LOGO_POSITION,
  TOGGLE_FRONT_OR_BACK
} from "../actions/items";
import { defaultItems } from "../data/defaultItems";

let logoMaxPixelsDefault = 120;
let logoWidth = 0;
let logoHeight = 0;
let url = "";
let urlKey = "";
let imageWidth = 0;
let imageHeight = 0;
let defaultLogoPositionX = 120;
let defaultLogoPositionY = 120;
let newLogos = {};

const initialItemState = {
  shirtUrl: defaultItems[0].url,
  backShirtUrl: defaultItems[0].backURL,
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
      logo1Front: "",
      logo2Front: "",
      logo3Front: "",
      logo4Front: "",
      logo5Front: "",
      logo6Front: ""
    },
    back: {
      logo1Back: "",
      logo2Back: "",
      logo3Back: "",
      logo4Back: "",
      logo5Back: "",
      logo6Back: ""
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
      console.log("in add logo in reducer");
      // console.log(state);
      // console.log(action.payload);

      url = action.payload[0];
      logoWidth = action.payload[1];
      logoHeight = action.payload[2];
      urlKey = action.payload[3];

      newLogos = state.logos;

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
            heightDefault: logoHeightDefault,
            defaultLogoPositionX: defaultLogoPositionX,
            defaultLogoPositionY: defaultLogoPositionY
          }
        };
        newLogos = firstLogo;
        // console.log(newLogos);
      } else {
        console.log("at least one logo");
        newLogos[urlKey] = {
          url: url,
          width: logoWidth,
          height: logoHeight,
          widthDefault: logoWidthDefault,
          heightDefault: logoHeightDefault,
          defaultLogoPositionX: defaultLogoPositionX,
          defaultLogoPositionY: defaultLogoPositionY
        };
        console.log(newLogos);
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
          priorLogos[logoKeys[i]].defaultLogoPositionX = defaultLogoPositionX;
          priorLogos[logoKeys[i]].defaultLogoPositionY = defaultLogoPositionY;
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
    case CHOOSE_LOGO:
      console.log("at choose logo in index.js reducer");
      // console.log(state);
      console.log(action);

      let newLogos = state.logos;
      console.log(newLogos);

      if (state.front) {
        if (!state.logos.front.logo1Front) {
          console.log("first logo front");
          newLogos.front.logo1Front = action.payload[0];
          newLogos.front.logo1Front.defaultLogoPositionX = defaultLogoPositionX;
          newLogos.front.logo1Front.defaultLogoPositionY = defaultLogoPositionY;
          console.log(newLogos);
        } else if (!state.logos.front.logo2Front) {
          console.log("second logo front");

          const newLogos3 = state.logos;
          newLogos3.front.logo2Front = action.payload[0];
          newLogos3.front.logo2Front.defaultLogoPositionX = defaultLogoPositionX;
          newLogos3.front.logo2Front.defaultLogoPositionY = defaultLogoPositionY;

          console.log(newLogos3);
          return { ...state, logos: newLogos3 };
        } else if (!state.logos.front.logo3Front) {
          // console.log("second logo");
          newLogos.front.logo3Front = action.payload[0];
          newLogos.front.logo3Front.defaultLogoPositionX = defaultLogoPositionX;
          newLogos.front.logo3Front.defaultLogoPositionY = defaultLogoPositionY;
        } else if (!state.logos.front.logo4Front) {
          // console.log("second logo");
          newLogos.front.logo4Front = action.payload[0];
          newLogos.front.logo4Front.defaultLogoPositionX = defaultLogoPositionX;
          newLogos.front.logo4Front.defaultLogoPositionY = defaultLogoPositionY;
        } else if (!state.logos.front.logo5Front) {
          // console.log("second logo");
          newLogos.front.logo5Front = action.payload[0];
          newLogos.front.logo5Front.defaultLogoPositionX = defaultLogoPositionX;
          newLogos.front.logo5Front.defaultLogoPositionY = defaultLogoPositionY;
        } else if (!state.logos.front.logo6Front) {
          // console.log("second logo");
          newLogos.front.logo6Front = action.payload[0];
          newLogos.front.logo6Front.defaultLogoPositionX = defaultLogoPositionX;
          newLogos.front.logo6Front.defaultLogoPositionY = defaultLogoPositionY;
        } else {
          // console.log("no logos front");
        }
      } else {
        if (!state.logos.back.logo1Back) {
          console.log("first logo back");
          newLogos.back.logo1Back = action.payload[0];
          newLogos.back.logo1Back.defaultLogoPositionX = defaultLogoPositionX;
          newLogos.back.logo1Back.defaultLogoPositionY = defaultLogoPositionY;
          console.log(newLogos);
        } else if (!state.logos.back.logo2Back) {
          // console.log("second logo back");
          const newLogos3 = state.logos;
          newLogos3.back.logo2Back = action.payload[0];
          newLogos3.back.logo2Back.defaultLogoPositionX = defaultLogoPositionX;
          newLogos3.back.logo2Back.defaultLogoPositionY = defaultLogoPositionY;
        } else if (!state.logos.back.logo3Back) {
          // console.log("second logo");
          newLogos.back.logo3Back = action.payload[0];
          newLogos.back.logo3Back.defaultLogoPositionX = defaultLogoPositionX;
          newLogos.back.logo3Back.defaultLogoPositionY = defaultLogoPositionY;
        } else if (!state.logos.back.logo4Back) {
          // console.log("second logo");
          newLogos.back.logo4Back = action.payload[0];
          newLogos.back.logo4Back.defaultLogoPositionX = defaultLogoPositionX;
          newLogos.back.logo4Back.defaultLogoPositionY = defaultLogoPositionY;
        } else if (!state.logos.back.logo5Back) {
          // console.log("second logo");
          newLogos.back.logo5Back = action.payload[0];
          newLogos.back.logo5Back.defaultLogoPositionX = defaultLogoPositionX;
          newLogos.back.logo5Back.defaultLogoPositionY = defaultLogoPositionY;
        } else if (!state.logos.back.logo6Back) {
          // console.log("second logo");
          newLogos.back.logo6Back = action.payload[0];
          newLogos.back.logo6Back.defaultLogoPositionX = defaultLogoPositionX;
          newLogos.back.logo6Back.defaultLogoPositionY = defaultLogoPositionY;
        } else {
          // console.log("no logos back");
        }
      }
      console.log("new state below");
      console.log(newLogos);

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
      let currentKeyDimensions = "logo" + action.payload.logoId;

      if (action.payload.front) {
        currentKeyDimensions = "logo" + action.payload.logoId + "Front";
        newLogoDimensions.front[currentKeyDimensions].widthDefault =
          newLogoDimensions.front[currentKeyDimensions].widthDefault * scalar;

        newLogoDimensions.front[currentKeyDimensions].heightDefault =
          newLogoDimensions.front[currentKeyDimensions].heightDefault * scalar;
      } else {
        currentKeyDimensions = "logo" + action.payload.logoId + "Back";
        newLogoDimensions.back[currentKeyDimensions].widthDefault =
          newLogoDimensions.back[currentKeyDimensions].widthDefault * scalar;

        newLogoDimensions.back[currentKeyDimensions].heightDefault =
          newLogoDimensions.back[currentKeyDimensions].heightDefault * scalar;
      }
      // console.log(newLogoDimensions);

      return { ...state, logos: newLogoDimensions };
    case TOGGLE_FRONT_OR_BACK:
      console.log("toggling front or back at index");
      return {
        ...state,
        front: !state.front
      };
    case REMEMBER_LOGO_LOCATION:
      console.log("remember logo location at index.js/reducer");

      // console.log(action);
      // console.log(state.logos);
      let currentLogo = action.payload[0];
      // console.log(currentLogo);

      newLogos = state.logos;
      if (action.payload[2].front) {
        // console.log("front true");
        newLogos.front[currentLogo].defaultLogoPositionX =
          action.payload[1].pageX - 80;
        newLogos.front[currentLogo].defaultLogoPositionY =
          action.payload[1].pageY - 95;
      } else {
        // console.log("back true");
        newLogos.back[currentLogo].defaultLogoPositionX =
          action.payload[1].pageX;
        newLogos.back[currentLogo].defaultLogoPositionY =
          action.payload[1].pageY;
      }
      // console.log("new state below");
      // console.log(newLogos);

      return { ...state, logos: newLogos };
    case CHANGE_LOGO_POSITION:
      console.log("change logo position at index.js/reducer");
      console.log(action);

      let newLogosHere = state.logos;

      let currentKeyHere = action.payload.logoId;

      let scalarHere = 10;

      if (action.payload.front) {
        console.log("true");
        if (action.payload.type === "up") {
          console.log("in up");
          newLogosHere.front[
            "logo" + currentKeyHere + "Front"
          ].defaultLogoPositionX =
            newLogosHere.front["logo" + currentKeyHere + "Front"]
              .defaultLogoPositionX - scalarHere;
        } else if (action.payload.type === "down") {
          // console.log("in down");
          newLogosHere.front[
            "logo" + currentKeyHere + "Front"
          ].defaultLogoPositionX =
            newLogosHere.front["logo" + currentKeyHere + "Front"]
              .defaultLogoPositionX + scalarHere;
        } else if (action.payload.type === "left") {
          // console.log("in left");
          newLogosHere.front[
            "logo" + currentKeyHere + "Front"
          ].defaultLogoPositionY =
            newLogosHere.front["logo" + currentKeyHere + "Front"]
              .defaultLogoPositionY - scalarHere;
        } else if (action.payload.type === "right") {
          // console.log("in right");
          newLogosHere.front[
            "logo" + currentKeyHere + "Front"
          ].defaultLogoPositionY =
            newLogosHere.front["logo" + currentKeyHere + "Front"]
              .defaultLogoPositionY + scalarHere;
        } else {
        }
        // console.log(state.logos.front["logo" + currentKeyHere]);
      } else {
        console.log("false");
        if (action.payload.type === "up") {
          console.log("in up");
          newLogosHere.back[
            "logo" + currentKeyHere + "Back"
          ].defaultLogoPositionX =
            newLogosHere.back["logo" + currentKeyHere + "Back"]
              .defaultLogoPositionX - scalarHere;
        } else if (action.payload.type === "down") {
          // console.log("in down");
          newLogosHere.back[
            "logo" + currentKeyHere + "Back"
          ].defaultLogoPositionX =
            newLogosHere.back["logo" + currentKeyHere + "Back"]
              .defaultLogoPositionX + scalarHere;
        } else if (action.payload.type === "left") {
          // console.log("in left");
          newLogosHere.back[
            "logo" + currentKeyHere + "Back"
          ].defaultLogoPositionY =
            newLogosHere.back["logo" + currentKeyHere + "Back"]
              .defaultLogoPositionY - scalarHere;
        } else if (action.payload.type === "right") {
          // console.log("in right");
          newLogosHere.back[
            "logo" + currentKeyHere + "Back"
          ].defaultLogoPositionY =
            newLogosHere.back["logo" + currentKeyHere + "Back"]
              .defaultLogoPositionY + scalarHere;
        } else {
        }
        // console.log(state.logos.back["logo" + currentKeyHere]);
      }
      console.log("new logos below");
      console.log(newLogosHere);

      return { ...state, logos: newLogosHere };

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
