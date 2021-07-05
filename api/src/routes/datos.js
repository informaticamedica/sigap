const express = require("express");
const router = express.Router();
const helpers = require("../lib/helpers");
const XLSX = require("xlsx");

const pool = require("../database");

const extraerDatos = () => {
  const nombreArchivo = "Dashboard Final.xlsx";
  const nombreHoja = "Datos (2)";
  const rutaArchivo = __dirname + "/" + nombreArchivo;
  const workbook = XLSX.readFile(rutaArchivo);
  const sheet_name_list = workbook.SheetNames;
  const sheet = workbook.Sheets[sheet_name_list.constructor(nombreHoja)[0]];
  const xlData = XLSX.utils.sheet_to_json(sheet);

  const Data = xlData.map((b) => {
    let aux = {};
    key = Object.keys(b).map((d) => d.replace("\n", "").replace("\r", " "));
    let i = 0;
    for (clave in b) {
      aux[key[i]] = b[clave];
      i++;
    }

    return aux;
  });
  // console.table(Data);
  return Data;
};
// console.log(sheet_name_list,sheet_name_list['datos']);
// console.log(__dirname,xlData);
router.get("/auditorias", helpers.verifyToken, async (req, res) => {
  try {
    const Auditorias = await pool.query("call ListarAuditorias(0)");
    res.status(200).json(Auditorias[0]);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});
router.get("/prestadores", helpers.verifyToken, async (req, res) => {
  try {
    const Prestadores = await pool.query("select * from Prestadores");
    res.json(Prestadores);
  } catch (error) {
    console.error(error);
    res.json({});
  }
});
router.get("/planificarauditoria", helpers.verifyToken, async (req, res) => {
  try {
    const Prestadores = await pool.query("select * from Prestadores");
    const TipoInforme = await pool.query(
      "Select idguia, descripcion, versionactual from Guias where activo=1"
    );
    const Usuarios = await pool.query(
      "select U.legajo, U.apellido, U.nombre,  P.descripcion as Profesion     from Usuarios U INNER JOIN UsuarioProfesion UP ON U.idusuario = UP.idusuario     INNER JOIN Profesiones P ON P.idprofesion = UP.idprofesion    where U.activo=1 and UP.activo=1 and P.activo = 1    order by U.apellido,U.nombre"
    );
    const Areas = await pool.query(
      "select idareaauditoria, descripcion from AreasAuditoria where activo=1 order by descripcion"
    );

    res.status(200).json({ Prestadores, TipoInforme, Usuarios, Areas });
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});
router.get("/lala", async (req, res) => {
  const datos = extraerDatos();
  if (datos != undefined) {
    try {
      // const result = await pool.query("INSERT INTO indicadores SET ? ", newUser);
      // console.log(req.body, result);
      let aux = datos.filter((a, i) => i < 3);
      console.log(aux);
      res.status(200).json(result);
    } catch (error) {
      // console.log("============error========================");
      // console.log(error);
      // console.log("error.code", error.code);
      // console.log("============error========================");

      if (error.code == "ER_DUP_ENTRY") res.status(406).json(error);
    }
    res.json(datos);
  }
  // console.log(req.body);
  // res.render("index", { title: "lala", condition: false });
});
// router.get("/cargarTabla/:token", async (req, res) => {
// // console.log(req.body, req.headers);
// token = req.params.token;
// const TOKEN = await helpers.verifyTokenArgument(token);
// if (TOKEN == "OK") {
//     res.status(200).render("cargarTabla", { title: "Cargar tabla " });
// } else res.status(401).send(TOKEN);
// });

module.exports = router;
