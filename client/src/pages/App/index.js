import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { useSelector } from 'react-redux';

import './index.css';

import Footer from '../../components/Footer';
import Dashboard from '../../components/Dashboard';
import Login from '../LoginPage';
import Header from '../../components/Header';
import MainPage from '../MainPage';
import AnalysisPage from '../AnalysisPage';
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
              <MainPage />
            </Route>
            <Route path="/login">
              <Login />
              <Footer />
            </Route>
            <Route path ="/analysis">
              <AnalysisPage />
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