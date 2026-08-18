# Modelagem

## Estrutura

O modelo combina tabelas factuais de viagens, despesas, aéreo, hospedagem e orçamento com dimensões de viajantes, centros de custo e calendário.

## Tabelas

| Tabela | Papel | Grão |
|---|---|---|
| `viagens_raw` | Fato principal | Uma viagem/solicitação consolidada |
| `despesas_raw` | Fato de despesas | Uma despesa |
| `aereo_raw` | Fato/atributo de aéreo | Um registro aéreo por viagem |
| `hospedagem_raw` | Fato/atributo de hospedagem | Um registro de hospedagem por viagem |
| `orcamento_raw` | Fato orçamentária | Um orçamento mensal por centro de custo |
| `viajantes_raw` | Dimensão cadastral | Um viajante |
| `centros_custo_raw` | Dimensão organizacional | Um centro de custo |
| `DimData` | Dimensão calendário | Um dia |
| `_Medidas` | Tabela técnica | Medidas DAX centralizadas |

## Relacionamentos Confirmados

| De | Para | Observação |
|---|---|---|
| `orcamento_raw[centro_custo_id]` | `centros_custo_raw[centro_custo_id]` | Relacionamento por centro de custo |
| `viagens_raw[viajante_id]` | `viajantes_raw[viajante_id]` | Cadastro de viajantes |
| `viagens_raw[viagem_id]` | `aereo_raw[viagem_id]` | `viagens_raw` no lado 1, filtro bidirecional |
| `viagens_raw[viagem_id]` | `hospedagem_raw[viagem_id]` | `viagens_raw` no lado 1, filtro bidirecional |
| `despesas_raw[viagem_id]` | `viagens_raw[viagem_id]` | Despesas vinculadas à viagem |
| `viagens_raw[centro_custo_id]` | `centros_custo_raw[centro_custo_id]` | Organização por centro de custo |
| `viagens_raw[data_ida]` | `DimData[Data]` | Data principal da viagem |
| `orcamento_raw[mes_referencia]` | `DimData[Data]` | Comparação temporal orçamento x realizado |

O Auto Date/Time foi desativado no TMDL, removendo as tabelas locais automáticas de data. O modelo passa a depender da `DimData` explícita para análise temporal principal.

## DimData

`DimData` é calculada no modelo com:

- Início: 01/01/2024
- Fim: 31/12/2025
- Colunas: `Data`, `Ano`, `MesNumero`, `Mes`, `AnoMes`, `Trimestre`
- `Mes` ordenado por `MesNumero`

## Decisões de Modelagem

- Medidas centralizadas na tabela `_Medidas` para facilitar manutenção e leitura.
- `Desvio R$ = [Gasto Total] - [Orçado]`, portanto valor positivo representa estouro de orçamento e valor negativo representa economia.
- Uso de `DimData` para alinhar realizado e orçamento no mesmo eixo temporal.
- Auto Date/Time desativado para reduzir ruído e privilegiar calendário controlado.
- Modelo mantido simples para clareza semântica e uso como case de portfólio.

## Pontos de Atenção

- As consultas usam caminhos absolutos para os CSVs, o que pode exigir ajuste ao clonar o repositório.
- Ao abrir o projeto no Power BI Desktop, valide se as configurações do arquivo mantiveram o Auto Date/Time desligado.
