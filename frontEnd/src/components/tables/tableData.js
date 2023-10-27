import React, { useState } from 'react';
import './table.css';
import DataForm from './table';
//import jsonData from './data.json';

function TableData() {
   const [itemData, setItemData] = useState([]);

   const tableRows = itemData.map((info) => {
      return (
         <tr>
            <td>{info.id}</td>
            <td>{info.mahang}</td>
            <td className='tableFont' >{info.tenhang}</td>
            <td className='tableRight'>{info.soluong}</td>
            <td className='tableRight'>{info.dongia.toLocaleString('en-US')}</td>
            <td className='tableRight'>{info.thanhtien.toLocaleString('en-US')}</td>
         </tr>
      );
   });

   const addRows = (data) => {
      const itemIndex = itemData.findIndex((element) => element.mahang === data.mahang);
      if (itemIndex === -1) {
         const totalItems = itemData.length;
         data.id = totalItems + 1;
         const updatedItemsData = [...itemData];
         updatedItemsData.push(data);
         setItemData(updatedItemsData);
      } else {
         const updatedItemsData = [...itemData];
         updatedItemsData[itemIndex].soluong += +data.soluong;
         updatedItemsData[itemIndex].thanhtien += +data.thanhtien;
         setItemData(updatedItemsData);
      }
   };

   return (
      <div>
         <DataForm func={addRows} />
         <table className="table table-stripped">
            <thead>
               <tr>
                  <th>Number</th>
                  <th>Mã hàng</th>
                  <th>Tên hàng</th>
                  <th className='tableRight'>Số lượng</th>
                  <th className='tableRight'>Đơn giá</th>
                  <th className='tableRight'>Thành tiền</th>
               </tr>
            </thead>
            <tbody>{tableRows}</tbody>
         </table>
         <h1>{itemData.length}</h1>
      </div>
   );
}

export default TableData;
