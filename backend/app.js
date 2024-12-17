const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path');

const productsRoutes = require('./routes/products');

const app = express();
app.use(bodyParser.json());

// Configura Pug como motor de plantillas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Ruta pública para mostrar productos
const Product = require('./models/product');
app.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('index', { products });
    } catch (err) {
        res.status(500).send('Error al cargar productos');
    }
});

// Ruta pública para login
app.get('/admin', (req, res) => {
    res.render('login');
});

app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'paula' && password === 'secret') {
        const token = jwt.sign({ username }, 'secret_key', { expiresIn: '1h' });
        res.redirect(`/admin/dashboard?token=${token}`);
    } else {
        res.status(401).send('Credenciales incorrectas');
    }
});

// Ruta protegida del dashboard
app.get('/admin/dashboard', (req, res) => {
    const token = req.query.token;
    jwt.verify(token, 'secret_key', (err, decoded) => {
        if (err) return res.status(401).send('Token inválido');
        res.render('dashboard', { user: decoded.username });
    });
});

mongoose.connect('mongodb://127.0.0.1:27017/tienda_online')
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

app.listen(3000, () => console.log('Servidor iniciado en el puerto 3000'));
