import React, { useState, useContext } from 'react';
import Input from '@mui/joy/Input';
import axios from "axios";
import './table.css';
import { Context } from "../../context/Context";
const { DB_URL } = require('../../config.json');

// **********************************
// This data form use query directly to server each time mahang input
// **********************************
function GhiseDataForm(props) {
  const [mahang, setMahang] = useState('');
  const [slNhapBanThem, setslNhapBanThem] = useState(1);
  const [billNumber, setBillNumber] = useState('');
  const { user } = useContext(Context);

  const changeMahang = (event) => {
    if (billNumber === '') getBillNumber();
    if (event.target.value.length === 7) {
      if (+slNhapBanThem < 1) {
        alert('Số lượng cho phép từ 1');
        clearState();
        return;
      }
      getItem(event.target.value)
        .then(item => {
          if (item.length === 1) {
            const val = {
              catruc: user.catruc,
              nhanvien: user.Tennv,
              sophieu: billNumber,
              mahang: event.target.value,
              tenhang: item[0].TenhangUnicode,
              slNhapBanThem: slNhapBanThem,
              Giavon: item[0].Giavon,
              price: item[0].price,
              dongia: item[0].Giaban,
              thanhtien: +item[0].Giaban * + slNhapBanThem,
              tonhientai: item[0].Tonhientai,
              tonkho: item[0].tonkho,
              tonban: item[0].tonban
            };
            props.func(val);
            clearState();
          } else {
            alert("Không tìm thấy mã hàng");
            clearState();
          }
        })
        .catch((error) => console.log(error));
    }
    if (event.target.value === '.') {
      props.checkout();
      getBillNumber();
      clearState();
    } else {
      setMahang(event.target.value);
    }
  };
  const changeSoluong = (event) => {
    if (+event.target.value < 0) {
      setslNhapBanThem(1);
    } else {
      setslNhapBanThem(+event.target.value);
    }
  };

  async function getItem(mahang) {
    try {
      const headers = { 'Authorization': 'Bearer ' + user.token };
      const results = await axios.get(DB_URL + 'items/' + mahang, { headers });
      return results.data.data;
    } catch (err) {
      console.log(err);
    }

  }
  async function getBillNumber() {
    try {
      const headers = { 'Authorization': 'Bearer ' + user.token };
      await axios.get(DB_URL + 'bills', { headers })
        .then(res => {
          setBillNumber(res.data.data)
        })
    } catch (err) {
      console.log(err);
    }
  }

  const clearState = () => {
    setMahang('');
    setslNhapBanThem(1);
  };

  function selectText() {
    const input = document.getElementById("number");
    input.focus();
    input.select();
  }

  return (
    <div className="dataTop">
      <label>Item ID
        <Input type='text'
          size="lg"
          placeholder="Nhập mã hàng"
          style={{ width: '150px', textAlign: 'center', fontWeight: 'bold' }}
          value={mahang}
          onChange={(e) => changeMahang(e)} /></label>

      <label style={{ paddingLeft: 20 }}>Quantity
        <Input type='number'
          id='number'
          size="lg"
          placeholder="Nhập số lượng"
          style={{ width: '150px', textAlign: 'center', fontWeight: 'bold' }}
          value={slNhapBanThem}
          onClick={() => selectText()}
          onChange={(e) => changeSoluong(e)} />
      </label>

      <label style={{ paddingLeft: 20 }}>Order Number
        <Input type='text'
          id="billNumber"
          // disabled={true}
          size="lg"
          placeholder="Số phiếu"
          style={{ width: '150px', textAlign: 'center', fontWeight: 'bold' }}
          value={billNumber} /></label>
      <label style={{ paddingLeft: 20 }}>Quantity of items
        <Input type='text'
          id="quantity"
          // disabled={true}
          size="lg"
          placeholder="Tổng số lượng"
          style={{ width: '150px', textAlign: 'center', fontWeight: 'bold' }}
          value={props.quantity} /></label>

      <label style={{ paddingLeft: 20 }}>Grand Total
        <Input type='text'
          id="totalVND"
          // disabled={true}
          size="lg"
          placeholder="Tổng tiền"
          style={{ width: '150px', textAlign: 'center', fontWeight: 'bold' }}
          value={new Intl.NumberFormat('en-US').format(props.grandTotal)} /></label>

      <label style={{ paddingLeft: 20 }}>$
        <Input type='text'
          id="totalUSD"
          // disabled={true}
          size="lg"
          placeholder="$"
          style={{ width: '150px', textAlign: 'center', fontWeight: 'bold' }}
          value={new Intl.NumberFormat('en-US').format(props.grandTotal / props.tygia)} /></label>
    </div>
  );
}

export default GhiseDataForm;
