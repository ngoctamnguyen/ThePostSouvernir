import DataTable from 'react-data-table-component';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import axios from "axios";
import { Context } from "../context/Context";
const { DB_URL } = require('../config.json');


export default function DailySaleReport() {

    const [data, setData] = useState([]);
    const [checkedNumber, setCheckedNumber] = useState(0)
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

    function changeSL(event) {
           
    }

    // A super simple expandable component.
    const ExpandedComponent = ({ data }) => <div>
        <h5>Số lượng kiểm thực tế: </h5>
        <input type='text' id='checkedNumber' placeholder='Số lượng kiểm...' onChange={(e) => changeSL(e) } ></input>
        <button type="button" onClick={() => handleSLkiem(data)}>Submit</button>
        {/* {JSON.stringify(data, null, 2)} */}

    </div>;

    const columns = [
        {
            name: 'Mã hàng',
            selector: row => row.Mahang,
        },
        {
            name: 'Số lượng bán',
            selector: row => row.SlBan,
        },
    ];

    return (
        <div>
            <button className='button' type="button" onClick={handleClick}>Load mặt hàng</button>
            <DataTable
                columns={columns}
                data={data}
                expandableRows
                expandableRowsComponent={ExpandedComponent}
            />
        </div>

    );
};
