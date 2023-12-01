import { useState } from "react";
import axios from "axios";

export default function ThemMathang() {
    const [success, setSuccess] = useState(false);
    const [isSignup, setisSignup] = useState(true);
    const [newUser, setNewUser] = useState({
        Manv: "",
        Tennv: "",
        password: "",
        diachi: "",
        tel: "",
        roll: ""
    });

    function checkInfo(newUser, e) {
        console.log(newUser)
        e.preventDefault()
        try {
            axios.post('http://localhost:8080/users', newUser)
                .then((result) => {
                    console.log(result)
                    setSuccess(true);
                    setisSignup(false);
                });
        } catch (e) {
            console.log(e);
        }
    }

    function cleanForm() {
        // setNewUser({
        //     Manv: "",
        //     Tennv: "",
        //     password: "",
        //     diachi: "",
        //     tel: "",
        //     roll: "user"
        // })
    }

    function handleChanged(e) {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    }

    return (
        <div style={{ width: '100%', height: '75%', backgroundColor: "transparent" }}>
            <section className="vh-100" >
                <p className="text-center h4 fw-bold mb-5 mx-1 mx-md-4 mt-4">Điều chỉnh mặt hàng</p>
                <form className="mx-1 mx-md-4" onSubmit={(e) => checkInfo(newUser, e)}>

                    {isSignup && <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                            <input type="text" id="form3Example1c" className="form-control"
                                name="Manv"
                                // value={newUser.name}
                                required
                                onChange={(e) => handleChanged(e)}
                                placeholder="Mã nhân viên..." />
                        </div>
                    </div>}

                    {isSignup && <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                            <input type="text" id="form3Example3c" className="form-control"
                                name="Tennv"
                                // value={newUser.username}
                                required
                                onChange={(e) => handleChanged(e)}
                                placeholder="Tên nhân viên..." />
                            {/* <label className="form-label" htmlFor="form3Example3c">Your Email</label> */}
                        </div>
                    </div>}

                    {isSignup && <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                            <input type="password" id="form3Example4c" className="form-control"
                                name="password"
                                // value={newUser.password}
                                required
                                onChange={(e) => handleChanged(e)}
                                placeholder="Password..." />
                        </div>
                    </div>}

                    {isSignup && <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-key fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                            <input type="text" id="diachi" className="form-control"
                                name="diachi"
                                // value={newUser.email}
                                required
                                onChange={(e) => handleChanged(e)}
                                placeholder="Địa chỉ ..." />

                        </div>
                    </div>}

                    {isSignup && <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-key fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                            <input type="tel" id="tel" className="form-control"
                                name="tel"
                                // value={newUser.tel}
                                //pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                                required
                                onChange={(e) => handleChanged(e)}
                                placeholder="Điện thoại (123-456-7890)....." />

                        </div>
                    </div>}

                    {isSignup && <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-key fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                            <input type="text" id="form3Example4cd" className="form-control"
                                name="roll"
                                // value={newUser.email}
                                required
                                onChange={(e) => handleChanged(e)}
                                placeholder="Role ..." />

                        </div>
                    </div>}

                    {isSignup && <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                        <button type="submit" onClick={cleanForm}>Register</button>
                    </div>}

                </form>
            </section>
        </div>
    )
}