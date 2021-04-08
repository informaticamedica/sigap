const express = require('express');
const router = express.Router();

const aut = require('./login')

var XLSX = require('xlsx')
var workbook = XLSX.readFile(__dirname + '/Dashboard Final.xlsx');
var sheet_name_list = workbook.SheetNames;
var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list.constructor('Datos (2)')[0]]);
// console.log(sheet_name_list,sheet_name_list['datos']);
// console.log(__dirname,xlData);
router.get('/', async (req, res) => {
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
    res.json(Data)
});

async function verifyToken(req, res, next) {
    try {
        if (!req.headers.authorization) {
            return res.status(401).send('Unauhtorized Request');
        }
        let token = req.headers.authorization.split(' ')[1];
        if (token === 'null') {
            return res.status(401).send('Unauhtorized Request');
        }
        console.log(await jwt.verify(token, 'secretkey'));
        console.log("añsl");
        const payload = await jwt.verify(token, 'secretkey');
        console.log('=================payload===================');
        console.log(payload, jwt.verify(token, 'secretkey'));
        console.log('==================payload==================');
        if (!payload) {
            return res.status(401).send('Unauhtorized Request');
        }

        if (req.userId != undefined) {
            console.log('===================a=================');
            console.log(req.userId);
            console.log('===================a=================');
        }
        req.userId = payload._id;
        next();
    } catch (e) {
        //console.log(e)
        return res.status(401).send('Unauhtorized Request');
    }
}

module.exports = router;