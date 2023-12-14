import './index.css';

import {
  Layout,
  Typography,
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
const { Title, Paragraph } = Typography;

const AnalyticsPage = () => {
  useAuth();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subcategoryMapping, setSubcategoryMapping] = useState([]);
  const [postMapping, setPostMapping] = useState([]);
  const [showCombSelect, setShowCombSelect] = useState(false);

  // const [metaTopics, setMetaTopics] = useState([]);
  const [weeklyTopics, setWeeklyTopics] = useState([]);
  const [weeklyPosts, setWeeklyPosts] = useState([]);
  // const [selectedMetaTopic, setSelectedMetaTopic] = useState("");

  const [combEngagement, setCombEngagement] = useState([]);
  const [topicEngagement, setTopicEngagement] = useState([]);
  const [commentEngagement, setCommentEngagement] = useState([]);
  const [postEngagement, setPostEngagement] = useState([]);

  const [liwcComponents, setLiwcComponents] = useState([]);
  const [liwcTopics, setLiwcTopics] = useState([]);
  const [liwcPosts, setLiwcPosts] = useState([]);
  const [liwcComments, setLiwcCommments] = useState([]);

  const onTabChange = (tabName) => {
    if (tabName === "static") {
      setShowCombSelect(true);
    } else {
      setShowCombSelect(false);
    }
  };

  useEffect(() => {
    getTopics().then((topicsData) => {
      setSubcategoryMapping(topicsData);
      const uniqueCategories = Array.from(new Set(topicsData.map(topic => topic.COMB)));
      setCategories(uniqueCategories);
      // const uniqueMetas = Array.from(new Set(topicsData.map(topic => topic.metaTopic)));
      // // setMetaTopics(['All', ...uniqueCategories]);
      // setMetaTopics(uniqueMetas);
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
        {showCombSelect && (<Col span={4} style={{ position: 'sticky', top: 0, borderRight: '2px solid #f0f0f0', }}>
          <div>
            <Title>COM-B Analysis</Title>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
            }}
          >
            <option value="" disabled>Select a category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
          <Paragraph style={{ marginTop: '3px' }} > TO DO: Description of the COM-B category </Paragraph>
        </Col>)}
        <Col span={showCombSelect ? 20 : 24} style={{ overflowY: 'auto', maxHeight: '90vh' }}>
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
                key: "static",
                label: "COM-B Categories",
                children: (<StaticAnalytics
                  category={selectedCategory}
                  subcategoryMapping={subcategoryMapping}
                  postMapping={postMapping} />),
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
            ]}
            onChange={onTabChange}
          />
        </Col>
      </Row>
    </Content>
  );
};

export default AnalyticsPage;
