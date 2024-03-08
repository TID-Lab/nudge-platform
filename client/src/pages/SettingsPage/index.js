import {
  Button,
  Flex,
  Layout,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
  message,
} from "antd";

import useAuth from "../../hooks/auth";
import { useEffect, useState } from "react";
import {
  fetchAllParticipants,
  setParticipantActive,
} from "../../api/participant";
import { calcWeekOfStudy } from "../../util/participant";

const { Content } = Layout;
const { Title } = Typography;

const SettingsPage = () => {
  useAuth();
  const [messageApi, contextHolder] = message.useMessage();

  const [changedParticipants, setChangedParticipants] = useState({});
  const [allParticipants, setAllParticipants] = useState([]);

  useEffect(() => {
    fetchAllParticipants().then((participants) => {
      setAllParticipants(participants);
    });
  }, []);

  const handleActiveToggle = (isActive, changedParticipant) => {
    setAllParticipants(
      allParticipants.map((p) => {
        if (p.participantId !== changedParticipant.participantId) {
          return p;
        }

        return {
          ...changedParticipant,
          active: isActive,
        };
      })
    );

    setChangedParticipants({
      ...changedParticipants,
      [changedParticipant.participantId]: isActive,
    });
  };

  const handleSubmitParticipantChanges = async () => {
    try {
      await setParticipantActive(changedParticipants);
      messageApi.success("Successfully updated participants");
    } catch (e) {
      messageApi.error(`Failed to update participants: ${e.message}`);
    }
  };

  return (
    <Content>
      {contextHolder}
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
              title: "Week of Study",
              key: "weekOfStudy",
              render: (participant) => {
                return (
                  <div>{calcWeekOfStudy("2024-01-21T00:02:12.855000")}</div>
                );
              },
            },
            {
              title: "Active",
              key: "active",
              render: (participant) => (
                <Space>
                  <Switch
                    checked={participant.active}
                    onChange={(checked) =>
                      handleActiveToggle(checked, participant)
                    }
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
