const express = require('express');
const os = require('os');
const mysql = require('mysql2/promise');

const app = express();
const port = process.env.PORT || 3000;

// Ruta principal
app.get('/', (req, res) => {
    res.json({
        mensaje: '¡Actualización automática con Dokploy!',
        version: '2.0.0',
        institucion: 'Universidad del Quindío',
        programa: 'Ingeniería de Sistemas y Computación',
        curso: 'Administración de Infraestructura de TI',
        plataforma: 'Dokploy PaaS',
        fecha: new Date().toISOString()
    });
});

// Verificación del estado de la aplicación
app.get('/health', (req, res) => {
    res.status(200).json({
        estado: 'saludable',
        uptime: process.uptime(),
        version: process.version,
        plataforma: 'Dokploy'
    });
});

// Información del servidor
app.get('/info', (req, res) => {
    res.json({
        node_version: process.version,
        platform: process.platform,
        arch: process.arch,
        memory: {
            total: Math.round(os.totalmem() / 1024 / 1024) + ' MB',
            free: Math.round(os.freemem() / 1024 / 1024) + ' MB'
        }
    });
});

// Comprobar la conexión con MySQL
app.get('/db-health', async (req, res) => {
    let conexion;

    try {
        conexion = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT || 3306),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            connectTimeout: 5000
        });

        const [resultado] = await conexion.query(
            'SELECT 1 AS conexion_exitosa'
        );

        res.status(200).json({
            estado: 'conectado',
            motor: 'MySQL',
            base_de_datos: process.env.DB_NAME,
            consulta: resultado[0].conexion_exitosa === 1
                ? 'exitosa'
                : 'fallida'
        });

    } catch (error) {
        console.error('Error de conexión MySQL:', error.message);

        res.status(503).json({
            estado: 'sin conexion',
            motor: 'MySQL',
            mensaje: 'No fue posible conectar con la base de datos'
        });

    } finally {
        if (conexion) {
            await conexion.end();
        }
    }
});

// Iniciar servidor
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor corriendo en puerto ${port}`);
    console.log('Plataforma: Dokploy PaaS');
});