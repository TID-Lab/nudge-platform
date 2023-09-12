import React, { useState } from "react";
import { Form, Modal, Radio, Space, DatePicker, Result, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
import { SmileOutlined } from "@ant-design/icons";

import { dispatchAssignment, fetchAssignments } from "../../api/nudge";

const ConfirmSendModal = (props) => {
  const dispatch = useDispatch();
  const pendingNudges = useSelector((state) => state.pendingNudges);
  const scheduledNudges = useSelector((state) => state.scheduledAssignments);

  const [isScheduled, setIsScheduled] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
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
    console.log("Pending Nudges");
    console.log(pendingNudges);
    console.log("Scheduled Nudges");
    console.log(scheduledNudges);
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

    // Update scheduled assignments list
    // this code repeats in PendingNudgeList/index.js
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

    dispatch({ type: "pendingNudges/set", payload: [] });
    onCancel();
    setSuccessModal(true);
  };

  const onCancel = () => {
    props.onCancel();
    setOkText("Confirm");
    setLoading(false);
  };

  return (
    <div>
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
      <Modal
        title="Congratulations"
        open={successModal}
        width={700}
        height={700}
        okText={okText}
        confirmLoading={loading}
        onCancel={() => setSuccessModal(false)}
        onOk={() => setSuccessModal(false)}
        footer={null}
      >
        <Result
          icon={<SmileOutlined />}
          title="Congratulations!"
          subTitle="You achieved something great!"
        />
      </Modal>
    </div>
  );
};

export default ConfirmSendModal;
