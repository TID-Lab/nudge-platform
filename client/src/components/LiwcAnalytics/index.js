import "./index.css";

import { useEffect, useState } from "react";
import SocialMediaPost from "../SocialMediaPost";
import CommentSection from "../CommentsSection";
import TopicCard from "../Charts/TopicCard";
import Pill from "../Pill";

import {
  Layout,
  Typography,
  Row,
  Col,
} from "antd";

const { Content } = Layout;
const { Title } = Typography;

const LiwcAnalytics = (props) => {
  const { components, topicMapping, postMapping, commentData } = props;
  // console.log(props);
  const [liwcTitle, setLiwcTitle] = useState("");
  const [selectedLiwcComponent, setSelectedLiwcComponent] = useState("");
  const [liwcComponents, setLiwcComponents] = useState([]);

  const [liwcTopics, setLiwcTopics] = useState([]);
  const [selectedTopicNumber, setSelectedTopicNumber] = useState(-1);
  const [postsSection, setPostsSection] = useState(<></>);

  useEffect(() => {
    if (components) {
      setLiwcComponents(components);
    }
  }, [components]);

  useEffect(() => {
    if (selectedTopicNumber !== -1) {
      const filteredPostData = postMapping.filter(item =>
        (item['Topic Number'] === selectedTopicNumber && item['LIWC'] === selectedLiwcComponent));
      const topic_theme_data = liwcTopics.find(item => item['Topic Number'] === selectedTopicNumber);
      if (filteredPostData.length > 0 && topic_theme_data !== undefined) {
        setPostsSection(
          <>
            <Title>{topic_theme_data['Theme']}</Title> <Pill text={topic_theme_data['COMB']}/>
            <div className="scrollable-cards">
              {filteredPostData.map((post, postIndex) => (
                <div key={postIndex} className="scrollable-posts">
                  <SocialMediaPost
                    platform={post.platform}
                    url={post.url}
                    author={post.author}
                    content={post.content}
                    postIndex={postIndex}
                  />
                  {commentData.length > 0 &&
                    <>
                      <Typography variant="h3" style={{ marginLeft: '2px' }}>Comments: </Typography>
                      <CommentSection
                        comments={commentData.filter(item => (item['newPostID'] === post.newPostID && item['LIWC'] === selectedLiwcComponent))}
                      />
                    </>
                  }
                </div>
              ))}
            </div>
          </>
        );
      } else {
        setPostsSection(<></>);
      }
    }
  }, [selectedTopicNumber, postMapping, commentData, selectedLiwcComponent, liwcTopics]);

  const handleTopicBarClick = (barClicked) => {
    setSelectedTopicNumber(barClicked);
  };

  return (
    <Content>
      <Row gutter={32} style={{ borderBottom: '2px solid #f0f0f0', }}>
        <Col span={12}>
          <Title>Sentiment Analysis</Title>
          <select
            value={selectedLiwcComponent}
            onChange={(e) => {
              setPostsSection(<></>);
              const liwc_comp = e.target.value;
              setSelectedLiwcComponent(liwc_comp);
              if (liwc_comp !== "") {
                const liwc_data = liwcComponents.find(item => item.LIWC === liwc_comp);
                if (liwc_data !== undefined) {
                  setLiwcTitle(liwc_data.Title);
                  const filteredTopicMap = topicMapping.filter(item => item.LIWC === liwc_comp);
                  setLiwcTopics(filteredTopicMap);
                }
              }
            }}
          >
            <option value="" disabled>Select a Sentiment</option>
            {liwcComponents.map((topic, index) => (
              <option key={index} value={topic.LIWC}>
                {topic.Display}
              </option>
            ))}
          </select>

        </Col>
        <Col span={12}>
          <h3>{liwcTitle}</h3>
          {liwcTopics.map((topicData, index) => (
            <TopicCard
              topic={topicData.Theme}
              value={topicData['Topic Number']}
              key={index}
              onClick={handleTopicBarClick}
            />
          ))}
        </Col>
      </Row>
      <Row gutter={32}>
        <Col span={1}></Col>
        <Col span={22}>
          {postsSection}
        </Col>
        <Col span={1}></Col>
      </Row>
    </Content>
  );
};

export default LiwcAnalytics;
