import DataTable from 'react-data-table-component';
import Dropdown from 'react-dropdown';
import DateObject from "react-date-object";
import 'react-dropdown/style.css';
import { MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useContext } from 'react';
import './login.css';
import axios from "axios";
import { Context } from "../context/Context";
const { DB_URL } = require('../config.json');


export default function KiemHang() {

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
    const [selectedData, setSelectedData] = useState();
    const [isChecked, setIsChecked] = useState(false);
    const [isDakiem, setIsDakiem] = useState(false);
    const [isChuakiem, setIsChuakiem] = useState(false);
    const [currentRow, setCurrentRow] = useState(null);
    const navigate = useNavigate();
    const { user } = useContext(Context);

    const columns = [
        {
            name: 'Mã hàng',
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
            name: 'Tổng tồn',
            selector: row => row.Tonhientai,
            width: '80px',
            textAlign: 'center'
        },
        // {
        //     name: 'Tồn kho',
        //     selector: row => row.tonkho,
        //     width: '40px'
        // },
        // {
        //     name: 'Tồn bán',
        //     selector: row => row.tonban,
        //     width: '40px'
        // },
        {
            name: 'c.lệch',
            selector: row => row.chenhlech,
            width: '80px'
        },
        {
            name: 'Ngày kiểm',
            selector: row => row.ngaykiem,
            width: '130px'
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
            <button type="button" onClick={() => handleSLkiem(data)}>Ok</button>
        </div>;

    const handleRowClick = (mahang) => {
        console.log(mahang)
    }

    const handleChange = (state) => {
        setSelectedData(state.selectedRows);
    };

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
    const handleCheckBoxTongton = () => {
        setIsChecked(!isChecked);
    };
    const handleCheckBoxDakiem = () => {
        setIsDakiem(!isDakiem)
    }
    const handleCheckBoxChuakiem = () => {
        setIsChuakiem(!isChuakiem)
    }
    const loadDSkiemhang = () => {
        if (maNhom != '') {
            getData(maNhom);
        }
    }
    useEffect(() => {
        if (isChecked) {
            setData(tempData.filter(item => +item.Tonhientai > 0));
        } else {
            setData(tempData);
        }
    }, [isChecked])
    useEffect(() => {
        if (isDakiem) {
            setData(tempData.filter(item => +item.chenhlech != 0));
        } else {
            setData(tempData);
        }
    }, [isDakiem])
    useEffect(() => {
        console.log(tempData)
        if (isChuakiem) {
            setData(tempData.filter(item => item.ngaykiem === ''));
        } else {
            setData(tempData);
        }
    }, [isChuakiem])
    return (
        <div style={{ width: '100%', height: '75%', backgroundColor: "rgba(0, 0, 255, 0.1)" }}>
            <MDBContainer>
                <MDBRow center style={{ height: "100vh" }}>
                    <MDBCol size='20'>
                        <label style={{ padding: '5px', color: 'red', textAlign: 'center' }}><h3>KIỂM HÀNG</h3></label>
                        <Dropdown className="tenhang" options={nhomhang} onChange={(e) => handleDropdownList(e)} value={defaultOption} placeholder="Chọn nhóm hàng" />
                        <span style={{ paddingRight: '15px' }}><button id='loadDSKH' onClick={() => loadDSkiemhang()}>Tải DS kiểm hàng</button></span>
                        <input className="tenhang" type='text' value={searchItemCode} onChange={handleItemCode} placeholder='Tìm mã hàng'></input>
                        <span style={{ paddingRight: '15px' }}><button onClick={() => clearSearchItemCode()}>X</button></span>
                        <input className="tenhang" type='text' value={searchItem} onChange={handleItemname} placeholder='Tìm tên hàng'></input>
                        <span style={{ paddingRight: '15px' }}><button onClick={() => clearSearchItem()}>X</button></span>
                        <input type="checkbox" id="topping" name="topping" onChange={handleCheckBoxTongton} style={{ paddingLeft: '10px' }} />
                        <span style={{ paddingRight: '15px' }}>Hiển thị số tồn lớn hơn 0</span>
                        <input type="checkbox" id="topping1" name="topping" onChange={handleCheckBoxChuakiem} style={{ paddingLeft: '10px' }} />
                        <span style={{ paddingRight: '15px' }}>Hiển thị chưa kiểm</span>
                        <input type="checkbox" id="topping1" name="topping" onChange={handleCheckBoxDakiem} style={{ paddingLeft: '10px' }} />
                        <span style={{ paddingRight: '15px' }}>Hiển thị dư thiếu</span>
                        <DataTable
                            title="Danh sách nhóm hàng"
                            // className="tenhang"
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
