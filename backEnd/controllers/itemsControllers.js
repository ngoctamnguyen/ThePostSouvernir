const ADODB = require('@el3um4s/node-adodb');
const { DB_URL, DB_KEY } = require('../config.json')
const { json } = require('express');

const connection = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=' + DB_URL + ';Jet OLEDB:Database Password= ' + DB_KEY + ';');

module.exports.getItems = async (req, res, next) => {
     try {
          const results = await connection.query("SELECT Mahang, Tenhang, mancc, dvt, Manhom, Giavon, price, Giaban, Giabansi, Tonhientai, tonkho, tonban, kygoi FROM Mathang");
          res.json({ success: true, data: results })
     } catch (e) {
          next(e)
     }
}
module.exports.getItem = async (req, res, next) => {
     try {
          const results = await connection.query('SELECT Mahang, Tenhang, mancc, dvt, Manhom, Giavon, price, Giaban, Giabansi, Tonhientai, tonkho, tonban, kygoi FROM Mathang where Mahang = "' + req.params.mahang + '"');
          res.json({ success: true, data: results })
     } catch (e) {
          next(e)
     }
}

module.exports.getTygia = async (req, res, next) => {
     try {
          const results = await connection.query('SELECT tygia FROM Tygia ');
          res.json({ success: true, data: results })
     } catch (e) {
          next(e)
     }
}

module.exports.updateMathang = async (req, res, next) => {
     try {
          const mahang = req.body.mahang;
          const soluong = req.body.soluong;
          let stringSQL = "UPDATE mathang SET Tonhientai = Tonhientai - " + soluong;
          stringSQL += ", tonban = tonban - " + soluong;
          stringSQL += " WHERE mahang = '" + mahang + "';";
          console.log(stringSQL)
          const results = await connection.execute(stringSQL);
          res.json({ success: true, data: results })
     } catch (e) {
          next(e)
     }
}

