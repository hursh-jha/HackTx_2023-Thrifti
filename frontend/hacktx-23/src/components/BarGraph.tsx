// BarGraph.tsx

import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { Karla } from "next/font/google";

interface BarGraphProps {
  labels: string[];
  data: number[];
}

const baseColors = [
  "#EF4444",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#9333EA",
  "#EC4899",
  "#6EE7B7",
  "#A78BFA",
  "#FBBF24",
  "#2DD4BF",
];

const generateColors = (numColors: number) => {
  const colors = [];
  for (let i = 0; i < numColors; i++) {
    colors.push(baseColors[i % baseColors.length]);
  }
  return colors;
};

const karla = Karla({
  weight: ["200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const BarGraph: React.FC<BarGraphProps> = ({ labels, data }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }

        const colors = generateColors(data.length);

        chartInstanceRef.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels,
            datasets: [
              {
                data,
                backgroundColor: colors,
                borderColor: colors,
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              x: {
                beginAtZero: true,
                grid: {
                  display: false,
                },
                ticks: {
                  color: "#059669",
                  font: {
                    family: karla.style.fontFamily,
                  },
                },
              },
              y: {
                beginAtZero: true,
                grid: {
                  display: false,
                },
              },
            },
          },
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

export default BarGraph;
