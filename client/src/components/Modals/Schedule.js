import React from "react";
import { useDispatch } from "react-redux";
import { Modal, List, Button, Space, Collapse, Tag, Empty } from "antd";
import { useState } from "react";
import { CheckOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import styled from "styled-components";
import { cancelSchedule } from "../../api/nudge";

const { Panel } = Collapse;

export default function ScheduleModal({
  open,
  onCancel,
  schedules,
  openReSch,
  setReJobId,
}) {
  const dispatch = useDispatch();

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
  const [rescheduleOpen, setRescheduleOpen] = useState(false);

  return (
    <div>
      <Modal
        width={800}
        title="Scheduled Nudge Assignments"
        open={open}
        onCancel={onCancel}
        footer={null}
      >
        {schedules.length === 0 ? (
          <Empty description="No assignments scheduled" />
        ) : (
          <Collapse>
            {schedules.map(({ id, nextRunAt, nudges }) => (
              <StyledPanel
                header={
                  <Space size={"large"}>
                    <div>{dayjs(nextRunAt).format("MM/DD/YYYY h:mmA")}</div>
                    <div>
                      {nudges.length} nudge{nudges.length > 1 ? "s" : ""}{" "}
                      assigned
                    </div>
                  </Space>
                }
                key={id}
                extra={[
                  <Button type="link" onClick={() => onAssignmentCancel(id)}>
                    Cancel
                  </Button>,
                  <Button
                    type="link"
                    onClick={() => {
                      setReJobId(id);
                      openReSch();
                    }}
                  >
                    Reschedule
                  </Button>,
                ]}
              >
                <List
                  dataSource={nudges}
                  renderItem={({ text, demographics, assigned, color }) => (
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
            ))}
          </Collapse>
        )}
      </Modal>
      <Modal>
        width={800}
        title="Scheduled Nudge Assignments" open={rescheduleOpen}
        onCancel = {() => setRescheduleOpen(false)}
        footer={null}
      </Modal>
    </div>
  );
}

const StyledPanel = styled(Panel)`
  .ant-collapse-header {
    align-items: center !important;
  }
`;
