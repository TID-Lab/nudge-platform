import "./index.css";

import { useEffect, useState } from "react";
import SocialMediaPost from "../SocialMediaPost";
import Pill from "../Pill";
import PercentageChange from "../PercentageChange"

import {
  Typography,
  Tabs,
} from "antd";

const { Text, Title } = Typography;

const WeeklyAnalytics = (props) => {
  const { categories, topicData, postMapping } = props;
  const [displayData, setDisplayData] = useState([]);
  const [selectedCOMB, setSelectedCOMB] = useState("");

  useEffect(() => {
    // Filter subcategory mapping based on the selected category
    if (postMapping !== undefined && topicData !== undefined && categories !== undefined) {
      if (selectedCOMB !== "") {
        const filteredSubcategoryMapping = topicData.filter(item => item.COMB === selectedCOMB);
        const filteredData = filteredSubcategoryMapping.map(subcategory => {
          const subcategoryNumber = subcategory['Topic Number'];
          const subcategoryName = subcategory['Theme'];
          const metaTopic = subcategory['metaTopic'];
          // Filter post mapping based on subcategoryNumber
          const content = postMapping.filter(post => post.bertopic === subcategoryNumber);
          if (subcategory.new === "1") {
            return {
              topicName: subcategoryName,
              new: subcategory.new,
              content: content,
              metaTopic: metaTopic,
              liwcChanges: []
            }
          } else {
            return {
              topicName: subcategoryName,
              new: subcategory.new,
              content: content,
              metaTopic: metaTopic,
              liwcChanges: [{property:'assent',value: (Math.random() * (150))-80},{property:'anger',value: (Math.random() * (160))-80},{property:'relig',value: (Math.random() * (90))-40}],
              // liwcChanges: JSON.parse(subcategory['LIWC Update']),
            }
          }
        });

        // Update state
        setDisplayData(filteredData);
      }
    }
  }, [selectedCOMB, categories, topicData, postMapping]);

  return (
    <Tabs
      defaultActiveKey="updates"
      items={[
        {
          key: "updates",
          label: "Weekly Update",
          children: (<iframe
            title="Weekly Analytics Dashboard"
            width="100%"
            height="600"
            src="https://nudgeanalytics.eastus.cloudapp.azure.com"
          ></iframe>)
        },
        {
          key: "comb",
          label: "Explore Topics",
          children: (
            <>
              <Title>COM-B Updates</Title>
              <select
                value={selectedCOMB}
                onChange={(e) => {
                  setSelectedCOMB(e.target.value);
                }}
              >
                <option value="" disabled>Select a COM-B Category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
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
                    {<Pill text={topic.metaTopic} />}
                  </div>
                ))}
              </div>
            </>
          )
        },]} />
  );
};

export default WeeklyAnalytics;
