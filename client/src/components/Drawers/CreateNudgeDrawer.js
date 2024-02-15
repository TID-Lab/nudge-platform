import React from "react";
import { useDispatch } from "react-redux";
import { Space, Form, Drawer, Button, Input, Select, Tag, Alert } from "antd";
import { CombColorMap } from "../../util/constants";
import { createNudge, fetchNudges } from "../../api/nudge";

const { TextArea } = Input;

const CreateNudgeDrawer = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const handleFormFinish = (values) => {
    const newNudge = {
      ...values,
      date_created: Date(),
      is_active: true,
    };

    createNudge(newNudge)
      // TODO: More elegant way to sync/refetch. https://redux.js.org/tutorials/essentials/part-5-async-logic
      .then(() => fetchNudges())
      .then((nudges) => {
        dispatch({
          type: "nudges/set",
          payload: nudges,
        });
      })
      .catch((err) => {
        console.error(err);
      });

    form.resetFields();
    onClose();
  };

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
      <Form
        layout="vertical"
        form={form}
        name="createNudgeForm"
        onFinish={handleFormFinish}
      >
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
              max: 160,
              message:
                "We recommend your nudge to be less than 130 characters.",
              warningOnly: true,
            },
          ]}
        >
          <TextArea
            rows={6}
            placeholder="Please input your nudge content here. Type <NAME> to include your recipient’s first name in the Nudge mesage."
          />
        </Form.Item>

        <Alert
          message="Hint: Type <NAME> to include your recipient's first name in the Nudge mesage."
          type="info"
          showIcon
          style={{ marginBottom: "1rem" }}
        />

        <TextArea
          rows={4}
          placeholder="Please input any comment to this nudge."
        />
      </Form>
    </Drawer>
  );
};

export default CreateNudgeDrawer;
