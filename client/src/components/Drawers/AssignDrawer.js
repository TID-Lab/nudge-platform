import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Space,
  Form,
  Drawer,
  Button,
  Card,
  Radio,
  Typography,
  Alert,
  Switch,
} from "antd";
import { presetPrimaryColors } from "@ant-design/colors";
import styled from "styled-components";

import { checkNudges } from "../../api/nudge";

const colors = Object.values(presetPrimaryColors);
const { Title } = Typography;

const AssignDrawer = ({ open, onClose, nudge }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [error, setError] = useState("");
  const [colorIndex, setColorIndex] = useState(0);

  const pendingNudges = useSelector((state) => state.pendingNudges);

  const onFinish = (values) => {
    const demographics = Object.values(values).filter((d) => d !== undefined);
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
          <Radio.Group
            options={[
              { value: "black", label: "Black" },
              { value: "latinx", label: "Latinx" },
              { value: "white", label: "White" },
              { value: "native_american", label: "Native American" },
            ]}
            optionType="button"
            buttonStyle="solid"
          />
        </Form.Item>
        <Form.Item label="Gender" name="gender">
          <Radio.Group
            options={[
              { value: "female", label: "Female" },
              { value: "male", label: "Male" },
              { value: "non_binary", label: "Non-binary" },
            ]}
            optionType="button"
            buttonStyle="solid"
          />
        </Form.Item>
        <Form.Item label="Age" name="age">
          <Radio.Group
            options={[
              { value: "18_29", label: "18-29" },
              { value: "30_40", label: "30-40" },
              { value: "41_50", label: "41-50" },
              { value: "51_64", label: "51-64" },
              { value: "65+", label: "65 and older" },
            ]}
            optionType="button"
            buttonStyle="solid"
          />
        </Form.Item>
        <Form.Item label="Diabetes" name="diabetes">
          <Radio.Group
            options={[
              { value: "has_diabetes", label: "Has Diabetes" },
              { value: "at_risk", label: "At Risk" },
              { value: "caretaker", label: "Caretaker" },
            ]}
            optionType="button"
            buttonStyle="solid"
          />
        </Form.Item>
        <Form.Item label="Testing Status" name="test_status">
          <Radio.Group
            options={[
              { value: "tested", label: "Tested" },
              { value: "untested", label: "Untested" },
            ]}
            optionType="button"
            buttonStyle="solid"
          />
        </Form.Item>

        <Form.Item
          name="unassigned"
          valuePropName="checked"
          label="All Unassigned"
        >
          <Switch defaultChecked>All Unassigned</Switch>
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
