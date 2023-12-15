import './index.css';

import {
  Layout,
  Row,
  Col,
  Tabs,
} from "antd";

import useAuth from "../../hooks/auth";
import { useEffect, useState } from "react";

import {
  getTopics,
  getTopicContent,
  getCOMBEngagement,
  getTopicEngagement,
  getPostsEngagement,
  getCommentsEngagement,
  getWeeklyTopics,
  getWeeklyPosts,
  getLiwcTopics,
  getLiwcPosts,
  getLiwcComments,
  getLiwcComponents,
} from "../../api/analytics";
import StaticAnalytics from "../../components/StaticAnalytics";
import EngagementAnalytics from "../../components/EngagementAnalytics";
import WeeklyAnalytics from "../../components/WeeklyAnalytics";
import LiwcAnalytics from '../../components/LiwcAnalytics';

const { Content } = Layout;

const AnalyticsPage = () => {
  useAuth();
  const [categories, setCategories] = useState([]);
  const [subcategoryMapping, setSubcategoryMapping] = useState([]);
  const [postMapping, setPostMapping] = useState([]);

  const [weeklyTopics, setWeeklyTopics] = useState([]);
  const [weeklyPosts, setWeeklyPosts] = useState([]);

  const [combEngagement, setCombEngagement] = useState([]);
  const [topicEngagement, setTopicEngagement] = useState([]);
  const [commentEngagement, setCommentEngagement] = useState([]);
  const [postEngagement, setPostEngagement] = useState([]);

  const [liwcComponents, setLiwcComponents] = useState([]);
  const [liwcTopics, setLiwcTopics] = useState([]);
  const [liwcPosts, setLiwcPosts] = useState([]);
  const [liwcComments, setLiwcCommments] = useState([]);

  const onTabChange = (tabName) => {};

  useEffect(() => {
    getTopics().then((topicsData) => {
      setSubcategoryMapping(topicsData);
      const uniqueCategories = Array.from(new Set(topicsData.map(topic => topic.COMB)));
      setCategories(uniqueCategories);
    });

    getTopicContent().then((postData) => {
      setPostMapping(postData);
    });

    getCOMBEngagement().then((engagementData) => {
      setCombEngagement(engagementData);
    });

    getTopicEngagement().then((engagementData) => {
      setTopicEngagement(engagementData);
    });

    getPostsEngagement().then((engagementData) => {
      setPostEngagement(engagementData);
    });

    getCommentsEngagement().then((engagementData) => {
      setCommentEngagement(engagementData);
    });

    getWeeklyTopics().then((topicsData) => {
      setWeeklyTopics(topicsData);
    });

    getWeeklyPosts().then((postData) => {
      setWeeklyPosts(postData);
    });

    getLiwcComponents().then((components) => {
      setLiwcComponents(components);
    });

    getLiwcTopics().then((topicsData) => {
      setLiwcTopics(topicsData);
    });

    getLiwcPosts().then((postData) => {
      setLiwcPosts(postData);
    });

    getLiwcComments().then((commentData) => {
      setLiwcCommments(commentData);
    });
  }
    , []);

  return (
    <Content>
      <Row gutter={32}>
        <Col span={24} style={{ overflowY: 'auto', maxHeight: '90vh' }}>
          <Tabs
            defaultActiveKey="week"
            items={[
              {
                key: "week",
                label: "Weekly Data",
                children: (
                  <WeeklyAnalytics
                    categories={categories}
                    topicData={weeklyTopics}
                    postMapping={weeklyPosts} />
                ),
              },
              {
                key: "engagement",
                label: "Engagement Data",
                children: (<EngagementAnalytics
                  combEngagementData={combEngagement}
                  topicData={subcategoryMapping}
                  topicEngagementData={topicEngagement}
                  postEngagementData={postEngagement}
                  commentEngagementData={commentEngagement}
                />),
              },
              {
                key: "sentiment",
                label: "Sentiment Analysis",
                children: (
                  <LiwcAnalytics // (liwc over time graph?) / newest posts in liwc reaction?
                    components={liwcComponents}
                    topicMapping={liwcTopics}
                    postMapping={liwcPosts}
                    commentData={liwcComments}
                  />
                ),
              },
              {
                key: "static",
                label: "COM-B Categories",
                children: (<StaticAnalytics
                  categories={categories}
                  subcategoryMapping={subcategoryMapping}
                  postMapping={postMapping} />),
              },
            ]}
            onChange={onTabChange}
          />
        </Col>
      </Row>
    </Content>
  );
};

export default AnalyticsPage;
