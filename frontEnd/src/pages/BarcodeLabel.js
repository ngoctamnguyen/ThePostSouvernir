/* eslint-disable react-hooks/rules-of-hooks */
import DataTable from 'react-data-table-component';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/joy/Input';
import DeleteIcon from '@mui/icons-material/Delete';
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
  const [labelNmuber, setLabelNumber] = useState(1);
  const [totalLabel, setTotalLabel] = useState(0);
  const [options] = useState([]);
  const defaultOption = options[0];
  const [pending, setPending] = useState(true);
  const navigate = useNavigate();
  const { user, dispatch } = useContext(Context);
  let componentRef = useRef();

  //check token for valid user and time
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

  //Get data for nhom hang combo box
  useEffect(() => {
    const timeout = setTimeout(() => {
      getNhomHang();
    }, 1000);
    return () => clearTimeout(timeout);
  }, []); // Empty dependency array ensures the effect runs only once on mount

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

  //Actions when add items to print barcode list
  useEffect(() => {
    setDataPrint([]);
    for (let i = 0; i < labelData.length; i++) {
      for (let j = 0; j < labelData[i].soluongTem; j++) {
        setDataPrint(dataPrint => [...dataPrint, { maHang: labelData[i].maHang, tenHangUnicode: labelData[i].tenHangUnicode, Giaban: labelData[i].Giaban }])
      }
    }
  }, [labelData]); //add items to print code list

  useEffect(() => {
    setGroupedArray([]);
    for (let i = 0; i < dataPrint.length; i = i + 5) {
      setGroupedArray(groupedArray => [...groupedArray, dataPrint.slice(i, i + 5)])
    }
  }, [dataPrint]); //grouped to 5 labels on each column

  //data table for group of list items
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

  //data table for items selected for print barcode
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
  const handleAddItem = (item) => {
    if (totalLabel + labelNmuber < 56) {
      setLabelData(labelData => [...labelData, { maHang: item.Mahang, tenHangUnicode: item.TenhangUnicode, soluongTem: labelNmuber, Giaban: item.Giaban }]);
      setLabelNumber(1);
      setTotalLabel(totalLabel => totalLabel + labelNmuber);
    } else {
      alert('Số lượng tem in không lớn hơn 55');
      return 0;
    }
  }
  //Action when chose nhom hang (item list)
  const handleDropdownList = (event) => {
    getData(event.value.substring(0, 3));
  }
  //Action when input on searching box
  const handleInputChange = (e) => {
    setData(tempData.filter(item => item.TenhangUnicode.includes(e.target.value)))
    if (e.target.value === '') setData(tempData)
    setSearchItem(e.target.value)
  }
  //Action clear selected items list
  function clearSearchInput() {
    setSearchItem('');
    setData(tempData);
  }
  //Action when change number of item when click add button
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
  //Ations when click on button clear list to clear selected item list
  function handleClearList() {
    setLabelData([]);
    setDataPrint([]);
    setGroupedArray([]);
    setLabelNumber(1);
  }
  //Select all when got focus
  function selectText() {
    const input = document.getElementById("labelNumber");
    input.focus();
    input.select();
  }

  // Print Table
  // ?? check if undefined
  const tableToPrint = groupedArray.map((data, i) => {
    return (
      <tr key={i}>
        <td className='barCode'><PrintBarcode value={data[0]} /></td>
        <td className='barCode'><PrintBarcode value={data[1]} /></td>
        <td className='barCode'><PrintBarcode value={data[2]} /></td>
        <td className='barCode'><PrintBarcode value={data[3]} /></td>
        <td className='barCode'><PrintBarcode value={data[4]} /></td>
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
            <MDBRow>
              <MDBCol size='auto'>
                <Dropdown className="inputHeaderSmall" options={nhomhang} onChange={(e) => handleDropdownList(e)} value={defaultOption} placeholder="Chọn nhóm hàng" />
              </MDBCol>
              <MDBCol size='auto'>
                <label>
                  <Input type='text'
                    className="inputHeaderSmall"
                    size="lg"
                    placeholder="Tìm tên hàng"
                    value={searchItem}
                    onChange={handleInputChange} />
                </label>
                <IconButton aria-label="delete" onClick={() => clearSearchInput()}>
                  <DeleteIcon />
                </IconButton>
              </MDBCol>
            </MDBRow>
            <label>Số tem
              <Input
                id='labelNumber'
                type='number'
                className="inputHeaderSmall"
                value={labelNmuber}
                onClick={() => selectText()}
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
            <MDBRow>
              <MDBCol>
                <Button variant="contained" size="large" onClick={() => handleClearList()}>Clear list</Button>
              </MDBCol>
              <MDBCol>
                <div>
                  <ReactToPrint
                    trigger={() => <div >
                      <Button variant="contained" size="large" id="checkOut" >In Tem 109</Button>
                    </div>}
                    content={() => componentRef}
                  />
                  <div style={{ display: "none" }} >
                    <ComponentToPrint ref={el => (componentRef = el)} />
                  </div>
                </div>
              </MDBCol>
            </MDBRow>
            <DataTable
              title="Danh sách mặt hàng in tem"
              className='listItems'
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
