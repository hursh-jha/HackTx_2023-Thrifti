// PieChart.tsx
import React, { useEffect, useRef } from "react";
import { Karla } from "next/font/google";
import Chart from "chart.js/auto";
import "chartjs-plugin-datalabels";

interface PieChartProps {
  labels: string[];
  data: number[];
  customFunc: (label: string) => void;
}
Chart.defaults.plugins.legend.labels.color = "green";

const baseColors = [

  "#6ee7b7",
  "#34d399",
  "#10b981",
  "#059669",
  "#047857",
  "#065f46",
  "#064e3b",
  "#022c22",
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

const PieChart: React.FC<PieChartProps> = ({ labels, data, customFunc }) => {
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
          type: "pie",
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
            aspectRatio: .45,
            // maintainAspectRatio: false,
            layout: {
              padding: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
              }
            },
            plugins: {
              legend: {
                position: "bottom",
                align: "start",
                labels: {
                  font: {
                    family: karla.style.fontFamily,
                    size: 18,
                  },
                  generateLabels:  (chart) => {
                    return chart.data.labels!.map((label, index) => {
                      return {
                        text: `${label}: $${data[index]!.toFixed(2)}`,
                        fontColor: "#214D3C",
                        fillStyle: colors[index],
                        strokeStyle: colors[index],
                        lineWidth: 1,
                        hidden: isNaN(
                          chart.data.datasets[0]!.data[index] as number,
                        ),
                        index: index,
                      };
                    });
                  },
                },
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const percentage = (
                      ((context.raw as number) /
                        data.reduce((acc, value) => acc + value, 0)) *
                      100
                    ).toFixed(2);
                    return `${context.label}: ${percentage}%`;
                  },
                },
              },
              datalabels: {
                display: false,
              },
            },
          },
        }) as any;

        // @ts-ignore
        chartInstanceRef.current.canvas.onclick = (event) => {
                  // @ts-ignore
                  const points = chartInstanceRef.current.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
                  if (points.length) {
                    // @ts-ignore
                    const index = points[0].index;
                    // @ts-ignore
                    const label = chartInstanceRef.current.data.labels[index] as string;
                    customFunc(label)
                  }
        };
      }
    }
    // @ts-ignore
    const originalFit = chartInstanceRef.current.legend.fit;
    // @ts-ignore
    chartInstanceRef.current.legend.fit = function fit() {
      // Call the original function and bind scope in order to use `this` correctly inside it
      // @ts-ignore
      originalFit.bind(chartInstanceRef.current.legend)();
      // Change the height as suggested in other answers
      // @ts-ignore
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [labels, data]);

  return <canvas ref={chartRef} ></canvas>;
};

export default PieChart;
