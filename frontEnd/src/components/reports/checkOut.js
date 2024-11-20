import React, { useRef, useContext } from "react";
import ReactToPrint from "react-to-print";
import DateObject from "react-date-object";
import { Context } from "../../context/Context";
import './check.css';

export default function Check(props) {

  let componentRef = useRef();
  const { user } = useContext(Context);

  let grandTotal = 0;
  let itemsTotal = 0;

  let sophieu = '';
  const date = (new DateObject()).format('MM/DD/YYYY HH:mm:ss');

  for (let i = 0; i < props.data.length; i++) {
    grandTotal += props.data[i].thanhtien;
    itemsTotal += props.data[i].slNhapBanThem;
    sophieu = props.data[i].sophieu;
  }

  const tableRows = props.data.map((data, i) => {
    return (
      <tr key={i}>
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
            <div className="col-sm-4 shop">
              <label>{user.shop}</label><br></br>
              <label>02 Cong xa Paris</label>
            </div>
            <div className="col-sm-8 title">
              <h5 style={{ textAlign: "center" }}>Sales Invoive</h5>
              <label>Date: {date}</label><br></br>
              <label>Order Number: {sophieu} </label>
            </div>
          </div>
          <hr></hr>
          <table>
            <thead>
              <tr>
                <th className='tenhangHeaderCk' >Item</th>
                <th className='tableRightCk'>Qty</th>
                <th className='tableRightCk'>Price</th>
                <th className='tableRightCk'>Amount</th>
              </tr>
            </thead>
            <tbody>
              {tableRows}
            </tbody>
          </table>
          <hr></hr>
          <div className="row justify-content-left">
            <div className="col-sm-6 footer">
              <label>Grand Total: {itemsTotal.toLocaleString('en-US')}</label><br />
            </div>
            <div className="col-sm-6 footer">
              <label>Total: {grandTotal.toLocaleString('en-US')}</label><br />
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

