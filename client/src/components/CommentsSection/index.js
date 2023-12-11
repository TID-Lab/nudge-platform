import "./index.css";

import { useEffect, useState } from "react";

import {
  Typography,
} from "antd";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const { Text } = Typography;

const CommentSection = (props) => {
  const { comments } = props;
  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    setCommentList(comments);
  }, [comments]);

  const maxLength = 35;

  const getCommentCard = (author, content) => {
    const splitStringIntoSpans = (inputString, maxLength) => {
      const spans = [];
      let remainingText = inputString;

      while (remainingText.length > maxLength) {
        const spanText = remainingText.substring(0, maxLength);
        spans.push(spanText);
        remainingText = remainingText.substring(maxLength);
      }

      if (remainingText.length > 0) {
        spans.push(remainingText);
      }

      return spans;
    };

    const spans = splitStringIntoSpans(content, maxLength);

    return (
      <Card sx={{ width: 300}}>
        <CardContent>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h5" style={{ fontWeight: 'bold' }}>
              {author}
            </Typography>
          </div>
          <div className="content-container-post">
            {spans.map((span, index) => (
              <span key={index}>
                {span}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="comment-container">
      {commentList.length > 0 && commentList.map((comment, commentIndex) => (
        <div key={commentIndex} className="comment-card">
          {getCommentCard(comment.name, comment.message)}
        </div>))}
      {commentList.length === 0 &&
        <Text>
          No Comments Found
        </Text>}
    </div>
  );
};

export default CommentSection;
