import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

const IncomeOverview = ({ transactions, onAddIncome }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // const result = prepareIncomeLineChartData(transactions);

    // console.log(result);
    // setChartData(result);

    return () => {};
  }, [transactions]);

  return (
    <div className="card p-5 mt-5">
      <div className="flex items-center justify-between">
        <div>
          <h5 className="text-lg">Income Overview</h5>

          <p className="text-xs text-gray-400 mt-0.5">
            Track your earnings over time and analyze your income trends.
          </p>
        </div>

        <button
          className="add-btn flex justify-center items-center gap-2 cursor-pointer"
          onClick={onAddIncome}
        >
          <Plus size={15} className="text-lg" /> Add Income
        </button>
      </div>

      <div className="mt-10">{/* <CustomLineChart data={chartData} /> */}</div>
    </div>
  );
};

export default IncomeOverview;
