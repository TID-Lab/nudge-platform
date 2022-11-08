import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { useSelector } from 'react-redux';

import './index.css';

import Footer from '../Footer';
import Dashboard from '../Dashboard';
import Settings from '../Settings';
import Login from '../Login';
import PrivacyPolicy from '../PrivacyPolicy';
import Terms from '../Terms';
import DataDeletion from '../DataDeletion';
import Header from '../Header';

// TODO: Style hyperlinks in the Terms, etc. pages

const App = () => {
  const popupModal = useSelector(state => state.popup);

  return (
    <div className='Root'>
      <div className='App'>
        <Router>
          <Header />
          <Switch>
            <Route exact path="/"> 
              <Dashboard />
            </Route>
            <Route path="/login">
              <Login />
              <Footer />
            </Route>
          </Switch>

        </Router>
      </div>
      <div id='Popup'>
        {popupModal}
      </div>
    </div>
  );
}

export default App;