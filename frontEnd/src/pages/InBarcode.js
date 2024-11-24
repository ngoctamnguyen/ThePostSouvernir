import React, { useState, useContext, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import ReactToPrint from "react-to-print";
import Button from '@mui/material/Button';
import PrintBarcode from "../components/printBarcode";
import { Context } from "../context/Context";
export default function InBarcode() {
  let componentRef = useRef();
  const navigate = useNavigate();
  const data = useState([
    [
      { maHang: '0010004', Giaban: '195000' },
      { maHang: '0010005', Giaban: '200000' },
      { maHang: '0010006', Giaban: '1500000' },
      { maHang: '0010007', Giaban: '45000' },
      { maHang: '0010008', Giaban: '60000' }
    ],
    [
      { maHang: '0010004', Giaban: '195000' },
      { maHang: '0010005', Giaban: '200000' },
      { maHang: '0010006', Giaban: '1500000' },
      { maHang: '0010007', Giaban: '45000' },
      { maHang: '0010008', Giaban: '60000' }
    ],
    [
      { maHang: '0010004', Giaban: '195000' },
      { maHang: '0010005', Giaban: '200000' },
      { maHang: '0010006', Giaban: '1500000' },
      { maHang: '0010007', Giaban: '45000' },
      { maHang: '0010008', Giaban: '60000' }
    ],
    [
      { maHang: '2222222', Giaban: '2222222' },
      { maHang: '2222222', Giaban: '2222222' },
      { maHang: '2222222', Giaban: '2222222' },
      { maHang: '2222222', Giaban: '2222222' },
      { maHang: '2222222', Giaban: '2222222' }
    ],
    [
      { maHang: '1111111', Giaban: '1111111' },
      { maHang: '1111111', Giaban: '1111111' },
      { maHang: '1111111', Giaban: '1111111' },
      { maHang: '1111111', Giaban: '1111111' },
      { maHang: '1111111', Giaban: '1111111' }
    ],
  ]);

    //check validation
  const { user, dispatch } = useContext(Context);
  function tokenValid() {
    if (!user) return 1;
    const currentDate = new Date();
    const expiryDate = new Date(parseInt(+user.exp) * 1000);
    return currentDate < expiryDate;
  }
  useEffect(() => {
    if (!tokenValid() && user) { //if user on local storage was cleared => not do
      alert("Quá thời gian đăng nhập, hãy đăng nhập lại")
      dispatch({ type: "LOGOUT" });
      localStorage.clear('user');
      navigate("/")
    }
  })

  // Print Table
  const tableToPrint = data[0].map((data, i) => {
    return (
      <tr key={i}>
        <td className='mahang' ><PrintBarcode value={data[0]} /></td>
        <td className='tenhang'><PrintBarcode value={data[1]} /></td>
        <td className='tableRightNumber'><PrintBarcode value={data[2]} /></td>
        <td className='tableRightNumber'><PrintBarcode value={data[3]} /></td>
        <td className='tableRightDate'><PrintBarcode value={data[4]} /></td>
      </tr>
    );
  });
  class ComponentToPrint extends React.PureComponent {
    render() {
      return (
        <div>
          <table>
            <tbody>
              {tableToPrint}
            </tbody>
          </table>
        </div>

      );
    }
  }

  return (
    <>
      <PrintBarcode />
      <div>
        <ReactToPrint
          trigger={() => <div >
            <Button variant="outlined" size="medium" id="checkOut" >In Tem</Button>
          </div>}
          content={() => componentRef}
        />
        <div style={{ display: "none" }} >
          <ComponentToPrint ref={el => (componentRef = el)} />
        </div>
      </div>
    </>
  )
}
