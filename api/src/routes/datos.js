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
    const Prestadores = await pool.query(`
      SELECT P.idprestador,
        P.descripcion as Prestador, 
        P.SAP, 
        P.CUIT, 
        CONCAT(RIGHT(CONCAT('00', P.idugl),2), ' - ', U.descripcion) as UGL
      FROM Prestadores P INNER JOIN UGL U ON P.idugl = U.idugl
      where P.activo=1
    `);

    const TipoInforme = await pool.query(`
      Select 
        idguia, 
        descripcion, 
        versionactual 
      from Guias 
      where activo=1
    `);

    const Usuarios = await pool.query(`
      select 
        U.legajo, 
        U.apellido, 
        U.nombre , 
        U.idusuario,  
        P.descripcion as Profesion     
      from Usuarios U 
        INNER JOIN UsuarioProfesion UP ON U.idusuario = UP.idusuario     
        INNER JOIN Profesiones P ON P.idprofesion = UP.idprofesion    
      where U.activo=1 and UP.activo=1 and P.activo = 1    
      order by U.apellido,U.nombre
    `);

    const Areas = await pool.query(`
      select 
        idareaauditoria, 
        descripcion 
      from AreasAuditoria 
      where activo=1 
      order by descripcion
    `);

    res.status(200).json({ Prestadores, TipoInforme, Usuarios, Areas });
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});
function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + (d.getDate() + 1),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}
router.post("/planificarauditoria", helpers.verifyToken, async (req, res) => {
  const {
    prestadores,
    fechaReal,
    TipoInforme,
    VERSIONGUIA,
    referente,
    integrantes,
  } = req.body;
  console.log(req.body);

  try {
    const auditoria = await pool.query(`
      INSERT INTO Auditorias (
        idprestador, 
        fechaplan, 
        fechaauditoria, 
        idestadoauditoria, 
        idinforme, 
        versioninforme, 
        idguia, 
        versionguia, 
        idusuarioreferente) 
        VALUES (
          ${prestadores}, 
          ${fechaReal !== "" ? "'" + formatDate(fechaReal) + "'" : "NULL"},
          NULL, 
          1, 
          NULL,
          NULL, 
          ${TipoInforme}, 
          ${VERSIONGUIA}, 
          ${referente != "" ? referente : "NULL"}
        )
    `);
    const Integrantes = `
    INSERT INTO EquipoAuditoria (idusuario, idauditoria, idareaauditoria, referente)
    VALUES 
    ${integrantes.map(
      (i) =>
        "(" +
        i.usuarios +
        "," +
        auditoria.insertId +
        "," +
        i.secciones +
        "," +
        (i.responsable ? 1 : 0) +
        ")"
    )}
    `;
    console.log(Integrantes);

    console.log(auditoria);
    res.status(200).json({});
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
