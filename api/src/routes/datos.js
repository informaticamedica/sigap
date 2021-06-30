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
router.get("/", helpers.verifyToken, async (req, res) => {
  // const datos = extraerDatos();

  const Auditorias = await pool.query(
    "select A.idauditoria, P.descripcion as Prestador, DATE_FORMAT(A.fechaplan, '%d/%m/%Y') as 'Fecha de Auditoría', P.CUIT, P.SAP, U.descripcion as UGL, E.descripcion as Estado from Auditorias A, Prestadores P, UGL U, EstadosAuditoria E where A.idprestador = P.cprestador and U.idugl = P.idugl and E.idestadoauditoria = A.idestadoauditoria"
  );
  const Prestadores = await pool.query("select * from Prestadores");

  res.json(Auditorias);

  // console.log(Prestadores);
  // res.render("index", { title: "lala", condition: false });
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
//   // console.log(req.body, req.headers);
//   token = req.params.token;
//   const TOKEN = await helpers.verifyTokenArgument(token);
//   if (TOKEN == "OK") {
//     res.status(200).render("cargarTabla", { title: "Cargar tabla " });
//   } else res.status(401).send(TOKEN);
// });

module.exports = router;
