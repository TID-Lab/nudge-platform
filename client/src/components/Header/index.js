import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Space, Button, Menu, Form, Upload, message, Flex } from "antd";
import { FormOutlined, UploadOutlined } from "@ant-design/icons";
import styled from "styled-components";

import Logo from "../Logo";
import CreateNudgeDrawer from "../Drawers/CreateNudgeDrawer";
import { createNudge, fetchNudges } from "../../api/nudge";
import { participantCsvToJson } from "../../util/participant";
import UploadParticipantsModal from "../Modals/UploadParticipantsModal";
import { uploadParticipants } from "../../api/participant";
import { Link } from "react-router-dom/cjs/react-router-dom";

const Header = () => {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [participants, setParticipants] = useState([]); // List of new participants to upload to server
  const [resp, setResp] = useState({
    state: "",
  });

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
      payload: participants,
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
              { label: "Analytics" },
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

      <Form.Provider
        onFormFinish={(name, { values }) => {
          if (name === "createNudgeForm") {
            const newNudge = {
              ...values,
              date_created: Date(),
              is_active: true,
            };

            createNudge(newNudge)
              // TODO: More elegant way to sync/refetch. https://redux.js.org/tutorials/essentials/part-5-async-logic
              .then(() => fetchNudges())
              .then((nudges) =>
                dispatch({
                  type: "nudges/set",
                  payload: nudges,
                })
              )
              .catch((err) => {
                // TODO: Make alert messages more user-readable
                setResp({
                  state: "error",
                  message: err.message,
                });
              });
          }

          setIsDrawerOpen(false);
        }}
      >
        <CreateNudgeDrawer
          onClose={() => setIsDrawerOpen(false)}
          open={isDrawerOpen}
        />
      </Form.Provider>

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
