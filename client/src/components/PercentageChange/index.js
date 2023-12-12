import './index.css';
import {
  Typography,
} from "antd";

const PercentageChange = ({ value, attribute }) => {
  const isIncrease = value > 0;
  const arrow = isIncrease ? '▲' : '▼';
  const sign = isIncrease ? '+' : '';

  return (
    <div className={`percentage-change ${isIncrease ? 'increase' : 'decrease'}`} style={{ fontSize: "3vw" }}>
      {attribute} {arrow} {value}% 
    </div>
  );
};

export default PercentageChange;
