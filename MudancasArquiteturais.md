# Evolução Arquitetural - Sistema de Lava Rápido (SaaS)

Este documento detalha as melhorias implementadas para transformar o sistema em uma plataforma SaaS completa.

## 1. Módulo de Agendamentos
**Implementação:** Criada estrutura para gerenciar agendamentos futuros vinculados a clientes e veículos.
- **Status:** Pendente, Confirmado, Cancelado, Concluído.
- **Objetivo:** Permitir a organização prévia do fluxo de trabalho.

## 2. Gestão de Funcionários e Comissões
**Implementação:** Novo modelo de dados para funcionários com percentual de comissão configurável.
- **Lógica:** Cada serviço pode ser vinculado a um funcionário, gerando automaticamente um registro de comissão no ato do pagamento/conclusão.

## 3. Controle de Despesas e Lucro Líquido
**Implementação:** Módulo de despesas categorizadas (Aluguel, Produtos, Salários).
- **Dashboard:** O Dashboard agora calcula o **Lucro Líquido** (Faturamento - Despesas) em tempo real, permitindo uma visão clara da saúde financeira do negócio.

## 4. Tabela de Preços Dinâmica
**Implementação:** Tela de serviços com preços e categorias pré-definidas.
- **Vantagem:** Padronização dos valores cobrados e facilidade na seleção de serviços durante o atendimento.

## 5. Histórico do Cliente
**Implementação:** Componente que lista todos os serviços já realizados por um cliente, independente do veículo.
- **Valor de Negócio:** Permite entender o perfil de consumo do cliente e oferecer promoções personalizadas.

## 6. Arquitetura de Dados (Back-end)
**Implementação:** O `db.json` foi expandido para suportar todas as relações SaaS, garantindo integridade referencial entre Clientes, Veículos, Serviços, Pagamentos, Funcionários e Comissões.
