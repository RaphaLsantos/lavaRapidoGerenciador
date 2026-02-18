# Evolução Arquitetural - Sistema de Lava Rápido

Este documento detalha as melhorias implementadas no sistema para torná-lo mais profissional, escalável e robusto.

## 1. Desacoplamento de Pagamentos
**Decisão:** Removemos o campo booleano `pago` do modelo de `Servico` e criamos uma entidade independente `Pagamento`.
- **Por que?** Em sistemas reais, um serviço pode ser pago em múltiplas parcelas ou diferentes formas de pagamento. Ter uma tabela/entidade separada permite rastrear o histórico financeiro completo (quem pagou, quando, como e quanto).
- **Lógica de Quitação:** Um serviço agora é considerado quitado apenas se a soma de seus pagamentos for maior ou igual ao seu valor total **E** se o status do serviço for "Finalizado".

## 2. Gestão de Status de Serviço
**Decisão:** Implementamos o campo `status` com os estados `"Em andamento"` e `"Finalizado"`.
- **Por que?** Garante o controle operacional. Um serviço não pode ser considerado "concluído financeiramente" se ainda está sendo executado. Isso separa a regra de negócio operacional da regra financeira.

## 3. Hooks Customizados Especializados
**Decisão:** Criação do `usePagamentos` e refatoração do `useServicos`.
- **Por que?** Seguindo o princípio de responsabilidade única (SRP), cada hook gerencia seu próprio domínio de dados. Isso facilita a manutenção e permite que diferentes partes do sistema consumam dados financeiros sem carregar lógica de serviços desnecessária.

## 4. Dashboard Inteligente e Filtros Temporais
**Decisão:** Implementação de filtros por Mês/Ano e cálculos dinâmicos de caixa.
- **Por que?** Para um SaaS, a visão temporal é crítica. O sistema agora calcula:
    - **Total Faturado:** Soma real de dinheiro que entrou no caixa no período selecionado.
    - **Total Pendente:** Valor de serviços finalizados que ainda não foram totalmente pagos.
    - **Caixa Diário:** Monitoramento em tempo real do faturamento do dia atual.

## 5. Tipagem Forte com TypeScript
**Decisão:** Uso de `type` e `interface` rigorosos para todos os modelos.
- **Por que?** Reduz erros em tempo de desenvolvimento e serve como documentação viva do sistema. O uso de `ISO Strings` para datas garante compatibilidade universal e facilidade de ordenação/filtragem.

## 6. Componentização de Serviços
**Decisão:** Criação do componente `Servicos.tsx` para gerenciar a lógica dentro da visualização do veículo.
- **Por que?** Melhora a legibilidade da página de Clientes e permite reutilizar a lógica de gestão de serviços em outras partes do sistema futuramente.
