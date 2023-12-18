const express = require('express');
const cors = require('cors'); // Importe o pacote cors
const app = express();
app.use(express.json());

const restify = require('restify');
const errors = require('restify-errors');

app.use(cors());
app.use(express.static('public'));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
})

//Rotas
const livroRoutes = require('./rotas/livroRoutes');
const userRoutes = require('./rotas/userRoutes');

app.get("/",(req,res) => {
  res.send("Hello World");
});

app.use("/livros", livroRoutes);
app.use("/usuarios",userRoutes);

app.listen (8001, () => { 
    console.log("Servidor Iniciado");
})