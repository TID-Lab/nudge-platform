import React, { useState } from "react";
import { Form, Modal, Radio, Space, DatePicker, Result, message } from "antd";

import { useSelector, useDispatch } from "react-redux";
import { dispatchAssignment } from "../../api/nudge";

const ConfirmSendModal = (props) => {
  const dispatch = useDispatch();
  const pendingNudges = useSelector((state) => state.pendingNudges);
  const [isScheduled, setIsScheduled] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [okText, setOkText] = useState("Confirm");
  const [scheduledTime, setScheduledTime] = useState(null);

  const onRadioChange = (e) => {
    setIsScheduled(e.target.value);
  };

  const onOk = () => {
    if (!result) {
      if (isScheduled) {
        // TODO: Implement scheduling
        if (!scheduledTime) {
          message.error("Please select a time to schedule the nudges.");
        }

        dispatch({
          type: "scheduledAssignment/add",
          payload: { time: scheduledTime, nudges: pendingNudges },
        });
      } else {
        setOkText("Sending nudges...");
        setLoading(true);

        const reformattedNudges = pendingNudges.map((nudge) => {
          return {
            nudge_id: nudge.id,
            demographics: nudge.demographics,
            nudge_message: nudge.text,
          };
        });

        dispatchAssignment(reformattedNudges, false);
      }

      dispatch({ type: "pendingNudges/set", payload: [] });
      setResult("success");
      setOkText("Ok");
    } else if (result === "success") {
      onCancel();
    }
  };

  const onCancel = () => {
    props.onCancel();
    setResult(null);
    setOkText("Confirm");
    setLoading(false);
  };

  let content = (
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
  );

  if (result === "success") {
    content = (
      <Result
        status="success"
        title="Successfully sent your nudge!"
        subTitle="Your nudge has been sent to all your participants."
      />
    );
  }

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
      {content}
    </Modal>
  );
};

export default ConfirmSendModal;
