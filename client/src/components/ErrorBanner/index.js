import "./index.css";
import { MdErrorOutline } from "react-icons/md";

const ErrorBanner = (props) => {
  const { text } = props;

  return (
    <div className="ErrorBanner">
      <MdErrorOutline />
      {<h1 className="ErrorText"> {text} </h1>}
    </div>
  );
};

export default ErrorBanner;
