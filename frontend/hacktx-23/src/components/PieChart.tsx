import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-plugin-datalabels';

interface PieChartProps {
  labels: string[];
  data: number[];
}

const baseColors = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#9333EA',
  '#EC4899', '#6EE7B7', '#A78BFA', '#FBBF24', '#2DD4BF',
];

const generateColors = (numColors: number) => {
  const colors = [];
  for (let i = 0; i < numColors; i++) {
    colors.push(baseColors[i % baseColors.length]);
  }
  return colors;
};

const PieChart: React.FC<PieChartProps> = ({ labels, data }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }
        const colors = generateColors(data.length);
        chartInstanceRef.current = new Chart(ctx, {
          type: 'pie',
          data: {
            labels,
            datasets: [{
              data,
              backgroundColor: colors,
              borderColor: colors,
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'right',
              },
              title: {
                display: true,
                text: 'Pie Chart Example'
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const percentage = ((context.raw as number) / data.reduce((acc, value) => acc + value, 0) * 100).toFixed(2);
                    return `${context.label}: ${percentage}%`;
                  }
                }
              },
              datalabels: {
                display: false
              }
            }
          }
        }) as any;
      }
    }
    
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [labels, data]);

  return <canvas ref={chartRef}></canvas>;
};

export default PieChart;
