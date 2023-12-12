import "./index.css";

import { useEffect, useState } from "react";
import SocialMediaPost from "../SocialMediaPost";
import Pill from "../Pill";
import PercentageChange from "../PercentageChange"

import {
  Typography,
} from "antd";

const { Text } = Typography;

const WeeklyAnalytics = (props) => {
  const { metaTopic, topicData, postMapping } = props;
  const [displayData, setDisplayData] = useState([]);

  useEffect(() => {
    // Filter subcategory mapping based on the selected category
    if (postMapping !== undefined && topicData !== undefined) {
      if (metaTopic !== "") {
        const filteredSubcategoryMapping = topicData.filter(item => item.metaTopic === metaTopic);
        const filteredData = filteredSubcategoryMapping.map(subcategory => {
          const subcategoryNumber = subcategory['Topic Number'];
          const subcategoryName = subcategory['Theme'];
          // Filter post mapping based on subcategoryNumber
          const content = postMapping.filter(post => post.bertopic === subcategoryNumber);
          if (subcategory.new === "1") {
            return { topicName: subcategoryName, new: subcategory.new, content: content, liwcChanges: [] }
          } else {
            return { topicName: subcategoryName, new: subcategory.new, content: content, liwcChanges: [{property:'assent',value: (Math.random() * (150))-80},{property:'anger',value: (Math.random() * (160))-80}] }
            // return { topicName: subcategoryName, new: subcategory.new, content: content, liwcChanges: JSON.parse(subcategory['LIWC Update']) };
          }
        });

        // Update state
        setDisplayData(filteredData);
      }
    }
  }, [metaTopic, topicData, postMapping]);

  return (
    <div className="sub-topics-section">
      {displayData.map((topic, index) => (
        <div key={index} className="sub-topic">
          <h3>{topic.topicName} {(topic.new === "1") && <Pill text="New Topic!" />}</h3>
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
          {(topic.new === "0") && <>{topic.liwcChanges.map((mapping, index) => (<PercentageChange key={index} value={mapping.value} attribute={mapping.property} />))}</>}
        </div>
      ))}
    </div>
  );
};

export default WeeklyAnalytics;
