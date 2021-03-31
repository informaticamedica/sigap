const express = require('express');
const router = express.Router();

var XLSX = require('xlsx')
var workbook = XLSX.readFile(__dirname+'/Dashboard Final.xlsx');
var sheet_name_list = workbook.SheetNames;
var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list.constructor('Datos_Juan')[0]]);
// console.log(sheet_name_list,sheet_name_list['datos']);
// console.log(__dirname,xlData);
router.get('/', async (req, res) => {
    // res.send('Api sector datos');
res.json(xlData)
});

module.exports = router;