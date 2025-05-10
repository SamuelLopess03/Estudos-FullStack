import { useContext } from "react";
import { ToastContainer } from "react-toastify";

import Login from "../src/pages/Login";
import { AdminContext } from "./context/AdminContext";

function App() {
  const { aToken } = useContext(AdminContext);

  return aToken ? (
    <div>
      <ToastContainer />
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
}

export default App;
