import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';

import { useNavigate } from "react-router-dom";
import "./topbar.css";
import { useContext } from "react";
import { Context } from "../context/Context";
import logoMinhphat from "../images/icon/logoMP1.ico";
import logoThepost from "../images/icon/logoTP1.ico";




export default function FadeMenu() {
  const [anchorGhise, setAnchorGhise] = React.useState(null);
  const openGhiSe = Boolean(anchorGhise);
  const [anchorKiemHang, setAnchorKiemHang] = React.useState(null);
  const openKiemHang = Boolean(anchorKiemHang);
  const [anchorMatHang, setAnchorMatHang] = React.useState(null);
  const openMatHang = Boolean(anchorMatHang);

  const { user, dispatch } = useContext(Context);
  const navigate = useNavigate();

  function handleClickHome() {
    navigate("/")
  }
  /* *********Menu Ghi Sê********* */
  const handleClickGhiSe = (event) => {
    setAnchorGhise(event.currentTarget);
  };
  const handleCloseGhiSe = () => {
    setAnchorGhise(null);
  };
  function handleItemGhiSe() {
    navigate("/ghise");
    setAnchorGhise(null);
  }

  /* *********Menu Kiem hang********* */
  const handleClickKiemHang = (event) => {
    setAnchorKiemHang(event.currentTarget);
  };
  const handleCloseKiemHang = () => {
    setAnchorKiemHang(null);
  };
  function handleItemKiemHang() {
    navigate("/kiemhang");
    setAnchorKiemHang(null);
  }
  function handleItemTongKetKiemHang() {
    navigate("/tongketkiemhang")
    setAnchorKiemHang(null);
  }

  /* *********Mặt hàng********* */
  const handleClickMatHang = (event) => {
    setAnchorMatHang(event.currentTarget);
  };
  const handleCloseMatHang = () => {
    setAnchorMatHang(null);
  };
  function handleItemMatHang() {
    navigate("/mathang")
    setAnchorMatHang(null);
  }

  /* *********LOGOUT********* */
  function handleLogout() {
    dispatch({ type: "LOGOUT" });
    localStorage.clear('user');
    navigate("/")
  }

  /* *********LOGOUT********* */
  function handleLOGIN() {
    navigate("/login")
  }

  return (
    <div style={{backgroundColor: 'lightblue'}}>
      <img src={user ? user.shop === 'MINH PHAT SOUVENIR' ? logoMinhphat : logoThepost : ""} alt="" />
      {/* *********HOME********* */}
      {user && <Button
        id="home"
        onClick={handleClickHome}
      >
        Home
      </Button>}
      {/* *********Menu Ghi Sê********* */}
      {user &&  <Button
        id="mnuGhiSe"
        aria-controls={openGhiSe ? 'fade-menuGhise' : undefined}
        aria-haspopup="true"
        aria-expanded={openGhiSe ? 'true' : undefined}
        onClick={handleClickGhiSe}
      >
        Ghi_Sê
      </Button>}
      <Menu
        id="fade-menuGhise"
        MenuListProps={{
          'aria-labelledby': 'mnuGhiSe',
        }}
        anchorEl={anchorGhise}
        open={openGhiSe}
        onClose={handleCloseGhiSe}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={handleItemGhiSe}>Ghi Sê</MenuItem>
      </Menu>



      {/* *********Menu Kiem hang********* */}
      {user && <Button
        id="kiemHang"
        aria-controls={openKiemHang ? 'fade_mnuKiemHang' : undefined}
        aria-haspopup="true"
        aria-expanded={openKiemHang ? 'true' : undefined}
        onClick={handleClickKiemHang}
      >
        Kiểm_hàng
      </Button>}
      <Menu
        id="fade_mnuKiemHang"
        MenuListProps={{
          'aria-labelledby': 'kiemHang',
        }}
        anchorEl={anchorKiemHang}
        open={openKiemHang}
        onClose={handleCloseKiemHang}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={handleItemKiemHang}>Kiểm hàng</MenuItem>
        <MenuItem onClick={handleItemTongKetKiemHang}>Tổng Kết Kiểm Hàng</MenuItem>
      </Menu>

      {/* *********Menu Mat Hang********* */}
      {user && false && <Button
        id="kiemHang"
        aria-controls={openMatHang ? 'fade_mnuMatHang' : undefined}
        aria-haspopup="true"
        aria-expanded={openKiemHang ? 'true' : undefined}
        onClick={handleClickMatHang}
      >
        Mặt_Hàng
      </Button>}
      <Menu
        id="fade_mnuMatHang"
        MenuListProps={{
          'aria-labelledby': 'matHang',
        }}
        anchorEl={anchorMatHang}
        open={openMatHang}
        onClose={handleCloseMatHang}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={handleItemMatHang}>Mặt Hàng</MenuItem>
      </Menu>


      {/* *********LOGOUT********* */}
      <Button
        id="LOGOUT"
        aria-controls={openKiemHang ? 'fade_mnuKiemHang' : undefined}
        aria-haspopup="true"
        aria-expanded={openKiemHang ? 'true' : undefined}
        onClick={user ? handleLogout : handleLOGIN}
      >
        {user ? "LOGOUT" : "LOGIN"}
      </Button>
    </div>
  );
}
