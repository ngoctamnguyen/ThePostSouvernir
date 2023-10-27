const ADODB = require('@el3um4s/node-adodb');
const { DB_URL, DB_KEY } = require('../config.json')
const { json } = require('express');

const connection = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=' + DB_URL + ';Jet OLEDB:Database Password= ' + DB_KEY + ';');

module.exports.getBillNumber = async (req, res, next) => {
    try {
        const results = await connection.query('SELECT Max(Sopbl) AS billNumber FROM Phieubanle;');
        const newBillNumber = (+results[0].billNumber + 1).toString().padStart(6, '0');
        addNewBillNumber(newBillNumber);
        res.json({ success: true, data: newBillNumber })
    } catch (e) {
        next(e)
    }
}

addNewBillNumber = async (num)=> {
    try {
        const str = "INSERT INTO Phieubanle (Sopbl, Manv) VALUES ('" + num + "', '');" ;
        const results = await connection.query(str);
        return results;
    } catch (err) {
        console.log(err)
    }
} 

