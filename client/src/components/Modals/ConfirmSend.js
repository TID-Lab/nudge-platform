import React, { useState } from "react";
import { Form, Modal, Radio, Space, DatePicker, Result, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";

import { dispatchAssignment } from "../../api/nudge";

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

  const onOk = async () => {
    if (isScheduled) {
      // TODO: Implement scheduling
      if (!scheduledTime) {
        Modal.error({
          content: "Please select a time to schedule the nudges.",
        });

        return;
      }

      dispatchAssignment(pendingNudges, true, dayjs(scheduledTime).toDate());
      dispatch({
        type: "scheduledAssignment/add",
        payload: { time: scheduledTime, nudges: pendingNudges },
      });
    } else {
      setOkText("Sending nudges...");
      setLoading(true);
      dispatchAssignment(pendingNudges, false);
    }

    dispatch({ type: "pendingNudges/set", payload: [] });
    props.onCancel();
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
              disabled={!isScheduled}
              value={scheduledTime}
              onChange={(date) => setScheduledTime(date)}
            />
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ConfirmSendModal;
