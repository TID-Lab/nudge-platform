import React, { useState } from "react";
import { Form, Modal, Radio, Space, DatePicker, Result, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
import { SmileOutlined } from "@ant-design/icons";
import { reSchedule } from "../../api/nudge";

import {
  dispatchAssignment,
  fetchAssignments,
  cancelSchedule,
} from "../../api/nudge";

/**
 * Confirm reschedule nudge assignments
 *
 * TODO: Merge with confirm send modal
 */
const ConfirmRescheduleModal = (props) => {
  const dispatch = useDispatch();
  const pendingNudges = useSelector((state) => state.pendingNudges);
  const scheduledNudges = useSelector((state) => state.scheduledAssignments);

  const [isScheduled, setIsScheduled] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [okText, setOkText] = useState("Confirm");
  const [scheduledTime, setScheduledTime] = useState(null);
  const id = props.jobid;

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
        await reSchedule(id, dayjs(scheduledTime).toDate()); // can this give me the latest schedule?
      } catch (e) {
        Modal.error({
          content: "Error scheduling nudges. Please try again.",
        });
      }
    } else {
      //filter only the job with the id from the scheduledNudges
      console.log(id);
      console.log(scheduledNudges);
      const toSendNudge = scheduledNudges.filter((job) => job.id == id)[0]
        .nudges;
      await dispatchAssignment(toSendNudge, false).then((res) => {
        //console.log(res);
        console.log(res);
        if (res !== []) {
          cancelSchedule(id);
        }
      });
    }

    //dispatch({ type: "pendingNudges/set", payload: [] });
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
        title="Confirm Reschedule"
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
          subTitle={
            "You have updated your nudges time to" +
            dayjs(scheduledTime).toDate()
          }
        />
      </Modal>
    </div>
  );
};

export default ConfirmRescheduleModal;
