import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useUserData } from "../context/UserContext";

const Register = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const { registerUser, btnLoading } = useUserData();

  const submitHandler = (event: any) => {
    event.preventDefault();

    registerUser(name, email, password, navigate);
  };

  return (
    <div className="flex items-center justify-center h-screen max-h-screen">
      <div className="bg-black text-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Register To Spotify
        </h2>

        <form className="mt-8" onSubmit={submitHandler}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Name</label>

            <input
              type="text"
              className="auth-input"
              placeholder="Enter Name"
              onChange={(event) => setName(event.target.value)}
              value={name}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Email or Username
            </label>

            <input
              type="email"
              className="auth-input"
              placeholder="Enter a Email or Username"
              onChange={(event) => setEmail(event.target.value)}
              value={email}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>

            <input
              type="password"
              className="auth-input"
              placeholder="Enter a Password"
              onChange={(event) => setPassword(event.target.value)}
              value={password}
              required
            />
          </div>

          <button disabled={btnLoading} className="auth-btn">
            {btnLoading ? "Please Wait..." : "Register"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link
            to={"/login"}
            className="text-sm text-gray-400 hover:text-gray-300"
          >
            Have an Account?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
