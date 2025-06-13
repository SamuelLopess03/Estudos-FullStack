import { Route, Routes, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import AllRooms from "./pages/AllRooms";
import RoomsDetails from "./pages/RoomDetails";
import MyBookings from "./pages/MyBookings";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  const isOwnerPath = useLocation().pathname.includes("owner");

  return (
    <div>
      {!isOwnerPath && <Navbar />}

      <div className="min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<AllRooms />} />
          <Route path="/rooms/:id" element={<RoomsDetails />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
