import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { List, Space, Collapse, Tag, Empty, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import { CheckOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import styled from "styled-components";

const { Panel } = Collapse;

export default function SentAssignmentsList({ schedules }) {
  const nudges = useSelector((state) => state.nudges);
  const [query, setQuery] = useState(undefined);

  const sentAssignments = useMemo(() => {
    return schedules
      .filter(({ nudges }) => {
        if (query === undefined) return true;

        return nudges.some(({ text }) =>
          text.toLowerCase().includes(query.toLowerCase())
        );
      })
      .sort((a, b) => new Date(b.lastRunAt) - new Date(a.lastRunAt));
  }, [schedules, query]);

  return (
    <div>
      <Select
        showSearch
        allowClear
        suffixIcon={<SearchOutlined />}
        options={nudges.map(({ message }) => ({
          value: message,
          label: message,
        }))}
        placeholder="Search for sent nudges"
        style={{ width: "100%", marginBottom: "1rem" }}
        onChange={(value) => setQuery(value)}
      />

      {sentAssignments.length === 0 ? (
        <Empty description="No assignments" />
      ) : (
        <Collapse>
          {sentAssignments.map(({ id, lastRunAt, nudges }) => (
            <StyledPanel
              header={
                <Space size={"large"}>
                  <div>{dayjs(lastRunAt).format("MM/DD/YYYY h:mmA")}</div>
                  <div>
                    {nudges.length} nudge{nudges.length > 1 ? "s" : ""} assigned
                  </div>
                </Space>
              }
              key={id}
            >
              <List
                dataSource={nudges}
                renderItem={({ text, demographics, assigned, color }) => (
                  <List.Item
                    style={{
                      borderLeft: `${color} solid 3px`,
                      paddingLeft: "0.5rem",
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
      )}
    </div>
  );
}

const StyledPanel = styled(Panel)`
  .ant-collapse-header {
    align-items: center !important;
  }
`;
