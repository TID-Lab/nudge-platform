import { Badge, Space, Tooltip } from "antd";
import { useMemo } from "react";
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
  const getTotalAssigned = () => {
    return nudges.reduce((acc, nudge) => acc + nudge.assigned, 0);
  };

  const totalAssigned = useMemo(getTotalAssigned, [nudges]);

  return (
    <BarContainer>
      <StyledBar>
        {nudges &&
          nudges.map((nudge, i) => (
            <Tooltip title={nudge.text} key={i} placement="bottom">
              <Progress
                percent={(nudge.assigned / total) * 100}
                background={nudge.color}
              >
                <Space>
                  <Badge
                    color="white"
                    count={nudge.assigned}
                    style={{ color: "black" }}
                  />
                </Space>
              </Progress>
            </Tooltip>
          ))}
      </StyledBar>

      <div>
        {totalAssigned} / {total}
      </div>
    </BarContainer>
  );
};

export default MultiProgressBar;

const BarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StyledBar = styled.div`
  flex: 1;

  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 0.5em;
  height: 38px;

  & > div {
    height: 100%;
    display: inline-flex;
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
  padding: 0 1rem;

  display: flex;
  align-items: center;
`;
