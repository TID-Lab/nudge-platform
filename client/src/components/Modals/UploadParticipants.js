import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Modal, Table, Tag } from "antd";
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
  ];
  const data = participants.map((participant) => {
    return {
      key: participant.participantId,
      ...participant,
    };
  });

  return (
    <Modal
      title="Confirm Participants"
      open={open}
      onCancel={onCancel}
      onOk={onOk}
    >
      <Table columns={columns} dataSource={data} />
    </Modal>
  );
}
