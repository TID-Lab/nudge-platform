import { red, orange, yellow } from "@ant-design/colors";
import { Tooltip } from "antd";

import "./index.css";

/**
 * A progress bar with multiple segments within it. Each segment is represented by a value
 * that represents its portion of the share. A percentage is calculated for each segment based
 * on a total value to compute what percentage of the UI it should take up. The total can be specified
 * using the total prop or if no total is specified, the values are added up and that is the total.
 *
 * Example:
 *    <MultiProgressBar values={[24, 15, 55]} total={200} />
 */

const MultiProgressBar = (props) => {
  const colors = [red.primary, orange.primary, yellow.primary]; // We can add more colors here.
  const total = props.values.reduce((sum, val) => sum + val, 0);

  return (
    <div className="MultiProgressBar">
      {props.values &&
        props.values.map((segmentValue, index) => (
          <Tooltip title={props.tooltips ? props.tooltips[index] : ""}>
            <div
              style={{
                width: `${(segmentValue / (props.total || total)) * 100}%`,
                backgroundColor: `${colors[index % colors.length]}`,
              }}
            />
          </Tooltip>
        ))}
    </div>
  );
};

export default MultiProgressBar;
