// ========== ELEMENTOS DOM ==========
const btnNovo = document.getElementById('btnNovo');
const overlay = document.getElementById('overlay');
const formClienteModal = document.getElementById('formCliente');
const closeForm = document.getElementById('closeForm');
const clienteForm = document.getElementById('clienteForm');
const tbody = document.querySelector('#clientesTable tbody');

// Elementos do modal de visualização
const modalViewCliente = document.getElementById('modalViewCliente');
const closeViewModal = document.getElementById('closeViewModal');
const viewContent = document.getElementById('viewContent');

// Elementos do modal de atualização
const modalEditCliente = document.getElementById('modalEditCliente');
const closeEditModal = document.getElementById('closeEditModal');
const editClienteForm = document.getElementById('editClienteForm');

// Elementos do modal de confirmação de exclusão
const modalConfirmDelete = document.getElementById('modalConfirmDelete');
const closeConfirmModal = document.getElementById('closeConfirmModal');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmContent = document.getElementById('confirmContent');

// Variáveis globais
let clienteParaExcluir = null;
let clienteParaEditar = null;

// ========== FUNÇÕES DE CONTROLE DOS MODAIS ==========

// Função para mostrar um modal
function mostrarModal(modal) {
  modal.style.display = 'block';
  overlay.style.display = 'block';
}

// Função para fechar todos os modais
function fecharTodosModais() {
  formClienteModal.style.display = 'none';
  modalViewCliente.style.display = 'none';
  modalConfirmDelete.style.display = 'none';
  modalEditCliente.style.display = 'none';
  overlay.style.display = 'none';
  clienteParaExcluir = null;
  clienteParaEditar = null;
}

// ========== EVENT LISTENERS DOS MODAIS ==========

// Abrir modal de cadastro
btnNovo.addEventListener('click', () => {
  mostrarModal(formClienteModal);
});

// Fechar modal de cadastro
closeForm.addEventListener('click', fecharTodosModais);

// Fechar modal de visualização
closeViewModal.addEventListener('click', fecharTodosModais);

// Fechar modal de atualização
closeEditModal.addEventListener('click', fecharTodosModais);

// Fechar modal de confirmação de exclusão
closeConfirmModal.addEventListener('click', fecharTodosModais);

// Cancelar exclusão
cancelDeleteBtn.addEventListener('click', fecharTodosModais);

// Botão cancelar do formulário de atualização
const btnCancelForm = document.querySelector('.btn-cancel-form');
if (btnCancelForm) {
  btnCancelForm.addEventListener('click', fecharTodosModais);
}

// Fechar modais clicando no overlay
overlay.addEventListener('click', fecharTodosModais);

// ========== FUNÇÃO PARA CARREGAR CLIENTES ==========
async function carregarClientes() {
  console.log('📊 Carregando clientes...');
  
  try {
    const response = await fetch('/clientes');
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Clientes recebidos:', data.clientes.length);
    
    // Limpar tabela
    tbody.innerHTML = '';
    
    // Verificar se existem clientes
    if (!data.clientes || data.clientes.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align: center; padding: 20px; color: #666;">
            📋 Nenhum cliente cadastrado
          </td>
        </tr>
      `;
      return;
    }
    
    // Adicionar cada cliente à tabela
    data.clientes.forEach(cliente => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${cliente.codigo || 'N/A'}</td>
        <td>${cliente.loja || 'N/A'}</td>
        <td>${cliente.razao || 'N/A'}</td>
        <td>${cliente.tipo || 'N/A'}</td>
        <td>${cliente.nomefantasia || 'N/A'}</td>
        <td>${cliente.cidade || 'N/A'}</td>
        <td>${cliente.estado || 'N/A'}</td>
        <td>${cliente.telefone || 'N/A'}</td>
        <td>
          <select class="action-select" data-id="${cliente.codigo}">
            <option value="">Selecione...</option>
            <option value="visualizar">👁️ Visualizar</option>
            <option value="atualizar">🔄 Atualizar</option>
            <option value="excluir">🗑️ Excluir</option>
          </select>
        </td>
      `;
      tbody.appendChild(tr);
    });
    
    console.log('✅ Tabela atualizada com sucesso');
    
  } catch (error) {
    console.error('❌ Erro ao carregar clientes:', error);
    tbody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align: center; padding: 20px; color: #ff4d4f;">
          ❌ Erro ao carregar clientes. Verifique a conexão.
        </td>
      </tr>
    `;
  }
}

// ========== FUNÇÃO PARA CADASTRAR CLIENTE ==========
clienteForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log('📝 Enviando formulário de cadastro...');
  
  // Coleta dados do formulário
  const formData = new FormData(clienteForm);
  const dadosCliente = Object.fromEntries(formData.entries());
  
  console.log('📋 Dados do cliente:', dadosCliente);
  
  try {
    const response = await fetch('/clientes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosCliente)
    });
    
    const resultado = await response.json();
    
    if (response.ok) {
      console.log('✅ Cliente cadastrado:', resultado);
      alert('✅ Cliente cadastrado com sucesso!');
      
      // Limpar formulário e fechar modal
      clienteForm.reset();
      fecharTodosModais();
      
      // Recarregar a tabela
      await carregarClientes();
      
    } else {
      console.error('❌ Erro no cadastro:', resultado);
      alert(`❌ Erro ao cadastrar cliente: ${resultado.error || 'Erro desconhecido'}`);
    }
    
  } catch (error) {
    console.error('❌ Erro na requisição:', error);
    alert('❌ Erro ao cadastrar cliente. Verifique a conexão.');
  }
});

// ========== FUNÇÃO PARA VISUALIZAR CLIENTE ==========
async function visualizarCliente(codigoCliente) {
  console.log(`👁️ Visualizando cliente: ${codigoCliente}`);
  
  try {
    const response = await fetch(`/clientes/${codigoCliente}`);
    
    if (!response.ok) {
      throw new Error(`Cliente não encontrado: ${response.status}`);
    }
    
    const cliente = await response.json();
    console.log('📋 Dados do cliente:', cliente);
    
    // Preencher modal com dados do cliente
    viewContent.innerHTML = `
      <p><strong>Código:</strong> ${cliente.codigo || 'N/A'}</p>
      <p><strong>Loja:</strong> ${cliente.loja || 'N/A'}</p>
      <p><strong>Razão Social:</strong> ${cliente.razao || 'N/A'}</p>
      <p><strong>Tipo:</strong> ${cliente.tipo || 'N/A'}</p>
      <p><strong>Nome Fantasia:</strong> ${cliente.nomefantasia || 'N/A'}</p>
      <p><strong>Finalidade:</strong> ${cliente.finalidade || 'N/A'}</p>
      <p><strong>CNPJ:</strong> ${cliente.cnpj || 'N/A'}</p>
      <p><strong>CEP:</strong> ${cliente.cep || 'N/A'}</p>
      <p><strong>País:</strong> ${cliente.pais || 'N/A'}</p>
      <p><strong>Estado:</strong> ${cliente.estado || 'N/A'}</p>
      <p><strong>Código Município:</strong> ${cliente.codmunicipio || 'N/A'}</p>
      <p><strong>Cidade:</strong> ${cliente.cidade || 'N/A'}</p>
      <p><strong>Endereço:</strong> ${cliente.endereco || 'N/A'}</p>
      <p><strong>Bairro:</strong> ${cliente.bairro || 'N/A'}</p>
      <p><strong>DDD:</strong> ${cliente.ddd || 'N/A'}</p>
      <p><strong>Telefone:</strong> ${cliente.telefone || 'N/A'}</p>
      <p><strong>Data Abertura:</strong> ${cliente.abertura || 'N/A'}</p>
      <p><strong>Contato:</strong> ${cliente.contato || 'N/A'}</p>
      <p><strong>Email:</strong> ${cliente.email || 'N/A'}</p>
      <p><strong>Homepage:</strong> ${cliente.homepage || 'N/A'}</p>
    `;
    
    // Mostrar modal
    mostrarModal(modalViewCliente);
    
  } catch (error) {
    console.error('❌ Erro ao visualizar cliente:', error);
    alert('❌ Erro ao carregar dados do cliente.');
  }
}

// ========== FUNÇÃO PARA ATUALIZAR CLIENTE ==========
async function atualizarCliente(codigoCliente) {
  console.log(`🔄 Abrindo modal para atualizar cliente: ${codigoCliente}`);
  
  try {
    const response = await fetch(`/clientes/${codigoCliente}`);
    
    if (!response.ok) {
      throw new Error(`Cliente não encontrado: ${response.status}`);
    }
    
    const cliente = await response.json();
    clienteParaEditar = cliente;
    
    console.log('📋 Dados do cliente para atualização:', cliente);
    
    // Preencher formulário de atualização com dados atuais
    const form = document.getElementById('editClienteForm');
    if (form) {
      // Lista de campos para preencher
      const campos = [
        'codigo', 'loja', 'razao', 'tipo', 'nomefantasia', 'finalidade',
        'cnpj', 'cep', 'pais', 'estado', 'codmunicipio', 'cidade',
        'endereco', 'bairro', 'ddd', 'telefone', 'abertura', 
        'contato', 'email', 'homepage'
      ];
      
      campos.forEach(campo => {
        const input = form.querySelector(`[name="${campo}"]`);
        if (input) {
          // Formatação especial para data
          if (campo === 'abertura' && cliente[campo]) {
            const data = new Date(cliente[campo]);
            input.value = data.toISOString().split('T')[0];
          } else {
            input.value = cliente[campo] || '';
          }
        }
      });
      
      // Mostrar modal de atualização
      mostrarModal(modalEditCliente);
      console.log('✅ Modal de atualização aberto com dados preenchidos');
    } else {
      console.error('❌ Formulário de atualização não encontrado');
    }
    
  } catch (error) {
    console.error('❌ Erro ao carregar cliente para atualização:', error);
    alert('❌ Erro ao carregar dados do cliente para atualização.');
  }
}

// ========== FUNÇÃO PARA PROCESSAR ATUALIZAÇÃO ==========
editClienteForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  if (!clienteParaEditar) {
    console.warn('⚠️ Nenhum cliente selecionado para atualização');
    alert('⚠️ Erro: Nenhum cliente selecionado para atualização.');
    return;
  }
  
  console.log('💾 Processando atualização do cliente...');
  
  // Coleta dados do formulário de atualização
  const formData = new FormData(editClienteForm);
  const dadosAtualizados = Object.fromEntries(formData.entries());
  
  console.log('📋 Dados para atualização:', dadosAtualizados);
  console.log('🎯 Cliente original:', clienteParaEditar);
  
  // Mostrar indicador de carregamento
  const botaoSubmit = editClienteForm.querySelector('button[type="submit"]');
  const textoOriginal = botaoSubmit.innerHTML;
  botaoSubmit.innerHTML = '⏳ Atualizando...';
  botaoSubmit.disabled = true;
  
  try {
    const response = await fetch(`/clientes/${clienteParaEditar.codigo}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosAtualizados)
    });
    
    const resultado = await response.json();
    
    if (response.ok) {
      console.log('✅ Cliente atualizado com sucesso:', resultado);
      alert('✅ Cliente atualizado com sucesso!');
      
      // Fechar modal e recarregar tabela
      fecharTodosModais();
      await carregarClientes();
      
    } else {
      console.error('❌ Erro na atualização:', resultado);
      alert(`❌ Erro ao atualizar cliente: ${resultado.error || 'Erro desconhecido'}`);
    }
    
  } catch (error) {
    console.error('❌ Erro na requisição de atualização:', error);
    alert('❌ Erro ao atualizar cliente. Verifique sua conexão.');
  } finally {
    // Restaurar botão
    botaoSubmit.innerHTML = textoOriginal;
    botaoSubmit.disabled = false;
  }
});

// ========== FUNÇÃO PARA ABRIR MODAL DE CONFIRMAÇÃO DE EXCLUSÃO ==========
async function abrirModalConfirmacao(codigoCliente) {
  console.log(`🗑️ Preparando exclusão do cliente: ${codigoCliente}`);
  
  try {
    const response = await fetch(`/clientes/${codigoCliente}`);
    
    if (!response.ok) {
      throw new Error(`Cliente não encontrado: ${response.status}`);
    }
    
    const cliente = await response.json();
    clienteParaExcluir = cliente;
    
    console.log('📋 Cliente para exclusão:', cliente);
    
    // Preencher modal de confirmação
    confirmContent.innerHTML = `
      <p><strong>Tem certeza que deseja excluir este cliente?</strong></p>
      <p><strong>Código:</strong> ${cliente.codigo || 'N/A'}</p>
      <p><strong>Loja:</strong> ${cliente.loja || 'N/A'}</p>
      <p><strong>Razão Social:</strong> ${cliente.razao || 'N/A'}</p>
      <p><strong>Nome Fantasia:</strong> ${cliente.nomefantasia || 'N/A'}</p>
      <p><strong>Cidade:</strong> ${cliente.cidade || 'N/A'}/${cliente.estado || 'N/A'}</p>
      <p><strong>Telefone:</strong> ${cliente.telefone || 'N/A'}</p>
      <div class="warning-text">⚠️ Esta ação não pode ser desfeita!</div>
    `;
    
    // Mostrar modal de confirmação
    mostrarModal(modalConfirmDelete);
    
  } catch (error) {
    console.error('❌ Erro ao carregar cliente para exclusão:', error);
    alert('❌ Erro ao carregar dados do cliente.');
  }
}

// ========== FUNÇÃO PARA CONFIRMAR EXCLUSÃO ==========
confirmDeleteBtn.addEventListener('click', async () => {
  if (!clienteParaExcluir) {
    console.warn('⚠️ Nenhum cliente selecionado para exclusão');
    return;
  }
  
  console.log(`🗑️ Excluindo cliente: ${clienteParaExcluir.codigo}`);
  
  try {
    const response = await fetch(`/clientes/${clienteParaExcluir.codigo}`, {
      method: 'DELETE'
    });
    
    const resultado = await response.json();
    
    if (response.ok) {
      console.log('✅ Cliente excluído:', resultado);
      alert('✅ Cliente excluído com sucesso!');
      
      // Fechar modal e recarregar tabela
      fecharTodosModais();
      await carregarClientes();
      
    } else {
      console.error('❌ Erro na exclusão:', resultado);
      alert(`❌ Erro ao excluir cliente: ${resultado.error || 'Erro desconhecido'}`);
    }
    
  } catch (error) {
    console.error('❌ Erro na requisição de exclusão:', error);
    alert('❌ Erro ao excluir cliente. Verifique a conexão.');
  }
});

// ========== EVENT LISTENER PARA O SELECT DE AÇÕES ==========
document.addEventListener('change', async (e) => {
  // Verificar se o elemento que mudou é um select de ações
  if (e.target.classList.contains('action-select')) {
    const codigoCliente = e.target.dataset.id;
    const acao = e.target.value;
    
    console.log(`🎯 Ação selecionada: ${acao} para cliente: ${codigoCliente}`);
    
    // Resetar select imediatamente
    e.target.value = '';
    
    // Executar ação baseada na seleção
    switch (acao) {
      case 'visualizar':
        await visualizarCliente(codigoCliente);
        break;
        
      case 'atualizar':
        await atualizarCliente(codigoCliente);
        break;
        
      case 'excluir':
        await abrirModalConfirmacao(codigoCliente);
        break;
        
      default:
        console.log('ℹ️ Nenhuma ação selecionada');
        break;
    }
  }
});

// ========== INICIALIZAÇÃO ==========
console.log('🚀 Script carregado! Inicializando sistema...');

// Carregar clientes quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 DOM carregado, iniciando sistema...');
  carregarClientes();
});

// Fallback: carregar clientes imediatamente
carregarClientes();

console.log('✅ Sistema inicializado com sucesso!');