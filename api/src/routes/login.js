const express = require('express');
const router = express.Router();

const helpers = require("../lib/helpers")
const pool = require('../database');

const jwt = require("jsonwebtoken")


router.get('/signin', async (req, res) => {
    res.send('signin');
});
router.get('/signin/a',verifyToken, async (req, res) => {
    res.send('signinSecret');
});

router.post('/signin', async (req, res) => {

    const { user, pass } = req.body

    const usuarios = await pool.query('SELECT * FROM usuarios WHERE usuario = ?', [user]);
    console.log('================pool.query(SELECT * FROM====================');
    // console.log(rows,rows[0]);
    console.log('===============pool.query(SELECT * FROM=====================');
    if (usuarios.length > 0) {
      const Usuario = usuarios[0];
      const validPassword = await helpers.matchPassword(pass, Usuario.contrasenia)
      if (validPassword && Usuario.activo) {
        
        const token = jwt.sign({id: Usuario.id},"secretkey",{
            expiresIn: 86400 // 24 hrs
        })
        res.status(200).json({token,nombre:Usuario.nombre})
      } else if (!validPassword){
        res.status(406).json({error: "Contraseña incorrecta"})
      } else if (!Usuario.activo){
        res.status(406).json({error: "Usuario deshabilitado"})
      }
    } else {
        res.status(406).json({error: "Usuario incorrecto"})
    }

    console.log(req.body);
    
});

router.put('/signup', async (req, res) => {
    const { user, pass} = req.body
    contrasenia = await helpers.encryptPassword(pass);

    // Saving in the Database
    try {
        //UPDATE `usuarios` SET `activo` = '1' WHERE `usuarios`.`id` = 2
        const result = await pool.query(' UPDATE usuarios SET activo=0,contrasenia=? WHERE usuario=?', [contrasenia,user]);
        console.log(req.body,result);

        console.log({contrasenia,user});

        // res.status(200).json({contrasenia,user})
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