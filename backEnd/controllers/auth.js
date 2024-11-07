//const ADODB = require('@el3um4s/node-adodb');
const ADODB = require('node-adodb');
const { DB_URL, DB_KEY, PRIVATE_KEY } = require('../config.json')
const { json } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const connection = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=' + DB_URL + ';Jet OLEDB:Database Password= ' + DB_KEY + ';');


module.exports.login = async (req, res, next) => {
   try {
      const results = await connection.query('SELECT Tennv, pass, quyen FROM Nhanvien where Tennv = "' + req.body.username + '";');
      if (results.length === 0) {
         res.status(403).json({ success: false, data: "Invalid username" })
      } else {
         if (results[0].pass === req.body.password) {
            const shop = await connection.query('select shop from tshop;');
            const Token = jwt.sign(
               { Tennv: results[0].Tennv, quyen: results[0].quyen, catruc: req.body.catruc, shop: shop[0].shop },
               PRIVATE_KEY,
               { expiresIn: 24 * 60 * 60 }//60 seconds * 60 * 12 = 1/2 day
            )
            res.json({ success: true, data: Token })
         } else {
            res.status(403).json({ success: false, data: "Invalid password" })
         }
      }
   } catch (e) {
      next(e)
   }
}