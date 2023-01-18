import './index.css';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ErrorBanner = (props) => {
  const {text} = props;

  return (
    <div className='ErrorBanner'>
      <ErrorOutlineIcon/>
      {<h1 className='ErrorText'> {text} </h1>}
    </div>
  )
};

export default ErrorBanner;