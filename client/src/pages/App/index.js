import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ConfigProvider } from "antd";

import Footer from "../../components/Footer";
import Login from "../LoginPage";
import Logout from "../LogoutPage";
import LandingPage from "../LandingPage";
import Header from "../../components/Header";
import MainPage from "../MainPage";
import SettingsPage from "../SettingsPage";

// TODO: Style hyperlinks in the Terms, etc. pages

const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {},
      }}
    >
      <div className="Root">
        <div className="App">
          <Router>
            <Header />

            <main style={{ padding: "1rem" }}>
              <Switch>
                <Route exact path="/">
                  <MainPage />
                </Route>
                <Route path="/landing">
                  <LandingPage />
                  <Footer />
                </Route>
                <Route path="/login">
                  <Login />
                  <Footer />
                </Route>
                <Route path="/logout">
                  <Logout />
                  <Footer />
                </Route>
                <Route path="/settings">
                  <SettingsPage />
                </Route>
              </Switch>
            </main>
          </Router>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default App;
