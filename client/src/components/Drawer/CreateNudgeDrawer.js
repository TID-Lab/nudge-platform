import React from "react";
import { Space, Form, Drawer, Button, Input, Select } from "antd";

const { TextArea } = Input;

const CreateNudgeDrawer = ({ open, onClose }) => {
  const [form] = Form.useForm();

  return (
    <Drawer
      title="Create Nudge"
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
            Submit
          </Button>
        </Space>
      }
    >
      <Form layout="vertical" form={form} name="createNudgeForm">
        <Form.Item label="Com-B (optional)" name="com_b">
          <Select
            mode="multiple"
            allowClear
            placeholder="Please select a Com-B component."
            options={[
              {
                value: "capability",
                label: "Capability",
              },
              {
                value: "opportunity",
                label: "Opportunity",
              },
              {
                value: "motivation",
                label: "Motivation",
              },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Nudge content"
          name="message"
          rules={[
            {
              required: true,
              message:
                "Nudge content is empty! If you would like to delete this nudge hit CANCEL.",
            },
          ]}
        >
          <TextArea
            rows={6}
            placeholder="Please input your nudge content here. Type <NAME> to include your recipient’s first name in the Nudge mesage."
            maxLength={300}
          />
        </Form.Item>

        <Form.Item label="Comment" name="comment">
          <TextArea
            rows={4}
            placeholder="Please input any comment to this nudge."
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default CreateNudgeDrawer;
