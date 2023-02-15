import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ConfigProvider } from "antd";

import "./index.css";

import Footer from "../../components/Footer";
import Login from "../LoginPage";
import Header from "../../components/Header";
import MainPage from "../MainPage";

// TODO: Style hyperlinks in the Terms, etc. pages

const App = () => {
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
      </div>
    </ConfigProvider>
  );
};

export default App;
