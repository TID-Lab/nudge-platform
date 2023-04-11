import React, { useState } from "react";
import { Modal, List, Typography, Button, Space, Collapse } from "antd";
import "dayjs";
import dayjs from "dayjs";

const { Panel } = Collapse;

export default function ScheduleModal({ open, onCancel, schedules }) {
  return (
    <Modal
      width={800}
      title="Scheduled Nudge Assignments"
      open={open}
      onCancel={onCancel}
      footer={null}
    >
      <Collapse>
        {schedules.map(({ time, nudges }) => (
          <Panel
            header={
              <Space size={"large"}>
                <div>{dayjs(time).format("MM/DD/YYYY h:mmA")}</div>
                <div>
                  {nudges.length} nudge{nudges.length > 1 ? "s" : ""} assigned
                </div>
              </Space>
            }
            key="1"
            extra={[
              <Button type="link">Cancel</Button>,
              <Button type="link">Reschedule</Button>,
            ]}
          >
            {console.log(time)}
            <List
              bordered
              dataSource={nudges}
              renderItem={(nudges) => <List.Item></List.Item>}
            />
          </Panel>
        ))}
      </Collapse>
    </Modal>
  );
}
