import './index.css';

import React from 'react';
import {
  useHistory
} from 'react-router-dom';



const LandingPage = () => {

  const history = useHistory();

  return (
  <div className='LandingPage'>
    <h1> Landing Page! </h1>
    {/*<div>*/}
    {/*<a href='/'>Check out the dashboard for sample code (ish)</a>*/}
    {/*</div>*/}

    <div>
      <a href='/api/auth/caslogin'>Log in!</a>
      {/*?redirectTo=beer& */}
    {/*<a*/}
    {/*    onClick={()=> {*/}
    {/*        fetch('/api/auth/caslogin', {method: 'GET'})*/}
    {/*            .then(history.push('/dashboard'));*/}
    {/*  }}>LOG IN!!</a>*/}
    </div>
    <div>
      {/*<a href='/api/auth/caslogout'>Log out!</a>*/}
      <button
          onClick={()=> {
            console.log("logging out...");
            fetch('/api/auth/caslogout', {method: 'GET'})
                .then(history.push('/landing'));
          }}>
        LOG OUT!!
      </button>
    </div>
  </div>

  );
};

export default LandingPage;
