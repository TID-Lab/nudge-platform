import React, { useState } from "react";
import { Form, Modal, Radio, Space, DatePicker, Result, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";

import { dispatchAssignment, fetchAssignments } from "../../api/nudge";

const ConfirmSendModal = (props) => {
  const dispatch = useDispatch();
  const pendingNudges = useSelector((state) => state.pendingNudges);

  const [isScheduled, setIsScheduled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [okText, setOkText] = useState("Confirm");
  const [scheduledTime, setScheduledTime] = useState(null);

  const onRadioChange = (e) => {
    setIsScheduled(e.target.value);
  };

  const disabledDate = (current) => {
    return current < dayjs().subtract(1, "day");
  };
  const onOk = async () => {
    if (isScheduled) {
      if (!scheduledTime) {
        Modal.error({
          content: "Please select a time to schedule the nudges.",
        });

        return;
      }

      try {
        await dispatchAssignment(
          pendingNudges,
          true,
          dayjs(scheduledTime).toDate()
        ); // can this give me the latest schedule?

        // this code repeats in PendingNudgeList/index.js
        fetchAssignments()
          .then((jobs) => {
            const assignments = jobs
              .filter(({ lastRunAt }) => !lastRunAt)
              .map(({ _id, nextRunAt, data }) => {
                return { id: _id, nextRunAt, nudges: data.nudges };
              });

            dispatch({
              type: "scheduledAssignments/set",
              payload: assignments.filter(
                (assignment) => !assignment.lastRunAt
              ),
            });
          })
          .catch((e) => console.log(e));
      } catch (e) {
        Modal.error({
          content: "Error scheduling nudges. Please try again.",
        });
      }
    } else {
      setOkText("Sending nudges...");
      setLoading(true);
      await dispatchAssignment(pendingNudges, false);
    }

    dispatch({ type: "pendingNudges/set", payload: [] });
    onCancel();
  };

  const onCancel = () => {
    props.onCancel();
    setOkText("Confirm");
    setLoading(false);
  };

  return (
    <Modal
      title="Confirm Send"
      open={props.open}
      width={700}
      okText={okText}
      confirmLoading={loading}
      onOk={onOk}
      onCancel={onCancel}
    >
      <Form>
        <Form.Item>
          <Radio.Group onChange={onRadioChange} value={isScheduled}>
            <Space direction="vertical">
              <Radio value={false}>Send it now</Radio>
              <Radio value={true}>Schedule a time</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>

        <Form.Item>
          <Space>
            <DatePicker
              showTime
              use12Hours
              disabled={!isScheduled}
              value={scheduledTime}
              onChange={(date) => setScheduledTime(date)}
              format={"MM/DD/YYYY HH:mm A"}
              disabledDate={disabledDate}
            />
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ConfirmSendModal;
