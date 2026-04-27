# 🚗 Lava Jato Gerenciador

O **Lava Jato Gerenciador** é uma solução completa para a gestão de estabelecimentos de estética automotiva. Desenvolvido com tecnologias modernas, o sistema permite o controle total de clientes, veículos, agendamentos, serviços e financeiro em uma interface intuitiva e responsiva.

---

## 🚀 Funcionalidades

-   **📊 Dashboard Inteligente**: Visualize métricas em tempo real, como faturamento, serviços realizados e despesas.
-   **👥 Gestão de Clientes**: Cadastro completo de clientes com histórico de serviços e veículos vinculados.
-   **🚘 Controle de Veículos**: Gerencie a frota de seus clientes (modelo, placa, cor).
-   **📅 Agendamentos**: Sistema de reserva de horários para otimizar o fluxo de trabalho.
-   **🛠️ Gestão de Serviços**: Controle de serviços em andamento, finalizados e agendados.
-   **💰 Financeiro**: Registro de entradas (pagamentos) e saídas (despesas), além de cálculo automático de comissões para funcionários.
-   **📋 Tabela de Preços**: Personalize seus serviços e valores por categoria.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando o que há de mais moderno no ecossistema Web:

-   **[React 19](https://react.dev/)**: Biblioteca principal para construção da interface.
-   **[TypeScript](https://www.typescriptlang.org/)**: Tipagem estática para maior segurança e produtividade.
-   **[Vite](https://vitejs.dev/)**: Ferramenta de build ultra-rápida.
-   **[Tailwind CSS](https://tailwindcss.com/)**: Estilização moderna e responsiva.
-   **[React Router 7](https://reactrouter.com/)**: Gerenciamento de rotas e navegação.
-   **[Recharts](https://recharts.org/)**: Visualização de dados através de gráficos dinâmicos.
-   **[Axios](https://axios-http.com/)**: Cliente HTTP para consumo de APIs.
-   **[JSON Server](https://github.com/typicode/json-server)**: Simulação de API REST para persistência de dados.

---

## 💻 Como Clonar e Executar

Siga os passos abaixo para configurar o projeto em sua máquina local:

### Pré-requisitos

Certifique-se de ter instalado:
-   [Node.js](https://nodejs.org/) (Versão 18 ou superior)
-   [pnpm](https://pnpm.io/) (ou npm/yarn)

### 1. Clonar o Repositório

Abra o terminal e execute:
```bash
git clone https://github.com/RaphaLsantos/lavaRapidoGerenciador.git
cd lavaRapidoGerenciador
```

### 2. Instalar Dependências

Entre na pasta do projeto e instale os pacotes:
```bash
cd LavaRapidoGerenciador
pnpm install
# ou
npm install
```

### 3. Executar a API (Backend Simulado)

O projeto utiliza o `json-server` para simular o banco de dados. Em um terminal separado, execute:
```bash
pnpm exec json-server --watch db.json --port 3001
```
*Nota: Certifique-se de que a API esteja rodando na porta 3001 ou conforme configurado no arquivo de serviço.*

### 4. Executar o Frontend

No terminal principal, inicie o servidor de desenvolvimento:
```bash
pnpm run dev
```

O site estará disponível em `http://localhost:5173` (ou na porta indicada pelo Vite).

---

## 📂 Estrutura do Projeto

```text
src/
├── components/     # Componentes reutilizáveis (UI, Layout, Modais)
├── contexts/       # Contextos do React (Tema, Autenticação)
├── hooks/          # Hooks customizados para lógica de negócios
├── pages/          # Páginas principais da aplicação
├── services/       # Configuração de API e LocalStorage
├── types/          # Definições de interfaces TypeScript
└── routes/         # Configuração de rotas
```

---

## 🤝 Contribuição

Contribuições são sempre bem-vindas!
1. Faça um **Fork** do projeto.
2. Crie uma **Branch** para sua funcionalidade (`git checkout -b feature/NovaFuncionalidade`).
3. Faça o **Commit** de suas alterações (`git commit -m 'Adicionando nova funcionalidade'`).
4. Faça o **Push** para a Branch (`git push origin feature/NovaFuncionalidade`).
5. Abra um **Pull Request**.

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---
Desenvolvido por [Raphael Silva](https://github.com/RaphaLsantos) 🚀
