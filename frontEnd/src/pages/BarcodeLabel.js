/* eslint-disable react-hooks/rules-of-hooks */
import DataTable from 'react-data-table-component';
import Button from '@mui/material/Button';
import Input from '@mui/joy/Input';
import Dropdown from 'react-dropdown';
import ReactToPrint from "react-to-print";
import PrintBarcode from "../components/printBarcode";
import 'react-dropdown/style.css';
import { MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useContext, useRef } from 'react';
import './login.css';
import axios from "axios";
import { Context } from "../context/Context";
const { DB_URL } = require('../config.json');


export default function BarcodeLabel() {
  const [data, setData] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [labelData, setLabelData] = useState([]);
  const [dataPrint, setDataPrint] = useState([]);
  const [groupedArray, setGroupedArray] = useState([])
  const [searchItem, setSearchItem] = useState('');
  const [nhomhang, setNhomHang] = useState([]);
  const [maNhomHang, setMaNhomHang] = useState('');
  const [labelNmuber, setLabelNumber] = useState(1);
  const [totalLabel, setTotalLabel] = useState(0);
  const [options] = useState([]);
  const defaultOption = options[0];
  const [pending, setPending] = useState(true);
  const navigate = useNavigate();
  const { user, dispatch } = useContext(Context);
  let componentRef = useRef();

  function tokenValid() {
    if (!user) return 1;
    const currentDate = new Date();
    const expiryDate = new Date(parseInt(+user.exp) * 1000);
    return currentDate < expiryDate;
  }
  useEffect(() => {
    if (!tokenValid() && user) { //if user on local storage was cleared => not do
      dispatch({ type: "LOGOUT" });
      localStorage.clear('user');
      navigate("/")
    }
  })
  useEffect(() => {
    const timeout = setTimeout(() => {
      getNhomHang();
    }, 1000);
    return () => clearTimeout(timeout);
  });

  useEffect(() => {
    setDataPrint([]);
    for (let i = 0; i < labelData.length; i++) {
      for (let j = 0; j < labelData[i].soluongTem; j++) {
        setDataPrint(dataPrint => [...dataPrint, { maHang: labelData[i].maHang, tenHangUnicode: labelData[i].tenHangUnicode, Giaban: labelData[i].Giaban }])
      }
    }
  }, [labelData]);

  useEffect(() => {
    setGroupedArray([]);
    for (let i = 0; i < dataPrint.length; i = i + 5) {
      setGroupedArray(groupedArray => [...groupedArray, dataPrint.slice(i, i + 5)])
    }
  }, [dataPrint])

  const columns = [
    {
      name: 'Mã hàng',
      selector: row => row.Mahang,
      sortable: true,
      width: '100px',
    },
    {
      name: 'Tên hàng Arial',
      selector: row => row.TenhangUnicode,
      width: '200px',
    },
    {
      name: 'Action',
      selector: row => <Button variant="outlined" size="small" onClick={() => handleAddItem(row)}>Add</Button>,
      width: '120px'
    },
  ];


  const columnsSelected = [
    {
      name: 'Mã hàng',
      selector: row => row.maHang,
      sortable: true,
      width: '100px',
    },
    {
      name: 'Tên hàng Arial',
      selector: row => row.tenHangUnicode,
      width: '200px',
    },
    {
      name: 'SL tem',
      selector: row => row.soluongTem,
      width: '100px'
    },
    {
      name: 'Action',
      selector: row => <Button variant="outlined" size="small" onClick={() => handleDelete(row)}>Delete</Button>,
      width: '120px'
    },
  ];

  const paginationComponentOptions = {
    rowsPerPageText: 'Rows per page',
    rangeSeparatorText: 'of',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'All',
  };

  async function getData(manhom) {
    try {
      const headers = { 'Authorization': 'Bearer ' + user.token };
      await axios.get(DB_URL + 'items/nhomhang/' + manhom, { headers })
        .then((result) => {
          setData(result.data.data);
          setTempData(result.data.data)
          setPending(false);
        });
    } catch (err) {
      console.log(err.message);
    }
  }
  async function getNhomHang() {
    try {
      const headers = { 'Authorization': 'Bearer ' + user.token };
      await axios.get(DB_URL + 'items/nhomhang', { headers })
        .then((result) => {
          const stringNhom = result.data.data.map(item => item.Manhom + ': ' + item.TennhomUnicode);
          setNhomHang(stringNhom);
        });
    } catch (err) {
      console.log(err.message);
    }
  }
  const handleAddItem = (item) => {
    setLabelData(labelData => [...labelData, { maHang: item.Mahang, tenHangUnicode: item.TenhangUnicode, soluongTem: labelNmuber, Giaban: item.Giaban }]);
    setLabelNumber(1);
    setTotalLabel(totalLabel => totalLabel + labelNmuber);

  }
  const handleDropdownList = (event) => {
    setMaNhomHang(event.value.substring(0, 3))
    getData(event.value.substring(0, 3));
  }
  const handleInputChange = (e) => {
    setData(tempData.filter(item => item.Tenhang.includes(e.target.value)))
    if (e.target.value === '') setData(tempData)
    setSearchItem(e.target.value)
  }
  function clearSearchInput() {
    setSearchItem('');
    setData(tempData);
  }
  function changeSoluong(event) {
    if (+event.target.value < 1) {
      setLabelNumber(1);
    } else {
      setLabelNumber(+event.target.value);
    }
  }
  function handleDelete(event) {
    console.log(event)
  }
  function handleClearList() {
    setLabelData([]);
    setDataPrint([]);
    setGroupedArray([]);
    setLabelNumber(1);
  }
  // Print Table
  // ?? check if undefined
  const tableToPrint = groupedArray.map((data) => {
    return (
      <tr key={data.id}>
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
    <div style={{ width: '100%', height: '75%', backgroundColor: "rgba(0, 0, 255, 0.1)" }}>
      <MDBContainer style={{ margin: '1%' }}>
        <MDBRow center style={{ height: "100vh", margin: "1%" }}>
          <MDBCol size='5' style={{ margin: '0%' }}>
            <Dropdown className="tenhang" options={nhomhang} onChange={(e) => handleDropdownList(e)} value={defaultOption} placeholder="Chọn nhóm hàng" />
            <input className="tenhang" type='text' value={searchItem} onChange={handleInputChange} placeholder='Tìm tên hàng'></input>
            <span><button onClick={() => clearSearchInput()}>X</button></span>
            <label style={{ paddingLeft: 20 }}>Số tem
              <Input type='number'
                size="sm"
                style={{ width: '120px', textAlign: 'center' }}
                value={labelNmuber}
                onChange={(e) => changeSoluong(e)} /></label>
            <DataTable
              title="Danh sách mặt hàng"
              className="tenhang"
              columns={columns}
              data={data}
              defaultSortFieldId={1}
              progressPending={pending}
              pagination
              paginationComponentOptions={paginationComponentOptions}
              highlightOnHover
              dense
            />
          </MDBCol>
          <MDBCol size='5' style={{ margin: '0%' }}>
            <Button variant="outlined" size="large" style={{ marginTop: '20px', marginBottom: '30px' }} onClick={() => handleClearList()}>Clear list</Button>
            <div>
              <ReactToPrint
                trigger={() => <div >
                  <Button variant="outlined" size="large" id="checkOut" >In Tem 109</Button>
                </div>}
                content={() => componentRef}
              />
              <div style={{ display: "none" }} >
                <ComponentToPrint ref={el => (componentRef = el)} />
              </div>
            </div>
            <DataTable
              title="Danh sách mặt hàng in tem"
              className="tenhang"
              columns={columnsSelected}
              data={labelData}
              defaultSortFieldId={1}
              progressPending={pending}
              pagination
              paginationComponentOptions={paginationComponentOptions}
              highlightOnHover
              dense
            />
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
};
