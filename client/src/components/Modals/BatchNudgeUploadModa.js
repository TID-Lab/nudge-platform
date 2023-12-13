import React from "react";
import { Modal, Upload, Button } from "antd";
import { InboxOutlined } from "@ant-design/icons";

const BatchNudgeUploadModal = ({ open, onCancel, onUpload }) => {
  const handleUpload = (file) => {
    // Handle file upload logic here
    console.log("Uploading file:", file);
    onUpload(file);
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title="Batch Nudge Upload"
      footer={null}
    >
      <Upload.Dragger
        beforeUpload={() => false}
        onChange={(info) => handleUpload(info.file)}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">Support for a single or bulk upload.</p>
      </Upload.Dragger>
    </Modal>
  );
};

export default BatchNudgeUploadModal;
