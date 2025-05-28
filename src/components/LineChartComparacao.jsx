import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function LineChartComparacao({ abril, maio, corAbril, corMaio, maxY }) {
  const labels = [
    "R$ 1.000", "R$ 2.000", "R$ 3.000", "R$ 4.000", "R$ 5.000",
    "R$ 6.000", "R$ 7.000", "R$ 8.000", "R$ 9.000", "R$ 10.000"
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Abril",
        data: abril,
        borderColor: corAbril,
        backgroundColor: corAbril,
        tension: 0.4,
        fill: false,
        pointRadius: 3,
      },
      {
        label: "Maio",
        data: maio,
        borderColor: corMaio,
        backgroundColor: corMaio,
        tension: 0.4,
        fill: false,
        pointRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          usePointStyle: true,
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: maxY || undefined,
        ticks: {
          stepSize: 5,
        },
      },
    },
  };

  return <Line data={data} options={options} />;
}
