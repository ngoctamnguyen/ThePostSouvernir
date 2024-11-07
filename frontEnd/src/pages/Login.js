import { useState } from "react";
import jwt_decode from "jwt-decode";
import Button from '@mui/material/Button';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../context/Context";
const { DB_URL } = require('../config.json');

export default function Login() {

  const [loginUser, setLoginUser] = useState({
    username: "",
    password: "",
    catruc: ""
  });
  const [errMessage, setErrMessage] = useState("");
  const { dispatch, isFetching } = useContext(Context);
  const navigate = useNavigate();

  async function handleSubmit(loginUser, e) {
    if (loginUser.catruc === "") {
      alert("Nhân viên phải chọn ca làm việc");
      return 0;
    }
    e.preventDefault()
    dispatch({ type: "LOGIN_START" });
    try {
      const results = await axios.post(DB_URL + 'login', loginUser);
      const decoded = await jwt_decode(results.data.data);
      const user = { ...decoded, token: results.data.data }
      console.log(user)
      dispatch({ type: "LOGIN_SUCCESS", payload: user });
      navigate("/");
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE" });
      setErrMessage(err.response.data.data);
    }
  }

  function handleChanged(e) {
    setLoginUser({ ...loginUser, [e.target.name]: e.target.value });

  }

  function handleCatruc(e) {
    setLoginUser({ ...loginUser, catruc: e.target.value })
  }

  return (
    <div style={{ width: '100%', height: '75%', backgroundColor: "rgba(0, 0, 255, 0.1)" }}>
      <section className="vh-100">
        <div className="container-fluid h-custom">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
              <div className="text-center fs-2" style={{color:"green"}}>
                ĐĂNG NHẬP
              </div>
              <form onSubmit={(e) => handleSubmit(loginUser, e)}>
                {/* <!-- Username input --> */}
                <div className="form-outline mb-4">
                  <input
                    type="username"
                    id="floatingInput"
                    className="form-control form-control-lg"
                    name="username"
                    required
                    placeholder="Enter a valid name"
                    onChange={(e) => handleChanged(e)}
                  />
                  <label className="form-label" htmlFor="floatingInput">Username</label>
                </div>

                {/* <!-- Password input --> */}
                <div className="form-outline mb-3">
                  <input
                    type="password"
                    id="floatingPassword"
                    className="form-control form-control-lg"
                    name="password"
                    required
                    placeholder="Enter password"
                    onChange={(e) => handleChanged(e)}
                  />
                  <label className="form-label" htmlFor="floatingPassword"
                  >Password</label
                  >
                </div>
                <div className="form-outline mb-3">
                  <input className="form-control form-control-lg" placeholder="Chọn ca trực" list="opts" onChange={(e) => handleCatruc(e)} />
                  <datalist id="opts" >
                    <option>Ca Ngay</option>
                    <option>Ca Sang</option>
                    <option>Ca Chieu</option>
                  </datalist>
                </div>
                <p className="link-danger" id="error"></p>
                <div className="d-flex justify-content-between align-items-center">
                  {/* <!-- Checkbox --> */}
                  <div className="form-check mb-0">
                    <input
                      className="form-check-input me-2"
                      type="checkbox"
                      value=""
                      id="form2Example3"
                    />
                    <label className="form-check-label" htmlFor="form2Example3">
                      Remember me
                    </label>
                  </div>
                  <a href="#!" className="text-body">Forgot password?</a>
                </div>

                <div className="text-center">
                  <Button
                    id="signinBtn"
                    type="submit"
                    size="medium"
                    variant="contained"
                  >
                    Login
                  </Button>
                  <br></br>
                  {" "}{errMessage}
                  {/* <p className="small fw-bold mt-2 pt-1 mb-0">
                                        Don't have an account? {" "}
                                        <Link to="/signup" >Register</Link>
                                    </p> */}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
