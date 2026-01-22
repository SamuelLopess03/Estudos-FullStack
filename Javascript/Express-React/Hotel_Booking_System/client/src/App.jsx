import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import AllRooms from "./pages/AllRooms";
import RoomsDetails from "./pages/RoomDetails";
import MyBookings from "./pages/MyBookings";
import Layout from "./pages/hotelOwner/Layout";

import Dashboard from "./pages/hotelOwner/Dashboard";
import AddRoom from "./pages/hotelOwner/AddRoom";
import ListRoom from "./pages/hotelOwner/ListRoom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HotelReg from "./components/HotelReg";
import Loader from "./components/Loader";

import { useAppContext } from "./context/AppContext";

function App() {
  const isOwnerPath = useLocation().pathname.includes("owner");
  const { showHotelReg } = useAppContext();

  return (
    <div>
      <Toaster />

      {!isOwnerPath && <Navbar />}

      {showHotelReg && <HotelReg />}

      <div className="min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<AllRooms />} />
          <Route path="/rooms/:id" element={<RoomsDetails />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/loader/:nextUrl" element={<Loader />} />
          <Route path="/owner" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="add-room" element={<AddRoom />} />
            <Route path="list-room" element={<ListRoom />} />
          </Route>
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
