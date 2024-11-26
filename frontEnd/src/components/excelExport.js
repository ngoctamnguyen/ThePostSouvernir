import React from 'react';
import Button from '@mui/material/Button';
import * as XLSX from 'xlsx';

const ExcelExport = ({ data, fileName }) => {
  const data1 = [
    { id: 1, name: 'John Doe', age: 30, profession: 'Developer' },
    { id: 2, name: 'Jane Smith', age: 25, profession: 'Designer' }
  ];
  const handleExport = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const worksheet1 = XLSX.utils.json_to_sheet(data1);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.utils.book_append_sheet(workbook, worksheet1, 'Sheet2');
    XLSX.writeFile(workbook, fileName);
  };
  return (
    <div>
      <Button variant="outlined" size="medium" id="exportExcel" onClick={() => handleExport(data, fileName)}>Xuất Excel</Button>
    </div>
  );
};

export default ExcelExport;
