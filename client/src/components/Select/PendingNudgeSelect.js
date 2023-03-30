import React, { useState } from "react";
import { Select, Space, Divider, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

import CreateNudgeDrawer from "../Drawers/CreateNudgeDrawer";

const { Option } = Select;

export const PendingNudgeSelect = ({ message, onSelect }) => {
  const nudges = useSelector((state) => state.nudges);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <Select
        showSearch
        bordered={false}
        optionLabelProp="label"
        style={{
          width: "100%",
        }}
        value={message}
        dropdownRender={(menu) => (
          <>
            {menu}
            <Divider
              style={{
                margin: "8px 0",
              }}
            />
            <Space
              style={{
                padding: "0 8px 4px",
              }}
            >
              <Button
                type="text"
                icon={<PlusOutlined />}
                onClick={() => setIsDrawerOpen(true)}
              >
                New nudge
              </Button>
            </Space>
          </>
        )}
        onSelect={onSelect}
      >
        {nudges
          .filter((nudge) => nudge.is_active)
          .map(({ key, message }) => (
            <Option key={key} value={message} label={message}>
              <Space size="middle">
                <span style={{ color: "#bfbfbf" }}>{key + 1}</span>
                <span>{message}</span>
              </Space>
            </Option>
          ))}
      </Select>

      <CreateNudgeDrawer
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
      />
    </>
  );
};
