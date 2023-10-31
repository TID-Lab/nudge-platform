import { Button, Layout, Space, Switch, Table, Tag, Typography } from "antd";
import { useSelector } from "react-redux";

import useAuth from "../../hooks/auth";

const { Content } = Layout;
const { Title } = Typography;

const SettingsPage = () => {
  useAuth();

  const participants = useSelector((state) => state.participants);

  return (
    <Content>
      <Title>Settings</Title>

      <section>
        <Title level={2}>All Participants</Title>

        <Table
          columns={[
            {
              title: "ID",
              dataIndex: "participantId",
              key: "participantId",
            },
            {
              title: "Labels",
              dataIndex: "labels",
              key: "labels",
              render: (labels) => {
                return (
                  <>
                    {labels.map((label, i) => {
                      return (
                        <Tag color="blue" key={i}>
                          {label}
                        </Tag>
                      );
                    })}
                  </>
                );
              },
            },
            {
              title: "Active",
              key: "active",
              render: () => (
                <Space>
                  <Switch defaultChecked />
                </Space>
              ),
            },
          ]}
          dataSource={participants.map((participant) => {
            return {
              ...participant,
              key: participant.participantId,
            };
          })}
        />
      </section>
    </Content>
  );
};

export default SettingsPage;
