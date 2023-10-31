import {
  Button,
  Flex,
  Layout,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
} from "antd";

import useAuth from "../../hooks/auth";
import { useEffect, useState } from "react";
import { fetchAllParticipants } from "../../api/participant";

const { Content } = Layout;
const { Title } = Typography;

const SettingsPage = () => {
  useAuth();

  const [changedParticipants, setChangedParticipants] = useState({});
  const [allParticipants, setAllParticipants] = useState([]);

  useEffect(() => {
    fetchAllParticipants().then((participants) => {
      setAllParticipants(participants);
    });
  }, []);

  const handleActiveToggle = (isActive, index) => {
    allParticipants[index].active = isActive;

    setChangedParticipants({
      ...changedParticipants,
      [allParticipants[index].participantId]: allParticipants[index].active,
    });
    setAllParticipants([...allParticipants]);
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
          dataSource={allParticipants.map((participant) => {
            return {
              ...participant,
              key: participant.participantId,
            };
          })}
        />
      </section>

      <Flex justify="end">
        <Button
          type="primary"
          size="large"
          onClick={handleSubmitParticipantChanges}
        >
          Submit
        </Button>
      </Flex>
    </Content>
  );
};

export default SettingsPage;
