import React from "react";
import { Modal, Typography } from "antd";

const { Paragraph, Text } = Typography;

const NewNudgeDiaryModal = (props) => {
  return (
    <Modal
      title="New Nudge Diary"
      open={props.open}
      onOk={props.onOk}
      onCancel={props.onCancel}
      width={800}
    >
      <Paragraph>
        Date created:{" "}
        <Text copyable mark>
          {props.id ? props.id : "No date found, please email admins"}
        </Text>
        . Please copy the date and paste it into the survey to complete!
      </Paragraph>

      <iframe
        src="https://gatech.co1.qualtrics.com/jfe/form/SV_dhRSObQ1uzNMYOq"
        title="Diary survey"
        width={750}
        height={500}
      />
    </Modal>
  );
};

export default NewNudgeDiaryModal;
