import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
    },
    aspectRatio: 1.5
};

const PieChart = ({ labels, data, datasetLabel }) => {
    const chartData = {
        labels: labels,
        datasets: [
            {
                label: datasetLabel,
                data: data,
                backgroundColor: [
                    'rgb(204, 51, 0, 0.2)',
                    'rgb(0, 0, 230, 0.2)',
                    'rgb(51, 153, 51, 0.2)',
                    'rgb(102, 0, 102, 0.2)',
                ],
                borderColor: [
                    'rgb(204, 51, 0, 1)',
                    'rgb(0, 0, 230, 1)',
                    'rgb(51, 153, 51, 1)',
                    'rgb(102, 0, 102, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };
    return <Pie data={chartData} options={options} />;
}

export default PieChart;