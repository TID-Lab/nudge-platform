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
} from "antd";
import { presetPrimaryColors } from "@ant-design/colors";
import styled from "styled-components";

import { checkAssignment } from "../../api/nudge";

const colors = Object.values(presetPrimaryColors).map((_, i, arr) => {
  if (i % 2 === 0) {
    return arr[i];
  } else {
    return arr[arr.length - i];
  }
});
const { Title } = Typography;

const AssignDrawer = ({ open, onClose, nudge }) => {
  const dispatch = useDispatch();
  const pendingNudges = useSelector((state) => state.pendingNudges);
  const [form] = Form.useForm();

  const [error, setError] = useState("");
  const [isControl, setIsControl] = useState(false); // Whether nudge is assigned to control group

  const onFinish = (values) => {
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

        if (lastRes.success_code === "SUCCESS") {
          dispatch({
            type: "pendingNudges/add",
            payload: {
              id: nudge._id,
              text: nudge.message,
              demographics: demographics,
              assigned: lastRes.num_assigned,
              color: colors[pendingNudges.length % colors.length],
              key: nudge.key,
            },
          });
          handleClose();
        } else if (lastRes.success_code === "NO_PARTICIPANT") {
          setError(
            'No participants are left with this demographic grouping. Please try a different combination, or toggle "All Unassigned"'
          );
        }
      })
      .catch((e) => console.log(e));
  };

  const handleClose = () => {
    onClose();
    form.resetFields();
    setError("");
  };

  const onValuesChange = (changedValues) => {
    if (
      changedValues.hasOwnProperty("unassigned") &&
      changedValues.unassigned
    ) {
      form.resetFields();
      form.setFieldValue("unassigned", true);
    } else {
      form.setFieldValue("unassigned", false);
    }
  };

  return (
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
      <Title level={3}>Please select group to assign:</Title>

      <Form
        layout="vertical"
        form={form}
        name="assignForm"
        onFinish={onFinish}
        onValuesChange={onValuesChange}
      >
        <Form.Item label="Study Group" name="studygroup" required>
          <Radio.Group
            onChange={(e) => setIsControl(e.target.value === "control")}
            options={[
              { value: "intervention", label: "Intervention" },
              { value: "control", label: "Control" },
            ]}
          />
        </Form.Item>

        <Form.Item label="Testing Status" name="testingstatus">
          <Checkbox.Group
            disabled={isControl}
            options={[
              { value: "sickxtested", label: "Sick x Tested" },
              { value: "notsickxtested", label: "Not Sick x Tested" },
              { value: "sickxnottested", label: "Sick x Not Tested" },
              { value: "notsickxnottested", label: "Not Sick x Not Tested" },
              { value: "notreported", label: "Not Reported" },
            ]}
          />
        </Form.Item>
        <Form.Item label="Race" name="race">
          <Checkbox.Group
            disabled={isControl}
            options={[
              { value: "black", label: "Black" },
              { value: "latinx", label: "Latinx" },
              { value: "asian", label: "Asian" },
              { value: "white", label: "White" },
              { value: "native-american", label: "Native American" },
            ]}
          />
        </Form.Item>
        <Form.Item label="Gender" name="gender">
          <Checkbox.Group
            disabled={isControl}
            options={[
              { value: "female", label: "Female" },
              { value: "male", label: "Male" },
              { value: "non-binary", label: "Non-binary" },
            ]}
          />
        </Form.Item>
        <Form.Item label="Age" name="age">
          <Checkbox.Group
            disabled={isControl}
            options={[
              { value: "18-29", label: "18-29" },
              { value: "30-40", label: "30-40" },
              { value: "41-50", label: "41-50" },
              { value: "51-64", label: "51-64" },
              { value: "65+", label: "65 and older" },
            ]}
          />
        </Form.Item>
        <Form.Item label="Diabetes" name="diabetes">
          <Checkbox.Group
            disabled={isControl}
            options={[
              { value: "has-diabetes", label: "Has Diabetes" },
              { value: "at-risk", label: "At Risk" },
              { value: "caretaker", label: "Caretaker" },
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

      {error !== "" && <Alert message={error} type="error" showIcon />}
    </Drawer>
  );
};

export default AssignDrawer;

const NudgeCard = styled(Card)`
  margin-bottom: 3rem;
  background-color: #fafafa;
`;
