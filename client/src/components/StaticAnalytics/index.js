import "./index.css";

import { useEffect, useState } from "react";
import SocialMediaPost from "../SocialMediaPost";

import {
  Typography,
  Layout,
  Row,
  Col,
} from "antd";

const { Title } = Typography;
const { Content } = Layout;

const StaticAnalytics = (props) => {
  const { categories, subcategoryMapping, postMapping } = props;
  const [topicData, setTopicData] = useState([]);
  const [selectedCOMB, setSelectedCOMB] = useState("");
  const [metaTopics, setMetaTopics] = useState([]);
  const [selectedMetaTopic, setSelectedMetaTopic] = useState("");

  useEffect(() => {
    // Filter subcategory mapping based on the selected category
    if (postMapping !== undefined && subcategoryMapping !== undefined && selectedCOMB !== "") {
      const filteredSubcategoryMapping = subcategoryMapping.filter(item => (item.COMB === selectedCOMB) && (selectedMetaTopic === "" || item.metaTopic === selectedMetaTopic));
      // Create topicData structure
      const tpcData = filteredSubcategoryMapping.map(subcategory => {
        const subcategoryNumber = subcategory['Topic Number'];
        const subcategoryName = subcategory['Theme'];
        // Filter post mapping based on subcategoryNumber
        const content = postMapping.filter(post => post.bertopic === subcategoryNumber);

        return { topicName: subcategoryName, content: content };
      });
      // Update state
      setTopicData(tpcData);
    }
  }, [selectedCOMB, selectedMetaTopic, subcategoryMapping, postMapping]);

  return (
    <Content>
      <Row gutter={32}>
        <Col span={8} style={{ position: 'sticky', top: 0, borderRight: '2px solid #f0f0f0', }}>
          <div>
            <Title>COM-B Analysis</Title>
          </div>
          <select
            value={selectedCOMB}
            onChange={(e) => {
              const comb_selected = e.target.value;
              setSelectedCOMB(comb_selected);
              const filteredMetaTopics = subcategoryMapping.filter(item => item.COMB === comb_selected);
              const uniqueCategories = Array.from(new Set(filteredMetaTopics.map(topic => topic.metaTopic)));
              setMetaTopics(uniqueCategories);
              setSelectedMetaTopic("");
            }}
          >
            <option value="" disabled>Select a category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </Col>
        <Col span={16} style={{ position: 'sticky', top: 0, borderRight: '2px solid #f0f0f0', }}>
          <div>
            <Title>Themes</Title>
            <select
              value={selectedMetaTopic}
              onChange={(e) => {
                setSelectedMetaTopic(e.target.value);
              }}
            >
              <option value="" >Select a Meta-Topic</option>
              {metaTopics.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </Col>
      </Row>
      <Row gutter={32}>
        <Col span={24}>
          <div className="sub-topics-section">
            {topicData.map((topic, index) => (
              <div key={index} className="sub-topic">
                <h3>{topic.topicName}</h3>
                <div className="scrollable-cards">
                  {topic.content.map((post, postIndex) => (
                    <SocialMediaPost
                      platform={post.platform}
                      url={post.url}
                      author={post.author}
                      content={post.content}
                      postIndex={postIndex}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </Content>);
};

export default StaticAnalytics;
