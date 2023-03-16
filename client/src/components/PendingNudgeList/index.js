import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Card, Space, Empty, Alert, Typography } from "antd";
import styled from "styled-components";

import PendingNudgeCard from "../Cards/PendingNudgeCard";
import "./index.css";
import { ConfirmSendModal } from "../Modals/ConfirmSend";

const { Title } = Typography;

const PendingNudgeList = ({ total }) => {
  const dispatch = useDispatch();
  const pendingNudges = useSelector((state) => state.pendingNudges);
  const [numParticipants, setNumParticipants] = useState(0);
  const [showError, setShowError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let participants = 0;
    pendingNudges.forEach((nudge) => (participants += nudge.assigned));
    setNumParticipants(participants);
  }, [pendingNudges]);

  function onSend() {
    if (numParticipants === total) {
      console.log("TODO: Call backend API");
      setIsModalOpen(true);
    } else {
      setShowError(true);
    }
  }

  return (
    <ListContainer direction="vertical">
      <AssignmentCard bordered={false}>
        <Space size="middle">
          <Space>
            <Title>{numParticipants}</Title> <Title level={3}>/ {total}</Title>
          </Space>

          <Title level={3}>Assigned</Title>
        </Space>
      </AssignmentCard>

      <h3>Nudges to Send</h3>

      <div className="list">
        {pendingNudges.length === 0 ? (
          <Empty description="No pending nudges" />
        ) : (
          pendingNudges.map((pendingNudge, i) => (
            <PendingNudgeCard
              data={{ ...pendingNudge, order: i + 1 }}
              key={i}
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
        />
      )}

      <ButtonGroup>
        <Button
          block
          onClick={() => dispatch({ type: "pendingNudges/set", payload: [] })}
        >
          Reset
        </Button>
        <Button block onClick={onSend} type="primary">
          Send
        </Button>
      </ButtonGroup>

      <ConfirmSendModal
        title="Confirm Send"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
      />

      {/* {showError && (
        <ErrorBanner
          text={"Not all participants assigned nudges!"}
        ></ErrorBanner>
      )} */}

      {/* {showSuccess && (
        <PopupModal
          content={
            <div>
              <h3>[Placeholder for delivery time selector] </h3>{" "}
              <button
                onClick={() =>
                  dispatch({ type: "pendingNudges/set", payload: [] })
                }
              >
                Confirm?
              </button>
            </div>
          }
          handleClose={() => {
            setShowSuccess(!showSuccess);
          }}
        />
      )} */}
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
    height: 35rem; // need to polish style here
    overflow-y: auto;

    .ant-empty {
      width: 100%;
      margin: auto;
    }
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
