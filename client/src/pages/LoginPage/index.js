import './index.css';

import useAuth from '../../hooks/auth';
import LoginModal from '../../components/LoginModal';
import {
  //useNavigate,
  useHistory
} from 'react-router-dom';

const Login = () => {
  console.log("LOGIN PAGE");

  const history = useHistory();

  useAuth(false, '/');

  return (
      <div className='Login'>
        {/*<LoginModal />*/}

        <button onClick={async ()=> {
          try {

            //redirect('/api/auth/caslogin');
            const response = await fetch('/api/auth/caslogin', {
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

            // const result = await response.json();

            // console.log('result is: ', JSON.stringify(result, null, 4));

            //const history = useHistory();
            history.push('/');
            //const navigate = useNavigate();
            //navigate('/');
            //navigate('/');

          } catch (err) {
            console.log(err.message);
          }

        }}>
          Login
        </button>
      </div>
  );
};

export default Login;
