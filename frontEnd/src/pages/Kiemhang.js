import DataTable from 'react-data-table-component';
import Dropdown from 'react-dropdown';
import ReactToPrint from "react-to-print";
import DateObject from "react-date-object";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import 'react-dropdown/style.css';
import { MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import './login.css';
import axios from "axios";
import { Context } from "../context/Context";
const { DB_URL } = require('../config.json');


export default function KiemHang() {

  let componentRef = useRef();

  const [data, setData] = useState([]);
  const [dataKiemhang, setDataKiemhang] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [searchItem, setSearchItem] = useState('');
  const [searchItemCode, setSearchItemCode] = useState('');
  const [nhomhang, setNhomHang] = useState([])
  const [maNhom, setMaNhom] = useState('')
  const [options, setOptions] = useState([]);
  const defaultOption = options[0];
  const [pending, setPending] = useState(true);


  const [radioValue, setRadioValue] = useState("tatca");

  const [currentRow, setCurrentRow] = useState(null);
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
      name: 'Mã H',
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
      name: 'SL Tồn',
      selector: row => row.Tonhientai,
      width: '80px',
      textAlign: 'center'
    },
    {
      name: 'Lệch',
      selector: row => row.chenhlech,
      width: '80px'
    },
    {
      name: 'Ngày kiểm',
      sortable: true,
      selector: row => row.ngaykiem,
      // width: '130px'
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

  useEffect(() => {
    getNhomHang();
  }, []);

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
  async function getDataKiemhang(manhom) {
    try {
      const headers = { 'Authorization': 'Bearer ' + user.token };
      await axios.get(DB_URL + 'items/kiemhang/' + manhom, { headers })
        .then((result) => {
          setDataKiemhang(result.data.data);
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
          const stringNhom = result.data.data.map(item => item.Manhom + ': ' + item.Tennhom);
          setNhomHang(stringNhom);
        });
    } catch (err) {
      console.log(err.message);
    }
  }

  async function handleSLkiem(param) {
    //Chuyển dữ liệu dataPost về xử lý tại server.
    //Nếu mã hàng chưa kiểm lần nào thì ngày kiểm chưa có (param.ngaykiem === null)=> thêm mới
    //Nếu ngày kiểm có rồi => update lại số kiểm mới
    try {
      if (document.getElementById('checkedNumber').value === '') {
        alert('Chưa nhập số lượng kiểm');
        return 0;
      }
      const date = new DateObject();
      const cl = document.getElementById('checkedNumber').value - param.Tonhientai;
      const sl = parseInt(document.getElementById('checkedNumber').value);

      const dataPost = {
        Ngay: param.ngaykiem,
        NgayMoi: date.format('MM/DD/YYYY HH:mm:ss'),
        Mahang: param.Mahang,
        Manhom: param.Manhom,
        Tonhientai: param.Tonhientai,
        slKiem: sl,
        Chenhlech: cl,
        ChenhlechCu: param.chenhlech
      }
      const results = await axios.post(DB_URL + 'items/kiemhang/',
        { dataPost },
        {
          headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
            'Authorization': 'Bearer ' + user.token
          }
        })
      loadDSkiemhang();
      document.getElementById('checkedNumber').value = '';
      return results.data.data;
    } catch (err) {
      console.log(err.response)
    }
  }

  const ExpandedComponent = ({ data }) =>
    <div>
      <input type='text' id='checkedNumber' placeholder='SL kiểm...' style={{ width: '100px' }}></input>
      <Button variant="contained" size="small" onClick={() => handleSLkiem(data)}>Submit</Button>
    </div>;


  const handleDropdownList = (event) => {
    const manhom = event.value.substring(0, 3);
    setMaNhom(event.value.substring(0, 3))
    getData(manhom);
    getDataKiemhang(manhom);
  }
  const handleItemname = (e) => {
    if (e.target.value === '') {
      setData(tempData);
    } else {
      setData(tempData.filter(item => item.Tenhang.includes(e.target.value)));
    }
    setSearchItem(e.target.value);
  }

  const handleItemCode = (e) => {
    if (e.target.value === '') {
      setData(tempData);
    } else {
      setData(tempData.filter(item => item.Mahang.includes(e.target.value)));
    }
    setSearchItemCode(e.target.value);
  }

  function clearSearchItem() {
    setSearchItem('');
    setData(tempData);
  }
  function clearSearchItemCode() {
    setSearchItemCode('');
    setData(tempData);
  }
  const loadDSkiemhang = () => {
    if (maNhom !== '') {
      getData(maNhom);
    }
  }

  const handleRadioChange = (event) => {
    setRadioValue(event.target.value);
    if (event.target.value === "lonhon0") {
      setData(tempData.filter(item => +item.Tonhientai > 0));
    } else {
      if (event.target.value === "chuakiem") {
        setData(tempData.filter(item => item.ngaykiem === ''));
      } else {
        if (event.target.value === "dakiem") {
          setData(tempData.filter(item => item.ngaykiem !== ''));
        } else {
          if (event.target.value === "duthieu") {
            setData(tempData.filter(item => +item.chenhlech !== 0));
          } else {
            setData(tempData);
          }
        }
      }
    }
  }

  // Print Table
  const tableToPrint = data.map((data) => {
    return (
      <tr key={data.id}>
        <td className='mahang' >{data.Mahang}</td>
        <td className='tenhang'>{data.Tenhang}</td>
        <td className='tableRightNumber'>{data.Tonhientai}</td>
        <td className='tableRightNumber'>{data.chenhlech}</td>
        <td className='tableRightDate'>{data.ngaykiem}</td>
      </tr>
    );
  });
  class ComponentToPrint extends React.PureComponent {
    render() {
      return (
        <div>
          <div>
            <h3>{user.shop}</h3>
            <h5>PHIẾU KIỂM HÀNG</h5>
            <label>In ngày: {Date()}</label> <br /> <br />
          </div>
          <table>
            <thead>
              <th className='tenhangHeader' >Mã hàng</th>
              <th className='tenhangHeader' >Tên hàng</th>
              <th className='tableRightNumberHeader'>SL tồn</th>
              <th className='tableRightNumberHeader'>SL lệch</th>
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

  return (
    <div style={{ width: '100%', height: '75%', backgroundColor: "rgba(0, 0, 255, 0.1)" }}>
      <MDBContainer>
        <MDBRow center style={{ height: "100vh", margin: "0", padding: "0" }}>
          <MDBCol size='20'>
            <label style={{ padding: '5px', color: 'red', textAlign: 'center' }}><h3>KIỂM ĐẾM SỐ LƯỢNG HÀNG TỒN</h3></label>
            <MDBRow>
              <MDBCol size='2'>
                <Dropdown className="tenhang" options={nhomhang} onChange={(e) => handleDropdownList(e)} value={defaultOption} placeholder="Chän nhãm hµng" />
              </MDBCol>
            </MDBRow>
            <input className="tenhang" type='text' value={searchItemCode} onChange={handleItemCode} placeholder='T×m m· hµng'></input>
            <span style={{ paddingLeft: '1px', paddingRight: '20px' }}>
              <IconButton aria-label="delete" onClick={() => clearSearchItemCode()}>
                <DeleteIcon />
              </IconButton>
            </span>
            <input className="tenhang" type='text' value={searchItem} onChange={handleItemname} placeholder='T×m tªn hµng'></input>
            <span style={{ paddingRight: '15px' }}>
              <IconButton aria-label="delete" onClick={() => clearSearchItem()}>
                <DeleteIcon />
              </IconButton>
            </span>

            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={radioValue}
              onChange={handleRadioChange}
            >
              <FormControlLabel
                value="tatca"
                // disabled
                control={<Radio />}
                label="Hiển thị tất cả"
              />
              <FormControlLabel value="lonhon0" control={<Radio />} label="Hiển thị số tồn lớn hơn 0" />
              <FormControlLabel value="chuakiem" control={<Radio />} label="Hiển thị chưa kiểm" />
              <FormControlLabel value="dakiem" control={<Radio />} label="Hiển thị đã kiểm" />
              <FormControlLabel value="duthieu" control={<Radio />} label="Hiển thị dư thiếu" />

            </RadioGroup>
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
            {/* Table */}
            <DataTable
              // title="Danh sách nhóm hàng"
              className="tenhang"
              columns={columns}
              data={data}
              expandableRows={true}
              expandableRowsComponent={ExpandedComponent}
              expandableRowExpanded={(row) => (row === currentRow)}
              expandOnRowClicked
              onRowClicked={(row) => setCurrentRow(row)}
              onRowExpandToggled={(bool, row) => setCurrentRow(row)}
              pagination
              paginationComponentOptions={paginationComponentOptions}
              defaultSortFieldId={1}
              progressPending={pending}
              dense
            />
            <h6>Chỉ hiển thị số liệu kiểm trong tháng này</h6>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
};
