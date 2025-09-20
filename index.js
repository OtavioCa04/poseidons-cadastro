const express = require('express');
const pool = require('./db');

const app = express();
const PORT = 3000;
const path = require('path');


app.use(express.json());
app.use(express.static(path.join(__dirname, 'views')));

//teste
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});


// get clients
app.get('/clientes', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM clientes ORDER BY id DESC');
        res.json({ clientes: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar clientes' });
    }
});

app.post('/clientes', async (req, res) => {
    try {
        const {
            codigo, loja, razao, tipo, nomefantasia, finalidade,
            cnpj, cep, pais, estado, codmunicipio, cidade,
            endereco, bairro, ddd, telefone, abertura, contato, email, homepage
        } = req.body;

        const sql = `
            INSERT INTO clientes
            (codigo, loja, razao, tipo, nomefantasia, finalidade,
            cnpj, cep, pais, estado, codmunicipio, cidade,
            endereco, bairro, ddd, telefone, abertura, contato, email, homepage)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await pool.query(sql, [
            codigo, loja, razao, tipo, nomefantasia, finalidade,
            cnpj, cep, pais, estado, codmunicipio, cidade,
            endereco, bairro, ddd, telefone, abertura, contato, email, homepage
        ]);

        res.json({ message: 'Cliente cadastrado com sucesso!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao cadastrar cliente' });
    }
});





app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
