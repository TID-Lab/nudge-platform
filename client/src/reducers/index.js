// Combines together every reducer into a root reducer

import { combineReducers } from "redux";

import filtersReducer from "./filters";
import postsReducer from "./posts";
import popupReducer from "./popup";
import postingMenuReducer from "./postingMenu";
import postingTextReducer from "./postingText";
import postingImageReducer from "./postingImage";
import pendingNudgesReducer from "./pendingNudges";
import nudgeReducer from "./nudges";

const rootReducer = combineReducers({
  filters: filtersReducer,
  posts: postsReducer,
  popup: popupReducer,
  postingMenu: postingMenuReducer,
  postingText: postingTextReducer,
  postingImage: postingImageReducer,
  pendingNudges: pendingNudgesReducer,
  nudges: nudgeReducer,
});

export default rootReducer;
