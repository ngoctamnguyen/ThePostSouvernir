const ADODB = require('@el3um4s/node-adodb');
const { DB_URL, DB_KEY } = require('../config.json')
const { json } = require('express');

const connection = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=' + DB_URL + ';Jet OLEDB:Database Password= ' + DB_KEY + ';');

module.exports.addUser = async (req, res, next) => {

   try {
      let val = '("' + req.body.Manv + '","' + req.body.Tennv + '","' + req.body.diachi + '","' + req.body.tel + '", 0, "", "' + req.body.password + '","' +  req.body.roll + '")';
      val = 'INSERT INTO Nhanvien(Manv, Tennv, Diachi, Dienthoai, Luong, Chucvu, pass, quyen) VALUES ' + val
      console.log(val)
      const results = await connection
           .execute(val);
      res.json({ success: true, data: results })

   } catch (e) {
        next(e)
   }
}

module.exports.login = async (req, res, next) => {

   try {
      const results = await connection.query('SELECT Tennv, pass FROM Nhanvien where Tennv = "' + req.body.username + '";');
      if (results.data.pass === req.body.password) {
         console.log(results.data)
         res.json({ success: true, data: results.data })
      } else {
         res.json({ success: false, data: [] })
      }
      
   } catch (e) {
        next(e)
   }
}