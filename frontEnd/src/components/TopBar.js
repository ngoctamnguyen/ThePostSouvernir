import { Link, useNavigate } from "react-router-dom";
import "./topbar.css";
import { useContext } from "react";
import { Context } from "../context/Context";
import logoMinhphat from "../images/icon/logoMP1.ico";
import logoThepost from "../images/icon/logoTP1.ico";

export default function Topbar() {

  const { user, dispatch } = useContext(Context);
  const navigate = useNavigate();

  function handleLogout() {
    dispatch({ type: "LOGOUT" });
    localStorage.clear('user');
    navigate("/")
  }


  return (
    <div className="top">
      <div className="topLeft">
        <img src={user ? user.shop === 'MINH PHAT SOUVENIR' ? logoMinhphat : logoThepost : ""} />
        <i className="topIcon fab fa-facebook-square"></i>
        <i className="topIcon fab fa-instagram-square"></i>
        <i className="topIcon fab fa-pinterest-square"></i>
        <i className="topIcon fab fa-twitter-square"></i>

      </div>
      <div className="topCenter">
        <ul className="topList">
          <li className="topListItem"><Link className="link" to="/">HOME</Link></li>
          <li className="topListItem">{user && <Link className="link" to="/ghise">GHISE</Link>}</li>
        </ul>

      </div>
      <div className="topRight">
        {user && user.shop +  " WELCOME " + user.Tennv}
      </div>
      <div className="topRight">
        {user && user.catruc}
      </div>
      <div className="topRight">
        <ul className="topList">
          <li className="topListItem" onClick={handleLogout}>{user && "LOGOUT"}</li>
          <li className="topListItem">
            <Link className="link" to="/login">
              {!user && "LOGIN"}
            </Link>
          </li>
          <li className="topListItem">
            <Link className="link" to="/signup">
              {!user && "REGISTER"}
            </Link>
          </li>
        </ul>
        <i className="topSearchIcon fa-solid fa-user"></i>
      </div>
    </div>
  );
}
