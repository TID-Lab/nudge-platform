import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useEffect, useState } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = (props) => {
  const { title, labels, datasets, onBarClick, showLabels } = props;
  const [chartOptions, setChartOptions] = useState({
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
        text: 'Title',
      },
    },
    onClick: (_, elements) => {
      if (elements.length > 0) {
        const clickedIndex = elements[0].index;
        // console.log(`Bar clicked at index ${labels[clickedIndex]}`);
        onBarClick(clickedIndex);
      }
    },
  });
  const [chartData, setChartData] = useState({labels:[],datasets:[]});

  useEffect(() => {
    if (title) {
      setChartOptions({
        scales: {
          x: {
            display: showLabels, // Hide x-axis labels
          },
          y: {
            display: showLabels, // Hide y-axis labels
          }
        },
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: title,
          },
        },
      });
    }

    if (labels && datasets) {
      const cdata = {
        labels: labels,
        datasets: datasets,
      };
      setChartData(cdata);
    }

  }, [title, labels, datasets, showLabels]);

  return <Bar options={chartOptions} data={chartData} />;
}




export default BarChart;
