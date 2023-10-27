import React, { useState, useEffect } from 'react';
import axios from "axios";


// **********************************
// This data form use query directly to server each time mahang input 
// **********************************

function DataForm(props1) {
   const [mahang, setMahang] = useState('');
   const [soluong, setSoluong] = useState(1);
   const [items, setItems] = useState([])

   const changeMahang = (event) => {
      setMahang(event.target.value);
   };
   const changeSoluong = (event) => {
      setSoluong(event.target.value);
   };

    async function geItems() {
      try {
        const results = await axios.get('http://localhost:8080/items/');
        setItems(results.data.data)
      } catch (err) {
        console.log('Error');
      }

    }

    useEffect(() => {
      if (items.length === 0) {
         geItems();
      }
   })

   function loadData() {
      geItems();
      alert('Đã update data xong');
   }

   useEffect(() => {
      if (mahang.length === 7) {
         if (+soluong < 1 ) {
            alert('Số lượng cho phép từ 1');
            clearState();
            return;
         }
         const item = items.filter((i => mahang === i.Mahang));
         if (item.length === 1) {
            const val = {
               mahang,
               tenhang: item[0].Tenhang,
               soluong,
               dongia: item[0].Giaban,
               thanhtien: +item[0].Giaban * +soluong
            };
            props1.func(val);
            clearState();
         } else {
            alert("Không tìm thấy mã hàng", mahang);
            clearState();
         }
      }
   },[mahang])


   const clearState = () => {
      setMahang('');
      setSoluong(1);
   };

   return (
      <div>
         <label>Mã hàng</label>
         <input type="text" value={mahang} onChange={changeMahang} />
         <label>Số lượng</label>
         <input type="number" min="0" max="10" maxlength="5" value={soluong} onChange={changeSoluong} />
         <button onClick={loadData}>Load data</button>
      </div>
   );
}

export default DataForm;
