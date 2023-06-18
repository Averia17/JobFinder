import React from 'react';
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
import { Line } from 'react-chartjs-2';
import {formatDate} from "../../services/services";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
    },
};


const LineChart = ({ chartData }) => {
    const labels = chartData?.reverse().map(({ created__date }) => formatDate(created__date));

    const data = {
        labels,
        datasets: [
            {
                label: 'Просмотры',
                data: chartData?.map(({ count }) => count),
                borderColor: '#0000e6',
                backgroundColor: '#6666ff',
            },
        ],
    };

    return <Line options={options} data={data} />;
}

export default LineChart;