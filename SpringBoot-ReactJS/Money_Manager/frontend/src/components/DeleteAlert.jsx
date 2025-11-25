import { useState } from "react";
import { LoaderCircle } from "lucide-react";

const DeleteAlert = ({ content, onDelete }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      await onDelete();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p className="text-sm">{content}</p>

      <div className="flex justify-end mt-6">
        <button
          className="bg-red-500 px-4 py-2 rounded-2xl cursor-pointer"
          type="button"
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? (
            <>
              <LoaderCircle className="h-4 w-4 animated-spin" />
              Deleting...
            </>
          ) : (
            <>Delete</>
          )}
        </button>
      </div>
    </div>
  );
};

export default DeleteAlert;
