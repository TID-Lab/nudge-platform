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
  const [titleText, setTitleText] = useState("");

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
          return { topicName: subcategoryName, new: subcategory.new, content: content };
        });

        // Update state
        setDisplayData(filteredData);
        setTitleText(metaTopic);
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
          <PercentageChange value={50} attribute={"joy"}/><PercentageChange value={-50} attribute={"anger"}/>
        </div>
      ))}
    </div>
  );
};

export default WeeklyAnalytics;
