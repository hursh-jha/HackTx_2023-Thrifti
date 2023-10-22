import React from "react";
import BarGraph from "../components/BarGraph";

const BarGraphPage: React.FC = () => {
  const labels = [
    "Restaurant",
    "Apparel",
    "Technology",
    "Groceries",
    "Entertainment",
    "Automotive",
    "Healthcare",
    "Education",
    "Travel",
    "Utilities",
  ];

  const data = [300, 50, 100, 200, 175, 250, 225, 80, 150, 120];

  return (
    <div className="container">
      <h1>Bar Graph Page</h1>
      <BarGraph labels={labels} data={data} />
    </div>
  );
};

export default BarGraphPage;
