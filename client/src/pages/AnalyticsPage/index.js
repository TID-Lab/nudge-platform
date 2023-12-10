import './index.css';

import {
  Layout,
  Typography,
} from "antd";

import useAuth from "../../hooks/auth";
import { useEffect, useState } from "react";

import Papa from 'papaparse';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

const { Content } = Layout;
const { Title } = Typography;

const extractInstagramShortcode = (url) => {
  const match = url.match(/^https:\/\/www\.instagram\.com\/p\/([^\/?]+)/);
  return match ? match[1] : null;
};
const maxLength = 35;

const getTwitter = (tweetUrl) => {
  return (
    <div className="post-container">
      <iframe
        title="Twitter Embed"
        src={`https://twitframe.com/show?url=${tweetUrl}`}
        width="300"
        height="400"
        style={{ border: "none" }}
        // allowFullScreen
      ></iframe>
    </div>
  );
};

const getFacebook = (fbUrl, post_data) => {
  // fbUrl = fbUrl.replace(":", "%3A").replace("/", "%2F");
  return (
    <div className="post-container">
      {/* <iframe
        title="Facebook Embed"
        src={`https://www.facebook.com/plugins/post.php?href=${fbUrl}`}
        width="300"
        height="400"
        style={{ border: "none", overflow: "hidden" }}
        allow="encrypted-media"
      ></iframe> */}
      <div className="fb-post" data-href={fbUrl} data-width="300">
          {getBackup(...post_data)}
        </div>
    </div>
  );
};

const getInsta = (instaShortcode) => {
  return (
    <div className="post-container">
      <iframe
        title="Instagram Embed"
        src={`https://www.instagram.com/p/${instaShortcode}/embed`}
        width="300"
        height="400"
        style={{ border: "none", overflow: "hidden" }}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      ></iframe>
    </div>
  );
};

const getPost = (platform, url, post_data) => {
  if (platform === "facebook") {
    return getFacebook(url, post_data);
  } else if (platform === "twitter") {
    return getTwitter(url);
  } else if (platform === "instagram") {
    const sc = extractInstagramShortcode(url);
    if (sc) {
      return getInsta(sc);
    }
  }

  return (
    <div className="empty">
      {getBackup(...post_data)}
    </div>
  );
};

// const getGraph = () => {
//   return (
//     <div>
//       <h1>Matplotlib Plot in React</h1>
//       <div>
//         <img src="http://20.119.99.148:5000/plot.png" alt="Matplotlib Plot" />
//       </div>
//     </div>
//   );
// };

const splitStringIntoSpans = (inputString, maxLength) => {
  const spans = [];
  let remainingText = inputString;

  while (remainingText.length > maxLength) {
    const spanText = remainingText.substring(0, maxLength);
    spans.push(spanText);
    remainingText = remainingText.substring(maxLength);
  }

  if (remainingText.length > 0) {
    spans.push(remainingText);
  }

  return spans;
};

const getBackup = (platform, author, content) => {
  const getSocialMediaIcon = () => {
    switch (platform) {
      case 'twitter':
        return <TwitterIcon />;
      case 'facebook':
        return <FacebookIcon />;
      case 'instagram':
        return <InstagramIcon />;
      default:
        return null;
    }
  };

  const spans = splitStringIntoSpans(content, maxLength);

  return (
    <Card sx={{ width: 300, height: 400 }}>
      <CardContent>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {getSocialMediaIcon()}
          <Typography variant="h6" style={{ marginLeft: '8px' }}>
            {author}
          </Typography>
        </div>
        <div className="content-container-post">
        {spans.map((span, index) => (
        <span key={index}>
          {span}
        </span>
      ))}
      </div>
      </CardContent>
    </Card>
  );
};

const AnalyticsPage = () => {
  useAuth();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [topicCards, setTopicCards] = useState(null);

  useEffect(() => {
    // Load category data from 'COMB' column of 'topics_dash.csv'
    Papa.parse('/data/topics_dash.csv', {
      download: true,
      header: true,
      complete: (result) => {
        const topicsData = result.data;

        // Extract unique categories from the 'COMB' column
        const uniqueCategories = Array.from(new Set(topicsData.map(topic => topic.COMB)));

        // Set categories state
        setCategories(uniqueCategories);
      },
    });
  }, []);

  const updateCards = (category) => {
    // Load subcategory mapping data from CSV
    Papa.parse('/data/topics_dash.csv', {
      download: true,
      header: true,
      complete: (result) => {
        const subcategoryMapping = result.data;

        // Filter subcategory mapping based on the selected category
        const filteredSubcategoryMapping = subcategoryMapping.filter(item => item.COMB === category);

        // Load post mapping data from CSV
        Papa.parse('/data/content_dash.csv', {
          download: true,
          header: true,
          complete: (result) => {
            const postMapping = result.data;

            // Create topicData structure
            const topicData = filteredSubcategoryMapping.map(subcategory => {
              const subcategoryNumber = subcategory['Topic Number'];
              const subcategoryName = subcategory['Theme'];

              // Filter post mapping based on subcategoryNumber
              const content = postMapping.filter(post => post.bertopic === subcategoryNumber);

              return { topicName: subcategoryName, content };
            });

            // Update state
            setTopicCards(
              <div className="sub-topics-section">
                {topicData.map((topic, index) => (
                  <div key={index} className="sub-topic">
                    <h3>{topic.topicName}</h3>
                    <div className="scrollable-cards">
                      {topic.content.map((post, postIndex) => (
                        <div key={postIndex} className="card">
                          {getPost(post.platform, post.url,[post.platform,post.author,post.content])}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          },
        });
      },
    });
  };

  return (
    <Content>
      <div>
        <Title>COM-B Analysis</Title>
      </div>
      <select
        value={selectedCategory}
        onChange={(e) => {
          setSelectedCategory(e.target.value);
          updateCards(e.target.value);
        }}
      >
        <option value="" disabled>Select a category</option>
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>
      {topicCards}
      </Content>
  );
};

export default AnalyticsPage;
