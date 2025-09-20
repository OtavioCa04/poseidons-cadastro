// Função para carregar clientes
async function carregarClientes() {
    try {
        const res = await fetch('/clientes');
        const data = await res.json();

        const tbody = document.querySelector('#clientesTable tbody');
        tbody.innerHTML = '';

        data.clientes.forEach(cliente => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${cliente.codigo}</td>
                <td>${cliente.loja}</td>
                <td>${cliente.razao}</td>
                <td>${cliente.tipo}</td>
                <td>${cliente.nomefantasia}</td>
                <td>${cliente.cidade}</td>
                <td>${cliente.estado}</td>
                <td>${cliente.telefone}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error('Erro ao carregar clientes:', err);
        alert('Erro ao carregar lista de clientes');
    }
}

// Função para mostrar/ocultar formulário
function toggleForm(show) {
    const formDiv = document.getElementById('formCliente');
    const overlay = document.getElementById('overlay');
    
    if (show) {
        formDiv.style.display = 'block';
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    } else {
        formDiv.style.display = 'none';
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Event listeners quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Carregar clientes inicialmente
    carregarClientes();

    // Botão novo cliente
    const btnNovo = document.getElementById('btnNovo');
    btnNovo.addEventListener('click', () => {
        toggleForm(true);
    });

    // Botão fechar formulário
    const closeForm = document.getElementById('closeForm');
    closeForm.addEventListener('click', () => {
        toggleForm(false);
    });

    // Fechar clicando no overlay
    const overlay = document.getElementById('overlay');
    overlay.addEventListener('click', () => {
        toggleForm(false);
    });

    // Submit do formulário
    const clienteForm = document.getElementById('clienteForm');
    clienteForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(clienteForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch('/clientes', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            
            if (res.ok) {
                alert('Cliente cadastrado com sucesso!');
                // Atualizar tabela
                carregarClientes();
                // Limpar formulário
                clienteForm.reset();
                // Fechar modal
                toggleForm(false);
            } else {
                alert('Erro: ' + result.message);
            }
        } catch (err) {
            console.error('Erro ao cadastrar cliente:', err);
            alert('Erro ao cadastrar cliente. Tente novamente.');
        }
    });
});

// Fechar modal com ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        toggleForm(false);
    }
});