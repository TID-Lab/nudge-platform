import React, { useState } from "react";
import {
  Form,
  Modal,
  Radio,
  Space,
  TimePicker,
  DatePicker,
  Result,
} from "antd";

import { useSelector, useDispatch } from "react-redux";
import { sendNudges } from "../../api/nudge";

export const ConfirmSendModal = (props) => {
  const dispatch = useDispatch();
  const pendingNudges = useSelector((state) => state.pendingNudges);
  const [sendOption, setSendOption] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [okText, setOkText] = useState("Confirm");

  const onRadioChange = (e) => {
    setSendOption(e.target.value);
  };

  const onOk = () => {
    if (okText === "Confirm") {
      setOkText("Sending nudges...");
      setLoading(true);
      // const reformattedNudges = pendingNudges.map((nudge) => {
      //   return { nudge_id: nudge.id, demographics: nudge.demographics, nudge_message: nudge.text };
      // });
      // sendNudges(reformattedNudges);
      // dispatch({ type: "pendingNudges/set", payload: [] })
    } else if (okText === "Close") {
      props.onCancel();
      setResult(null);
      setOkText("Confirm");
    }
  };

  const onCancel = () => {
    props.onCancel();
    setResult(null);
    setOkText("Confirm");
  };

  let content = (
    <Form>
      <Form.Item>
        <Radio.Group onChange={onRadioChange} value={sendOption}>
          <Space direction="vertical">
            <Radio value={1}>Send it now</Radio>
            <Radio value={2}>Schedule a time</Radio>
          </Space>
        </Radio.Group>
      </Form.Item>

      <Form.Item>
        <Space>
          <DatePicker onChange={() => {}} disabled={sendOption === 1} />
          <TimePicker onChange={() => {}} disabled={sendOption === 1} />
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
  } else if (result === "error") {
    content = (
      <Result
        status="error"
        title="An error occurred."
        subTitle="Please try again later."
      />
    );
  }

  return (
    <Modal
      title={props.title}
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
