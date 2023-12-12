import {
  Typography,
} from "antd";

const { Text } = Typography;

const TopicCard = ({ topic, value, onClick }) => {
  const handleClick = () => {
    onClick(value);
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', cursor: 'pointer' }} onClick={handleClick}>
      <Text>{topic}</Text>
    </div>
  );
};

export default TopicCard;
