const express = require('express');
const router = express.Router();

const helpers = require("../lib/helpers")


var XLSX = require('xlsx')
var workbook = XLSX.readFile(__dirname + '/Dashboard Final.xlsx');
var sheet_name_list = workbook.SheetNames;
var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list.constructor('Datos (2)')[0]]);
// console.log(sheet_name_list,sheet_name_list['datos']);
// console.log(__dirname,xlData);
router.get('/',helpers.verifyToken, async (req, res) => {
    // res.send('Api sector datos');
  
    let Data = xlData.map(b => {

        let aux = {}
        key = Object.keys(b).map(d => d.replace("\n", "").replace("\r", " "))
        let i = 0
        for (clave in b) {

            aux[key[i]] = b[clave]
            i++

        }


        return aux

    }
    )
    // console.table(Data);
    res.json(Data)
});


module.exports = router;