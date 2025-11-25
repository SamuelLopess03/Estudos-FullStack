import { ArrowRight } from "lucide-react";
import moment from "moment";

import TransactionInfoCard from "../components/TransactionInfoCard";

const RecentTransactions = ({ transactions, onMore }) => {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold">Recent Transactions</h4>

        <button className="card-btn" onClick={onMore}>
          More <ArrowRight className="text-base" size={15} />
        </button>
      </div>

      <div className="mt-6">
        {transactions?.slice(0, 5)?.map((item) => (
          <TransactionInfoCard
            key={item.id}
            title={item.name}
            icon={item.icon}
            date={moment(item.date).format("Do MMM YYYY")}
            amount={item.amount}
            type={item.type}
            hideDeleteBtn
          />
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
