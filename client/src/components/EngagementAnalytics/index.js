import "./index.css";

import { useEffect, useState } from "react";
import BarChart from "../Charts/BarChart";
import SocialMediaPost from "../SocialMediaPost";
import CommentSection from "../CommentsSection";

import {
  Layout,
  Typography
} from "antd";

const { Content } = Layout;
const { Title } = Typography;

const EngagementAnalytics = (props) => {
  const { combEngagementData, topicData, topicEngagementData, postEngagementData, commentEngagementData } = props;
  const [title, setTitle] = useState("");
  const [labels, setLabels] = useState([]);
  const [datasets, setDatasets] = useState([]);

  const [selectedCOMB, setSelectedCOMB] = useState(-1);
  const [showCOMBGraph, setShowCOMBGraph] = useState(false);

  const [subgraphTitle, setSubgraphTitle] = useState("");
  const [subgraphLabels, setSubgraphLabels] = useState([]);
  const [subgraphTopics, setSubgraphTopics] = useState([]);
  const [subgraphDatasets, setSubgraphDatasets] = useState([]);

  const [selectedTopic, setSelectedTopic] = useState(-1);
  const [postsSection, setPostsSection] = useState(<></>);

  useEffect(() => {
    setTitle("COM-B Engagement");
    const comb_labels = combEngagementData.map(item => item.COMB);
    setLabels(comb_labels);
    const comment_data = combEngagementData.map(item => Math.floor(item.comments));
    const like_data = combEngagementData.map(item => Math.floor(item.likes));
    setDatasets([
      {
        label: 'Average No. of Comments per Post',
        data: comment_data,
        backgroundColor: 'rgba(47, 119, 255, 0.75)',
      },
      {
        label: 'Average No. of Likes per Post',
        data: like_data,
        backgroundColor: 'rgba(245, 158, 87, 0.75)',
      }]);
  }, [combEngagementData]);

  useEffect(() => {
    if (selectedCOMB !== -1 && labels.length > selectedCOMB) {
      const comb_component = labels[selectedCOMB];
      setSubgraphTitle('Engagement for topics in ' + comb_component);
      const filteredTopicData = topicData.filter(item => item['COMB'] === comb_component);
      const subgraph_labels = filteredTopicData.map(item => item.Theme);
      const topic_numbers = filteredTopicData.map(item => item['Topic Number']);
      setSubgraphTopics(topic_numbers);
      setSubgraphLabels(subgraph_labels);

      const subgraph_data = topic_numbers.map(item => Math.floor(topicEngagementData.find(itm => itm['Topic Number'] === item).comments));
      setSubgraphDatasets([{
        label: 'Comments per Topic',
        data: subgraph_data,
        backgroundColor: 'rgba(47, 119, 255, 0.75)',
      },]);
      setShowCOMBGraph(true);
    } else {
      setSubgraphTopics([]);
      setShowCOMBGraph(false);
    }

  }, [topicData, topicEngagementData, selectedCOMB, labels]);

  useEffect(() => {
    if (selectedTopic !== -1 && subgraphLabels.length > selectedTopic) {
      const topic = subgraphTopics[selectedTopic];
      const filteredPostData = postEngagementData.filter(item =>
        item['bertopic'] === topic);
      if (filteredPostData.length > 0) {
        setPostsSection(
          <>
            <Title>{subgraphLabels[selectedTopic]}</Title>
            <div>
              {filteredPostData.map((post, postIndex) => (
                <div key={postIndex} className="scrollable-cards">
                  <SocialMediaPost
                    platform={post.platform}
                    url={post.url}
                    author={post.author}
                    content={post.content}
                    postIndex={postIndex}
                  />
                  <CommentSection
                    comments={commentEngagementData.filter(item => item['newPostID'] === post.newPostID)}
                  />
                </div>
              ))}
            </div>
          </>
        );
      } else {
        setPostsSection(<></>);
      }
    }
  }, [selectedTopic, postEngagementData, commentEngagementData, subgraphLabels, subgraphTopics]);

  const handleCombBarClick = (barClicked) => {
    if (barClicked !== selectedCOMB) {
      setShowCOMBGraph(false);
      setSubgraphTopics([]);
      setSelectedTopic(-1);
      setPostsSection(<></>);
      setSelectedCOMB(barClicked);
    }
  };

  const handleTopicBarClick = (barClicked) => {
    if (barClicked !== selectedTopic) {
      setSelectedTopic(barClicked);
      setPostsSection(<></>);
    }
  };

  return (
    <Content>
      <BarChart
        title={title}
        labels={labels}
        datasets={datasets}
        onBarClick={handleCombBarClick}
        showLabels={true}
      />
      <Content>
        {showCOMBGraph &&
          <BarChart
            title={subgraphTitle}
            labels={subgraphLabels}
            datasets={subgraphDatasets}
            onBarClick={handleTopicBarClick}
            showLabels={false}
          />}
        {postsSection}
      </Content>
    </Content>
  );
};

export default EngagementAnalytics;
