import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import DateObject from "react-date-object";
import './check.css';

export default function Check(props) {

  let componentRef = useRef();

  let grandTotal = 0;
  let itemsTotal = 0;

  let sophieu = '';
  const date = (new DateObject()).format('MM/DD/YYYY HH:mm:ss');

  for (let i = 0; i < props.data.length; i++) {
    grandTotal += props.data[i].thanhtien;
    itemsTotal += props.data[i].slNhapBanThem;
    sophieu = props.data[i].sophieu;
  }

  const tableRows = props.data.map((data) => {
    return (
      <tr key={data.id}>
        <td className='tenhangCk' >{data.tenhang}</td>
        <td className='tableRightCk'>{data.slNhapBanThem}</td>
        <td className='tableRightCk'>{data.dongia.toLocaleString('en-US')}</td>
        <td className='tableRightCk'>{data.thanhtien.toLocaleString('en-US')}</td>
      </tr>
    );
  });

  function handleClick() {
    props.clearCurrentList(props.data);
  }

  class ComponentToPrint extends React.Component {
    render() {
      return (
        <div>
          <div className="row justify-content-center">
            <div class="col-sm-4 shop">
              <label>MINH PHAT</label><br></br>
              <label>02 Cong xa Paris</label>
            </div>
            <div class="col-sm-8 title">
              <h5 style={{ textAlign: "center" }}>Hóa đơn bán lẻ</h5>
              <label>Ngày: {date}</label><br></br>
              <label>Số phiếu: {sophieu} </label>
            </div>
          </div>
          <hr></hr>
          <table>
            <thead>
              <th className='tenhangHeaderCk' >Tên hàng</th>
              <th className='tableRightCk'>SL</th>
              <th className='tableRightCk'>Đơn giá</th>
              <th className='tableRightCk'>Thành tiền</th>
            </thead>
            <tbody>
              {tableRows}
            </tbody>
          </table>
          <hr></hr>
          <div className="row justify-content-left">
            <div className="col-sm-6 footer">
              <label>Tổng số lượng: {itemsTotal.toLocaleString('en-US')}</label><br />
            </div>
            <div className="col-sm-6 footer">

              <label>Tổng số tiền: {grandTotal.toLocaleString('en-US')}</label><br />
            </div>

          </div>
          <div className="see">
            <label>Thank you & See You Again !!!</label>
          </div>
        </div>
      );
    }
  }
  return (
    <>
      <div id="print_component" style={{ paddingBottom: 10, display: "none" }} >
        <ReactToPrint
          trigger={() => <div >
            <button type="button" id="checkOut" onClick={handleClick} >Kết thúc Bill bằng dấu chấm</button>
          </div>}
          content={() => componentRef}
        />
        <div style={{ display: "none" }}>
          <ComponentToPrint ref={(el) => (componentRef = el)} />
        </div>
      </div>
    </>
  );
}

