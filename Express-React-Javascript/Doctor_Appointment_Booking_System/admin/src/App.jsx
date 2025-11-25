import { useContext } from "react";
import { ToastContainer } from "react-toastify";
import { Routes, Route } from "react-router-dom";

import { AdminContext } from "./context/AdminContext";
import { DoctorContext } from "./context/DoctorContext";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Login from "../src/pages/Login";
import Dashboard from "./pages/Admin/Dashboard";
import AllAppointments from "./pages/Admin/AllAppointments";
import AddDoctors from "./pages/Admin/AddDoctors";
import DoctorsList from "./pages/Admin/DoctorsList";

import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments";
import DoctorProfile from "./pages/Doctor/DoctorProfile";

function App() {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  return aToken || dToken ? (
    <div className="bg-[#F8F9FD]">
      <ToastContainer />
      <Navbar />
      <div className="flex items-start">
        <Sidebar />
        <Routes>
          {/* Admin Routes*/}
          <Route path="/" element={<></>} />
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/all-appointments" element={<AllAppointments />} />
          <Route path="/add-doctors" element={<AddDoctors />} />
          <Route path="/doctor-list" element={<DoctorsList />} />

          {/* Doctor Routes*/}
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor-appointments" element={<DoctorAppointments />} />
          <Route path="/doctor-profile" element={<DoctorProfile />} />

          {/* Default Routes*/}
          <Route
            path="*"
            element={
              <div className="w-full flex justify-center items-center min-h-screen">
                <h1 className="font-semibold text-2xl">
                  Página Não Encontrada
                </h1>
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
}

export default App;
