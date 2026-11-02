const express = require('express');
const os = require('os');

const app = express();
const port = process.env.PORT || 3000;

// Ruta principal
app.get('/', (req, res) => {
    res.json({
        mensaje: '¡Aplicación desplegada con Dokploy!',
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

// Iniciar servidor
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor corriendo en puerto ${port}`);
    console.log('Plataforma: Dokploy PaaS');
});