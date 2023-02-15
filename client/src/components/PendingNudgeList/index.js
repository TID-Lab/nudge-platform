import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Card, Space, Statistic, Empty } from "antd";
import styled from "styled-components";

import PendingNudge from "../PendingNudge";
import ErrorBanner from "../ErrorBanner";
import PopupModal from "../PopupModal";
import { fetchTotalParticipants } from "../../api/nudge";
import "./index.css";

const PendingNudgeList = () => {
  const dispatch = useDispatch();
  const pendingNudges = useSelector((state) => state.pendingNudges);
  const [numParticipants, setNumParticipants] = useState(0);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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
    setShowSuccess(false);
    setShowError(false);
  }, [pendingNudges]);

  function submitCheck() {
    if (numParticipants === totalParticipants) {
      console.log("TODO: Call backend API");
      setShowSuccess(true);
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

      <ButtonGroup>
        <Button
          block
          onClick={() => dispatch({ type: "pendingNudges/set", payload: [] })}
        >
          Reset
        </Button>
        <Button block onClick={() => submitCheck()} type="primary">
          Submit
        </Button>
      </ButtonGroup>

      {showError && (
        <ErrorBanner
          text={"Not all participants assigned nudges!"}
        ></ErrorBanner>
      )}
      {/* {showSuccess && <h3>Success!</h3>} */}
      {showSuccess && (
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
      )}
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
    flex: 1;
    display: flex;
    align-items: center;

    .ant-empty {
      width: 100%;
    }
  }
`;

const ButtonGroup = styled(Space)`
  width: 100%;

  .ant-space-item {
    flex: 1;
  }
`;
