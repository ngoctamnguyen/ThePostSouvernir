/* eslint-disable react-hooks/rules-of-hooks */
import DataTable from 'react-data-table-component';
import Button from '@mui/material/Button';
import Dropdown from 'react-dropdown';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/joy/Input';
import DeleteIcon from '@mui/icons-material/Delete';
import ChangeItemNameUnicode from '../components/changeItemNameUnicode';
import 'react-dropdown/style.css';
import { MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import './login.css';
import axios from "axios";
import { Context } from "../context/Context";
const { DB_URL } = require('../config.json');


export default function ChangeItemName() {

  const [data, setData] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [searchItem, setSearchItem] = useState('')
  const [nhomhang, setNhomHang] = useState([])
  const [maNhomHang, setMaNhomHang] = useState('')
  const [options] = useState([]);
  const defaultOption = options[0];
  const [pending, setPending] = useState(true);
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
  useEffect(() => {
    getNhomHang();
  }, []);


  const [matHang, setMathang] = useState({
    maHang: "",
    tenHang: "",
    tenHangUnicode: "",
  });

  const columns = [
    {
      name: 'Mã hàng',
      selector: row => row.Mahang,
      sortable: true,
      width: '100px',
    },
    {
      name: 'Tên hàng .vnTime',
      selector: row => row.Tenhang,
      width: '200px',
    },
    {
      name: 'Tên hàng Arial',
      selector: row => row.TenhangUnicode,
      width: '200px',
    },
    {
      name: 'Action',
      selector: row => <Button variant="outlined" size="small" onClick={() => handleRowClick(row)}>Thay đổi</Button>,
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

  async function handleChangeItemName() {
    updateItemNameUnicode(matHang);
    getData(maNhomHang);
  }

  async function updateItemNameUnicode(item) {
    try {
      if (item.maHang === '') {
        alert('Chưa nhập dữ liệu');
        return 0;
      }
      const results = await axios.put(DB_URL + 'items/itemNameUni/' + item.maHang,
        item,
        {
          headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
            'Authorization': 'Bearer ' + user.token
          }
        })
        .then(cleanForm())
        .catch(e => console.log(e))
      return results.data.data;
    } catch (err) {
      console.log(err.message);
    }
  }

  function cleanForm() {
    setMathang({ ...matHang, maHang: '', tenHang: '', tenHangUnicode: '' });
    getData(maNhomHang);
  }

  const handleRowClick = (item) => {
    setMathang({ ...matHang, maHang: item.Mahang, tenHang: item.Tenhang, tenHangUnicode: item.TenhangUnicode });
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

  return (
    <div style={{ width: '100%', height: '75%', backgroundColor: "rgba(0, 0, 255, 0.1)" }}>
      <MDBContainer style={{ margin: '1%' }}>
        <MDBRow center style={{ height: "100vh", margin: "1%" }}>
          <MDBCol size='7' style={{ margin: '0%' }}>
            <MDBRow>
              <MDBCol size='auto'>
                <Dropdown className="inputHeader" options={nhomhang} onChange={(e) => handleDropdownList(e)} value={defaultOption} placeholder="Chọn nhóm hàng" />
              </MDBCol>
              <MDBCol size='auto'>
                <label>
                  <Input type='text'
                    className="inputHeader"
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
          <MDBCol size='4' style={{ margin: '0%' }}>
            <ChangeItemNameUnicode data={matHang} setMathang={setMathang} handleChangeItemName={handleChangeItemName} />
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
};
