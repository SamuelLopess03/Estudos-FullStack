import { useContext } from "react";
import { ToastContainer } from "react-toastify";

import Login from "../src/pages/Login";
import { AdminContext } from "./context/AdminContext";
import Navbar from "./components/Navbar";

function App() {
  const { aToken } = useContext(AdminContext);

  return aToken ? (
    <div>
      <ToastContainer />
      <Navbar />
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
}

export default App;
