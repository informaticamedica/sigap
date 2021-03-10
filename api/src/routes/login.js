const express = require('express');
const router = express.Router();

const helpers = require("../lib/helpers")
const pool = require('../database');

const jwt = require("jsonwebtoken")


router.get('/signin', async (req, res) => {
    res.send('signin');
});

router.post('/signin', async (req, res) => {

    const { user, pass } = req.body

    const rows = await pool.query('SELECT * FROM usuarios WHERE usuario = ?', [user]);
    console.log('================pool.query(SELECT * FROM====================');
    console.log(rows,rows[0]);
    console.log('===============pool.query(SELECT * FROM=====================');
    if (rows.length > 0) {
      const Usuario = rows[0];
      const validPassword = await helpers.matchPassword(pass, Usuario.contrasenia)
      if (validPassword) {
        
        const token = jwt.sign({id: Usuario.id},"secretkey",{
            expiresIn: 86400 // 24 hrs
        })
        res.status(200).json({token})
      } else {
        res.status(406).json({error: "Contraseña incorrecta"})
      }
    } else {
        res.status(406).json({error: "Usuario incorrecto"})
    }

    console.log(req.body);
    
});

router.post('/signup', async (req, res) => {
    const { user, pass, nombre } = req.body
    contrasenia = await helpers.encryptPassword(pass);
    const newUser = {
        usuario: user,
        contrasenia,
        nombre
    }
    // Saving in the Database
    try {
        
        const result = await pool.query('INSERT INTO usuarios SET ? ', newUser);
        console.log(req.body,result);
        res.status(200).json(result)
    } catch (error) {
        console.log('============error========================');
        console.log(error);
        console.log("error.code",error.code);
        console.log('============error========================');

        if (error.code=="ER_DUP_ENTRY")
        res.status(406).json(error)
    }
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

        const payload = await jwt.verify(token, 'secretkey');
        // console.log('=================payload===================');
        // console.log(payload);
        // console.log('==================payload==================');
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