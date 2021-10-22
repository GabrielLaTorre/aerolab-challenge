const cors = require('cors');
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;
const products = require('./routes/products');

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());
app.use(cors());


app.use('/products', products);

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen( port, () => {
    console.log(`Servidor funcionando en puerto ${port}`)
});