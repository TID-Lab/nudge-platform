
import Papa from 'papaparse';

const defaultOptions = {
  headers: {
    Accept: "text/csv",
    "Content-Type": "text/csv",
  },
};

function parseCsvData(csvString) {
  return new Promise((resolve) => {
    Papa.parse(csvString, {
      header: true,
      complete: (result) => {
        resolve(result.data);
      },
      error: (error) => {
        console.error('Error parsing CSV data:', error);
        resolve([]);
      },
    });
  });
}

async function getTopics() {
  const options = {
    ...defaultOptions,
    method: "GET",
  };
  const res = await fetch(
    `/api/analytics/combtopics`,
    options
  );

  try {
    const csvText = await res.text()
    const parsedData = await parseCsvData(csvText);
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
    `/api/analytics/combposts`,
    options
  );

  try {
    const csvText = await res.text()
    const parsedData = await parseCsvData(csvText);
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
    `/api/analytics/combengagement`,
    options
  );

  try {
    const csvText = await res.text()
    const parsedData = await parseCsvData(csvText);
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
    `/api/analytics/topicengagement`,
    options
  );

  try {
    const csvText = await res.text()
    const parsedData = await parseCsvData(csvText);
    return parsedData;
  } catch (error) {
    console.error('Error fetching Topic Engagement CSV data:', error);
    return [];
  }
}

export {
  getTopics,
  getTopicContent,
  getCOMBEngagement,
  getTopicEngagement,
};
