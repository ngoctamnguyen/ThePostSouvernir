
const ADODB = require('@el3um4s/node-adodb');
const { DB_URL, DB_KEY } = require('../config.json');
const { json } = require('express');

const connection = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=' + DB_URL + ';Jet OLEDB:Database Password= ' + DB_KEY + ';');

module.exports.getItems = async (req, res, next) => {
     try {
          const results = await connection.query("SELECT Mahang, TenhangUnicode, mancc, dvt, Manhom, Giavon, price, Giaban, Giabansi, Tonhientai, tonkho, tonban, kygoi FROM Mathang");
          res.json({ success: true, data: results })
     } catch (e) {
          next(e)
     }
}
module.exports.getItem = async (req, res, next) => {
     try {
          const results = await connection.query('SELECT Mahang, TenhangUnicode, mancc, dvt, Manhom, Giavon, price, Giaban, Giabansi, Tonhientai, tonkho, tonban, kygoi FROM Mathang where Mahang = "' + req.params.mahang + '"');
          res.json({ success: true, data: results })
     } catch (e) {
          next(e)
     }
}

module.exports.getGroupItem = async (req, res, next) => {
     try {
          //Query Qr_getKiemHang_Thang in database lấy những kiểm hàng trong tháng hiện hành
          let str = "SELECT Mathang.Mahang AS Mahang, Mathang.TenhangUnicode AS Tenhang, Mathang.Manhom AS Manhom, Mathang.tonkho AS tonkho, Mathang.tonban AS tonban, Mathang.Tonhientai AS Tonhientai, kiemhang.chenhLech AS chenhlech, FORMAT(kiemhang.Ngay, 'MM/dd/yyyy HH:mm:ss') AS ngaykiem ";
          str += "FROM Qr_getKiemHang_Thang AS kiemhang RIGHT JOIN Mathang ON kiemhang.Mahang = Mathang.Mahang ";
          str += "WHERE Mathang.Manhom='" + req.params.manhom + "'";
          str += "GROUP BY Mathang.Mahang, Mathang.TenhangUnicode, Mathang.Manhom, Mathang.tonkho, Mathang.tonban, Mathang.Tonhientai, kiemhang.chenhLech, kiemhang.Ngay ";
          str += "ORDER BY Mathang.Mahang, kiemhang.Ngay DESC;"
          const results = await connection.query(str);
          res.json({ success: true, data: results })
     } catch (e) {
          next(e)
     }
}

module.exports.getNhomKiemhang = async (req, res, next) => {
     try {
          const results = await connection.query('SELECT Mahang, Ngay, Tonhientai AS Tonluckiem, slKiem, chenhLech FROM kiemhang where Manhom = "' + req.params.manhom + '"');
          res.json({ success: true, data: results })
     } catch (e) {
          next(e)
     }
}

module.exports.getTongKetKiemhang = async (req, res, next) => {
     try {
          const today= new Date();
          const thisMonth = today.getMonth() + 1; //Note: 0=January, 1=February etc.
          let stringSQL = "SELECT kiemhang.Mahang, Mathang.TenhangUnicode, kiemhang.chenhLech, FORMAT(kiemhang.Ngay, 'MM/dd/yyyy') AS Ngay, Mathang.kygoi, kiemhang.ghichu ";
          stringSQL += "FROM kiemhang LEFT JOIN Mathang ON kiemhang.Mahang = Mathang.Mahang ";
          stringSQL += "WHERE kiemhang.chenhLech<>0 AND Month([Ngay])='" + thisMonth + "' AND Year([Ngay]) = '"+ today.getFullYear() + "' ";
          stringSQL += "ORDER BY kiemhang.Ngay;"
          const results = await connection.query(stringSQL);
          res.json({ success: true, data: results })
     } catch (e) {
          next(e)
     }
}

module.exports.getTongKetKiemhangNgay = async (req, res, next) => {
     try {
          const today= new Date();
          const thisMonth = today.getMonth() + 1; //Note: 0=January, 1=February etc.
          let stringSQL = "SELECT kiemhang.Mahang, Mathang.TenhangUnicode, kiemhang.chenhLech, FORMAT(kiemhang.Ngay, 'MM/dd/yyyy') AS Ngay, Mathang.kygoi, kiemhang.ghichu ";
          stringSQL += "FROM kiemhang LEFT JOIN Mathang ON kiemhang.Mahang = Mathang.Mahang ";
          stringSQL += "WHERE Day([Ngay])='" + today.getDate() + "' AND Month([Ngay]) = '" + thisMonth + "' AND Year([Ngay]) = '"+ today.getFullYear() + "' ";
          stringSQL += "ORDER BY kiemhang.Ngay;"
          const results = await connection.query(stringSQL);
          res.json({ success: true, data: results })
     } catch (e) {
          next(e)
     }
}

module.exports.saveKiemhang = async (req, res, next) => {
     try {
          if (req.body.dataPost.Ngay === '') {
               //chưa kiểm lần nào trong tháng => thêm mới
               let stringSQL = "INSERT INTO kiemhang (Ngay, Mahang, Manhom, Tonhientai, slKiem, chenhLech) VALUES ";
               stringSQL += "('" + req.body.dataPost.NgayMoi + "', ";
               stringSQL += "'" + req.body.dataPost.Mahang + "', ";
               stringSQL += "'" + req.body.dataPost.Manhom + "', ";
               stringSQL += "" + req.body.dataPost.Tonhientai + ", ";
               stringSQL += "" + req.body.dataPost.slKiem + ", ";
               stringSQL += "" + req.body.dataPost.Chenhlech + ")";
               const results = await connection.execute(stringSQL);
               res.json({ success: true, data: results });
          } else {
               //Đã kiểm trong tháng, => cập nhật số kiểm mới
               let stringSQL = "UPDATE kiemhang SET Ngay = '" + req.body.dataPost.NgayMoi + "' ";
               stringSQL += ", Tonhientai = " + req.body.dataPost.Tonhientai;
               stringSQL += ", slKiem = " + req.body.dataPost.slKiem;
               stringSQL += ", chenhLech = " + req.body.dataPost.Chenhlech;
               stringSQL += ", ghichu = ghichu & '@" + req.body.dataPost.Ngay + "CL" + req.body.dataPost.ChenhlechCu + "'";
               stringSQL += " WHERE mahang = '" + req.body.dataPost.Mahang + "' AND Ngay=#" + req.body.dataPost.Ngay + "#;";
               const results = await connection.execute(stringSQL);
               res.json({ success: true, data: results });
          }
     } catch (e) {
          next(e)
          console.log(e)
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
          const results = await connection.execute(stringSQL);
          res.json({ success: true, data: results })
     } catch (e) {
          next(e)
     }
}

module.exports.getNhomHang = async (req, res, next) => {
     try {
          const results = await connection.query('SELECT Manhom, TennhomUnicode FROM Nhomhang;');
          res.json({ success: true, data: results })
     } catch (e) {
          next(e)
     }
}