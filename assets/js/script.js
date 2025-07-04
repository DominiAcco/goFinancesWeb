// assets/js/script.js

document.addEventListener('DOMContentLoaded', () => {
  const API_URL = 'http://localhost:3000/api/v1/transacao';
  let tipoSelecionado = 'entrada';

  // Elementos do DOM
  const modal = document.getElementById('modal');
  const btnAbrirModal = document.querySelector('.btn-nova-transacao');
  const btnFecharModal = document.querySelector('.btn-fechar-modal');
  const btnCadastrar = document.querySelector('.btn-cadastrar');
  const entradaBtn = document.querySelector('.type-button.entrada');
  const saidaBtn = document.querySelector('.type-button.saida');
  const tabelaCorpo = document.getElementById('corpo-tabela');
  const totalEntradasEl = document.getElementById('total-entradas');
  const totalSaidasEl = document.getElementById('total-saidas');
  const totalGeralEl = document.getElementById('total-geral');
  const infoTexts = document.querySelectorAll('.info-text');

  // Abrir/fechar modal
  btnAbrirModal.addEventListener('click', () => modal.classList.add('active'));
  btnFecharModal.addEventListener('click', () => modal.classList.remove('active'));
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('active'); });

  // Seleção de tipo
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

  // Formatadores de data
  function formatarData(dataString) {
    const date = new Date(dataString);
    if (isNaN(date)) return '--/--';
    return date.toLocaleDateString('pt-BR');
  }

  function formatarDiaMes(dataString) {
    const date = new Date(dataString);
    if (isNaN(date)) return '--/--';
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = date.toLocaleString('pt-BR', { month: 'long' });
    return `${dia} de ${mes}`;
  }

  // Carregar transações
  async function carregarTransacoes() {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const transacoes = await res.json();

      // Preencher tabela
      tabelaCorpo.innerHTML = '';
      transacoes.forEach(t => {
        const tr = document.createElement('tr');
        tr.classList.add(t.tipo);
        tr.innerHTML = `
          <td>${t.titulo}</td>
          <td class="${t.tipo === 'entrada' ? 'income' : 'outcome'}">
            R$ ${Number(t.preco).toFixed(2)}
          </td>
          <td>${t.categoria}</td>
          <td>${formatarData(t.data)}</td>
        `;
        tabelaCorpo.appendChild(tr);
      });

      // Atualizar cards
      const entradas = transacoes.filter(t => t.tipo === 'entrada');
      const saidas = transacoes.filter(t => t.tipo === 'saida');
      const soma = arr => arr.reduce((acc, x) => acc + Number(x.preco), 0);
      const totalEnt = soma(entradas);
      const totalSai = soma(saidas);

      totalEntradasEl.textContent = `R$ ${totalEnt.toFixed(2)}`;
      totalSaidasEl.textContent   = `R$ ${totalSai.toFixed(2)}`;
      totalGeralEl.textContent    = `R$ ${(totalEnt - totalSai).toFixed(2)}`;

      // Período: mais antiga e mais recente
      const maisRecente = transacoes[0]?.data;
      const maisAntiga  = transacoes[transacoes.length - 1]?.data;

      infoTexts[0].textContent = entradas.length > 0
        ? `Última entrada dia ${formatarDiaMes(entradas[0].data)}`
        : 'Nenhuma entrada registrada';

      infoTexts[1].textContent = saidas.length > 0
        ? `Última saída dia ${formatarDiaMes(saidas[0].data)}`
        : 'Nenhuma saída registrada';

      infoTexts[2].textContent = (maisAntiga && maisRecente)
        ? `De ${formatarDiaMes(maisAntiga)} a ${formatarDiaMes(maisRecente)}`
        : 'Não há transações registradas';

    } catch (err) {
      console.error('Erro ao carregar transações:', err);
      tabelaCorpo.innerHTML = '<tr><td colspan="4">Erro ao carregar transações</td></tr>';
      infoTexts[0].textContent = 'Nenhuma entrada registrada';
      infoTexts[1].textContent = 'Nenhuma saída registrada';
      infoTexts[2].textContent = 'Não há transações registradas';
    }
  }

  // Cadastrar transação
  btnCadastrar.addEventListener('click', async () => {
    const titulo = document.getElementById('titulo').value.trim();
    const preco  = parseFloat(document.getElementById('preco').value);
    const categoria = document.getElementById('categoria').value.trim();

    if (!titulo || isNaN(preco) || !categoria) {
      alert('Preencha todos os campos corretamente!');
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, preco, categoria, data: new Date().toISOString(), tipo: tipoSelecionado })
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);

      // Resetar form
      document.getElementById('titulo').value = '';
      document.getElementById('preco').value = '';
      document.getElementById('categoria').value = '';
      modal.classList.remove('active');

      await carregarTransacoes();
    } catch (err) {
      console.error('Erro ao cadastrar transação:', err);
      alert('Falha ao cadastrar transação. Veja o console');
    }
  });

  // Inicialização
  carregarTransacoes();
});
