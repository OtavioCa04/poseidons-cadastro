# Laboratório de Engenharia de Software – Cadastro de Clientes

## Descrição
Este projeto tem como objetivo desenvolver uma aplicação Web para manipular dados de clientes, simulando a tabela **SA1990** do ERP TOTVS Protheus.  

O projeto é composto por:
- **Backend:** Node.js com Express.js, fornecendo uma API REST para CRUD completo de clientes
- **Frontend:** HTML, CSS e JavaScript puro, consumindo a API com interface moderna e responsiva
- **Banco de Dados:** MySQL, utilizando MySQL Workbench para gerenciamento

A aplicação permite simular o atendimento a demandas de clientes que utilizam ERP, melhorando a experiência ao manipular o cadastro de clientes com interface profissional e funcionalidades robustas.

---

## ✨ Funcionalidades Implementadas

### 🎯 **CRUD Completo:**
✅ **CREATE** - Cadastrar novo cliente com modal interativo  
✅ **READ** - Listar todos os clientes + Visualizar detalhes completos  
✅ **UPDATE** - Atualizar dados existentes com formulário pré-preenchido  
✅ **DELETE** - Excluir cliente com modal de confirmação segura  

### 🎨 **Interface:**
- **Modal de Cadastro** com validação de campos obrigatórios
- **Modal de Visualização** com todos os dados organizados
- **Modal de Atualização** com dados pré-carregados e labels
- **Modal de Confirmação** para exclusões com aviso de segurança
- **Tabela Responsiva** com select de ações por linha
- **Design Moderno** com gradientes, animações e efeitos visuais
- **Loading States** e feedback visual em todas as operações

### 🛡️ **Funcionalidades Avançadas:**
- **Tratamento de Erros** robusto em frontend e backend
- **Logs Detalhados** para facilitar debugging
- **Validação de Dados** tanto no cliente quanto no servidor
- **Geração Automática** de códigos sequenciais (C00001, C00002...)
- **Responsividade Completa** para desktop, tablet e mobile
- **Experiência de Usuário** profissional com indicadores visuais

---

## 🛠️ Tecnologias

### **Backend:**
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web minimalista
- **MySQL2** - Driver para MySQL com suporte a Promises
- **CORS** - Middleware para Cross-Origin Resource Sharing

### **Frontend:**
- **HTML5** - Estrutura semântica moderna
- **CSS3** - Estilização avançada com gradientes, flexbox e grid
- **JavaScript ES6+** - Funcionalidades modernas (async/await, arrow functions)
- **Fetch API** - Requisições HTTP nativas

### **Banco de Dados:**
- **MySQL 8.0+** - Sistema de gerenciamento de banco
- **MySQL Workbench** - Interface gráfica para administração

### **Ferramentas de Desenvolvimento:**
- **Git** - Controle de versão
- **VS Code** - Editor de código recomendado
- **Postman** (opcional) - Testes de API

---

## 📋 Estrutura do Projeto

```
projeto-clientes/
├── views/                  # Frontend
│   ├── index.html         # Página principal
│   ├── style.css          # Estilos globais
│   └── script.js          # Lógica do frontend
├── index.js               # Servidor Express (Backend)
├── db.js                  # Configuração do banco de dados
├── package.json           # Dependências do projeto
├── package-lock.json      # Lock das versões
└── README.md              # Este arquivo
```

---

## ⚙️ Instalação e Configuração

### 1. **Clone o repositório:**
```bash
git clone <URL_DO_REPOSITORIO>
cd <NOME_DO_PROJETO>
```

### 2. **Instale as dependências:**
```bash
npm install
```

### 3. **Configure o banco de dados:**

**Crie o arquivo `db.js`:**
```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'seu_usuario',
    password: 'sua_senha',
    database: 'nome_do_banco',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
```

### 4. **Crie a tabela no MySQL:**
```sql
CREATE DATABASE clientes_db;
USE clientes_db;

CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(10) UNIQUE NOT NULL,
    loja VARCHAR(50) NOT NULL,
    razao VARCHAR(100) NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    nomefantasia VARCHAR(100) NOT NULL,
    finalidade VARCHAR(50),
    cnpj VARCHAR(20),
    cep VARCHAR(10),
    pais VARCHAR(50),
    estado VARCHAR(50) NOT NULL,
    codmunicipio VARCHAR(10),
    cidade VARCHAR(50) NOT NULL,
    endereco VARCHAR(200),
    bairro VARCHAR(50),
    ddd VARCHAR(5),
    telefone VARCHAR(20) NOT NULL,
    abertura DATE,
    contato VARCHAR(100),
    email VARCHAR(100),
    homepage VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 5. **Inicie o servidor:**
```bash
npm start
# ou
node index.js
```

### 6. **Acesse a aplicação:**
Abra seu navegador em: **http://localhost:3000**

---

## 🚀 Como Usar

### **📝 Cadastrar Cliente:**
1. Clique no botão **"➕ Cadastrar Cliente"**
2. Preencha os campos obrigatórios no modal
3. Clique em **"➕ Cadastrar Cliente"**
4. O cliente será adicionado e a tabela atualizada automaticamente

### **👁️ Visualizar Cliente:**
1. Na tabela, selecione **"👁️ Visualizar"** no select de ações
2. Modal abrirá com todos os dados do cliente organizados

### **🔄 Atualizar Cliente:**
1. Na tabela, selecione **"🔄 Atualizar"** no select de ações
2. Modal abrirá com formulário pré-preenchido
3. Modifique os campos desejados
4. Clique em **"🔄 Atualizar Cliente"**

### **🗑️ Excluir Cliente:**
1. Na tabela, selecione **"🗑️ Excluir"** no select de ações
2. Modal de confirmação mostrará os dados do cliente
3. Confirme clicando em **"🗑️ Sim, Excluir Definitivamente"**

---

## 🔌 API Endpoints

### **📋 Listar todos os clientes**
```
GET /clientes
Response: { clientes: [...] }
```

### **👁️ Buscar cliente específico**
```
GET /clientes/:codigo
Response: { codigo, loja, razao, ... }
```

### **➕ Cadastrar novo cliente**
```
POST /clientes
Body: { loja, razao, tipo, nomefantasia, ... }
Response: { message, codigo }
```

### **🔄 Atualizar cliente**
```
PUT /clientes/:codigo
Body: { loja, razao, tipo, nomefantasia, ... }
Response: { message, codigo, linhasAfetadas }
```

### **🗑️ Excluir cliente**
```
DELETE /clientes/:codigo
Response: { message }
```

---

## 🎨 Características da Interface

### **Design Moderno:**
- **Gradientes azuis** inspirados em aplicações corporativas
- **Animações suaves** em hover e transições
- **Sombras e bordas arredondadas** para profundidade
- **Tipografia elegante** com hierarquia visual clara

### **Responsividade:**
- **Mobile-first** com breakpoints em 768px e 480px
- **Tabela scrollável** horizontalmente em telas pequenas
- **Modais adaptativos** que se ajustam ao tamanho da tela
- **Botões empilhados** verticalmente em dispositivos móveis

### **UX/UI Profissional:**
- **Loading states** com indicadores visuais
- **Feedback imediato** para todas as ações
- **Validação em tempo real** nos formulários
- **Mensagens de erro específicas** e amigáveis
- **Confirmações de segurança** para ações críticas

---

## 🐛 Debugging e Logs

O sistema inclui **logs detalhados** no console do navegador:

```javascript
🚀 Script carregado! Inicializando sistema...
📊 Carregando clientes...
✅ Clientes recebidos: 5
🎯 Ação selecionada: atualizar para cliente: C00001
💾 Processando atualização do cliente...
✅ Cliente atualizado com sucesso!
```

Para debugar, abra as **Ferramentas de Desenvolvedor** (F12) e monitore o console.

---

## 📦 Dependências

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.0",
    "cors": "^2.8.5"
  }
}
```
