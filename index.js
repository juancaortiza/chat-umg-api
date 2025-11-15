const express = require("express");
const cors = require("cors");
const sql = require("mssql");

const app = express();

app.use(cors());
app.use(express.json());

// ======================
//  CONFIGURACIÓN SQL SERVER
// ======================

const dbConfig = {
  user: "usr_DesaWebDevUMG",
  password: "!ngGuast@360",
  server: "svr-sql-ctezo.southcentralus.cloudapp.azure.com",
  database: "db_DesaWebDevUMG",
  port: 1433,
  options: {
    encrypt: true,              // necesario para Azure
    trustServerCertificate: true
  }
};

// ======================
//  RUTAS
// ======================

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("API Chat UMG funcionando. Usa /api/chat-mensajes para ver los mensajes.");
});

// SERIE III: obtener mensajes del chat (vista cronológica)
app.get("/api/chat-mensajes", async (req, res) => {
  try {
    console.log("Conectando a SQL Server...");
    const pool = await sql.connect(dbConfig);
    console.log("Conexión OK, ejecutando SELECT...");

    const result = await pool.request().query(`
      SELECT TOP 100
        ID_Mensaje,
        Cod_Sala,
        Login_Emisor,
        Contenido,
        Fecha_Envio,
        Estado
      FROM dbo.Chat_Mensaje
      ORDER BY Fecha_Envio DESC
    `);

    console.log("Filas devueltas:", result.recordset.length);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error al consultar Chat_Mensaj​e:");
    console.error("message:", err.message);
    console.error("code   :", err.code);
    console.error("number :", err.number);

    res.status(500).json({
      error: "Error al obtener mensajes de la base de datos.",
      message: err.message ?? null,
      code: err.code ?? null,
      number: err.number ?? null
