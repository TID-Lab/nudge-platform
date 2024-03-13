import React, { useState } from "react";
import { Modal, DatePicker, Result } from "antd";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";

import { dispatchAssignment } from "../../api/nudge";
import { useUpdateAssignmentLists } from "../../hooks/nudge";

const ScheduleModal = (props) => {
  const dispatch = useDispatch();
  const pendingNudges = useSelector((state) => state.pendingNudges);
  const updateAssignmentLists = useUpdateAssignmentLists();

  const [successModal, setSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [okText, setOkText] = useState("Confirm");
  const [scheduledTime, setScheduledTime] = useState(null);

  const disabledDate = (current) => {
    return current < dayjs().subtract(1, "day");
  };
  const onOk = async () => {
    if (!scheduledTime) {
      Modal.error({
        content: "Please select a time to schedule the nudges.",
      });

      return;
    }

    try {
      const { job } = await dispatchAssignment(
        pendingNudges,
        true,
        dayjs(scheduledTime).toDate()
      ); // can this give me the latest schedule?

      props.onOk(job._id);
    } catch (e) {
      Modal.error({
        content: "Error scheduling nudges. Please try again.",
      });
    }

    updateAssignmentLists();

    dispatch({ type: "pendingNudges/set", payload: [] });
  };

  const onCancel = () => {
    props.onCancel();
    setOkText("Confirm");
    setLoading(false);
  };

  return (
    <>
      <Modal
        title="Schedule for later"
        open={props.open}
        okText={okText}
        confirmLoading={loading}
        onOk={onOk}
        onCancel={onCancel}
      >
        <DatePicker
          showTime
          use12Hours
          value={scheduledTime}
          onChange={(date) => setScheduledTime(date)}
          format={"MM/DD/YYYY HH:mm A"}
          disabledDate={disabledDate}
        />
      </Modal>

      <Modal
        title="Nudge Scheduled"
        open={successModal}
        onCancel={() => setSuccessModal(false)}
        onOk={() => setSuccessModal(false)}
      >
        <Result
          status="success"
          title="Nudge Scheduled"
          subTitle={`Nudge scheduled at ${dayjs(scheduledTime).format(
            "MM/DD/YYYY HH:mm A"
          )}`}
        />
      </Modal>
    </>
  );
};

export default ScheduleModal;
