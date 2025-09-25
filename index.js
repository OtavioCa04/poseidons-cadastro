const express = require('express');
const pool = require('./db');

const app = express();
const PORT = 3000;
const path = require('path');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'views')));

// Página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// GET - Listar todos os clientes
app.get('/clientes', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM clientes ORDER BY id DESC');
        res.json({ clientes: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar clientes' });
    }
});

// POST - Cadastrar cliente
app.post('/clientes', async (req, res) => {
    try {
        // Gerar próximo código automaticamente
        const [rows] = await pool.query("SELECT codigo FROM clientes ORDER BY id DESC LIMIT 1");
        let novoCodigo = "C00001";
        if (rows.length > 0) {
            const ultimoCodigo = rows[0].codigo;
            const numero = parseInt(ultimoCodigo.substring(1)) + 1;
            novoCodigo = "C" + numero.toString().padStart(5, "0");
        }

        const {
            loja, razao, tipo, nomefantasia, finalidade,
            cnpj, cep, pais, estado, codmunicipio, cidade,
            endereco, bairro, ddd, telefone, abertura,
            contato, email, homepage
        } = req.body;

        await pool.query(`
            INSERT INTO clientes
            (codigo, loja, razao, tipo, nomefantasia, finalidade,
            cnpj, cep, pais, estado, codmunicipio, cidade,
            endereco, bairro, ddd, telefone, abertura, contato, email, homepage)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            novoCodigo, loja, razao, tipo, nomefantasia, finalidade,
            cnpj, cep, pais, estado, codmunicipio, cidade,
            endereco, bairro, ddd, telefone, abertura, contato, email, homepage
        ]);

        res.json({ message: "Cliente cadastrado com sucesso!", codigo: novoCodigo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao cadastrar cliente" });
    }
});

// GET - Buscar cliente pelo código (DEVE vir DEPOIS das rotas específicas)
app.get('/clientes/:codigo', async (req, res) => {
    const { codigo } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM clientes WHERE codigo = ?', [codigo]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar cliente' });
    }
});

// DELETE - Excluir cliente
app.delete('/clientes/:codigo', async (req, res) => {
    const { codigo } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM clientes WHERE codigo = ?', [codigo]);
        
        if (result.affectedRows > 0) {
            res.json({ message: 'Cliente excluído com sucesso!' });
        } else {
            res.status(404).json({ error: 'Cliente não encontrado' });
        }
    } catch (err) {
        console.error('Erro ao excluir cliente:', err);
        res.status(500).json({ error: 'Erro ao excluir cliente' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});