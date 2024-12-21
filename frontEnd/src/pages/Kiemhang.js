import DataTable from 'react-data-table-component';
import Dropdown from 'react-dropdown';
import ReactToPrint from "react-to-print";
import DateObject from "react-date-object";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Input from '@mui/joy/Input';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
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
  const [tempData, setTempData] = useState([]);
  const [searchItem, setSearchItem] = useState('');
  const [searchItemId, setSearchItemId] = useState('');
  const [nhomhang, setNhomHang] = useState([]);
  const [displayTenhang, setDisplayTenHang] = useState(true);
  const [maNhom, setMaNhom] = useState('')
  const [options] = useState([]);
  const defaultOption = options[0];
  const [pending, setPending] = useState(true);
  const [radioValue, setRadioValue] = useState("tatca");
  const [checkNumer, setCheckNumber] = useState(0);
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
  //Table design
  const columns = [
    {
      name: 'Mã H',
      selector: row => row.Mahang,
      sortable: true,
      width: '60px',
      style: {
        background: "lightblue",
        paddingRight: '0px',
        paddingLeft: '0px',
        marginRight: '0px'
      }
    },
    {
      name: 'Tên hàng',
      selector: row => row.TenhangUnicode,
      width: displayTenhang ? '140px' : '0px',
      style: {
        paddingRight: '0px',
        paddingLeft: '0px',
        marginRight: '0px'
      }
    },
    {
      name: 'SL kiểm',
      width: '100px',
      style: {
        paddingRight: '0px',
        paddingLeft: '0px',
        marginRight: '0px'
      },
      selector: row => <div>
        <input
          style={{ width: '40px', height: '30px', paddingRight: '2px' }}
          type='number'
          id='checkedNumberInput'
          placeholder='SL kiểm...'
          onBlur={handleBlur}
          // onKeyDown={(e) => {
          //   if (e.key === "Enter") {
          //     handleSLkiem(row);
          //   }
          // }}
          onChange={(e) => handleInput(e)}></input>
        <IconButton aria-label="delete" onClick={() => handleSLkiem(row)}>
          <CheckIcon />
        </IconButton>
      </div>
    },
    {
      name: 'Tồn',
      selector: row => row.Tonhientai,
      width: '40px',
      style: {
        background: "lightblue",
        paddingRight: '0px',
        paddingLeft: '0px',
        marginRight: '0px'
      },
      textAlign: 'center'
    },
    {
      name: 'Lệch',
      selector: row => row.chenhlech,
      width: '60px'
    },

    {
      name: 'Ngày kiểm',
      sortable: true,
      selector: row => row.ngaykiem,
      // width: '130px'
    }
  ];

  const handleBlur = (event) => {
    event.target.value = '';
  };

  const handleInput = (event) => {
    setCheckNumber(event.target.value);
  }

  const paginationComponentOptions = {
    rowsPerPageText: 'Rows per page',
    rangeSeparatorText: 'of',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'All',
  };

  useEffect(() => {
    getNhomHang();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getData(manhom) {
    try {
      const headers = { 'Authorization': 'Bearer ' + user.token };
      await axios.get(DB_URL + 'items/nhomhang/' + manhom, { headers })
        .then((result) => {
          setData(result.data.data);
          if (radioValue === "tatca") {
            setTempData(result.data.data);
          } else {
            setTempData(result.data.data);
            handleFilterGetData(result.data.data, radioValue);
          }
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
  async function handleSLkiem(param) {
    //Chuyển dữ liệu dataPost về xử lý tại server.
    //Nếu mã hàng chưa kiểm lần nào thì ngày kiểm chưa có (param.ngaykiem === null)=> thêm mới
    //Nếu ngày kiểm có rồi => update lại số kiểm mới
    try {
      if (checkNumer < 0) {
        alert('KHÔNG nhập số lượng kiểm < 0');
        return 0;
      }
      const date = new DateObject();
      const cl = checkNumer - param.Tonhientai;
      const sl = parseInt(checkNumer);
      const dataPost = {
        Ngay: param.ngaykiem,
        NgayMoi: date.format('MM/DD/YYYY HH:mm:ss'),
        Mahang: param.Mahang,
        Manhom: param.Manhom,
        Tonhientai: param.Tonhientai,
        slKiem: sl,
        Chenhlech: cl,
        ChenhlechCu: param.chenhlech,
        firstCheck: param.ngaykiem === '' ? true : false
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
      getData(maNhom);
      setCheckNumber(0);
      return results.data.data;
    } catch (err) {
      console.log(err.response)
    }
  }

  const handleDropdownList = (event) => {
    const manhom = event.value.substring(0, 3);
    setMaNhom(event.value.substring(0, 3))
    getData(manhom);
  }
  const handleItemname = (e) => {
    if (e.target.value === '') {
      setData(tempData);
    } else {
      setData(tempData.filter(item => item.TenhangUnicode.includes(e.target.value)));
    }
    setSearchItem(e.target.value);
  }

  const handleItemId = (e) => {
    if (e.target.value === '') {
      setData(tempData);
    } else {
      setData(tempData.filter(item => item.Mahang.includes(e.target.value)));
    }
    setSearchItemId(e.target.value);
  }

  function clearSearchItem() {
    setSearchItem('');
    setData(tempData);
  }

  function clearSearchItemId() {
    setSearchItemId('');
    setData(tempData);
  }

  const handleFilterGetData = (showlist, event) => {
    if (event === "lonhon0") {
      setData(showlist.filter(item => +item.Tonhientai > 0));
    } else {
      if (event === "chuakiem") {
        setData(showlist.filter(item => item.ngaykiem === '' && +item.Tonhientai > 0));
      } else {
        if (event === "dakiem") {
          setData(showlist.filter(item => item.ngaykiem !== ''));
        } else {
          if (event === "duthieu") {
            setData(showlist.filter(item => +item.chenhlech !== 0));
          } else {
            if (event === "homnay") {
              const today = new Date();
              setData(showlist.filter(item => {
                if (item.ngaykiem !== '') {
                  const CurrentDay = new Date(Date.parse(item.ngaykiem)).getDate();
                  if (CurrentDay === today.getDate()) {
                    return 1
                  } else {
                    return 0;
                  }
                }
                return 0;
              }));
            } else {
              setData(showlist);
            }
          }
        }
      }
    }
  }

  const handleRadioChange = (event) => {
    setRadioValue(event.target.value);
    handleFilterGetData(tempData, event.target.value);
  }
  const handleDisplayTenHang = () => {
    setDisplayTenHang(!displayTenhang)
  }

  // Print Table
  const tableToPrint = data.map((data, i) => {
    return (
      <tr key={i}>
        <td className='mahang' >{data.Mahang}</td>
        <td className='tenhang'>{data.TenhangUnicode}</td>
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
            <thead id="tableHaed">
              <tr>
                <th className='tenhangHeader' >ID</th>
                <th className='tenhangHeader' >Item</th>
                <th className='tableRightNumberHeader'>Tồn</th>
                <th className='tableRightNumberHeader'>SL lệch</th>
                <th className='tableRightDateHeader'>Ngày kiểm</th>
              </tr>
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
    <div style={{ width: '100%', height: '75%', fontWeight: 'normal', fontSize: '8', backgroundColor: "rgba(0, 0, 255, 0.1)"}}>
      <MDBContainer>
        <MDBRow center style={{ height: "100vh", margin: "0", padding: "0" }}>
          <MDBCol size='auto'>
            <label style={{ padding: '5px', color: 'red', textAlign: 'center' }}><h5>KIỂM ĐẾM SỐ LƯỢNG HÀNG TỒN</h5></label>
            <MDBRow>
              <MDBCol size='auto'>
                <Dropdown className="inputHeader"
                  size='sm'
                  options={nhomhang}
                  onChange={(e) => handleDropdownList(e)}
                  value={defaultOption}
                  placeholder="Chọn nhóm hàng" />
              </MDBCol>
              <MDBCol size='auto'>
                <label>
                  <Input type='text'
                    className="inputBox"
                    size="sm"
                    placeholder="Tìm mã hàng"
                    value={searchItemId}
                    onChange={handleItemId} />

                </label>
                <IconButton aria-label="delete" onClick={() => clearSearchItemId()}>
                  <DeleteIcon />
                </IconButton>
              </MDBCol>
              <MDBCol size='auto'>
                <label>
                  <Input type='text'
                    className="inputBox"
                    size="sm"
                    placeholder="Tìm tên hàng"
                    value={searchItem}
                    onChange={handleItemname} />

                </label>
                <IconButton aria-label="delete" onClick={() => clearSearchItem()}>
                  <DeleteIcon />
                </IconButton>
              </MDBCol>
              <MDBCol>
                {/* Print table */}
                <span>
                  <ReactToPrint
                    trigger={() => <div >
                      <Button variant="contained" size="medium" id="checkOut" >In danh sách</Button>
                    </div>}
                    content={() => componentRef}
                  />
                  <div style={{ display: "none" }} >
                    <ComponentToPrint ref={el => (componentRef = el)} />
                  </div>
                </span>
              </MDBCol>
            </MDBRow>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              style={{fontWeight:'normal', fontSize: '6'}}
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
              <FormControlLabel value="chuakiem" control={<Radio />} label="Hiển thị chưa kiểm (Tồn >0)" />
              <FormControlLabel value="dakiem" control={<Radio />} label="Hiển thị đã kiểm" />
              <FormControlLabel value="duthieu" control={<Radio />} label="Hiển thị dư thiếu" />
              <FormControlLabel value="homnay" control={<Radio />} label="Hiển thị Hôm nay" />
            </RadioGroup>
            {/* Table */}
            <label>Ẩn/Hiện cột tên hàng
              <Switch
                checked={displayTenhang}
                onChange={handleDisplayTenHang}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            </label>
            <DataTable
              // title="Danh sách nhóm hàng"
              className="dataTable"
              columns={columns}
              data={data}
              pagination
              paginationComponentOptions={paginationComponentOptions}
              defaultSortFieldId={1}
              progressPending={pending}
              highlightOnHover
              dense
            />
            <h6>Chỉ hiển thị số liệu kiểm trong tháng này</h6>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
};
