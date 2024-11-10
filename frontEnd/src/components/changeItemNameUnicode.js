import { Button } from '@mui/material';

export default function ChangeItemNameUnicode(props) {


  function handleSubmit() {
    props.handleChangeItemName();
  }

  function handleChanged(e) {
    props.setMathang({ ...props.data, tenHangUnicode: e.target.value });
  }

  return (
    <div style={{ width: '100%', height: '75%', backgroundColor: "transparent" }}>
      <section className="vh-100" >
        <form className="mx-1 mx-md-4">
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
                value={props.data.maHang}
                disabled
                required
                placeholder="Mã hàng..." />
            </div>
          </div>
          <div className="d-flex flex-row align-items-center mb-2">
            <i className="me-3 w-25">Tên hàng</i>
            <div className="form-outline flex-fill mb-0">
              <input type="text" id="form3Example3c" className="form-control"
                name="Tenhang"
                value={props.data.tenHang}
                disabled
                required
                placeholder="Tên hàng .vnTime..." />
            </div>
          </div>
          <div className="d-flex flex-row align-items-center mb-2">
            <i className="me-3 w-25">Tên hàng Arial</i>
            <div className="form-outline flex-fill mb-0">
              <input type="text" id="form3Example3c" className="form-control"
                name="TenhangArrial"
                value={props.data.tenHangUnicode}
                required
                onChange={(e) => handleChanged(e)}
                placeholder="Tên hàng Arial..." />
            </div>
          </div>
          <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
            <Button variant="contained" size="large" onClick={handleSubmit}>Submit</Button>
          </div>

        </form>
      </section>
    </div>
  )
}
