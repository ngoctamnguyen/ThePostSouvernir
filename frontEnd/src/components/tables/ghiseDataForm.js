import React, { useState, useEffect, useContext } from 'react';
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
      if (event.target.value === '.') {
         props.checkout();
         getBillNumber();
         clearState();
      } else {
         setMahang(event.target.value);
      }
   };
   const changeSoluong = (event) => {
      setslNhapBanThem(event.target.value);
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

   useEffect(() => {
      if (mahang.length === 7) {
         if (+slNhapBanThem < 1) {
            alert('Số lượng cho phép từ 1');
            clearState();
            return;
         }
         getItem(mahang)
            .then(item => {
               if (item.length === 1) {
                  const val = {
                     catruc: user.catruc,
                     nhanvien: user.Tennv,
                     sophieu: billNumber,
                     mahang: mahang,
                     tenhang: item[0].Tenhang,
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
   }, [mahang])

   const clearState = () => {
      setMahang('');
      setslNhapBanThem(1);
   };

   return (
      <div className="dataTop">
         <label>Mã hàng</label>
         <input type="text"
            style={{ textAlign: 'center', fontWeight: 'bold' }}
            value={mahang}
            onChange={changeMahang} />
         <label style={{ paddingLeft: 20 }}>Số lượng</label>
         <input type="number" min="1" max="10" maxlength="5" style={{ textAlign: 'center', fontWeight: 'bold' }} value={slNhapBanThem} onChange={changeSoluong} />
         <label style={{ paddingLeft: 20 }}>Số phiếu bán lẻ</label>
         <input type="text" id="billNumber" style={{ textAlign: 'center', fontWeight: 'bold' }} disabled={true} value={billNumber} />
      </div>
   );
}

export default GhiseDataForm;
