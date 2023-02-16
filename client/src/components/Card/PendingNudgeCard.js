import { useDispatch, useSelector } from "react-redux";
import { Card, Tag, Space, Button } from "antd";

const PendingNudge = ({ data }) => {
  const { text, demographics, assigned, order } = data;
  const dispatch = useDispatch();
  const pendingNudges = useSelector((state) => state.pendingNudges);

  // TODO: On Delete, can reassess distribution (since when you delete a category, the ones underneath could expand technically)
  // Perhaps more intuitively, we can just delete the entire sequences
  function onDelete() {
    dispatch({ type: "pendingNudges/delete", payload: order - 1 });
  }

  return (
    <Card
      title={`#${order}`}
      extra={
        <Space>
          <Button type="link">Edit</Button>
          <Button type="link" danger>
            Delete
          </Button>
        </Space>
      }
      bordered={false}
    >
      <p>{text}</p>
      <div>
        {demographics.map((category, i) => (
          // Category values aren't very well formatted
          <Tag key={i}>{category}</Tag>
        ))}
      </div>
      <p>{assigned} assigned</p>
    </Card>
  );
};

export default PendingNudge;
