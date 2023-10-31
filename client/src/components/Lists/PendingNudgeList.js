import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Card, Space, Empty, Alert, Typography } from "antd";
import styled from "styled-components";

import PendingNudgeCard from "../Cards/PendingNudgeCard";
import ConfirmSendModal from "../Modals/ConfirmSend";
import { fetchAssignments } from "../../api/nudge";
import UploadParticipantsModal from "../Modals/UploadParticipantsModal";

const { Title } = Typography;

const PendingNudgeList = ({ total, pendingNudges }) => {
  const dispatch = useDispatch();
  const participants = useSelector((state) => state.participants);

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
    fetchAssignments()
      .then((jobs) => {
        const scheduled = jobs.filter(({ lastRunAt }) => !lastRunAt);
        const sent = jobs.filter(({ lastRunAt }) => lastRunAt);

        dispatch({
          type: "scheduledAssignments/set",
          payload: scheduled.map(({ _id, nextRunAt, data }) => {
            return { id: _id, nextRunAt, nudges: data.nudges };
          }),
        });
        dispatch({
          type: "sentAssignments/set",
          payload: sent.map(({ _id, lastRunAt, data }) => {
            return { id: _id, lastRunAt, nudges: data.nudges };
          }),
        });
      })
      .catch((e) => console.log(e));
  }, [dispatch]);

  const handleAssignmentSend = () => {
    const hasOrphans = false; // TODO: check if there are orphans

    if (hasOrphans) {
      setIsParticipantModalOpen(true);
    } else {
      setIsSendModalOpen(true);
    }
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
        <Button
          block
          onClick={handleAssignmentSend}
          type="primary"
          disabled={numParticipants !== total}
        >
          Send
        </Button>
      </ButtonGroup>

      <ConfirmSendModal
        open={isSendModalOpen}
        onCancel={() => setIsSendModalOpen(false)}
      />

      <UploadParticipantsModal
        open={isParticipantModalOpen}
        onCancel={() => setIsParticipantModalOpen(false)}
        onOk={() => setIsSendModalOpen(true)}
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
`;

const AssignmentCard = styled(Card)`
  background-color: #f1f5f9;
`;
