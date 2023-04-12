import React, { useState } from "react";
import { Modal, List, Button, Space, Collapse, Tag } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import styled from "styled-components";

const { Panel } = Collapse;

export default function ScheduleModal({ open, onCancel, schedules }) {
  const onAssignmentCancel = (assignment) => {};

  return (
    <Modal
      width={800}
      title="Scheduled Nudge Assignments"
      open={open}
      onCancel={onCancel}
      footer={null}
    >
      <Collapse>
        {schedules.map(({ time, nudges }, i) => (
          <StyledPanel
            header={
              <Space size={"large"}>
                <div>{dayjs(time).format("MM/DD/YYYY h:mmA")}</div>
                <div>
                  {nudges.length} nudge{nudges.length > 1 ? "s" : ""} assigned
                </div>
              </Space>
            }
            key={i}
            extra={[
              <Button
                type="link"
                onClick={() => onAssignmentCancel({ time, nudges })}
              >
                Cancel
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
                          <Tag key={i} color="blue" icon={<CheckOutlined />}>
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
    </Modal>
  );
}

const StyledPanel = styled(Panel)`
  .ant-collapse-header {
    align-items: center !important;
  }
`;
