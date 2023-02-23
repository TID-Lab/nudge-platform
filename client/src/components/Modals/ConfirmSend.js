import React, { useState } from "react";
import { Form, Modal, Radio, Space, TimePicker, DatePicker } from "antd";

export const ConfirmSendModal = (props) => {
  const [sendOption, setSendOption] = useState(1);

  const onRadioChange = (e) => {
    setSendOption(e.target.value);
  };

  return (
    <Modal {...props} width={700} okText="Confirm">
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
    </Modal>
  );
};
