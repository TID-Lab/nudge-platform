import React, { useState } from 'react';
import { Space, Form, Drawer, Button, Input, Select } from 'antd'

const { TextArea } = Input
const onFinish = (values) => { }
const onFinishFailed = (err) => { }
const handleChange = (value) => { }


const CreateNudgeDrawer = ({ open, onClose }) => {

  return <Drawer title='Create Nudge' width={720} onClose={onClose} open={open} footer={<Space>
    <Button onClick={onClose}>Cancel</Button>
    <Button onClick={onClose} type="primary" htmlType='submit'>
      Submit
    </Button>
  </Space>}>
    <Form onFinish={onFinish} onFinishFailed={onFinishFailed} layout='vertical'>
      <Form.Item label="Com-B (optional)" name="com-b">
        <Select onChange={handleChange} placeholder='Please select a Com-B component.' options={[
          {
            value: 'foo',
            label: 'Foo'
          },
          {
            value: 'bar',
            label: 'Bar'
          }
        ]} />
      </Form.Item>

      <Form.Item label='Nudge content' name="content">
        <TextArea rows={6} placeholder='Please input your nudge content here. Type <NAME> to include your recipient’s first name in the Nudge mesage.' maxLength={300} />
      </Form.Item>

      <Form.Item label='Comment' name="comment">
        <TextArea rows={4} placeholder='Please input any comment to this nudge.' />
      </Form.Item>

    </Form>
  </Drawer>
}

export default CreateNudgeDrawer;