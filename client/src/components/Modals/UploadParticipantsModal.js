import React, { useState, useEffect, useMemo } from "react";
import { Badge, Modal, Table, Tabs, Tag } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { getParticipants } from "../../api/participant";

export default function UploadParticipantsModal({
  participants,
  open,
  onCancel,
  onOk,
}) {
  const [existingParticipants, setExistingParticipants] = useState([]);

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
      title: "Active",
      dataIndex: "active",
      key: "active",
      render: (active) => {
        return active !== false && <CheckOutlined />;
      },
    },
  ];

  // Participants to be updated on backend
  const updateParticipants = useMemo(() => {
    return participants
      .map((participant) => {
        return {
          key: participant.participantId,
          ...participant,
        };
      })
      .filter(
        (participant) =>
          existingParticipants.find(
            (p) => p.part_code === participant.participantId
          ) !== undefined
      );
  }, [participants, existingParticipants]);

  // Participants to be created on backend (new/orphan)
  const newParticipants = useMemo(() => {
    return participants
      .map((participant) => {
        return {
          key: participant.participantId,
          ...participant,
        };
      })
      .filter(
        (participant) =>
          existingParticipants.find(
            (p) => p.part_code === participant.participantId
          ) === undefined
      );
  }, [participants, existingParticipants]);

  // Participants that are unchanged in the backend (not in the CSV)
  const unchangedParticipants = useMemo(() => {
    return existingParticipants
      .filter(
        (p) =>
          participants.find(
            (participant) => participant.participantId === p.part_code
          ) === undefined
      )
      .map((p) => {
        return {
          key: p.part_code,
          participantId: p.part_code,
          labels: [],
        };
      });
  }, [participants, existingParticipants]);

  // pulling backend server participants
  useEffect(() => {
    // Fetch data from the backend when the component mounts
    getParticipants("nudge_demo_001")
      .then((res) => {
        setExistingParticipants(res.mesg ?? []);
      })
      .catch((error) => {
        console.error("Error fetching data from the backend:", error);
      });
  }, [participants]);

  return (
    <Modal
      title="Confirm Participants"
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      width={800}
    >
      <Tabs
        items={[
          {
            key: "update",
            label: (
              <Badge count={updateParticipants.length} size="small">
                Updating
              </Badge>
            ),
            children: (
              <Table columns={columns} dataSource={updateParticipants} />
            ),
          },
          {
            key: "new",
            label: (
              <Badge count={newParticipants.length} size="small">
                New
              </Badge>
            ),
            children: <Table columns={columns} dataSource={newParticipants} />,
          },
          {
            key: "unchanged",
            label: (
              <Badge count={unchangedParticipants.length} size="small">
                Unchanged
              </Badge>
            ),
            children: (
              <Table columns={columns} dataSource={unchangedParticipants} />
            ),
          },
        ]}
      />
    </Modal>
  );
}
