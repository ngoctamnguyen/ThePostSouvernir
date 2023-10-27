const ADODB = require('@el3um4s/node-adodb');
const { DB_URL, DB_KEY } = require('../config.json')
const { json } = require('express');

const connection = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=' + DB_URL + ';Jet OLEDB:Database Password= ' + DB_KEY + ';');

module.exports.getTygia = async (req, res, next) => {
     try {
          const results = await connection.query('SELECT tygia FROM Tygia ');
          res.json({ success: true, data: results[0] })
     } catch (e) {
          next(e)
     }
  }