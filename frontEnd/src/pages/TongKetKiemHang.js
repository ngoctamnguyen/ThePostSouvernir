import DataTable from 'react-data-table-component';
import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import 'react-dropdown/style.css';
import { MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import './login.css';
import axios from "axios";
import { Context } from "../context/Context";
const { DB_URL } = require('../config.json');


export default function TongKetKiemHang() {

  let componentRef = useRef();

  const [data, setData] = useState([]);
  const [month, setMonth] = useState(0)
  const [tempData, setTempData] = useState([]);
  const [isCheckedKG, setIsCheckedKG] = useState(false);
  const [isCheckedNoKG, setIsCheckedNoKG] = useState(false);
  const [radioValue, setRadioValue] = useState("today");
  const navigate = useNavigate();
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

  const columns = [
    {
      name: 'Mã hàng',
      selector: row => row.Mahang,
      sortable: true,
      width: '80px',
      style: {
        background: "cyan",
        paddingRight: '1px',
        marginRight: '0px'
      }
    },
    {
      name: 'Tên hàng',
      selector: row => row.Tenhang,
      width: '150px',
    },
    {
      name: 'Chênh lệch',
      selector: row => row.chenhLech,
      sortable: true,
      width: '80px',
      textAlign: 'center'
    },
    {
      name: 'KG',
      selector: row => row.kygoi,
      width: '80px'
    },
    {
      name: 'Ghi chú',
      selector: row => row.ghichu,
      width: '900px'
    }
  ];
  const paginationComponentOptions = {
    rowsPerPageText: 'Rows per page',
    rangeSeparatorText: 'of',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'All',
  };

  useEffect(() => {
    if (!user) { navigate("/") }
  }, [user]);

  async function loadDSkiemhang() {
    try {
      if (radioValue === "today") {
        getDataCheckedToday();
      } else {
        if (radioValue === "month") {
          getDataCheckedThisMonth();
        } else {
          return 0;
        }
      }

    } catch (err) {
      console.log(err.message);
    }
  }

  async function getDataCheckedThisMonth() {
    try {
      const headers = { 'Authorization': 'Bearer ' + user.token };
      await axios.get(DB_URL + 'items/kiemhang/thang/' + month, { headers })
        .then((result) => {
          setData(result.data.data);
          setTempData(result.data.data);
        });
    } catch (err) {
      console.log(err.message);
    }
  }
  async function getDataCheckedToday() {
    try {
      const headers = { 'Authorization': 'Bearer ' + user.token };
      await axios.get(DB_URL + 'items/kiemhang/today', { headers })
        .then((result) => {
          setData(result.data.data);
          setTempData(result.data.data);
        });
    } catch (err) {
      console.log(err.message);
    }
  }

  const handleCheckBoxKygui = () => {
    setIsCheckedKG(!isCheckedKG)
  }
  const handleCheckBoxKhongKygui = () => {
    setIsCheckedNoKG(!isCheckedNoKG)
  }

  useEffect(() => {
    if (isCheckedKG) {
      setData(tempData.filter(item => item.kygoi === 'y' || item.kygoi === 'Y'));
    } else {
      setData(tempData);
    }
  }, [isCheckedKG])

  useEffect(() => {
    if (isCheckedNoKG) {
      setData(tempData.filter(item => (item.kygoi !== 'y' && item.kygoi !== 'Y')));
    } else {
      setData(tempData);
    }
  }, [isCheckedNoKG])

  // Print Table
  const tableToPrint = data.map((data) => {
    return (
      <tr key={data.id}>
        <td className='mahang' >{data.Mahang}</td>
        <td className='tenhang'>{data.Tenhang}</td>
        <td className='tableRightNumber'>{data.chenhLech}</td>
        <td className='tableRightNumber'>{data.kygoi}</td>
        <td className='tableRightDate'>{data.ghichu}</td>
      </tr>
    );
  });
  class ComponentToPrint extends React.PureComponent {
    render() {
      return (
        <div>
          <div>
            <h3>{user.shop}</h3>
            <h5>BẢNG TỔNG HỢP KIỂM HÀNG</h5>
            <label>In ngày: {Date()}</label> <br /> <br />
          </div>
          <table>
            <thead>
              <th className='tenhangHeader' >Mã hàng</th>
              <th className='tenhangHeader' >Tên hàng</th>
              <th className='tableRightNumberHeader'>Chênh lệch</th>
              <th className='tableRightNumberHeader'>Ký gửi</th>
              <th className='tableRightDateHeader'>Ngày kiểm</th>
            </thead>
            <tbody>
              {tableToPrint}
            </tbody>
          </table>
        </div>

      );
    }
  }

  const handleRadioChange = (event) => {
    setRadioValue(event.target.value);
  }

  return (
    <div style={{ width: '100%', height: '75%', backgroundColor: "rgba(0, 0, 255, 0.1)" }}>
      <MDBContainer>
        <MDBRow center style={{ height: "100vh" }}>
          <MDBCol size='20'>
            <label style={{ padding: '5px', color: 'red', textAlign: 'center' }}><h3>TỔNG HỢP KIỂM HÀNG</h3></label>
            <MDBRow>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={radioValue}
                onChange={handleRadioChange}
              >
                <FormControlLabel
                  value="today"
                  // disabled
                  control={<Radio />}
                  label="Xem kết quả kiểm hàng hôm nay"
                />
                <FormControlLabel value="month" control={<Radio />} label="Xem kết quả kiểm hàng trong tháng" />
                <Button size="small" variant="contained" id='loadDSKH' onClick={() => loadDSkiemhang()}>Hiển thị</Button>
              </RadioGroup>
            </MDBRow>
            <input type="checkbox" id="topping" name="topping" onChange={handleCheckBoxKygui} style={{ paddingLeft: '10px' }} />
            <span style={{ paddingRight: '15px' }}>Hiển thị ký gửi</span>
            <input type="checkbox" id="topping1" name="topping" onChange={handleCheckBoxKhongKygui} style={{ paddingLeft: '10px' }} />
            <span style={{ paddingRight: '15px' }}>Hiển thị KHÔNG ký gửi</span>
            {/* Print table */}
            <div>
              <ReactToPrint
                trigger={() => <div >
                  <Button variant="outlined" size="medium" id="checkOut" >In danh sách</Button>
                </div>}
                content={() => componentRef}
              />
              <div style={{ display: "none" }} >
                <ComponentToPrint ref={el => (componentRef = el)} />
              </div>
            </div>
            <DataTable
              title="Danh sách hàng"
              className="tenhang"
              columns={columns}
              data={data}
              pagination
              paginationComponentOptions={paginationComponentOptions}
              dense
            />
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
};
