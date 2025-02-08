import './index.css';
import { Layout } from "antd"; // Importing necessary components

import BarChart from '../../components/Charts/BarChart'; // Import the BarChart
import { Line } from 'react-chartjs-2'; // Import the Line chart component from Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registering Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const { Content } = Layout;

const AnalyticsPage = () => {
  const healthKeywords = ["COVID", "Mental Health", "Exercise", "Nutrition", "Vaccination", "Sleep"];
  const postCounts = [150, 120, 180, 90, 130, 100]; // Example post counts for bar chart

  const colorMapping = {
    "COVID": 'rgba(255, 99, 132, 0.6)', // Red
    "Mental Health": 'rgba(75, 192, 192, 0.6)', // Teal
    "Exercise": 'rgba(153, 102, 255, 0.6)', // Purple
    "Nutrition": 'rgba(255, 159, 64, 0.6)', // Orange
    "Vaccination": 'rgba(255, 205, 86, 0.6)', // Yellow
    "Sleep": 'rgba(54, 162, 235, 0.6)', // Blue
  };

  const datasets = [
    {
      label: "Number of Posts",
      data: postCounts,
      backgroundColor: healthKeywords.map(keyword => colorMapping[keyword]),
      borderColor: healthKeywords.map(keyword => colorMapping[keyword].replace("0.6", "1")), // Darken border color
      borderWidth: 1,
    },
  ];

  // Data for the number of likes on health-related posts (2024) for the line chart
  const engagementData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], // Months of 2024
    datasets: [
      {
        label: "Mental Health Likes",
        data: [300, 320, 350, 370, 400, 420, 440, 460, 480, 500, 520, 540],
        borderColor: 'rgba(75, 192, 192, 1)', // Line color
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Fill color
        fill: true, // Optional: fill the area under the line
        tension: 0.3, // Smooth curve
      },
      {
        label: "Exercise Likes",
        data: [500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000, 1050],
        borderColor: 'rgba(153, 102, 255, 1)', // Line color
        backgroundColor: 'rgba(153, 102, 255, 0.2)', // Fill color
        fill: true, // Optional: fill the area under the line
        tension: 0.3, // Smooth curve
      },
      {
        label: "Nutrition Likes",
        data: [450, 470, 500, 520, 550, 580, 600, 630, 650, 680, 710, 740],
        borderColor: 'rgba(255, 159, 64, 1)', // Line color
        backgroundColor: 'rgba(255, 159, 64, 0.2)', // Fill color
        fill: true, // Optional: fill the area under the line
        tension: 0.3, // Smooth curve
      }
    ]
  };

  return (
    <Content>
      {/* Bar chart section */}
      <h2>Health Keywords in Social Media Posts in 2024</h2>
      <BarChart
        title="Health Keyword Mentions"
        labels={healthKeywords}
        datasets={datasets}
        onBarClick={(index) => console.log(`Clicked on ${healthKeywords[index]}`)}
        showLabels={true}
      />

      {/* Line chart section */}
      <h2>Social Media Health Engagement (Likes) in 2024</h2>
      <Line data={engagementData} options={{
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Health Topics Engagement Over Time',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          },
          legend: {
            position: 'top',
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Month'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Likes'
            }
          }
        }
      }} />
    </Content>
  );
};

export default AnalyticsPage;