import { useState } from "react";
import { useDispatch } from "react-redux";
import { Card, Tag, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { UserOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { PendingNudgeSelect } from "../Select/PendingNudgeSelect";

const PendingNudgeCard = ({ data, readonly, index }) => {
  const { text, demographics, assigned, color } = data;
  const dispatch = useDispatch();
  const [message, setMessage] = useState(text);
  const [key, setKey] = useState(data.key);

  // TODO: On Delete, can reassess distribution (since when you delete a category, the ones underneath could expand technically)
  // Perhaps more intuitively, we can just delete the entire sequences
  function onDelete() {
    dispatch({ type: "pendingNudges/delete", payload: index });
  }

  const onSelect = (selected, rec) => {
    setMessage(selected);
    setKey(rec.key);
  };

  return (
    <StyledCard
      title={`#${+key + 1}`}
      extra={
        !readonly && (
          <Space>
            <Button
              onClick={onDelete}
              icon={<CloseOutlined />}
              shape="circle"
            />
          </Space>
        )
      }
      color={color}
    >
      <PendingNudgeSelect key={key} message={message} onSelect={onSelect} />
      <Space>
        <div className="tags-list">
          {demographics.length === 0 ? (
            <Tag>All Unassigned</Tag>
          ) : (
            demographics.map((category, i) => (
              // Category values aren't very well formatted
              <Tag key={i}>{category}</Tag>
            ))
          )}
        </div>
        <p className="text-assigned">
          <UserOutlined /> {assigned} assigned
        </p>
      </Space>
    </StyledCard>
  );
};

const StyledCard = styled(Card)`
  border-top: 8px solid ${(props) => props.color};

  .nudge-content {
    min-height: 3rem;
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
`;

const Space = styled.div`
  display: flex;

  .tags-list {
    flex-grow: 1;
    display: flex;
    align-items: center;
  }

  .text-assigned {
    font-size: 1rem;
    flex-shrink: 1;
  }
`;

export default PendingNudgeCard;
