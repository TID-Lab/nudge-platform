import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Alert, Modal, Table, Tag } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import styled from "styled-components";
import { cancelSchedule } from "../../api/nudge";
import { getParticipants } from "../../api/org";

export default function UploadParticipantsModal({
  participants,
  open,
  onCancel,
  onOk,
}) {
  console.log(participants);
  const [backEndParts, setBackEndParts] = useState({});
  const [backEndPartCodes, setBackEndPartCodes] = useState([]);
  const [onlyDbPartCodesObject, setOnlyDbPartCodesObject] = useState({});
  const [tableRender, setTableRender] = useState([]);
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
      dataIndex: "missing", // Use participantId for the dataIndex
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
      missing: !backEndPartCodes.includes(participant.participantId), // TODO: How do I get this value?
    };
  });
  //pulling backend server participants
  useEffect(() => {
    // Fetch data from the backend when the component mounts
    getParticipants("nudge_demo_001")
      .then((res) => {
        //console.log(res);
        setBackEndParts(res);
        const actualPartCodes = res.mesg.map(
          (participant) => participant.part_code
        );
        console.log(actualPartCodes);
        setBackEndPartCodes(actualPartCodes);

        const filteredPartCodes = actualPartCodes.filter((partCode) => {
          return !participants.some(
            (participant) => participant.participantId === partCode
          );
        });
        console.log(filteredPartCodes);
        // Create objects for the filtered part_codes
        const filteredPartCodeObjects = filteredPartCodes.map((partCode) => {
          return {
            participantId: partCode,
            labels: ["Only in backend DB"], // You can provide labels or any other data here
          };
        });
        console.log(filteredPartCodeObjects);
        setOnlyDbPartCodesObject(filteredPartCodeObjects);
        setTableRender([...data, ...filteredPartCodeObjects]);
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
      {data.some((user) => user.missing) && (
        <Alert
          message="Some participants are not in the database. Please check the table below."
          type="warning"
        />
      )}

      <Table columns={columns} dataSource={tableRender} />
    </Modal>
  );
}
