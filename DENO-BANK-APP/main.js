const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear el cuerpo de las solicitudes JSON
app.use(express.json());

// Configuración de Supabase
const supabaseUrl = 'https://phypykackibcvmxyvjns.supabase.co'; // Cambia esto
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoeXB5a2Fja2liY3ZteHl2am5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg4MjA5NzcsImV4cCI6MjA0NDM5Njk3N30.Qi14L3S4S__JNsRSGfYUAIwniBz2pc9to2dtJO_xq1s'; // Cambia esto 
const supabase = createClient(supabaseUrl, supabaseKey);


// Configuración de Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Usuarios',
            version: '1.0.0',
            description: 'Documentación de la API para gestionar usuarios',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
            },
        ],
    },
    apis: ['./main.js'], // Ruta a los archivos donde se encuentran las anotaciones Swagger
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Definición de los endpoints
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API para gestionar usuarios
 */


/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       500:
 *         description: Error del servidor
 */
app.get('/api/users', async (req, res) => {
    const { data, error } = await supabase.from('users').select('*');

    // Imprime la respuesta y el error en la consola para depuración
    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
});


/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Agregar un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado
 *       400:
 *         description: Error en los datos de entrada
 *       500:
 *         description: Error del servidor
 */
app.post('/api/users', async (req, res) => {
    const { username, email } = req.body;

    // Validar datos
    if (!username || !email) {
        return res.status(400).json({ error: 'Username and email are required' });
    }

    const { data, error } = await supabase.from('users').insert([{ username, email }]);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data);
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});