import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "react-hot-toast";

import { useUser } from "../hooks/useUser";
import axiosConfig from "../utils/axiosConfig";
import { API_ENDPOINTS } from "../utils/apiEndpoints";

import Dashboard from "../components/Dashboard";
import CategoryList from "../components/CategoryList";
import Modal from "../components/Modal";
import AddCategoryForm from "../components/AddCategoryForm";

const Category = () => {
  useUser();

  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
  const [openEditCategoryModal, setOpenEditCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchCategoryDetails = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);

      if (response.status === 200) {
        console.log("categories:", response.data);
        setCategoryData(response.data);
      }
    } catch (error) {
      console.error("Something Went Wrong. Please try Again.", error);

      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (category) => {
    const { name, type, icon } = category;

    if (!name.trim()) {
      toast.error("Category Name is Required");
      return;
    }

    const isDuplicate = categoryData.some((category) => {
      return category.name.toLowerCase() === name.trim().toLowerCase();
    });

    if (isDuplicate) {
      toast.error("Category Name Already Exists");
      return;
    }

    try {
      const response = await axiosConfig.post(API_ENDPOINTS.ADD_CATEGORY, {
        name,
        type,
        icon,
      });

      if (response.status === 201) {
        toast.success("Category Added Successfully");
        setOpenAddCategoryModal(false);
        fetchCategoryDetails();
      }
    } catch (error) {
      console.error("Error Adding Category: ", error);
      toast.error(error.response?.data?.message || "Failed to Add Category");
    }
  };

  const handleEditCategory = (categoryToEdit) => {
    setSelectedCategory(categoryToEdit);
    setOpenEditCategoryModal(true);
  };

  const handleUpdateCategory = async (updatedCategory) => {
    const { id, name, type, icon } = updatedCategory;

    if (!name.trim()) {
      toast.error("Category Name is Required");
      return;
    }

    if (!id) {
      toast.error("Category ID is Missing for Update");
      return;
    }

    try {
      await axiosConfig.put(API_ENDPOINTS.UPDATE_CATEGORY(id), {
        name,
        type,
        icon,
      });

      setOpenEditCategoryModal(false);
      setSelectedCategory(null);
      toast.success("Category Updated Successfully");
      fetchCategoryDetails();
    } catch (error) {
      console.error(
        "Error Updating Category: ",
        error.response?.data?.message || error.message
      );
      toast.error(error.response?.data?.message || "Failed to Update Category");
    }
  };

  useEffect(() => {
    fetchCategoryDetails();
  }, []);

  return (
    <Dashboard activeMenu={"Category"}>
      <div className="my-5 mx-auto">
        {/* Add Button to Add Category */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-semibold">All Categories</h2>

          <button
            onClick={() => setOpenAddCategoryModal(true)}
            className="add-btn flex items-center gap-1 cursor-pointer"
          >
            <Plus size={15} />
            Add Category
          </button>
        </div>

        {/* Category List */}
        <CategoryList
          categories={categoryData}
          onEditCategory={handleEditCategory}
        />

        {/* Adding Category Modal */}
        <Modal
          isOpen={openAddCategoryModal}
          onClose={() => setOpenAddCategoryModal(false)}
          title="Add Category"
        >
          <AddCategoryForm onAddCategory={handleAddCategory} />
        </Modal>

        {/* Updating Category Modal */}
        <Modal
          isOpen={openEditCategoryModal}
          onClose={() => {
            setOpenEditCategoryModal(false);
            setSelectedCategory(null);
          }}
          title="Update Category"
        >
          <AddCategoryForm
            initialCategoryData={selectedCategory}
            onAddCategory={handleUpdateCategory}
            isEditing={true}
          />
        </Modal>
      </div>
    </Dashboard>
  );
};

export default Category;
