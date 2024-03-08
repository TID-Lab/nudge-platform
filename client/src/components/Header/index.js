import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Space, Button, Menu, Form, Upload, message, Flex } from "antd";
import { FormOutlined, UploadOutlined } from "@ant-design/icons";
import styled from "styled-components";

import Logo from "../Logo";
import CreateNudgeDrawer from "../Drawers/CreateNudgeDrawer";
import { participantCsvToJson } from "../../util/participant";
import UploadParticipantsModal from "../Modals/UploadParticipantsModal";
import { uploadParticipants } from "../../api/participant";
import { Link } from "react-router-dom/cjs/react-router-dom";

const Header = () => {
  const dispatch = useDispatch();

  const existingParticipants = useSelector((state) => state.participants);

  const [messageApi, contextHolder] = message.useMessage();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [participants, setParticipants] = useState([]); // List of new participants to upload to server

  // Transform CSV to JSON before uploading to server
  function onBeforeUpload(file) {
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = (e) => {
      const csv = e.target.result;
      const participantsJson = participantCsvToJson(csv);
      setParticipants(participantsJson);
    };

    return false;
  }

  function onUploadParticipantModalCancel() {
    setParticipants([]);
  }

  function onUploadParticipantModalOk() {
    // Update on server and DB
    dispatch({
      type: "participants/set",
      payload: [...existingParticipants, ...participants],
    });
    uploadParticipants(participants);
    setParticipants([]);
    messageApi.success("Participants uploaded successfully");
  }

  return (
    <StyledHeader>
      {contextHolder}

      <Flex justify="space-between">
        <Space>
          <Logo />

          <Menu
            mode="horizontal"
            items={[
              { label: <Link to="/">Nudges</Link> },
              { label: <Link to="/analytics">Analytics</Link> },
              { label: <Link to="/settings">Settings</Link> },
            ]}
          />
        </Space>

        <Space justify="center">
          <Button
            size="large"
            type="primary"
            icon={<FormOutlined />}
            onClick={() => setIsDrawerOpen(true)}
          >
            Create Nudge
          </Button>

          <Upload
            maxCount={1}
            accept=".csv"
            showUploadList={false}
            beforeUpload={onBeforeUpload}
          >
            <Button size="large" type="secondary" icon={<UploadOutlined />}>
              Upload Participants
            </Button>
          </Upload>
        </Space>

        <Space style={{ width: 300 }}> </Space>
      </Flex>

      <CreateNudgeDrawer
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
      />

      <UploadParticipantsModal
        participants={participants}
        onCancel={onUploadParticipantModalCancel}
        onOk={onUploadParticipantModalOk}
        open={participants.length !== 0}
      />
    </StyledHeader>
  );
};

export default Header;

const StyledHeader = styled.header`
  background-color: var(--body-background);
  padding: 1rem;
`;
