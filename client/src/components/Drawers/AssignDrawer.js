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
} from "antd";
import { presetPrimaryColors } from "@ant-design/colors";
import styled from "styled-components";

import { checkNudges } from "../../api/nudge";

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
  const [form] = Form.useForm();

  const [error, setError] = useState("");
  const [colorIndex, setColorIndex] = useState(0);
  const [isUnassignedDisabled, setIsUnassignedDisabled] = useState(true);

  const pendingNudges = useSelector((state) => state.pendingNudges);

  const onFinish = (values) => {
    const demographics = Object.values(values)
      .filter((d) => d !== undefined)
      .flat();
    demographics.pop();
    const reformattedNudges = pendingNudges.map(({ id, demographics }) => {
      return { nudge_id: id, demographics: demographics };
    });
    reformattedNudges.push({ nudge_id: nudge._id, demographics: demographics });

    checkNudges(reformattedNudges)
      .then((res) => {
        const lastRes = res[reformattedNudges.length - 1];

        if (lastRes.success_code === "SUCCESS") {
          dispatch({
            type: "pendingNudges/add",
            payload: {
              id: nudge._id,
              text: nudge.message,
              demographics: demographics,
              assigned: lastRes.num_assigned,
              color: colors[colorIndex],
            },
          });

          setColorIndex((colorIndex + 1) % colors.length);
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
    } else {
      form.setFieldValue("unassigned", false);
    }

    // Let user toggle unassigned switch if demographics are chosen
    if (Object.keys(form.getFieldsValue(true)).length !== 0) {
      setIsUnassignedDisabled(false);
    } else {
      setIsUnassignedDisabled(true);
    }
  };

  return (
    <Drawer
      title="Assign"
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
        <Form.Item label="Race" name="race">
          <Checkbox.Group
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
            options={[
              { value: "female", label: "Female" },
              { value: "male", label: "Male" },
              { value: "non-binary", label: "Non-binary" },
            ]}
          />
        </Form.Item>
        <Form.Item label="Age" name="age">
          <Checkbox.Group
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
            options={[
              { value: "has-diabetes", label: "Has Diabetes" },
              { value: "at-risk", label: "At Risk" },
              { value: "caretaker", label: "Caretaker" },
            ]}
          />
        </Form.Item>
        <Form.Item label="Testing Status" name="test_status">
          <Checkbox.Group
            options={[
              { value: "tested", label: "Tested" },
              { value: "untested", label: "Untested" },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="unassigned"
          valuePropName="checked"
          label="All Unassigned"
        >
          <Switch defaultChecked disabled={isUnassignedDisabled}>
            All Unassigned
          </Switch>
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
