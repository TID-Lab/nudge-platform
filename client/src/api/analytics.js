const defaultOptions = {
  headers: {
    Accept: "text/csv",
    "Content-Type": "text/csv",
  },
};

async function getTopics() {
  const options = {
    ...defaultOptions,
    method: "GET",
  };
  const res = await fetch(
    `https://nudgeanalytics.eastus.cloudapp.azure.com/api/analytics/comb_topics`,
    options
  );

  try {
    const json_data = await res.json();
    const parsedData = JSON.parse(json_data);
    return parsedData;
  } catch (error) {
    console.error('Error fetching Topic CSV data:', error);
    return [];
  }
}

async function getTopicContent() {
  const options = {
    ...defaultOptions,
    method: "GET",
  };
  const res = await fetch(
    `https://nudgeanalytics.eastus.cloudapp.azure.com/api/analytics/comb_posts`,
    options
  );

  try {
    const json_data = await res.json();
    const parsedData = JSON.parse(json_data);
    return parsedData;
  } catch (error) {
    console.error('Error fetching Posts CSV data:', error);
    return [];
  }
}

async function getCOMBEngagement() {
  const options = {
    ...defaultOptions,
    method: "GET",
  };
  const res = await fetch(
    `https://nudgeanalytics.eastus.cloudapp.azure.com/api/analytics/engagement_comb`,
    options
  );

  try {
    const json_data = await res.json();
    const parsedData = JSON.parse(json_data);
    return parsedData;
  } catch (error) {
    console.error('Error fetching COMB Engagement CSV data:', error);
    return [];
  }
}

async function getTopicEngagement() {
  const options = {
    ...defaultOptions,
    method: "GET",
  };
  const res = await fetch(
    `https://nudgeanalytics.eastus.cloudapp.azure.com/api/analytics/topic_engagement`,
    options
  );

  try {
    const json_data = await res.json();
    const parsedData = JSON.parse(json_data);
    return parsedData;
  } catch (error) {
    console.error('Error fetching Topic Engagement CSV data:', error);
    return [];
  }
}

async function getPostsEngagement() {
  const options = {
    ...defaultOptions,
    method: "GET",
  };
  const res = await fetch(
    `https://nudgeanalytics.eastus.cloudapp.azure.com/api/analytics/engagement_posts`,
    options
  );

  try {
    const json_data = await res.json();
    const parsedData = JSON.parse(json_data);
    return parsedData;
  } catch (error) {
    console.error('Error fetching Engagement Posts CSV data:', error);
    return [];
  }
}

async function getCommentsEngagement() {
  const options = {
    ...defaultOptions,
    method: "GET",
  };
  const res = await fetch(
    `https://nudgeanalytics.eastus.cloudapp.azure.com/api/analytics/engagement_comments`,
    options
  );

  try {
    const json_data = await res.json();
    const parsedData = JSON.parse(json_data);
    return parsedData;
  } catch (error) {
    console.error('Error fetching Engagement Comments CSV data:', error);
    return [];
  }
}

async function getWeeklyTopics() {
  const options = {
    ...defaultOptions,
    method: "GET",
  };
  const res = await fetch(
    `https://nudgeanalytics.eastus.cloudapp.azure.com/api/analytics/updated_topics`,
    options
  );

  try {
    const json_data = await res.json();
    const parsedData = JSON.parse(json_data);
    return parsedData;
  } catch (error) {
    console.error('Error fetching Weekly Topics CSV data:', error);
    return [];
  }
}

async function getWeeklyPosts() {
  const options = {
    ...defaultOptions,
    method: "GET",
  };
  const res = await fetch(
    `https://nudgeanalytics.eastus.cloudapp.azure.com/api/analytics/updated_posts`,
    options
  );

  try {
    const json_data = await res.json();
    const parsedData = JSON.parse(json_data);
    return parsedData;
  } catch (error) {
    console.error('Error fetching Weekly Posts CSV data:', error);
    return [];
  }
}

async function getLiwcComponents() {
  const options = {
    ...defaultOptions,
    method: "GET",
  };
  const res = await fetch(
    `https://nudgeanalytics.eastus.cloudapp.azure.com/api/analytics/liwc_components`,
    options
  );

  try {
    const json_data = await res.json();
    const parsedData = JSON.parse(json_data);
    return parsedData;
  } catch (error) {
    console.error('Error fetching LIWC Components CSV data:', error);
    return [];
  }
}

async function getLiwcTopics() {
  const options = {
    ...defaultOptions,
    method: "GET",
  };
  const res = await fetch(
    `https://nudgeanalytics.eastus.cloudapp.azure.com/api/analytics/liwc_topics`,
    options
  );

  try {
    const json_data = await res.json();
    const parsedData = JSON.parse(json_data);
    return parsedData;
  } catch (error) {
    console.error('Error fetching LIWC Topics CSV data:', error);
    return [];
  }
}

async function getLiwcPosts() {
  const options = {
    ...defaultOptions,
    method: "GET",
  };
  const res = await fetch(
    `https://nudgeanalytics.eastus.cloudapp.azure.com/api/analytics/liwc_posts`,
    options
  );

  try {
    const json_data = await res.json();
    const parsedData = JSON.parse(json_data);
    return parsedData;
  } catch (error) {
    console.error('Error fetching LIWC Posts CSV data:', error);
    return [];
  }
}

async function getLiwcComments() {
  const options = {
    ...defaultOptions,
    method: "GET",
  };
  const res = await fetch(
    `https://nudgeanalytics.eastus.cloudapp.azure.com/api/analytics/liwc_comments`,
    options
  );

  try {
    const json_data = await res.json();
    const parsedData = JSON.parse(json_data);
    return parsedData;
  } catch (error) {
    console.error('Error fetching LIWC Comments CSV data:', error);
    return [];
  }
}

export {
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
};
