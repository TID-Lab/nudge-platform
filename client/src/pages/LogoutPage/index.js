import './index.css';

import useAuth from '../../hooks/auth';


const Logout = () => {
  console.log("LOGOUT PAGE");
  //useAuth(false, '/');

  return (
  <div className='Logout'>
    {/*<LoginModal />*/}

    <button onClick={async ()=> {
      try {
        const response = await fetch('/api/auth/logout', {
          method: 'GET',
          body: JSON.stringify({}),
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`Error! status: ${response.status}`);
        }

        const result = await response.json();

        console.log('result is: ', JSON.stringify(result, null, 4));


      } catch (err) {
        console.log('exception: ' + err.message);
      }

    }}>
      Logout
    </button>
  </div>
  );
};

export default Logout;
