import { useDispatch, useSelector } from "react-redux";
import { Card, Tag, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import styled from "styled-components";

const PendingNudgeCard = ({ data, readonly }) => {
  const { text, demographics, assigned, color, key, order } = data;
  const dispatch = useDispatch();

  // TODO: On Delete, can reassess distribution (since when you delete a category, the ones underneath could expand technically)
  // Perhaps more intuitively, we can just delete the entire sequences
  function onDelete() {
    dispatch({ type: "pendingNudges/delete", payload: order - 1 });
  }

  return (
    <StyledCard
      title={`#${order}`}
      extra={
        !readonly && (
          <Space>
            <Button type="link">Edit</Button>
            <Button type="link" danger onClick={onDelete}>
              Delete
            </Button>
          </Space>
        )
      }
      bordered={false}
      color={color}
    >
      <p className="nudge-content">{text}</p>
      <Space>
        <div className="tags-list">
          {demographics.map((category, i) => (
            // Category values aren't very well formatted
            <Tag key={i}>{category}</Tag>
          ))}
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
