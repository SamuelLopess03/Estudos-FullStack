import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return (
    <div className="flex items-center justify-center h-screen max-h-screen">
      <div className="bg-black text-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Login To Spotify
        </h2>

        <form className="mt-8">
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

          <button className="auth-btn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
