import React, { useEffect, useState, useContext } from 'react';
import DateObject from "react-date-object";
import './table.css';
import GhiseDataForm from './ghiseDataForm';
import axios from "axios";
import Check from '../reports/checkOut';
import { Context } from "../../context/Context";
import { useNavigate } from "react-router-dom";
const { DB_URL } = require('../../config.json');



function GhiseTableForm() {
   const { user, dispatch } = useContext(Context);
   const [itemData, setItemData] = useState([]);
   const [tygia, setTygia] = useState(0);
   const [quantity, setQuantity] = useState(0);
   const [grandTotal, setGrandTotal] = useState(0);
   const navigate = useNavigate();

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

   const handleDelete = (id) => {
      let updatedItemsData = [...itemData];
      updatedItemsData = updatedItemsData.filter((item) => item.id !== id);
      for (let i = 0; i < updatedItemsData.length; i++) {
         updatedItemsData[i].id = i + 1;
      }
      setItemData(updatedItemsData);
   }

   const tableRows = itemData.map((info) => {
      return (
         <tr key={info.id} style={{ backgroundColor: info.id % 2 === 0 ? "aqua" : "" }}>
            <td className='orderNumber'>{info.id}</td>
            <td className='mahang'>{info.mahang}</td>
            <td className='tenhang' >{info.tenhang}</td>
            <td className='tableRight'>{info.slNhapBanThem}</td>
            <td className='tableRight'>{info.dongia.toLocaleString('en-US')}</td>
            <td className='tableRight'>{info.thanhtien.toLocaleString('en-US')}</td>
            <td className='tableCenter'><button onClick={() => handleDelete(info.id)}>Delete</button></td>
         </tr>
      );
   });

   const addRows = (data) => {
      const itemIndex = itemData.findIndex((element) => element.mahang === data.mahang);
      if (itemIndex === -1) { //item not in the current list
         if (data.tonban >= data.slNhapBanThem) {
            const totalItems = itemData.length;
            data.id = totalItems + 1;
            const updatedItemsData = [...itemData];
            updatedItemsData.push(data);
            setItemData(updatedItemsData);
         } else {
            alert('Mã hàng ' + data.mahang + ' tổng tồn: ' + data.tonhientai + ': tồn kho ' + data.tonkho + ', tồn bán ' + data.tonban)
         }

      } else {
         if ((+data.slNhapBanThem + +itemData[itemIndex].slNhapBanThem) <= data.tonban) {
            const updatedItemsData = [...itemData];
            updatedItemsData[itemIndex].slNhapBanThem += +data.slNhapBanThem;
            updatedItemsData[itemIndex].thanhtien += +data.thanhtien;
            setItemData(updatedItemsData);
         } else {
            alert('Mã hàng ' + data.mahang + ' tổng tồn: ' + data.tonhientai + ': tồn kho ' + data.tonkho + ', tồn bán ' + data.tonban)
         }
      }
   };

   const checkout = () => {
      //print bill
      if (itemData.length > 0) {
         document.getElementById('checkOut').click();
      }

   }

   const clearCurrentList = (itemsList) => {

      itemsList.forEach(element => {
         //update table mathang: tonban, tonhientai
         updateMathang(element.mahang, element.slNhapBanThem);

         //insert current list into table CTBL
         saveSale(element);
      });
      //clear current list => clear table
      setItemData([]);
   }

   async function updateMathang(itemCode, itemNum) {
      try {
         const results = await axios.put(DB_URL + 'items/' + itemCode,
            {
               mahang: itemCode,
               soluong: itemNum
            },
            {
               headers: {
                  "Accept": "application/json",
                  "Content-type": "application/json",
                  'Authorization': 'Bearer ' + user.token
               }
            })
         return results.data.data;
      } catch (err) {
         console.log(err.response.data)
      }
   }

   async function saveSale(list) {
      try {
         const date = new DateObject();
         const data = {
            Sopbl: list.sophieu,
            Mahang: list.mahang,
            Catruc: list.catruc,
            Nhanvien: list.nhanvien,
            Gio: date.format('MM/DD/YYYY HH:mm:ss'),
            Soluong: list.slNhapBanThem,
            Giavon: list.Giavon,
            price: list.price,
            Dongia: list.dongia,
            Thanhtien: list.thanhtien,
            bansi: false,
         }
         const results = await axios.post(DB_URL + 'sales/',
            { data },
            {
               headers: {
                  "Accept": "application/json",
                  "Content-type": "application/json",
                  'Authorization': 'Bearer ' + user.token
               }
            })
         return results.data.data;
      } catch (err) {
         console.log(err.response)
      }
   }

   const sumOfQuantity = (items) => {
      let Quantity = 0
      for (let i = 0; i < items.length; i++) {
         Quantity += items[i].slNhapBanThem;
      }
      return Quantity;
   }

   const handleGrandTotal = (items) => {
      let total = 0
      for (let i = 0; i < items.length; i++) {
         total += items[i].thanhtien;
      }
      return total;
   }

   useEffect(() => {
      setQuantity(sumOfQuantity(itemData));
      setGrandTotal(handleGrandTotal(itemData));
   }, [itemData])

   async function getTygia() {
      try {
         const headers = { 'Authorization': 'Bearer ' + user.token };
         const results = await axios.get(DB_URL + 'tygia', { headers })
         return results.data.data;
      } catch (err) {
         console.log(err.response.data)
      }
   }
   useEffect(() => {
      if (tygia === 0) {
         getTygia().then(results => {
            setTygia(results.tygia);
         });
      }
   }, [])

   return (
      <div>
         <Check data={itemData} clearCurrentList={clearCurrentList} disabled={true} />
         <GhiseDataForm func={addRows} checkout={checkout} />
         <table className="table table-stripped">
            <thead className="banner">
               <tr>
                  <th className='orderNumber'>Number</th>
                  <th className='mahang'>Mã hàng</th>
                  <th className='tenhangHeader'>Tên hàng</th>
                  <th className='tableRight'>Số lượng <br /><h4>{quantity}</h4></th>
                  <th className='tableRight'>Đơn giá <br /></th>
                  <th className='tableRight'>
                     Thành tiền <br />
                     <h4>${(grandTotal / tygia).toLocaleString('en-US')}</h4>
                     <h4>VND: {grandTotal.toLocaleString('en-US')}</h4>
                  </th>
                  <th className='tableCenter'>Action</th>
               </tr>
            </thead>
            <tbody>{tableRows}</tbody>
         </table>
      </div>
   );
}

export default GhiseTableForm;
