import "./index.css";

import {
  Typography,
} from "antd";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

const SocialMediaPost = (props) => {
  const { platform, url, author, content, postIndex } = props;

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


  if (platform === "facebook") {
    return (<div key={postIndex} className="card">
      {getFacebook(url, [platform, author, content])}
    </div>);
  } else if (platform === "twitter") {
    return (<div key={postIndex} className="card">
      {getTwitter(url)}
    </div>);
  } else if (platform === "instagram") {
    const sc = extractInstagramShortcode(url);
    if (sc) {
      return (<div key={postIndex} className="card">
        {getInsta(sc)}
      </div>);
    }
  }
  return (<div key={postIndex} className="card">
    {getBackup(platform, author, content)}
  </div>
  );
};

export default SocialMediaPost;
