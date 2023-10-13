import React from "react";
import { useDispatch } from "react-redux";
import { List, Button, Space, Collapse, Tag, Empty } from "antd";
import { useState } from "react";
import { CheckOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import styled from "styled-components";
import { cancelSchedule } from "../../api/nudge";
import SendAssignmentModal from "../Modals/ConfirmReschedule";

const { Panel } = Collapse;

export default function ScheduledAssignmentsList({ schedules }) {
  const dispatch = useDispatch();
  const [rescheduleJobId, setRescheduleJobId] = useState();

  const onAssignmentCancel = async (id) => {
    try {
      cancelSchedule(id); // do you need async/await logic here?
      dispatch({
        type: "scheduledAssignments/delete",
        payload: id,
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      {schedules.length === 0 ? (
        <Empty description="No assignments scheduled" />
      ) : (
        <Collapse>
          {schedules
            .sort((a, b) => new Date(b.nextRunAt) - new Date(a.nextRunAt))
            .map(({ id, nextRunAt, nudges }) => (
              <StyledPanel
                key={id}
                header={
                  <Space size={"large"}>
                    <div>{dayjs(nextRunAt).format("MM/DD/YYYY h:mmA")}</div>
                    <div>
                      {nudges.length} nudge{nudges.length > 1 ? "s" : ""}{" "}
                      assigned
                    </div>
                  </Space>
                }
                extra={[
                  <Button
                    type="link"
                    onClick={() => onAssignmentCancel(id)}
                    key="cancel-btn"
                  >
                    Cancel
                  </Button>,
                  <Button
                    type="link"
                    onClick={(e) => {
                      e.stopPropagation();
                      setRescheduleJobId(id);
                    }}
                    key="reschedule-btn"
                  >
                    Reschedule
                  </Button>,
                ]}
              >
                <List
                  dataSource={nudges}
                  renderItem={({ text, demographics, assigned, color }, i) => (
                    <List.Item
                      style={{
                        borderLeft: `${color} solid 3px`,
                      }}
                    >
                      <Space size={"large"}>
                        <div>{text}</div>
                        <div>{assigned} Assigned</div>
                        <div>
                          {demographics.length === 0 ? (
                            <Tag color="blue" icon={<CheckOutlined />}>
                              All Unassigned
                            </Tag>
                          ) : (
                            demographics.map((category, i) => (
                              // Category values aren't very well formatted
                              <Tag
                                key={i}
                                color="blue"
                                icon={<CheckOutlined />}
                              >
                                {category}
                              </Tag>
                            ))
                          )}
                        </div>
                      </Space>
                    </List.Item>
                  )}
                />
              </StyledPanel>
            ))
            .sort((a, b) => a.nextRunAt - b.nextRunAt)}
        </Collapse>
      )}

      <SendAssignmentModal
        open={rescheduleJobId !== undefined}
        onCancel={() => setRescheduleJobId(undefined)}
        jobid={rescheduleJobId}
      />
    </div>
  );
}

const StyledPanel = styled(Panel)`
  .ant-collapse-header {
    align-items: center !important;
  }
`;
