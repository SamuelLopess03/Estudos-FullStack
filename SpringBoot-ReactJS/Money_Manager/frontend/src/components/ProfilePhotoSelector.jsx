import { useRef, useState } from "react";
import { Trash, Upload, User } from "lucide-react";

const ProfilePhotoSelector = ({ image, setImage }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  const inputRef = useRef(null);

  const handleImageChange = (e) => {
    e.preventDefault();

    const file = e.target.files[0];

    if (file) {
      setImage(file);

      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleImageRemove = (e) => {
    e.preventDefault();

    setImage(null);
    setPreviewUrl(null);
  };

  const onChooseFile = (e) => {
    e.preventDefault();

    inputRef.current?.click();
  };

  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!image ? (
        <div className="w-20 h-20 flex items-center justify-center bg-purple-100 rounded-full relative">
          <User className="text-purple-500" size={35} />

          <button
            className="w-8 h-8 flex items-center justify-center bg-primary text-white 
            rounded-full absolute -bottom-1 -right-1 cursor-pointer"
            onClick={onChooseFile}
          >
            <Upload size={15} className="text-purple-600" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Profile Photo"
            className="w-20 h-20 rounded-full object-cover"
          />

          <button
            className="w-8 h-8 flex items-center justify-center bg-red-800 text-white 
            rounded-full absolute -bottom-1 -right-1 cursor-pointer"
            onClick={handleImageRemove}
          >
            <Trash size={15} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
