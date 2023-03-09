import React, { useState } from "react";
import { Select, Space, Divider, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

import CreateNudgeDrawer from "../Drawers/CreateNudgeDrawer";

export const PendingNudgeSelect = ({ value, onSelect }) => {
  const nudges = useSelector((state) => state.nudges);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <Select
        showSearch
        bordered={false}
        style={{
          width: "100%",
        }}
        value={value}
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
        options={nudges
          .filter((nudge) => nudge.is_active)
          .map(({ message }) => ({
            label: message,
            value: message,
          }))}
        onSelect={onSelect}
      />

      <CreateNudgeDrawer
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
      />
    </>
  );
};
