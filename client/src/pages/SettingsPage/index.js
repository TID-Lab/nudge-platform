import { Button, Layout, Space, Switch, Table, Tag, Typography } from "antd";
import { useSelector, useDispatch } from "react-redux";

import useAuth from "../../hooks/auth";

const { Content } = Layout;
const { Title } = Typography;

const SettingsPage = () => {
  useAuth();
  const dispatch = useDispatch();

  const participants = useSelector((state) => state.participants);

  const handleActiveToggle = (isActive, index) => {
    participants[index].active = isActive;

    dispatch({
      type: "participants/update",
      payload: {
        index,
        participant: participants[index],
      },
    });
  };

  const handleSubmitParticipantChanges = () => {};

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
              render: (_, __, i) => (
                <Space>
                  <Switch
                    defaultChecked
                    onChange={(checked) => handleActiveToggle(checked, i)}
                  />
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

      <Button
        type="primary"
        size="large"
        onClick={handleSubmitParticipantChanges}
      >
        Submit
      </Button>
    </Content>
  );
};

export default SettingsPage;
