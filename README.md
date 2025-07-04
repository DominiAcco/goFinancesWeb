#  goFinances Web

Aplicação web para controle financeiro pessoal, onde é possível registrar entradas e saídas, além de visualizar o saldo total com base em transações cadastradas. Inspirado no layout e funcionamento da versão mobile, com atualização em tempo real utilizando API REST.

---

##  Funcionalidades

- Cadastro de novas transações (entradas e saídas)
- Listagem das transações registradas
- Exibição dos totais:
  - Entradas
  - Saídas
  - Total geral
- Exibição do período da última entrada e saída
- Modal interativo para cadastro
- Integração com API em Node.js + PostgreSQL

---

##  Layout

###  Cards

- Mostram o total de **Entradas**, **Saídas** e **Total Geral**
- Exibem também as datas da **última entrada**, **última saída** e o **período do total**

### Tabela de Transações

- Lista todas as transações com:
  - Título
  - Valor (verde para entrada, vermelho para saída)
  - Categoria
  - Data formatada (DD/MM/YYYY)

---
```bash
goFinances/
├── assets/
│ ├── css/
│ │ ├── styles.css
│ │ └── modal.css
| ├── images/
|  | Arthur.png
│ └── js/
│ ├── script.js
│ └── modal.js
├── index.html # Página principal
└── README.md
```
 Como executar

### Pré-requisitos:

- Node.js
- PostgreSQL
- Navegador moderno

---

###  Passo a passo:

#### 1. Clone o repositório

```bash
git clone https://github.com/DominiAcco/goFinancesWeb
cd goFinancesWeb
npm i
git checkout webFinal
