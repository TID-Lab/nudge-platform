import { useState } from "react";
import "./index.css";

const DemographicButton = (props) => {
  const { toggleFunction, label } = props;
  const [isToggled, setIsToggled] = useState(false);
  function combinedToggle(e) {
    toggleFunction();
    setIsToggled(!isToggled);
  }

  return (
    <button className={isToggled ? "On" : "Off"} onClick={combinedToggle}>
      {label}
    </button>
  );
};

export default DemographicButton;
