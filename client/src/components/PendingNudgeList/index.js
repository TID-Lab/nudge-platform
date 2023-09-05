import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Card, Space, Empty, Alert, Typography } from "antd";
import styled from "styled-components";

import PendingNudgeCard from "../Cards/PendingNudgeCard";
import ConfirmSendModal from "../Modals/ConfirmSend";
import ScheduleModal from "../Modals/Schedule";
import ConfirmRescheduleModal from "../Modals/ConfirmReschedule";
import "./index.css";
import { fetchAssignments } from "../../api/nudge";

const { Title } = Typography;

const PendingNudgeList = ({ total }) => {
  const dispatch = useDispatch();
  const pendingNudges = useSelector((state) => state.pendingNudges);
  const scheduledAssignments = useSelector(
    (state) => state.scheduledAssignments
  );
  const [numParticipants, setNumParticipants] = useState(0);
  const [showError, setShowError] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isReModalOpen, setIsReModalOpen] = useState(false)
  const [jobRescheduleId, setJobRescheduleId] = useState(null)

  useEffect(() => {
    let participants = 0;
    pendingNudges.forEach((nudge) => (participants += nudge.assigned));
    setNumParticipants(participants);
  }, [pendingNudges]);

  useEffect(() => {
    fetchAssignments()
      .then((jobs) => {
        console.log(jobs)
        const assignments = jobs
          .filter(({ lastRunAt }) => !lastRunAt)
          .map(({ _id, nextRunAt, data }) => {
            return { id: _id, nextRunAt, nudges: data.nudges };
          });

        dispatch({
          type: "scheduledAssignments/set",
          payload: assignments,
        });
      })
      .catch((e) => console.log(e));
  }, [dispatch]);

  function onSend() {
    setIsSendModalOpen(true);
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

      <div className="list-title-wrapper">
        <h3>Nudges to Send</h3>

        {scheduledAssignments.length > 0 && (
          <Button onClick={() => setIsScheduleModalOpen(true)}>
            <b>{scheduledAssignments.length} </b>scheduled assignments
          </Button>
        )}
      </div>

      <div className="list">
        {pendingNudges.length === 0 ? (
          <Empty description="No pending nudges" />
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
          onClick={onSend}
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

      <ScheduleModal
        open={isScheduleModalOpen}
        onCancel={() => setIsScheduleModalOpen(false)}
        schedules={scheduledAssignments}
        openReSch={()=>{setIsReModalOpen(true); console.log("Modal Triggered")}}
        setReJobId = {(the_id)=>setJobRescheduleId(the_id)}
      />
      <ConfirmRescheduleModal
      open={isReModalOpen}
      onCancel={()=>setIsReModalOpen(false)}
      jobid={jobRescheduleId}>
      
        

      </ConfirmRescheduleModal>

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
