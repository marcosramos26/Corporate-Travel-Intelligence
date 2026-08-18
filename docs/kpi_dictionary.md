# Dicionário de KPIs

As medidas abaixo foram extraídas da tabela `_Medidas.tmdl`.

| Medida | Categoria | Definição | Fórmula DAX | Formato | Interpretação |
|---|---|---|---|---|---|
| `Gasto Total` | Executivo / Financeiro | Soma do gasto total realizado em viagens | `SUM(viagens_raw[gasto_total_realizado])` | Moeda BRL | Valor realizado no contexto filtrado |
| `Orçado` | Executivo / Financeiro | Soma do orçamento | `SUM(orcamento_raw[orcado])` | Moeda BRL | Base orçamentária comparável ao realizado |
| `Desvio R$` | Executivo / Financeiro | Diferença entre realizado e orçado | `[Gasto Total] - [Orçado]` | Moeda | Positivo indica estouro; negativo indica economia |
| `Desvio %` | Executivo / Financeiro | Desvio proporcional ao orçamento | `DIVIDE([Desvio R$], [Orçado], 0)` | Percentual | Intensidade relativa do desvio |
| `Qtd Viagens` | Executivo | Quantidade distinta de viagens | `DISTINCTCOUNT(viagens_raw[viagem_id])` | Número inteiro | Volume de viagens no contexto |
| `Ticket Médio` | Executivo / Financeiro | Gasto médio por viagem | `DIVIDE([Gasto Total], [Qtd Viagens], 0)` | Moeda BRL | Valor médio realizado por viagem |
| `Saving Estimado` | Financeiro / Eficiência | Soma do saving estimado | `SUM(viagens_raw[saving_estimado])` | Moeda BRL | Economia estimada em relação à referência |
| `Taxa Fora da Política` | Compliance | Percentual de viagens fora da política | `DIVIDE(CALCULATE([Qtd Viagens], viagens_raw[fora_politica] = TRUE()), [Qtd Viagens], 0)` | Percentual | Quanto maior, maior risco de conformidade |
| `Antecedência Média` | Eficiência | Média de dias de antecedência | `AVERAGE(viagens_raw[antecedencia_dias])` | Número decimal | Antecedência média de compra |
| `% Compras < 7 dias` | Eficiência / Compliance | Percentual de viagens compradas com menos de 7 dias | `DIVIDE(CALCULATE([Qtd Viagens], viagens_raw[antecedencia_dias] < 7), [Qtd Viagens], 0)` | Percentual | Sinaliza compras potencialmente menos eficientes |
| `Tempo Médio Aprovação` | Processo | Média do tempo de aprovação em horas | `AVERAGE(viagens_raw[tempo_aprovacao_horas])` | Número decimal | Velocidade do fluxo de aprovação |
| `Tarifa Média Aérea` | Aéreo | Média do valor aéreo realizado | `AVERAGE(aereo_raw[valor_aereo_realizado])` | Moeda BRL | Custo médio de passagens |
| `Diária Média Hotel` | Hospedagem | Média do valor da diária | `AVERAGE(hospedagem_raw[valor_diaria])` | Moeda | Custo médio de hospedagem por diária |
| `Taxa de Remarcação` | Aéreo / Processo | Percentual de viagens remarcadas | `DIVIDE(CALCULATE([Qtd Viagens], viagens_raw[remarcada] = TRUE()), [Qtd Viagens], 0)` | Percentual | Indica retrabalho e possível custo adicional |
| `Taxa de Cancelamento` | Aéreo / Processo | Percentual de registros aéreos cancelados | `DIVIDE(CALCULATE(COUNTROWS(aereo_raw), aereo_raw[cancelada] = TRUE()), COUNTROWS(aereo_raw), 0)` | Percentual | Indica incidência de cancelamento na base aérea |
| `Noites Médias` | Hospedagem | Média de diárias | `AVERAGE(hospedagem_raw[diarias])` | Número decimal | Duração média de hospedagem |
| `Gasto Médio Reembolso` | Financeiro | Média das despesas reembolsáveis por viagem | `AVERAGE(viagens_raw[valor_despesas_reembolsaveis])` | Moeda BRL | Custo médio de reembolso |
| `Gasto Fora da Política` | Compliance / Financeiro | Gasto total em viagens fora da política | `CALCULATE([Gasto Total], viagens_raw[fora_politica] = TRUE())` | Moeda BRL | Exposição financeira ligada a não conformidade |
| `Custo Remarcações` | Aéreo / Financeiro | Soma das taxas de remarcação | `SUM(aereo_raw[taxa_remarcacao])` | Moeda BRL | Custo direto com remarcações |
| `Custo Cancelamentos` | Aéreo / Financeiro | Soma das taxas de cancelamento | `SUM(aereo_raw[taxa_cancelamento])` | Moeda BRL | Custo direto com cancelamentos |
| `Saving %` | Financeiro / Eficiência | Saving estimado dividido pelo valor de referência | `DIVIDE([Saving Estimado], SUM(viagens_raw[valor_referencia]), 0)` | Percentual | Eficiência relativa contra referência |

## Observações

- As fórmulas foram preservadas integralmente.
- A interpretação do desvio segue a regra confirmada no modelo: realizado menos orçado.
- A medida `Diária Média Hotel` usa formatação de moeda diferente de algumas medidas BRL no TMDL, com hint `es-US`; isso pode ser revisado futuramente se houver necessidade visual.
