const ADODB = require('@el3um4s/node-adodb');
const { DB_URL, DB_KEY } = require('../config.json')
const { json } = require('express');

const connection = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=' + DB_URL + ';Jet OLEDB:Database Password= ' + DB_KEY + ';');

module.exports.getNcc = async (req, res, next) => {
   try {

     const results = await connection.query("SELECT * FROM dmncc");
        res.json({ success: true, data: results })

   } catch (e) {
        next(e)
   }
}

module.exports.getDailySaleReport = async (req, res, next) => {
     try {
          const results = await connection.query("SELECT CTBL.Mahang, Sum(CTBL.Soluong) AS SlBan FROM CTBL GROUP BY CTBL.Mahang, Month([Gio]), Year([gio]) HAVING (((Month([Gio]))=3) AND ((Year([gio]))=2023));");
          res.json({ success: true, data: results })
  
     } catch (e) {
          next(e)
     }
  }