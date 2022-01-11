import { ChartOptions } from 'chart.js';

export const CHART_OPTIONS: ChartOptions = {
  responsive: true,
  interaction: {
    mode: 'nearest',
    intersect: false,
  },
  plugins: {
    legend: {
      labels: {
        color: '#495057',
      },
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Day',
      },
      ticks: {
        color: '#333',
      },
      grid: {
        color: '#ececec',
      },
    },
    y: {
      title: {
        display: true,
        text: 'Cards',
      },
      ticks: {
        color: '#333',
      },
      grid: {
        color: '#ececec',
      },
    },
  },
};
