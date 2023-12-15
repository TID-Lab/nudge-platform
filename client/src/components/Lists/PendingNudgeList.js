import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Card,
  Space,
  Empty,
  Alert,
  Typography,
  Dropdown,
  Modal,
  Popconfirm,
} from "antd";
import { DownOutlined, ClockCircleOutlined } from "@ant-design/icons";
import styled from "styled-components";

import PendingNudgeCard from "../Cards/PendingNudgeCard";
import ScheduleModal from "../Modals/ScheduleModal";
import { dispatchAssignment } from "../../api/nudge";
import UploadParticipantsModal from "../Modals/UploadParticipantsModal";
import { useUpdateAssignmentLists } from "../../hooks/nudge";

const { Title } = Typography;

const PendingNudgeList = ({ total, pendingNudges }) => {
  const dispatch = useDispatch();
  const participants = useSelector((state) => state.participants);
  const updateAssignmentLists = useUpdateAssignmentLists();

  const [numParticipants, setNumParticipants] = useState(0);
  const [showError, setShowError] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false); // Modal for assignment confirmation
  const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false); // Modal for participant list (orphan)

  useEffect(() => {
    let participants = 0;
    pendingNudges.forEach((nudge) => (participants += nudge.assigned));
    setNumParticipants(participants);
  }, [pendingNudges]);

  useEffect(() => {
    updateAssignmentLists();
  }, [updateAssignmentLists]);

  const handleAssignmentSend = async () => {
    const hasOrphans = false; // TODO: check if there are orphans

    if (hasOrphans) {
      setIsParticipantModalOpen(true);
    }

    await dispatchAssignment(pendingNudges, false);
    updateAssignmentLists();
    dispatch({ type: "pendingNudges/set", payload: [] });
  };

  return (
    <ListContainer direction="vertical">
      <AssignmentCard bordered={false}>
        <Space size="middle">
          <Space>
            <Title>{numParticipants}</Title> <Title level={3}>/ {total}</Title>
          </Space>

          <Title level={3}>Participants Assigned</Title>
        </Space>
      </AssignmentCard>

      <div className="list-title-wrapper">
        <h3>Nudges to Send</h3>
      </div>

      <div className="list">
        {pendingNudges.length === 0 ? (
          <Empty
            description="No pending nudges"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          pendingNudges.map((pendingNudge, i) => (
            <PendingNudgeCard
              data={pendingNudge}
              key={i}
              index={i}
              readonly={i !== pendingNudges.length - 1}
            />
          ))
        )}
      </div>

      {showError && (
        <Alert
          message="Not all participants are assigned nudges!"
          type="error"
          showIcon
          closable
          afterClose={() => setShowError(false)}
        />
      )}

      <ButtonGroup>
        <Button
          block
          onClick={() => dispatch({ type: "pendingNudges/set", payload: [] })}
        >
          Reset
        </Button>

        <Popconfirm
          onConfirm={handleAssignmentSend}
          title="Send Now"
          description="Send the above nudge assignments now?"
        >
          <Dropdown.Button
            icon={<DownOutlined />}
            type="primary"
            menu={{
              items: [
                {
                  key: "send-later",
                  label: "Send Later",
                  icon: <ClockCircleOutlined />,
                  onClick: () => {
                    setIsSendModalOpen(true);
                  },
                },
              ],
            }}
            disabled={numParticipants !== total}
          >
            Send
          </Dropdown.Button>
        </Popconfirm>
      </ButtonGroup>

      <ScheduleModal
        open={isSendModalOpen}
        onCancel={() => setIsSendModalOpen(false)}
      />

      <UploadParticipantsModal
        open={isParticipantModalOpen}
        onCancel={() => setIsParticipantModalOpen(false)}
        participants={participants}
      ></UploadParticipantsModal>
    </ListContainer>
  );
};

export default PendingNudgeList;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  height: 100%;

  .list {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    overflow-y: auto;

    .ant-empty {
      width: 100%;
      margin: auto;
    }
  }

  .list-title-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

const ButtonGroup = styled(Space)`
  width: 100%;

  .ant-space-item {
    flex: 1;
  }

  .ant-btn-compact-first-item {
    width: 100%;
  }
`;

const AssignmentCard = styled(Card)`
  background-color: #f1f5f9;
`;
