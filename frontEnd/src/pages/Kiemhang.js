import DataTable from 'react-data-table-component';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import './login.css';
import axios from "axios";
import { Context } from "../context/Context";
const { DB_URL } = require('../config.json');


export default function KiemHang() {

    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const { user } = useContext(Context);

    useEffect(() => {
        if (!user) { navigate("/") }
    }, [user])

    async function getData() {
        try {
            await axios.get(DB_URL + 'reports')
                .then((result) => {
                    setData(result.data.data);
                    console.log(result.data.data)
                });
        } catch (err) {
            console.log(err.message);
        }
    }

    function handleClick() {
        getData();
    }
    function handleSLkiem(param) {
        alert(param.Mahang)
        alert(document.getElementById('checkedNumber').value)
    }

    // A super simple expandable component.
    const ExpandedComponent = ({ data }) => <div>
        <h5>Số lượng kiểm thực tế: </h5>
        <input type='text' id='checkedNumber' placeholder='Số lượng kiểm...' ></input>
        <button type="button" onClick={() => handleSLkiem(data)}>Submit</button>
        {/* {JSON.stringify(data, null, 2)} */}

    </div>;

const myNewTheme= {
    rows: {
      fontSize: '25px',
      FontFace: '.VnTime'
    }
  }

    const columns = [
        {
            name: 'Mã hàng',
            selector: row => row.Mahang,
        },
        {
            name: 'Tên hàng',
            selector: row => row.Tenhang,
            FontFace: '.VnTime'
        },
        {
            name: 'Tổng tồn',
            selector: row => row.Tonhientai,
        },
        {
            name: 'Tồn kho',
            selector: row => row.tonkho,
        },
        {
            name: 'Tồn bán',
            selector: row => row.tonban,
        },
        {
            name: 'Ngày kiểm',
            selector: row => '',
        },
        {
            name: 'Số lượng kiểm',
            selector: row => '',
        },
    ];

    return (
        <div>
            <button className='button' type="button" onClick={handleClick} >Load item</button>
            <DataTable
                className="tenhang"
                title="Danh sách nhóm hàng"
                columns={columns}
                data={data}
                expandableRows
                expandableRowsComponent={ExpandedComponent}
                customTheme={myNewTheme}
                selectableRows
            />
        </div>

    );
};
