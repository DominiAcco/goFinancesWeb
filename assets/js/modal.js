// assets/js/modal.js

let tipoSelecionado = 'entrada';

const modal = document.getElementById('modal');
const btnAbrirModal = document.querySelector('.btn-nova-transacao');
const btnFecharModal = document.querySelector('.btn-fechar-modal');
const btnCadastrar = document.querySelector('.btn-cadastrar');
const entradaBtn = document.querySelector('.type-button.entrada');
const saidaBtn = document.querySelector('.type-button.saida');

function initModalListeners() {
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

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}
