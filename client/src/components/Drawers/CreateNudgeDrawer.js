import React from "react";
import { Space, Form, Drawer, Button, Input, Select, Tag } from "antd";
import { CombColorMap } from "../../util/constants";

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
            tagRender={(props) => (
              <Tag {...props} color={CombColorMap[props.value]}>
                {props.label}
              </Tag>
            )}
            options={[
              {
                value: "c-psy",
                label: "Psychological Capability",
              },
              {
                value: "c-phy",
                label: "Physical Capability",
              },

              {
                value: "o-soc",
                label: "Social Opportunity",
              },
              {
                value: "o-phy",
                label: "Physical Opportunity",
              },
              {
                value: "m-ref",
                label: "Reflective Motivation",
              },
              {
                value: "m-auto",
                label: "Automatic Motivation",
              },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Nudge content"
          name="message"
          hasFeedback
          validateFirst
          rules={[
            {
              required: true,
              message:
                "Nudge content is empty. Please input your nudge content.",
            },
            {
              max: 300,
              message: "Nudge content cannot be longer than 300 characters.",
            },
            {
              max: 130,
              message:
                "We recommend your nudge to be less than 130 characters.",
              warningOnly: true,
            },
          ]}
          help="Type <NAME> to include your recipient’s first name in the Nudge mesage."
        >
          <TextArea
            rows={6}
            placeholder="Please input your nudge content here. Type <NAME> to include your recipient’s first name in the Nudge mesage."
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
