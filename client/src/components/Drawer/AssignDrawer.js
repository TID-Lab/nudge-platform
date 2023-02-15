import React from "react";
import { Space, Form, Drawer, Button, Card, Checkbox, Typography } from "antd";
import styled from "styled-components";

const { Title } = Typography;

const AssignDrawer = ({ open, onClose, nudge }) => {
  const [form] = Form.useForm();

  return (
    <Drawer
      title="Assign"
      size="large"
      onClose={onClose}
      open={open}
      footer={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
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
        onFinish={(values) => console.log(values)}
      >
        <Form.Item label="Race" name="race">
          <Checkbox.Group
            options={[
              { value: "black", label: "Black" },
              { value: "latinx", label: "Latinx" },
              { value: "white", label: "White" },
              { value: "native_american", label: "Native American" },
            ]}
          />
        </Form.Item>

        <Form.Item label="Gender" name="gender">
          <Checkbox.Group
            options={[
              { value: "female", label: "Female" },
              { value: "male", label: "Male" },
              { value: "non_binary", label: "Non-binary" },
            ]}
          />
        </Form.Item>

        <Form.Item label="Age" name="age">
          <Checkbox.Group
            options={[
              { value: "18_29", label: "18-29" },
              { value: "30_40", label: "30-40" },
              { value: "41_50", label: "41-50" },
              { value: "51_64", label: "51-64" },
              { value: "65+", label: "65 and older" },
            ]}
          />
        </Form.Item>

        <Form.Item label="Diabetes" name="diabetes">
          <Checkbox.Group
            options={[
              { value: "has_diabetes", label: "Has Diabetes" },
              { value: "at_risk", label: "At Risk" },
              { value: "caretaker", label: "Caretaker" },
            ]}
          />
        </Form.Item>

        <Form.Item label="Misc." name="misc">
          <Checkbox.Group
            options={[
              { value: "all_unassigned", label: "All Unassigned" },
              { value: "tested", label: "Tested" },
              { value: "untested", label: "Untested" },
            ]}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AssignDrawer;

const NudgeCard = styled(Card)`
  margin-bottom: 3rem;
  background-color: #fafafa;
`;
