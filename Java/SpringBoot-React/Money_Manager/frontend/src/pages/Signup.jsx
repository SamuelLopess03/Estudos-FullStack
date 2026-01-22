import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";

import { assets } from "../assets/assets";

import { validateEmail } from "../utils/validation";
import { API_ENDPOINTS } from "../utils/apiEndpoints";
import axiosConfig from "../utils/axiosConfig";
import uploadProfileImage from "../utils/uploadProfileImage";

import Input from "../components/Input";
import ProfilePhotoSelector from "../components/ProfilePhotoSelector";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let profileImageUrl = "";

    if (!fullName.trim()) {
      setError("Please enter your fullname");
      setIsLoading(false);

      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter valid email address");
      setIsLoading(false);

      return;
    }

    if (!password.trim()) {
      setError("Please enter your password");
      setIsLoading(false);

      return;
    }

    setError("");

    try {
      if (profilePhoto) {
        const imageUrl = await uploadProfileImage(profilePhoto);

        profileImageUrl = imageUrl || "";
      }

      const response = await axiosConfig.post(API_ENDPOINTS.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl,
      });

      if (response.status === 201) {
        toast.success("Profile Created Successfully.");
        navigate("/login");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        console.error("Something went wrong", error);
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full relative flex items-center justify-center overflow-hidden">
      <img
        src={assets.login_bg}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover filter blur-sm"
      />

      <div className="relative z-10 w-full max-w-lg px-6">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
          <h3 className="text-2xl font-semibold text-black text-center mb-2">
            Create An Account
          </h3>

          <p className="text-sm text-slate-700 text-center mb-8">
            Start tracking your spendings by joining with us.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center mb-6">
              <ProfilePhotoSelector
                image={profilePhoto}
                setImage={setProfilePhoto}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
              <Input
                type="text"
                label="FullName"
                placeholder="John Doe"
                onChange={(e) => setFullName(e.target.value)}
                value={fullName}
              />

              <Input
                type="text"
                label="Email Address"
                placeholder="name@example.com"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />

              <div className="col-span-2">
                <Input
                  type="password"
                  label="Password"
                  placeholder="**********"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </div>
            </div>

            {error && (
              <p className="text-red-800 text-sm text-center bg-red-50 p-2 rounded">
                {error}
              </p>
            )}

            <button
              className={`btn-primary w-full py-2 text-lg font-medium cursor-pointer flex items-center 
                justify-center gap-2 ${
                  isLoading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="animate-spin w-5 h-5" />
                  Signing Up...
                </>
              ) : (
                "SIGN UP"
              )}
            </button>

            <p className="text-sm text-slate-800 text-center mt-3">
              Already have an account?
              <Link
                to="/login"
                className="font-medium text-primary underline hover:text-primary-dark transition-colors"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
