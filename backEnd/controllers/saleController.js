//const ADODB = require('@el3um4s/node-adodb');
const ADODB = require('node-adodb');
const { DB_URL, DB_KEY } = require('../config.json')
const { json } = require('express');


const connection = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=' + DB_URL + ';Jet OLEDB:Database Password= ' + DB_KEY + ';');

module.exports.saveSale = async (req, res, next) => {
    try {
        let stringSQL = "INSERT INTO CTBL (Sopbl, Mahang, Catruc, Nhanvien, Gio, Soluong, Giavon, price, Dongia, Thanhtien) VALUES ";
        stringSQL += "('" + req.body.data.Sopbl + "', ";
        stringSQL += "'" + req.body.data.Mahang + "', ";
        stringSQL += "'" + req.body.data.Catruc + "', ";
        stringSQL += "'" + req.body.data.Nhanvien + "', ";
        stringSQL += "'" + req.body.data.Gio + "', ";
        stringSQL += "" + req.body.data.Soluong + ", ";
        stringSQL += "'" + req.body.data.Giavon + "', ";
        stringSQL += "'" + req.body.data.price + "', ";
        stringSQL += "'" + req.body.data.Dongia + "', ";
        stringSQL += "'" + req.body.data.Thanhtien + "')";

        const results = await connection.execute(stringSQL);
        res.json({ success: true, data: results });

    } catch (e) {
        next(e)
        console.log(e)
    }
}