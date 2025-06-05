import Navbar from "./components/Navbar";
import { useLocation } from "react-router-dom";

function App() {
  const isOwnerPath = useLocation().pathname.includes("owner");

  return <div>{!isOwnerPath && <Navbar />}</div>;
}

export default App;
