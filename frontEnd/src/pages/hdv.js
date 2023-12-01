import DataTable from 'react-data-table-component';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import './login.css';
import axios from "axios";
import { Context } from "../context/Context";
const { DB_URL } = require('../config.json');


export default function HDV() {

    const [data, setData] = useState([]);
    const [tempData, setTempData] = useState([]);
    const [searchItem, setSearchItem] = useState('')
    const [nhomhang, setNhomHang] = useState([])
    const [options, setOptions] = useState([]);
    const defaultOption = options[0];
    const [pending, setPending] = useState(true);
    const [selectedData, setSelectedData] = useState();
    const navigate = useNavigate();
    const { user, dispatch } = useContext(Context);

    const ExpandedComponent = ({ data }) => <div>
        <h6>Số lượng kiểm thực tế: </h6>
        <input type='text' id='checkedNumber' placeholder='Số lượng kiểm...' ></input>
        <button type="button" onClick={() => handleSLkiem(data)}>Submit</button>
        {/* {JSON.stringify(data, null, 2)} */}
    </div>;


    const columns = [
        {
            name: 'Item code',
            selector: row => row.Mahang,
            sortable: true,
            width: '100px',
            style: {
                background: "cyan",
                FontFace: ".VnTime"
            }
        },
        {
            name: 'Tªn hµng',
            selector: row => row.Tenhang,
            width: '200px',
        },
        {
            name: 'Tæng tån',
            selector: row => row.Tonhientai,
            width: '100px'
        },
        {
            name: 'Tån kho',
            selector: row => row.tonkho,
            width: '100px'
        },
        {
            name: 'Tån b¸n',
            selector: row => row.tonban,
            width: '100px'
        },
        {
            name: 'Ngµy kiÓm',
            selector: row => '',
            width: '100px'
        },
        {
            name: 'Sè l­îng kiÓm',
            selector: row => <button onClick={(e) => handleRowClick(row.Mahang)}>delete</button>,
            width: '100px'
        },
    ];

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
                    const stringNhom = result.data.data.map(item => item.Manhom + ': ' + item.Tennhom);
                    setNhomHang(stringNhom);
                });
        } catch (err) {
            console.log(err.message);
        }
    }

    function handleSLkiem(param) {
        alert(param.Mahang)
        alert(document.getElementById('checkedNumber').value)
        const index = data.findIndex((item) => item.Mahang === param.Mahang)
        //if (index >=0) data[index].Tonhientai = document.getElementById('checkedNumber').value
        if (index >= 0) {
            let temp = data;
            temp[index].tonhientai = document.getElementById('checkedNumber').value;
            setData(temp);
        }
    }

    const handleRowClick = (mahang) => {
        console.log(mahang)
    }

    const paginationComponentOptions = {
        rowsPerPageText: 'Rows per page',
        rangeSeparatorText: 'of',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'All',
    };

    const handleChange = (state) => {
        setSelectedData(state.selectedRows);
    };

    const handleDropdownList = (event) => {
        const manhom = event.value.substring(0, 3);
        getData(manhom);
        console.log(event.value.substring(0, 3));
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
        const timeout = setTimeout(() => {
            getNhomHang();
        }, 1000);
        return () => clearTimeout(timeout);
    });

    return (
        <div style={{ width: '100%', height: '75%', backgroundColor: "rgba(0, 0, 255, 0.1)" }}>
            <MDBContainer>
                <MDBRow center style={{ height: "100vh" }}>
                    <MDBCol size='9'>
                        <Dropdown className="tenhang" options={nhomhang} onChange={(e) => handleDropdownList(e)} value={defaultOption} placeholder="Chän nhãm hµng" />
                        <input className="tenhang" type='text' value={searchItem} onChange={handleInputChange} placeholder='T×m tªn hµng'></input>
                        <span><button onClick={() => clearSearchInput()}>X</button></span>
                        <DataTable
                            title="Danh sách nhóm hàng"
                            className="tenhang"
                            columns={columns}
                            data={data}
                            expandableRows
                            expandableRowsComponent={ExpandedComponent}
                            selectableRows
                            onSelectedRowsChange={handleChange}
                            pagination
                            paginationComponentOptions={paginationComponentOptions}
                            defaultSortFieldId={1}
                            progressPending={pending}
                            dense
                        />
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </div>
    );
};
