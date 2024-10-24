import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

import Menu from "./components/Menu";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Ghise from "./pages/Ghise";
import KiemHang from "./pages/Kiemhang";
import HDV from "./pages/hdv";
import Mathang from "./pages/Mathang";
import TongKetKiemHang from "./pages/TongKetKiemHang";

axios.defaults.baseURL = "http://localhost:8080";

function App() {

  return (
    <BrowserRouter>
      <Menu />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/ghise" element={<Ghise />}></Route>
        <Route path="/mathang" element={<Mathang />}></Route>
        <Route path="/kiemhang" element={<KiemHang />}></Route>
        <Route path="/tongketkiemhang" element={<TongKetKiemHang />}></Route>
        <Route path="/hdv" element={<HDV />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
      </Routes>
    </BrowserRouter>

  );
}

export default App;
