import React from "react";
import { Modal, Typography } from "antd";

const { Paragraph, Text } = Typography;

const AssignmentDiaryModal = (props) => {
  return (
    <Modal
      title="Assignment Diary Modal"
      open={props.open}
      onOk={props.onOk}
      onCancel={props.onCancel}
      width={800}
    >
      <Paragraph>
        Please copy the batch ID and paste it into the survey to complete:{" "}
        <Text copyable mark>
          {props.batchId
            ? props.batchId
            : "No batch ID found, please email admins"}
        </Text>
      </Paragraph>

      <iframe
        src="https://gatech.co1.qualtrics.com/jfe/form/SV_eUT03VVMpLsMzBQ"
        title="Diary survey"
        width={750}
        height={500}
      />
    </Modal>
  );
};

export default AssignmentDiaryModal;
