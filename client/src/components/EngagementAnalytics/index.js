import "./index.css";

import { useEffect, useState } from "react";
import BarChart from "../Charts/BarChart";

import {
  Layout,
} from "antd";

const { Content } = Layout;

const EngagementAnalytics = (props) => {
  const { combEngagementData, topicData, topicEngagementData } = props;
  const [title, setTitle] = useState("");
  const [labels, setLabels] = useState([]);
  const [datasets, setDatasets] = useState([]);
  
  const [selectedCOMB, setSelectedCOMB] = useState(-1);
  const [showCOMBGraph, setShowCOMBGraph] = useState(false);

  const [subgraphTitle, setSubgraphTitle] = useState("");
  const [subgraphLabels, setSubgraphLabels] = useState([]);
  const [subgraphDatasets, setSubgraphDatasets] = useState([]);

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
      setSubgraphTitle('Engagement for topics in '+comb_component);
      const filteredTopicData = topicData.filter(item => item['COMB'] === comb_component);
      const subgraph_labels = filteredTopicData.map(item => item.Theme);
      const topic_numbers = filteredTopicData.map(item => item['Topic Number']);
      setSubgraphLabels(subgraph_labels);
      
      const subgraph_data = topic_numbers.map(item => Math.floor(topicEngagementData.find(itm => itm['Topic Number'] === item).comments));
      setSubgraphDatasets([{
        label: 'Comments per Topic',
        data: subgraph_data,
        backgroundColor: 'rgba(47, 119, 255, 0.75)',
      },]);
      setShowCOMBGraph(true);
    }

  }, [topicData, topicEngagementData, selectedCOMB]);

  const handleCombBarClick = (barClicked) => {
    setSelectedCOMB(barClicked);
  };

  const handleTopicBarClick = (barClicked) => {
    console.log(`Bar ${barClicked} clicked!`);
    // setSelectedSubcategory(barClicked);
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
      {showCOMBGraph &&
        <BarChart
          title={subgraphTitle}
          labels={subgraphLabels}
          datasets={subgraphDatasets}
          onBarClick={handleTopicBarClick}
          showLabels={false}
        />}
    </Content>
  );
};

export default EngagementAnalytics;
