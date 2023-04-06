// Initializes the client-side React app.

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import store from "./store";
import App from "./pages/App";

import "./fonts/OpenSauceTwo-Regular.ttf";
import "./fonts/OpenSauceTwo-Bold.ttf";
import "./fonts/OpenSauceTwo-Italic.ttf";
import "./fonts/OpenSauceTwo-Black.ttf";
import "./fonts/OpenSauceTwo-Medium.ttf";
import "./fonts/OpenSauceTwo-SemiBold.ttf";

import "./index.css";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
