# Automação PBIR e IA Aplicada

## Por que PBIP/PBIR

PBIP/PBIR transforma o relatório Power BI em uma estrutura de arquivos legíveis por ferramentas de versionamento. Isso permite auditar páginas, visuais, posições, propriedades de formatação e vínculo com o modelo semântico.

## Estrutura Confirmada

- `Corporate_Travel_Intelligence.Report/definition/pages/pages.json`: ordem e página ativa.
- `Corporate_Travel_Intelligence.Report/definition/pages/60bf25af6c012497cd0a/page.json`: página `01 - Visão Executiva`.
- `Corporate_Travel_Intelligence.Report/definition/pages/60bf25af6c012497cd0a/visuals/*/visual.json`: configuração de cada visual.
- `Corporate_Travel_Intelligence.Report/definition.pbir`: referência ao modelo semântico por caminho relativo.

## Página Executiva

Visuais confirmados na página:

| Pasta do visual | Tipo | Componente |
|---|---|---|
| `8faf69e5a3f40eda8ebb` | `cardVisual` | KPI Gasto Total |
| `4f0ae0ab608e226cee9f` | `cardVisual` | KPI Orçado |
| `1650cd17e0b0b103231d` | `cardVisual` | KPI Desvio % |
| `3abea10989ea2360636d` | `cardVisual` | KPI Qtd Viagens |
| `ffe326c0e7545c83e73b` | `cardVisual` | KPI Ticket Médio |
| `ef84ccc731e2caa3748b` | `lineChart` | Tendência mensal |
| `994b8a19d8658f7281a2` | `clusteredBarChart` | Gasto por área |
| `846cb390114782d48905` | `lineClusteredColumnComboChart` | Desvio por área |
| `29b28eaa0faaa7f9133a` | `slicer` | Filtro de Área |
| `d510f55e99586fe8325d` | `slicer` | Filtro de Período |
| `dca8c92c3e127ea5f2ba` | `shape` | Fundo do header |
| `f2664c4c49bff477becf` | `shape` | Título/subtítulo do header |
| `61306605f3ed82c8e18e`, `09492050012310606e0b`, `78bb94c6ab42a69d1ac2`, `7a39881df5606a5317c5`, `ae6e6bc5a6ace441df10` | `image` | Ícones dos KPIs |

Após a limpeza de portfólio, a página vazia `Página 1` foi removida do PBIR.

## Propriedades Manipuladas

Na rodada visual do projeto, foram usadas propriedades nativas de PBIR relacionadas a:

- posição e dimensão dos containers;
- cor de fundo da página;
- fundos e bordas de cards;
- título, subtítulo e rótulos;
- cores de séries;
- sombras leves;
- filtros integrados ao header;
- espaçamento e alinhamento.

## Controles para Evitar Quebra de Lógica

- Bindings de campos e medidas preservados.
- Medidas DAX não alteradas.
- Modelo semântico não alterado.
- CSVs não alterados.
- Validação por parse de JSON após edição.
- Backup criado antes das alterações visuais.

## Ganhos

- Camada visual tratada como código.
- Menos trabalho manual repetitivo no Power BI.
- Melhor rastreabilidade de alterações.
- Documentação clara para explicar o uso de IA com critério.

## Riscos e Limitações

- O schema PBIR ainda pode variar entre versões do Power BI.
- Algumas propriedades visuais aceitas em JSON podem renderizar de forma diferente no Desktop.
- Ajustes visuais precisam ser validados no Power BI Desktop com screenshot real.
- A automação não substitui validação de negócio, apenas acelera ajustes estruturais e documentação.
