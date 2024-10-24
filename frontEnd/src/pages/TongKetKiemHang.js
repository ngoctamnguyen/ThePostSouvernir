import DataTable from 'react-data-table-component';
import 'react-dropdown/style.css';
import { MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import './login.css';
import axios from "axios";
import { Context } from "../context/Context";
const { DB_URL } = require('../config.json');


export default function TongKetKiemHang() {

    const [data, setData] = useState([]);
    const [month, setMonth] = useState(0)
    const [tempData, setTempData] = useState([]);
    const [pending, setPending] = useState(true);
    const [isCheckedKG, setIsCheckedKG] = useState(false);
    const [isCheckedNoKG, setIsCheckedNoKG] = useState(false);
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
            name: 'Chênh lệch',
            selector: row => row.chenhLech,
            width: '80px',
            textAlign: 'center'
        },
        {
            name: 'KG',
            selector: row => row.kygoi,
            width: '80px'
        },
        {
            name: 'Ghi chú',
            selector: row => row.ghichu,
            width: '900px'
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

    async function loadDSkiemhang() {
        try {
            if (month < 1 || month > 12) {
                alert("Nhập sai tháng");
                return 0;
            }
            const headers = { 'Authorization': 'Bearer ' + user.token };
            await axios.get(DB_URL + 'items/kiemhang/thang/' + month, { headers })
                .then((result) => {
                    setData(result.data.data);
                    setTempData(result.data.data);
                });
        } catch (err) {
            console.log(err.message);
        }
    }

    const changeMonth = (event) => {
        setMonth(event.target.value);
    }
    const handleCheckBoxKygui = () => {
        setIsCheckedKG(!isCheckedKG)
    }
    const handleCheckBoxKhongKygui = () => {
        setIsCheckedNoKG(!isCheckedNoKG)
    }

    useEffect(() => {
        if (isCheckedKG) {
            setData(tempData.filter(item => item.kygoi === 'y'));
        } else {
            setData(tempData);
        }
    }, [isCheckedKG])

    useEffect(() => {
        if (isCheckedNoKG) {
            setData(tempData.filter(item => item.kygoi !== 'y'));
        } else {
            setData(tempData);
        }
    }, [isCheckedNoKG])

    return (
        <div style={{ width: '100%', height: '75%', backgroundColor: "rgba(0, 0, 255, 0.1)" }}>
            <MDBContainer>
                <MDBRow center style={{ height: "100vh" }}>
                    <MDBCol size='20'>
                        <label style={{ padding: '5px', color: 'red', textAlign: 'center' }}><h3>TỔNG HỢP KIỂM HÀNG</h3></label>
                        <MDBRow>
                            <MDBCol size='2'>
                                <span style={{ paddingRight: '8px' }}>Chọn tháng</span>
                                <input type="text" id='thang' style={{ textAlign: 'center', fontWeight: 'bold', width: '70px' }} onChange={(e) => changeMonth(e)} />
                            </MDBCol>
                            <MDBCol size='5'>
                                <span style={{ paddingRight: '15px' }}><button id='loadDSKH' onClick={() => loadDSkiemhang()}>XEM DANH SÁCH</button></span>
                            </MDBCol>
                        </MDBRow>
                        <input type="checkbox" id="topping" name="topping" onChange={handleCheckBoxKygui} style={{ paddingLeft: '10px' }} />
                        <span style={{ paddingRight: '15px' }}>Hiển thị ký gửi</span>
                        <input type="checkbox" id="topping1" name="topping" onChange={handleCheckBoxKhongKygui} style={{ paddingLeft: '10px' }} />
                        <span style={{ paddingRight: '15px' }}>Hiển thị KHÔNG ký gửi</span>
                        <DataTable
                            title="Danh sách hàng"
                            // className="tenhang"
                            columns={columns}
                            data={data}
                            pagination
                            paginationComponentOptions={paginationComponentOptions}
                            dense
                        />
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </div>
    );
};
