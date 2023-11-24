var XLSX = require('xlsx');
var fs = require('fs');

export const generateId = () => {
  const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for ( let i = 0; i < 12; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export const generateUniqueId = () => {
  let result = "";
  for (let i = 0; i < 3; i++) {
    result += String.fromCharCode(97 + Math.floor(Math.random() * 26)).toLocaleUpperCase();
  }
  result += "-" + Math.floor(Math.random() * 1000000000000);
  return result;
}

export const generateCodeWithDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = ('0'+(now.getMonth() + 1)).slice(-2);
  const day = now.getDate();
  let result = "";
  for (let i = 0; i < 3; i++) {
    result += String.fromCharCode(97 + Math.floor(Math.random() * 26)).toLocaleUpperCase();
  };
  return `${result}/${year}/${month}/${day}`;
}

export const generateExcel = (data: any, fileName: string) => {
  const workSheet = XLSX.utils.json_to_sheet(data);
  const workBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet 1");
  XLSX.writeFile(workBook, fileName);
}

export const encodeFile = (fileName: any) => {
  const bitmap = fs.readFileSync(fileName);
  return  Buffer.from(bitmap).toString('base64'); 
}

export const convertToExcel = (base64: string) => {
  // data:@file/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,
  const bufferExcel = Buffer.from(base64.toString().replace("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,", ""),'base64');
  const workbook = XLSX.read(bufferExcel, { type: 'buffer' });
  const sheetNamesList = workbook.SheetNames;
  return XLSX.utils.sheet_to_json(workbook.Sheets[sheetNamesList[0]]);
}

export const getMonthNameByNumber = (number: number) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[number];
}