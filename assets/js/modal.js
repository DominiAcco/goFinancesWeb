// Configurações
const API_URL = 'http://localhost:3000/api/v1/transacao';
let tipoSelecionado = 'entrada';

// Elementos do DOM
const modal = document.getElementById('modal');
const btnAbrirModal = document.querySelector('.btn-nova-transacao');
const btnFecharModal = document.querySelector('.btn-fechar-modal');
const btnCadastrar = document.querySelector('.btn-cadastrar');
const entradaBtn = document.querySelector('.type-button.entrada');
const saidaBtn = document.querySelector('.type-button.saida');

// Função para formatar data (DD/MM)
function formatarData(dataString) {
  if (!dataString) return '--/--';
  
  try {
    const data = new Date(dataString);
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    return `${dia}/${mes}`;
  } catch (e) {
    console.error('Erro ao formatar data:', dataString, e);
    return '--/--';
  }
}

// Função para obter o nome do mês
function obterNomeMes(dataString) {
  if (!dataString) return '--';
  
  try {
    const meses = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    
    const data = new Date(dataString);
    return meses[data.getMonth()];
  } catch (e) {
    console.error('Erro ao obter mês:', dataString, e);
    return '--';
  }
}

// Função para carregar transações
async function carregarTransacoes() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Erro ao carregar transações');
    const transacoes = await response.json();
    
    const tabela = document.getElementById('corpo-tabela');
    tabela.innerHTML = '';
    
    transacoes.forEach(transacao => {
      const linha = document.createElement('tr');
      linha.innerHTML = `
        <td>${transacao.titulo}</td>
        <td class="${transacao.tipo}">R$ ${Number(transacao.preco).toFixed(2)}</td>
        <td>${transacao.categoria}</td>
        <td>${new Date(transacao.data).toLocaleDateString('pt-BR')}</td>
      `;
      tabela.appendChild(linha);
    });
    
    // Atualizar os totais
    await atualizarTotais();
  } catch (error) {
    console.error('Erro ao carregar transações:', error);
    alert('Falha ao carregar transações. Verifique o console.');
  }
}

// Função para atualizar os totais
async function atualizarTotais() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Erro ao carregar totais');
    const transacoes = await response.json();

    // Filtrar entradas e saídas
    const entradas = transacoes.filter(t => t.tipo === 'entrada');
    const saidas = transacoes.filter(t => t.tipo === 'saida');

    // Calcular totais
    const totalEntradas = entradas.reduce((total, t) => total + Number(t.preco), 0);
    const totalSaidas = saidas.reduce((total, t) => total + Number(t.preco), 0);
    const totalGeral = totalEntradas - totalSaidas;

    // Encontrar últimas datas
    const ultimaEntrada = entradas.length > 0 
      ? entradas[entradas.length - 1].data 
      : null;
      
    const ultimaSaida = saidas.length > 0 
      ? saidas[saidas.length - 1].data 
      : null;
      
    const ultimaAtualizacao = transacoes.length > 0 
      ? transacoes[transacoes.length - 1].data 
      : null;

    // Atualizar cards
    document.getElementById('total-entradas').textContent = `R$ ${totalEntradas.toFixed(2)}`;
    document.getElementById('total-saidas').textContent = `R$ ${totalSaidas.toFixed(2)}`;
    document.getElementById('total-geral').textContent = `R$ ${totalGeral.toFixed(2)}`;
    
    // Atualizar informações de data
    const infoTexts = document.querySelectorAll('.info-text');
    
    if (entradas.length > 0) {
      infoTexts[0].textContent = `Última entrada dia ${formatarData(ultimaEntrada)}`;
    } else {
      infoTexts[0].textContent = 'Última entrada dia --/--';
    }
    
    if (saidas.length > 0) {
      infoTexts[1].textContent = `Última saída dia ${formatarData(ultimaSaida)}`;
    } else {
      infoTexts[1].textContent = 'Última saída dia --/--';
    }
    
    if (transacoes.length > 0) {
      const dataAtualizacao = new Date(ultimaAtualizacao);
      const dia = dataAtualizacao.getDate();
      const mes = obterNomeMes(ultimaAtualizacao);
      infoTexts[2].textContent = `Atualizado em ${dia} de ${mes}`;
    } else {
      infoTexts[2].textContent = 'Atualizado em --/--';
    }
    
  } catch (error) {
    console.error('Erro ao atualizar totais:', error);
  }
}

// Função para cadastrar transação
async function cadastrarTransacao() {
  const titulo = document.getElementById('titulo').value;
  const preco = parseFloat(document.getElementById('preco').value);
  const categoria = document.getElementById('categoria').value;
  const data = new Date().toISOString();

  if (!titulo || isNaN(preco) || !categoria) {
    alert('Preencha todos os campos corretamente!');
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        titulo,
        preco,
        categoria,
        data,
        tipo: tipoSelecionado
      })
    });

    if (!response.ok) {
      const erro = await response.json();
      throw new Error(erro.erro || 'Erro ao criar transação');
    }

    // Limpar formulário
    document.getElementById('titulo').value = '';
    document.getElementById('preco').value = '';
    document.getElementById('categoria').value = '';

    // Fechar modal
    modal.classList.remove('active');

    // Recarregar transações
    await carregarTransacoes();

    alert('Transação cadastrada com sucesso!');
  } catch (error) {
    console.error('Erro ao cadastrar transação:', error);
    alert(error.message || 'Erro ao cadastrar transação. Verifique o console.');
  }
}

// Event Listeners
function initEventListeners() {
  btnAbrirModal.addEventListener('click', () => {
    modal.classList.add('active');
  });

  btnFecharModal.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  entradaBtn.addEventListener('click', () => {
    tipoSelecionado = 'entrada';
    entradaBtn.classList.add('active');
    saidaBtn.classList.remove('active');
  });

  saidaBtn.addEventListener('click', () => {
    tipoSelecionado = 'saida';
    saidaBtn.classList.add('active');
    entradaBtn.classList.remove('active');
  });

  btnCadastrar.addEventListener('click', cadastrarTransacao);

  // Fechar modal ao clicar fora do conteúdo
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM carregado');
  
  // Iniciar com o botão de entrada ativo
  entradaBtn.classList.add('active');
  saidaBtn.classList.remove('active');

  // Configurar event listeners
  initEventListeners();

  // Carregar transações iniciais
  carregarTransacoes();
});