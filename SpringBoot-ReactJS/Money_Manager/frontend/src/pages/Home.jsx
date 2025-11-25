import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Coins, Wallet, WalletCards } from "lucide-react";

import { useUser } from "../hooks/useUser";
import { addThousandsSeparator } from "../utils/util";
import axiosConfig from "../utils/axiosConfig";
import { API_ENDPOINTS } from "../utils/apiEndpoints";

import Dashboard from "../components/Dashboard";
import InfoCard from "../components/InfoCard";
import RecentTransactions from "../components/RecentTransactions";
import FinanceOverview from "../components/FinanceOverview";
import Transactions from "../components/Transactions";

const Home = () => {
  useUser();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosConfig.get(API_ENDPOINTS.DASHBOARD_DATA);

      if (response.status === 200) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error(
        "Something went wrong while fetching dashboard data: ",
        error
      );
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    return () => {};
  }, []);

  return (
    <Dashboard activeMenu={"Dashboard"}>
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
            icon={<WalletCards />}
            label="Total Balance"
            value={addThousandsSeparator(dashboardData?.totalBalance || 0)}
            color="bg-purple-800"
          />

          <InfoCard
            icon={<Wallet />}
            label="Total Income"
            value={addThousandsSeparator(dashboardData?.totalIncome || 0)}
            color="bg-green-800"
          />

          <InfoCard
            icon={<Coins />}
            label="Total Expense"
            value={addThousandsSeparator(dashboardData?.totalExpense || 0)}
            color="bg-red-800"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <RecentTransactions
            transactions={dashboardData?.recentTransactions}
            onMore={() => navigate("/expense")}
          />

          <FinanceOverview
            totalBalance={dashboardData?.totalBalance || 0}
            totalIncome={dashboardData?.totalIncome || 0}
            totalExpense={dashboardData?.totalExpense || 0}
          />

          <Transactions
            transactions={dashboardData?.recent5Expenses || []}
            onMore={() => navigate("/expense")}
            type="expense"
            title="Recent Expenses"
          />

          <Transactions
            transactions={dashboardData?.recent5Incomes || []}
            onMore={() => navigate("/income")}
            type="income"
            title="Recent Incomes"
          />
        </div>
      </div>
    </Dashboard>
  );
};

export default Home;
