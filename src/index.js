// Servidor Express

// Para probar los ficheros estáticos del fronend, entrar en <http://localhost:4500/>
// Para probar el API, entrar en <http://localhost:4500/api/items>

// Imports

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require('dotenv').config()



// Arrancar el servidor

const server = express();

// Configuración del servidor

server.use(cors());
server.use(express.json({limit: "25mb"}));
server.set('view engine', 'ejs');



// Conexion a la base de datos

async function getConnection() {
  const connection = await mysql.createConnection(
    {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS,  // <-- Pon aquí tu contraseña o en el fichero /.env en la carpeta raíz
      database: process.env.DB_NAME || "Clase",
    }
  );

  connection.connect();

  return connection;
}



// Poner a escuchar el servidor

const port = process.env.PORT || 4500;
server.listen(port, () => {
  console.log(`Ya se ha arrancado nuestro servidor: http://localhost:${port}/`);
});



// Endpoints

// GET---- para obtener el listado de recetas

server.get('/recetas', async (req, res) => {
  const selectRecipes = 'SELECT * FROM recetas';
  const conn = await getConnection();
  const [result] = await conn.query(selectRecipes);
  const numOfElements = result.length;
  console.log(result);
  conn.end(); 
  res.json({
    info: {
      info: { count: numOfElements },
    results: result,}
  });
});

// Obtener recetas por id
server.get('/recetas/:id', async (req, res) => {
  const recetaId = req.params.id;
  const select = 'SELECT * from recetas WHERE id = ?';
  const conn = await getConnection();
  const [result] = await conn.query(select,[recetaId]);
  console.log(result);
  conn.end();
  res.json({
   
    results: result, //listado 
  }); 
});

// POST ---- Añadir nueva receta  
server.post('/recetas', async (req, res) => {
  const newRecipe = req.body;

  try {
    const insert =
      'INSERT INTO recetas (nombre, ingredientes, instrucciones) VALUES (?,?,?)';
    const conn = await getConnection();
    const [result] = await conn.query(insert, [
     
      newRecipe.nombre,
      newRecipe.ingredientes,
      newRecipe.instrucciones,
    ]);
    conn.end();
    res.json({
      success: true, //Puede ser true o false
      
      
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false, //Puede ser true o false
      message: error,
    });
  }
});

//PUT ---- actualizar una receta
server.put('/recetas/:id', async (req, res) => {
  const recipeId = req.params.id;
  const { nombre, ingredientes, instrucciones } = req.body;
  try {
    const update =
      'UPDATE recetas SET nombre= ?, ingredientes= ? , instrucciones= ? WHERE id = ?';
    const conn = await getConnection();
    const [result] = await conn.query(update, [
      nombre,
      ingredientes,
      instrucciones,
      recipeId,  
      ]);
    console.log(nombre);
    conn.end();
    res.json({
      success: true,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error,
    });
  }
});
