import { MDBBtn } from 'mdb-react-ui-kit';
import { useState } from "react";
import axios from "axios";

export default function ThemMathang() {
  const [matHang, setMathang] = useState({
    Mahang: "",
    Tenhang: "",
    dvt: "",
    giabanle: "",
    giabansi: "",
    kugui: "",
    mancc: "",
    giavon: "",
    price: "",
  });


  function cleanForm() {
    setMathang({
      Mahang: "",
      Tenhang: "",
      dvt: "",
      giabanle: "",
      giabansi: "",
      kugui: "",
      mancc: "",
      giavon: "",
      price: "",
    })
  }

  function handleSubmit(e) {

  }

  function handleChanged(e) {
    setMathang({ ...matHang, [e.target.name]: e.target.value });
  }

  return (
    <div style={{ width: '100%', height: '75%', backgroundColor: "transparent" }}>
      <section className="vh-100" >
        <form className="mx-1 mx-md-4" onSubmit={(e) => handleSubmit(e)}>


          <div className="d-flex flex-row align-items-center mb-2">


            <div className="form-outline flex-fill mb-0">
            <p className="text-center text-primary h4 fw-bold mt-4 text-primary">CHI TIẾT MẶT HÀNG</p>
            </div>
          </div>


          <div className="d-flex flex-row align-items-center mb-2">
            <i className="me-3 w-25">Mã hàng</i>
            <div className="form-outline flex-fill mb-0">
              <input type="text" id="form3Example1c" className="form-control"
                name="Mahang"
                required
                onChange={(e) => handleChanged(e)}
                placeholder="Mã hàng..." />
            </div>
          </div>

          <div className="d-flex flex-row align-items-center mb-2">
            <i className="me-3 w-25">Tên hàng</i>
            <div className="form-outline flex-fill mb-0">
              <input type="text" id="form3Example3c" className="form-control"
                name="Tenhang"
                required
                onChange={(e) => handleChanged(e)}
                placeholder="Tên hàng..." />
            </div>
          </div>

          <div className="d-flex flex-row align-items-center mb-2">
            <i className="me-3 w-25">Đơn vị tính</i>
            <div className="form-outline flex-fill mb-0">
              <input type="text" id="form3Example3c" className="form-control"
                name="dvt"
                required
                onChange={(e) => handleChanged(e)}
                placeholder="Đơn vị tính..." />
            </div>
          </div>

          <div className="d-flex flex-row align-items-center mb-2">
            <i className="me-3 w-25">Giá bán lẻ</i>
            <div className="form-outline flex-fill mb-0">
              <input type="text" id="form3Example3c" className="form-control"
                name="giabanle"
                required
                onChange={(e) => handleChanged(e)}
                placeholder="Giá bán lẻ..." />
            </div>
          </div>

          <div className="d-flex flex-row align-items-center mb-2">
            <i className="me-3 w-25">Giá bán sỉ</i>
            <div className="form-outline flex-fill mb-0">
              <input type="text" id="form3Example3c" className="form-control"
                name="giabansi"
                required
                onChange={(e) => handleChanged(e)}
                placeholder="Giá bán sỉ..." />
            </div>
          </div>

          <div className="d-flex flex-row align-items-center mb-2">
            <i className="me-3 w-25">Ký gửi</i>
            <div className="form-outline flex-fill mb-0">
              <input type="text" id="form3Example3c" className="form-control"
                name="kygui"
                required
                onChange={(e) => handleChanged(e)}
                placeholder="Hàng ký gửi..." />
            </div>
          </div>

          <div className="d-flex flex-row align-items-center mb-2">
            <i className="me-3 w-25">Mã NCC</i>
            <div className="form-outline flex-fill mb-0">
              <input type="text" id="form3Example3c" className="form-control"
                name="Mancc"
                required
                onChange={(e) => handleChanged(e)}
                placeholder="Mã nhà cung cấp..." />
            </div>
          </div>

          <div className="d-flex flex-row align-items-center mb-2">
            <i className="me-3 w-25">Giá vốn</i>
            <div className="form-outline flex-fill mb-0">
              <input type="text" id="form3Example3c" className="form-control"
                name="giavon"
                required
                onChange={(e) => handleChanged(e)}
                placeholder="Giá vốn..." />
            </div>
          </div>

          <div className="d-flex flex-row align-items-center mb-2">
            <i className="me-3 w-25">Price</i>
            <div className="form-outline flex-fill mb-0">
              <input type="text" id="form3Example3c" className="form-control"
                name="price"
                required
                onChange={(e) => handleChanged(e)}
                placeholder="price..." />
            </div>
          </div>

          <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
            <MDBBtn className='me-1 w-50' type="submit" onClick={cleanForm} >
              Submit
            </MDBBtn>

          </div>

        </form>
      </section>
    </div>
  )
}
