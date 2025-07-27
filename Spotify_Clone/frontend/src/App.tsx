import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useUserData } from "./context/UserContext";
import Loading from "./components/Loading";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Album from "./pages/Album";

function App() {
  const { isAuth, loading } = useUserData();

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={isAuth ? <Home /> : <Login />} />
            <Route
              path="/register"
              element={isAuth ? <Home /> : <Register />}
            />
            <Route path="/album/:id" element={<Album />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
