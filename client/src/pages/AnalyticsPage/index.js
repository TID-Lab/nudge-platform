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

import { getTopics, getTopicContent, getCOMBEngagement, getTopicEngagement, getPostsEngagement, getCommentsEngagement} from "../../api/analytics";
import StaticAnalytics from "../../components/StaticAnalytics";
import EngagementAnalytics from "../../components/EngagementAnalytics";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const AnalyticsPage = () => {
  useAuth();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subcategoryMapping, setSubcategoryMapping] = useState([]);
  const [postMapping, setPostMapping] = useState([]);
  const [combEngagement, setCombEngagement] = useState([]);
  const [topicEngagement, setTopicEngagement] = useState([]);
  const [showCombSelect, setShowCombSelect] = useState(true);
  const [commentEngagement, setCommentEngagement] = useState([]);
  const [postEngagement, setPostEngagement] = useState([]);

  const onTabChange = (tabName) => {
    if (tabName !== 'engagement' && tabName !== 'weeklyData') {
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
  }
    , []);

  return (
    <Content>
      <Row gutter={32}>
        {showCombSelect && (<Col span={4} style={{ position: 'sticky', top: 0 }}>
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
          <Paragraph> TO DO: Description of the COM-B category </Paragraph>
        </Col>)
        }
        <Col span={showCombSelect ? 20 : 24} style={{ borderLeft: '2px solid #f0f0f0', overflowY: 'auto', maxHeight: '90vh' }}>
          <Tabs
            defaultActiveKey="static"
            items={[
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
                children: (<Content></Content>),
              },
              {
                key: "weeklyData",
                label: "Weekly Data",
                children: (<Content></Content>),
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
