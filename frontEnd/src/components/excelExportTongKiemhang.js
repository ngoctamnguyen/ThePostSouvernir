import React from 'react';
import Button from '@mui/material/Button';
import * as XLSX from 'xlsx';

const ExcelExportTongKiemhang = ({ data, fileName }) => {

  const handleExport = () => {
    const workbook = XLSX.utils.book_new();
    const worksheetHangthieuKG = XLSX.utils.json_to_sheet(data.filter(item => item.chenhLech < 0 && (item.kygoi === 'y' || item.kygoi === 'Y')));
    XLSX.utils.book_append_sheet(workbook, worksheetHangthieuKG, 'Hàng thiếu KG');
    const worksheetHangthieuNonKG = XLSX.utils.json_to_sheet(data.filter(item => item.chenhLech < 0 && item.kygoi !== 'y' && item.kygoi !== 'Y'));
    XLSX.utils.book_append_sheet(workbook, worksheetHangthieuNonKG, 'Hàng thiếu không KG');
    const worksheetHangduKG = XLSX.utils.json_to_sheet(data.filter(item => item.chenhLech > 0 && (item.kygoi === 'y' || item.kygoi === 'Y')));
    XLSX.utils.book_append_sheet(workbook, worksheetHangduKG, 'Hàng dư KG');
    const worksheetHangduNonKG = XLSX.utils.json_to_sheet(data.filter(item => item.chenhLech > 0 && item.kygoi !== 'y' && item.kygoi !== 'Y'));
    XLSX.utils.book_append_sheet(workbook, worksheetHangduNonKG, 'Hàng dư không KG');

    XLSX.writeFile(workbook, fileName);
  };
  return (
    <div>
      <Button variant="outlined" size="medium" id="exportExcel" onClick={() => handleExport(data, fileName)}>Xuất Excel</Button>
    </div>
  );
};

export default ExcelExportTongKiemhang;
