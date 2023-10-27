const ADODB = require('@el3um4s/node-adodb');
const { DB_URL, DB_KEY } = require('../config.json')
const { json } = require('express');

const connection = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=' + DB_URL + ';Jet OLEDB:Database Password= ' + DB_KEY + ';');

module.exports.getSup = async (req, res, next) => {
   try {
        const results = await connection.query("SELECT * FROM dmncc");
        res.json({ success: true, data: results })

   } catch (e) {
        next(e)
   }
}

module.exports.addSup = async (req, res, next) => {
     try {
          const val = '("' + req.body.mancc + '","' + req.body.tenncc + '","' + req.body.diachi + '","' + req.body.dienthoai + '","' + req.body.ManccTP + '")';
          const results = await connection
               .execute('INSERT INTO dmncc(mancc, tenncc, diachi, dienthoai, ManccTP) VALUES ' + val);
          res.json({ success: true, data: results })
  
     } catch (e) {
          next(e)
     }
  }

  module.exports.editSup = async (req, res, next) => {
     try {
          let sqlStr = 'UPDATE dmncc SET dmncc.tenncc = "' + req.body.tenncc + '", dmncc.diachi = "' + req.body.diachi + '", dmncc.dienthoai = "' + req.body.dienthoai + '", dmncc.ManccTP = "' + req.body.ManccTP + '"';
          sqlStr += ' WHERE dmncc.mancc="' + req.params.mancc + '"';
          const results = await connection
               .execute(sqlStr);
          res.json({ success: true, data: results })
  
     } catch (e) {
          next(e)
     }
  }

  module.exports.deleteSup = async (req, res, next) => {
     try {
          let sqlStr = 'DELETE dmncc.mancc FROM dmncc WHERE dmncc.mancc="' + req.params.mancc + '"';
          const results = await connection
               .execute(sqlStr);
          res.json({ success: true, data: results })
  
     } catch (e) {
          next(e)
     }
  }