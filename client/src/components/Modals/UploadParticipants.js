import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Alert, Modal, Table, Tag } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import styled from "styled-components";
import { cancelSchedule } from "../../api/nudge";

export default function UploadParticipantsModal({
  participants,
  open,
  onCancel,
  onOk,
}) {
  const columns = [
    {
      title: "ID",
      dataIndex: "participantId",
      key: "participantId",
    },
    {
      title: "Labels",
      dataIndex: "labels",
      key: "labels",
      render: (labels) => {
        return (
          <>
            {labels.map((label, i) => {
              return (
                <Tag color="blue" key={i}>
                  {label}
                </Tag>
              );
            })}
          </>
        );
      },
    },
    {
      title: "New",
      dataIndex: "missing",
      key: "missing",
      render: (missing) => {
        return missing ? <CheckOutlined /> : null;
      },
    },
  ];
  const data = participants.map((participant) => {
    return {
      key: participant.participantId,
      ...participant,
      missing: true, // TODO: How do I get this value?
    };
  });

  return (
    <Modal
      title="Confirm Participants"
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      width={800}
    >
      {data.some((user) => user.missing) && (
        <Alert
          message="Some participants are not in the database. Please check the table below."
          type="warning"
        />
      )}

      <Table columns={columns} dataSource={data} />
    </Modal>
  );
}
