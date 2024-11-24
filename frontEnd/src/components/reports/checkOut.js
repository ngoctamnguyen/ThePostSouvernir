import React, { useRef, useContext } from "react";
import { MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
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
        <td className='tableRightCKQuantity'>{data.slNhapBanThem}</td>
        <td className='tableRightCkMoney'>{data.dongia.toLocaleString('en-US')}</td>
        <td className='tableRightCkMoney'>{data.thanhtien.toLocaleString('en-US')}</td>
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
          <div className="row justify-content-left" >
            <div className="col-sm-2 shop">
              <label>{user.shop}</label><br></br>
              <label>02 Cong xa Paris</label>
            </div>
            <div className="col-sm-3 title">
              <h6 style={{ textAlign: "center" }}>Sales Invoive</h6>
              <label>Date: {date}</label><br></br>
              <label>Order Number: {sophieu} </label>
            </div>
          </div>
          <hr className="col-sm-5"></hr>
          <div className="col-sm-5">
            <table >
              <thead>
                <tr>
                  <th className='tenhangCk' >Item</th>
                  <th className='tableRightCKQuantity'>Qty</th>
                  <th className='tableRightCkMoney'>Price</th>
                  <th className='tableRightCkMoney'>Amount</th>
                </tr>
              </thead>
              <tbody>
                {tableRows}
              </tbody>
            </table>
          </div>
          <hr className="col-sm-5"></hr>
          <div className="row justify-content-left">
            <div className="col-sm-2 footer">
              <label>Grand Total: {itemsTotal.toLocaleString('en-US')}</label><br />
            </div>
            <div className="col-sm-2 footer">
              <label>Total: {grandTotal.toLocaleString('en-US')}</label><br />
            </div>
          </div>
          <div className="row justify-content-left">
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

