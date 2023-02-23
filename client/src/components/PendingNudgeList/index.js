import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Card, Space, Statistic, Empty, Alert } from "antd";
import styled from "styled-components";

import PendingNudge from "../Cards/PendingNudgeCard";
import { fetchTotalParticipants } from "../../api/nudge";
import "./index.css";
import { ConfirmSendModal } from "../Modals/ConfirmSend";

const PendingNudgeList = () => {
  const dispatch = useDispatch();
  const pendingNudges = useSelector((state) => state.pendingNudges);
  const [numParticipants, setNumParticipants] = useState(0);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [showError, setShowError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // dispatch({ type: 'pendingNudges/set', payload: [{text: 'lorum ipsum', categories: ['female'], assigned: 50}]})
  useEffect(() => {
    fetchTotalParticipants()
      .then((numParticipants) => setTotalParticipants(numParticipants))
      .catch((err) => console.log("err:" + err));
  }, []);

  useEffect(() => {
    let participants = 0;
    pendingNudges.forEach((nudge) => (participants += nudge.assigned));
    setNumParticipants(participants);
  }, [pendingNudges]);

  function onSend() {
    if (numParticipants === totalParticipants) {
      console.log("TODO: Call backend API");
      setIsModalOpen(true);
    } else {
      setShowError(true);
    }
  }

  return (
    <ListContainer direction="vertical">
      <Card bordered={false}>
        <Statistic
          title="Assigned"
          value={numParticipants}
          suffix={`/ ${totalParticipants}`}
        />
      </Card>

      <h3>Nudges to Send</h3>

      <div className="list">
        {pendingNudges.length === 0 ? (
          <Empty description="No pending nudges" />
        ) : (
          pendingNudges.map((pendingNudge, index) => (
            <PendingNudge
              data={{ ...pendingNudge, order: index + 1 }}
              key={pendingNudge.text}
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
