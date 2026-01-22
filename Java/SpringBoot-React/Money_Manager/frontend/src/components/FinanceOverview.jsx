import { addThousandsSeparator } from "../utils/util";

import CustomPieChart from "./CustomPieChart.jsx";

const FinanceOverview = ({ totalBalance, totalIncome, totalExpense }) => {
  const COLORS = ["#59168B", "#a0090e", "#016630"];

  const balanceData = [
    { name: "Total Balance", amount: totalBalance },
    { name: "Total Incomes", amount: totalIncome },
    { name: "Total Expenses", amount: totalExpense },
  ];

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Financial Overview</h5>
      </div>

      <CustomPieChart
        data={balanceData}
        label="Total Balance"
        totalAmount={`R$${addThousandsSeparator(totalBalance)}`}
        colors={COLORS}
        showTextAnchor
      />
    </div>
  );
};

export default FinanceOverview;
