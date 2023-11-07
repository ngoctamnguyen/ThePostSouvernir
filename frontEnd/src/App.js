import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Topbar from "./components/TopBar";
import Ghise from "./pages/Ghise";
import KiemHang from "./pages/Kiemhang";

axios.defaults.baseURL = "http://localhost:8080";

function App() {
  return (
    <BrowserRouter>
      <Topbar/>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/ghise" element={<Ghise />}></Route>
        <Route path="/saleReport" element={<KiemHang />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;