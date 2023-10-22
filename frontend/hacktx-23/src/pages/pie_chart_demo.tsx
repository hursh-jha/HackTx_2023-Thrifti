import React from 'react';
import PieChart from '../components/PieChart';

const ChartPage: React.FC = () => {
const labels = [
  'Restaurant',
  'Apparel',
  'Technology',
  'Groceries',
  'Entertainment',
  'Automotive',
  'Healthcare',
  'Education',
  'Travel',
  'Utilities'
];

const data = [300, 50, 100, 200, 175, 250, 225, 80, 150, 120];


  return (
    <div className="container">
      <h1>Pie Chart Page</h1>
      <PieChart labels={labels} data={data} />
    </div>
  );
};

export default ChartPage;
