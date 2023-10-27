import DataTable from 'react-data-table-component';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import axios from "axios";
import { Context } from "../context/Context";


export default function DailySaleReport() {

    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const { user } = useContext(Context);

    async function getData() {
        try {
            await axios.get('http://localhost:8080/reports/dailysalereports')
                .then((result) => {
                    setData(result.data.data);
                });
        } catch (err) {
            console.log(err.message);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    //if not login => go to welcome page
    useEffect(() => {
        if (!user) { navigate("/") }
    }, [user])

    // A super simple expandable component.
    const ExpandedComponent = ({ data }) => <pre>{JSON.stringify(data, null, 2)}</pre>;

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

    function handleClick() {
       
    }


    return (
        <>
            <button onClick={() => handleClick()}>Click</button>
            <DataTable
                columns={columns}
                data={data}
                expandableRows
                expandableRowsComponent={ExpandedComponent}
            />
        </>

    );
};
