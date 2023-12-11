import "./index.css";

import { useEffect, useState } from "react";
import SocialMediaPost from "../SocialMediaPost";

const StaticAnalytics = (props) => {
  const { category, subcategoryMapping, postMapping } = props;
  const [topicData, setTopicData] = useState([]);

  useEffect(() => {
    // Filter subcategory mapping based on the selected category
    if (postMapping !== undefined && subcategoryMapping !== undefined) {
      const filteredSubcategoryMapping = subcategoryMapping.filter(item => item.COMB === category);
      // Create topicData structure
      const tpcData = filteredSubcategoryMapping.map(subcategory => {
        const subcategoryNumber = subcategory['Topic Number'];
        const subcategoryName = subcategory['Theme'];

        // Filter post mapping based on subcategoryNumber
        const content = postMapping.filter(post => post.bertopic === subcategoryNumber);

        return { topicName: subcategoryName, content };
      });

      // Update state
      setTopicData(tpcData);
    }
  }, [category, subcategoryMapping, postMapping]);

  return (<div className="sub-topics-section">
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
  </div>);
};

export default StaticAnalytics;
