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
      select GV.idguia, GV.versionguia, S.idareaauditoria, A.descripcion
      FROM GuiaVersion GV 
        INNER JOIN SeccionesGuia SG ON GV.idguia = SG.idguia AND GV.versionguia = SG.versionguia
        INNER JOIN Secciones S ON SG.idseccion = S.idseccion
        INNER JOIN AreasAuditoria A ON S.idareaauditoria = A.idareaauditoria
      WHERE GV.activo =1 and SG.activo = 1 and S.activo = 1 and A.activo = 1
      ORDER BY GV.idguia, GV.versionguia, A.descripcion
    `);

    // const Areas = await pool.query(`
    //   select
    //     idareaauditoria,
    //     descripcion
    //   from AreasAuditoria
    //   where activo=1
    //   order by descripcion
    // `);

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
    const Integrantes = await pool.query(`
    INSERT INTO EquipoAuditoria (idusuario, idauditoria, idareaauditoria, referente)
    VALUES 
    ${integrantes.map(
      (i) =>
        "(" +
        i.usuarios +
        "," +
        auditoria.insertId +
        "," +
        i.areas +
        "," +
        (i.responsable ? 1 : 0) +
        ")"
    )}
    `);
    console.log(auditoria);
    console.log(Integrantes);

    res.status(200).json({ auditoria, Integrantes });
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.get("/informe/:idauditoria", helpers.verifyToken, async (req, res) => {
  const { idauditoria } = req.params;
  try {
    const [Auditoria] = await pool.query(`
    select 
      A.fechaplan,
      A.fechaauditoria,
      A.idestadoauditoria,
      A.idguia, 
      A.versionguia,
      A.idusuarioreferente,
      P.descripcion as Prestador,
      P.domicilio,
      P.localidad,
      P.idprovincia,
      P.telefono,
      P.email,
      P.idugl,
      P.CUIT,
      EA.descripcion as EstadoAuditoria,
      Prov.descripcion as ProvinciaPrestador,
      CONCAT(RIGHT(CONCAT('00', P.idugl),2), ' - ', U.descripcion) as UGL,
      CONCAT(Us.nombre,' ',Us.apellido) as Referente
    from Auditorias A
      INNER JOIN Prestadores P ON  P.idprestador = A.idprestador
      INNER JOIN EstadosAuditoria EA ON  EA.idestadoauditoria = A.idestadoauditoria 
      INNER JOIN Provincias Prov ON  Prov.idprovincia = P.idprovincia 
      INNER JOIN UGL U ON U.idugl = P.idugl 
      INNER JOIN Usuarios Us ON Us.idusuario = A.idusuarioreferente 
    where  A.idauditoria = ${idauditoria}
    `);
    const [Informe] = await pool.query(`
    call VerInforme(${Auditoria.idguia},${Auditoria.versionguia})
    `);
    // const callback = (arr, callback) => {
    //   console.log(arr, callback);
    // };
    // pool.getConnection((err, conn) => {
    //   if (err) {
    //     callback(err);
    //   } else {
    //     Informe.forEach(async (a) => {
    //       if (a.Secciones != 0) {
    //         conn.query(
    //           `
    //         call VerSecciones(${a.idseccion})
    //         `,
    //           (error, results, fields) => {
    //             conn.release();
    //             callback(error, results, fields);
    //           }
    //         );
    //       }
    //     });
    //   }
    // });

    // let QuerySecciones = "";
    // Informe.forEach((a) => {
    //   if (a.Secciones != 0) {
    //     QuerySecciones += `
    //     call VerSecciones(${a.idseccion}) ,
    //     `;
    //   }
    // });

    // console.log("QuerySecciones", QuerySecciones);
    // const secciones = await pool.query(QuerySecciones);
    // console.log("secciones", secciones);

    // let QuerySecciones = "";
    // Informe.forEach((a) => {
    //   if (a.Secciones != 0) {
    //     // QuerySecciones += `
    //     // call VerSecciones(${a.idseccion}) ,
    //     // `;
    //     QuerySecciones += `
    //     select
    //       S.idseccion,
    //       S.descripcion,
    //       (
    //         select count(I.idseccion)
    //         from Secciones I
    //         where I.idseccionmadre = S.idseccion
    //       ) as Secciones
    //     from Secciones S
    //     where S.activo = 1 AND
    //     S.idseccionmadre= ${a.idseccion}
    //     ORDER BY S.orden;
    //     `;
    //   }
    // });

    // const connection = await pool.getConnection();
    // QuerySecciones = [];
    // Informe.forEach((a) => {
    //   if (a.Secciones != 0) {
    //     QuerySecciones.push(`
    //     call VerSecciones(${a.idseccion}) ,
    //     `);
    //   }
    // });

    // doStuff(QuerySecciones);

    // const Secciones = await pool.query(QuerySecciones);

    // QuerySecciones = [];
    // Informe.forEach((a) => {
    //   if (a.Secciones != 0) {
    //     QuerySecciones.push(
    //       pool.query(`
    //     call VerSecciones(${a.idseccion})
    //     `)
    //     );
    //   }
    // });

    // const lala = await Promise.all(QuerySecciones);

    // const VerSecciones = await pool.query("call VerSecciones(15)");
    // console.log("VerSecciones15", VerSecciones);

    // console.log("******************************");
    // console.log("******************************");

    // const lala = Promise.all([
    //   pool.query("call VerSecciones(7)"),
    //   pool.query("call VerSecciones(15)"),
    //   pool.query("call VerSecciones(14)"),
    //   pool.query("call VerSecciones(13)"),
    //   // pool.query("call VerSecciones(11)"),
    //   // pool.query("call VerSecciones(10)"),
    // ]).then(function (values) {
    //   console.log(
    //     "---------------------------------------------------values",
    //     values
    //   );
    // });
    // console.log("lala", lala);
    // console.log("******************************");
    // console.log("******************************");
    // console.log("QuerySecciones", QuerySecciones);
    // console.log("Secciones", Secciones);

    // const Secciones1 = await pool.query("call VerSecciones(1)");
    // console.log("Secciones1");
    // console.table(Secciones1[0]);
    const idsecciones = Informe.filter((a) => a.Secciones != 0).map(
      (a) => a.idseccion
    );
    // console.table(secciones);
    const queryString = (idsecciones) => `
      select 
        S.idseccionmadre,
        S.idseccion,
        S.descripcion,
        (
          select count(I.idseccion)
          from Secciones I
          where I.idseccionmadre = S.idseccion
        ) as Secciones
      from Secciones S
      where S.activo = 1 AND
      S.idseccionmadre in (${idsecciones})
      ORDER BY S.idseccionmadre;
    `;
    const secciones = pool
      .query(queryString(idsecciones))
      .then((aa) => {
        const informeSecciones = Informe.map((i) => {
          // if (condition) {
          // console.log("///////////secciones///////////////", aa);
          // }
          const auxSecciones = aa.filter(
            (s) => s.idseccionmadre == i.idseccion
          );

          return {
            ...i,
            subSecciones: auxSecciones,
          };
        });
        console.table(Informe);
        return informeSecciones;
      })
      .then(async (Secciones) => {
        console.log("*************informe**************");
        console.log("Secciones", Secciones);
        console.log("*************informe**************");
        const idsecciones = [];
        Secciones.map((i) => {
          idsecciones.push(i.idseccion);
          i.subSecciones.map((ii) => {
            idsecciones.push(ii.idseccion);
          });
        });
        console.log(idsecciones);
        console.log(
          "porlas",
          `
        select 
          I.iditem, 
          C.descripcion, 
          TE.idtipoeval, 
          TE.componente, 
          IFNULL(A.valor, '') as Valor
        from ItemSeccion ITS 
          INNER JOIN Items I ON ITS.iditem = I.iditem
          INNER JOIN TipoEvaluacion TE ON I.idtipoeval = TE.idtipoeval
          INNER JOIN Criterios C ON C.idcriterio = I.idcriterio
          LEFT JOIN ItemsAuditoria A ON A.iditem = I.iditem and A.idauditoria=${idauditoria}
        where 
          ITS.activo = 1 AND 
          I.activo=1 AND 
          TE.activo=1 AND
          ITS.idseccion in (${idsecciones}) 
        ORDER BY ITS.orden
      `
        );
        const items = await pool.query(`
        select 
        I.iditem, 
        C.descripcion, 
        TE.idtipoeval, 
        TE.componente, 
        ITS.idseccion,
        IFNULL(A.valor, '') as Valor

      from ItemSeccion ITS 
        INNER JOIN Items I ON ITS.iditem = I.iditem
        INNER JOIN TipoEvaluacion TE ON I.idtipoeval = TE.idtipoeval
        INNER JOIN Criterios C ON C.idcriterio = I.idcriterio
        LEFT JOIN ItemsAuditoria A ON A.iditem = I.iditem and A.idauditoria=${idauditoria}
      where 
        ITS.activo = 1 AND 
        I.activo=1 AND 
        TE.activo=1 AND
        ITS.idseccion in (${idsecciones}) 
      ORDER BY ITS.orden
        `);
        const informe = Secciones.map((sec) => {
          return {
            ...sec,
            items: items.filter((item) => item.idseccion == sec.idseccion),
            subSecciones: sec.subSecciones.map((subsec) => {
              return {
                ...subsec,
                items: items.filter(
                  (item) => item.idseccion == subsec.idseccion
                ),
              };
            }),
          };
        });

        return informe;
      })
      .then((Informe) => res.json({ Auditoria, Informe }));
    console.log("*************secciones**************");
    console.table(secciones);
  } catch (error) {
    // finally {
    //   await connection.release();
    // }

    console.error(error);
    res.json({});
  }
});

// async function doStuff(items) {
//   try {
//     const connection = await pool.getConnection();
//     try {
//       for (const item of items) {
//         await connection?.query(item);
//       }
//     } finally {
//       await connection?.release();
//     }
//   } catch (error) {
//     console.error(error);
//   }
// }

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
