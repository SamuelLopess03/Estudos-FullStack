import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

import { useUser } from "../hooks/useUser";

import axiosConfig from "../utils/axiosConfig";
import { API_ENDPOINTS } from "../utils/apiEndpoints";

import Dashboard from "../components/Dashboard";
import ExpenseOverview from "../components/ExpenseOverview";
import ExpenseList from "../components/ExpenseList";
import AddExpenseForm from "../components/AddExpenseForm";
import Modal from "../components/Modal";
import DeleteAlert from "../components/DeleteAlert";

const Expense = () => {
  useUser();

  const [expenseData, setExpenseData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  const fetchExpenseDetails = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_EXPENSES);

      if (response.status === 200) {
        console.log("Expenses: ", response.data);
        setExpenseData(response.data);
      }
    } catch (error) {
      console.error("Failed to Fetch Expense Details: ", error);
      toast.error(
        error.response?.data?.message || "Failed to Fetch Expense Details"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenseCategories = async () => {
    try {
      const response = await axiosConfig.get(
        API_ENDPOINTS.CATEGORY_BY_TYPE("expense")
      );

      if (response.status === 200) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Failed to Fetch Expense Categories:", error);
      toast.error(
        error.response?.data?.message || "Failed to Fetch Expense Categories"
      );
    }
  };

  const handleAddExpense = async (expense) => {
    const { name, amount, date, icon, categoryId } = expense;

    if (!name.trim()) {
      toast.error("Please Enter a Name");
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount Should be a Valid Number Greater than 0");
      return;
    }

    if (!date) {
      toast.error("Please Select a Date");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (date > today) {
      toast.error("Date Cannot be in the Future");
      return;
    }

    if (!categoryId) {
      toast.error("Please Select a Category");
      return;
    }

    try {
      const response = await axiosConfig.post(API_ENDPOINTS.ADD_EXPENSE, {
        name,
        amount: Number(amount),
        date,
        icon,
        categoryId,
      });

      if (response.status === 201) {
        setOpenAddExpenseModal(false);
        toast.success("Expense Added Successfully");
        fetchExpenseDetails();
        fetchExpenseCategories();
      }
    } catch (error) {
      console.error("Error Adding Expense: ", error);
      toast.error(error.response?.data?.message || "Failed to Adding Expense");
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axiosConfig.delete(API_ENDPOINTS.DELETE_EXPENSE(id));

      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Expense Deleted Successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.error("Error Deleting Expense", error);
      toast.error(error.response?.data?.message || "Failed to Delete Expense");
    }
  };

  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axiosConfig.get(
        API_ENDPOINTS.EXPENSE_EXCEL_DOWNLOAD,
        { responseType: "blob" }
      );

      let filename = "expense_details.xlsx";
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Download Expense Details Successfully");
    } catch (error) {
      console.error("Error Downloading Expense Details:", error);
      toast.error(
        error.response?.data?.message || "Failed to Download Expense"
      );
    }
  };

  const handleEmailExpenseDetails = async () => {
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.EMAIL_EXPENSE);

      if (response.status === 200) {
        toast.success("Expense Details Emailed Successfully");
      }
    } catch (error) {
      console.error("Error Emailing Expense Details:", error);
      toast.error(error.response?.data?.message || "Failed to Email Expense");
    }
  };

  useEffect(() => {
    fetchExpenseDetails();
    fetchExpenseCategories();
  }, []);

  return (
    <Dashboard activeMenu={"Expense"}>
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <ExpenseOverview
              transactions={expenseData}
              onAddExpense={() => setOpenAddExpenseModal(true)}
            />
          </div>

          <ExpenseList
            transactions={expenseData}
            onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
            onDownload={handleDownloadExpenseDetails}
            onEmail={handleEmailExpenseDetails}
          />

          <Modal
            isOpen={openAddExpenseModal}
            onClose={() => setOpenAddExpenseModal(false)}
            title="Add Expense"
          >
            <AddExpenseForm
              onAddExpense={(expense) => handleAddExpense(expense)}
              categories={categories}
            />
          </Modal>

          <Modal
            isOpen={openDeleteAlert.show}
            onClose={() => setOpenDeleteAlert({ show: false, data: null })}
            title="Delete Expense"
          >
            <DeleteAlert
              content="Are you sure want to delete this expense details?"
              onDelete={() => deleteExpense(openDeleteAlert.data)}
            />
          </Modal>
        </div>
      </div>
    </Dashboard>
  );
};

export default Expense;
