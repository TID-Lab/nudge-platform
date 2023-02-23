import { Tooltip } from "antd";
import styled from "styled-components";

/**
 * A progress bar with multiple segments within it. Each segment is represented by a value
 * that represents its portion of the share. A percentage is calculated for each segment based
 * on a total value to compute what percentage of the UI it should take up. The total can be specified
 * using the total prop or if no total is specified, the values are added up and that is the total.
 *
 * Example:
 *    <MultiProgressBar
 *        nudges={[ list of pending nudges ]}
 *        total={200} />
 */

const MultiProgressBar = ({ nudges, total }) => {
  return (
    <StyledBar>
      {nudges &&
        nudges.map((nudge, i) => (
          <Tooltip title={nudge.text} key={i} placement="bottom">
            <Progress
              percent={(nudge.assigned / total) * 100}
              background={nudge.color}
            />
          </Tooltip>
        ))}
    </StyledBar>
  );
};

export default MultiProgressBar;

const StyledBar = styled.div`
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 0.5em;
  height: 38px;

  & > div {
    display: inline-block;
    height: 100%;
  }

  & > div:first-child {
    border-top-left-radius: 0.5em;
    border-bottom-left-radius: 0.5em;
  }

  & > div:last-child {
    border-top-right-radius: 0.5em;
    border-bottom-right-radius: 0.5em;
  }
`;

const Progress = styled.div`
  width: ${(props) => props.percent}%;
  background-color: ${(props) => props.background};
`;
