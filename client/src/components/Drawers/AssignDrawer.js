import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Space,
  Form,
  Drawer,
  Button,
  Card,
  Checkbox,
  Typography,
  Alert,
  Switch,
  Radio,
  Popover,
  Modal,
} from "antd";
import { presetPrimaryColors } from "@ant-design/colors";
import styled from "styled-components";

import { checkAssignment } from "../../api/nudge";
import { DEMO_ENUM } from "../../util/constants";

const colors = Object.values(presetPrimaryColors).map((_, i, arr) => {
  if (i % 2 === 0) {
    return arr[i];
  } else {
    return arr[arr.length - i];
  }
});
const { Text, Title, Link, Paragraph } = Typography;

const AssignDrawer = ({ open, onClose, nudge }) => {
  const dispatch = useDispatch();
  const pendingNudges = useSelector((state) => state.pendingNudges);
  const [form] = Form.useForm();

  const [error, setError] = useState("");
  const [excludedParticipants, setExcludedParticipants] = useState({});
  const [isExcludeModalOpen, setIsExcludeModalOpen] = useState(false);
  const [assignPayload, setAssignPayload] = useState();

  // First confirmation after assigning demographics
  const onSubmit = (values) => {
    let demographics = Object.values(values).filter((d) => d !== undefined);

    if (demographics.length === 0) {
      setError("Please select at least one demographic");

      return;
    } else {
      demographics = demographics.flat();
      demographics.pop();
    }

    const newPendingNudges = [
      ...pendingNudges,
      {
        id: nudge._id,
        text: nudge.message,
        demographics: demographics,
      },
    ];

    checkAssignment(newPendingNudges)
      .then((res) => {
        const lastRes = res[newPendingNudges.length - 1];
        const payload = {
          id: nudge._id,
          text: nudge.message,
          demographics: demographics,
          assigned: lastRes.num_assigned,
          color: colors[pendingNudges.length % colors.length],
          key: nudge.key,
        };

        setAssignPayload(payload);

        if (lastRes.success_code === "SUCCESS") {
          if (payload.assigned !== 0) {
            dispatch({
              type: "pendingNudges/add",
              payload: payload,
            });
          }

          handleClose();
        } else if (
          lastRes.success_code === "PARTICIPANTS_ALREADY_SENT" &&
          Object.keys(lastRes.overlap).length !== 0
        ) {
          setIsExcludeModalOpen(true);
          setExcludedParticipants(lastRes.overlap);
        } else if (lastRes.success_code === "NO_PARTICIPANT") {
          setError(
            'No participants are left with this demographic grouping. Please try a different combination, or toggle "All Unassigned"'
          );
        }
      })
      .catch((e) => console.log(e));
  };

  const handleAssign = () => {
    const payload = assignPayload;

    if (payload.assigned !== 0) {
      dispatch({
        type: "pendingNudges/add",
        payload: payload,
      });
    }

    handleClose();
  };

  const handleClose = () => {
    onClose();
    form.resetFields();
    setExcludedParticipants({});
    setAssignPayload();
    setIsExcludeModalOpen(false);
    setError("");
  };

  const onValuesChange = (changed, all) => {
    // checkExcluded(all);

    if (changed.hasOwnProperty("unassigned") && changed.unassigned) {
      form.resetFields();
      form.setFieldValue("unassigned", true);
    } else {
      form.setFieldValue("unassigned", false);
    }
  };

  // TODO: Check whether some participants in the current assignment has already gotten the nudge
  const checkExcluded = (formValues) => {
    setExcludedParticipants(["foo", "bar"]);
  };

  return (
    <>
      <Drawer
        title="Assign"
        width={900}
        size="large"
        onClose={handleClose}
        open={open}
        footer={
          <Space>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              onClick={() => form.submit()}
              type="primary"
              htmlType="submit"
            >
              Confirm
            </Button>
          </Space>
        }
      >
        <NudgeCard title={`Nudge #${nudge.key + 1}`}>{nudge.message}</NudgeCard>

        {error !== "" && <Alert message={error} type="error" showIcon />}

        <Title level={3}>Please select demographic to assign:</Title>

        <Form
          layout="vertical"
          form={form}
          name="assignForm"
          onFinish={onSubmit}
          onValuesChange={onValuesChange}
        >
          <Form.Item label="Testing Status" name="testing-status">
            <Radio.Group
              options={[
                { value: DEMO_ENUM.TestStatus.Tested, label: "Tested" },
                { value: DEMO_ENUM.TestStatus.NotTested, label: "Not Tested" },
                {
                  value: DEMO_ENUM.TestStatus.NoResponse,
                  label: "No Response",
                },
              ]}
            />
          </Form.Item>

          <Form.Item label="Sick Status" name="sick-status">
            <Radio.Group
              options={[
                { value: DEMO_ENUM.SickStatus.Sick, label: "Sick" },
                { value: DEMO_ENUM.SickStatus.NotSick, label: "Not Sick" },
                {
                  value: DEMO_ENUM.SickStatus.NoResponse,
                  label: "No Response",
                },
              ]}
            />
          </Form.Item>

          <Form.Item label="Race" name="race">
            <Checkbox.Group
              options={[
                { value: DEMO_ENUM.Race.Black, label: "Black" },
                { value: DEMO_ENUM.Race.Latinx, label: "Latinx" },
                { value: DEMO_ENUM.Race.Asian, label: "Asian" },
                { value: DEMO_ENUM.Race.White, label: "White" },
                {
                  value: DEMO_ENUM.Race.NativeAmerican,
                  label: "Native American",
                },
              ]}
            />
          </Form.Item>
          <Form.Item label="Gender" name="gender">
            <Checkbox.Group
              options={[
                { value: DEMO_ENUM.Sex.Female, label: "Female" },
                { value: DEMO_ENUM.Sex.Male, label: "Male" },
                { value: DEMO_ENUM.Sex.Intersex, label: "Non-binary" },
              ]}
            />
          </Form.Item>
          <Form.Item label="Age" name="age">
            <Checkbox.Group
              options={[
                { value: DEMO_ENUM.Age[0], label: "18-29" },
                { value: DEMO_ENUM.Age[1], label: "30-40" },
                { value: DEMO_ENUM.Age[2], label: "41-50" },
                { value: DEMO_ENUM.Age[3], label: "51-64" },
                { value: DEMO_ENUM.Age[4], label: "65 and older" },
              ]}
            />
          </Form.Item>
          <Form.Item label="Diabetes" name="diabetes">
            <Checkbox.Group
              options={[
                {
                  value: DEMO_ENUM.Diabetes.HasDiabetes,
                  label: "Has Diabetes",
                },
                { value: DEMO_ENUM.Diabetes.AtRisk, label: "At Risk" },
                { value: DEMO_ENUM.Diabetes.Caretaker, label: "Caretaker" },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="unassigned"
            valuePropName="checked"
            label="All Unassigned"
          >
            <Switch>All Unassigned</Switch>
          </Form.Item>
        </Form>
      </Drawer>

      <Modal
        title="Excluding Participants"
        open={isExcludeModalOpen}
        onOk={handleAssign}
        onCancel={handleClose}
      >
        <Paragraph>
          Some participants have already received this nudge
        </Paragraph>
        <Text>
          <Popover
            title="Excluded participant IDs"
            content={Object.entries(excludedParticipants).map(
              ([partCode, message]) => (
                <li key={partCode}>
                  <Text copyable>{`${partCode}: ${message}`}</Text>
                </li>
              )
            )}
            trigger="hover"
          >
            <Link>{Object.keys(excludedParticipants).length} participants</Link>
          </Popover>{" "}
          will be excluded from this assignment.
        </Text>
      </Modal>
    </>
  );
};

export default AssignDrawer;

const NudgeCard = styled(Card)`
  margin-bottom: 3rem;
  background-color: #fafafa;
`;
