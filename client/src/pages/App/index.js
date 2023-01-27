import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { ConfigProvider } from "antd";

import "./index.css";

import Footer from "../../components/Footer";
import Dashboard from "../../components/Dashboard";
import Login from "../LoginPage";
import Header from "../../components/Header";
import MainPage from "../MainPage";

// TODO: Style hyperlinks in the Terms, etc. pages

const App = () => {
  const popupModal = useSelector((state) => state.popup);

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "Open Sauce Two, sans-serif",
        },
      }}
    >
      <div className="Root">
        <div className="App">
          <Router>
            <Header />
            <Switch>
              <Route exact path="/">
                <MainPage />
              </Route>
              <Route path="/login">
                <Login />
                <Footer />
              </Route>
            </Switch>
          </Router>
        </div>
        <div id="Popup">{popupModal}</div>
      </div>
    </ConfigProvider>
  );
};

export default App;
