import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Modal, Upload, Button, Table, Tag, Flex } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import Papa from "papaparse";
import { CombColorMap } from "../../util/constants";
import { createNudge, fetchNudges } from "../../api/nudge";

const BatchNudgeUploadModal = ({ open, onCancel }) => {
  const dispatch = useDispatch();
  const [newNudges, setNewNudges] = useState(); // List of new nudges to create

  const handleUpload = (file) => {
    Papa.parse(file, {
      header: true,
      complete: function (results) {
        const nudges = results.data.map((nudge, i) => {
          const com_b = {
            ...nudge,
          };
          delete com_b.message;
          delete com_b.comment;

          return {
            key: i,
            message: nudge.message,
            com_b: Object.entries(com_b)
              .filter(([, value]) => value === "1")
              .map(([key]) => key),
            date_created: Date(),
            is_active: true,
          };
        });

        setNewNudges(nudges);
      },
      error: function (err) {
        console.error(err);
      },
    });
  };

  const handleConfirm = () => {
    createNudge(newNudges, { batch: true })
      .then(() => fetchNudges())
      .then((nudges) =>
        dispatch({
          type: "nudges/set",
          payload: nudges,
        })
      );

    onCancel();
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title="Batch Nudge Upload"
      footer={null}
    >
      {newNudges === undefined ? (
        <Upload.Dragger
          beforeUpload={() => false}
          maxCount={1}
          accept=".csv"
          showUploadList={false}
          onChange={(info) => handleUpload(info.file)}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload.
          </p>
        </Upload.Dragger>
      ) : (
        <Flex vertical gap={"small"}>
          <Table
            dataSource={newNudges}
            columns={[
              {
                title: "Message",
                dataIndex: "message",
              },
              {
                title: "Com-B",
                dataIndex: "com_b",
                render: (_, { com_b }) => (
                  <>
                    {com_b.map((tag) => {
                      return (
                        <Tag key={tag} color={CombColorMap[tag]}>
                          {tag.toUpperCase()}
                        </Tag>
                      );
                    })}
                  </>
                ),
              },
            ]}
          />

          <Button onClick={handleConfirm}>Confirm</Button>
        </Flex>
      )}
    </Modal>
  );
};

export default BatchNudgeUploadModal;
