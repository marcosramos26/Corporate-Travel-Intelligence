# ETL e Qualidade dos Dados

As transformações abaixo foram confirmadas nas partitions M dos arquivos TMDL do modelo semântico. O objetivo é documentar decisões relevantes, não cada clique do Power Query.

## Visão Geral

| Tabela | Problema | Transformação | Impacto |
|---|---|---|---|
| `viagens_raw` | Tipos mistos, datas inválidas, duplicidades, nulos e variantes textuais | Tipagem, reconstrução de data, remoção de duplicatas, merge com viajantes e padronização | Base central fica analisável por viagem |
| `despesas_raw` | Valores em localidade `en-US` e duplicidades por `despesa_id` | Conversão decimal, data/lógico e distinct por chave | 15.402 linhas brutas para 15.372 despesas distintas |
| `orcamento_raw` | Data e orçamento em tipos textuais/numéricos | Tipagem de data e decimal `en-US` | Orçamento apto a comparar com realizado por mês e centro de custo |
| `aereo_raw` | Companhias com grafias diferentes e valores numéricos | Conversão de tipos e substituição de variantes | Companhias consolidadas para análise |
| `hospedagem_raw` | Cidades e hotéis com grafias inconsistentes/vazios | Tipagem, padronização de cidades e hotel vazio para `Não Informado` | Hospedagem agrupável por cidade/hotel |
| `viajantes_raw` | Campo de risco numérico e ativo lógico | Conversão de tipos | Cadastro apto a relacionamento e enriquecimento |
| `centros_custo_raw` | Cabeçalhos e tipos | Promoção de cabeçalhos e tipagem textual | Dimensão organizacional confiável |

## viagens_raw

Problemas confirmados:

- 5.015 linhas no CSV bruto e 5.000 `viagem_id` distintos.
- 20 registros com `centro_custo_id` vazio no CSV.
- 20 registros com `motivo` vazio no CSV.
- Variações de área como `Adm`, `COMERCIAL`, `Operacoes`, `OPERAÇÕES`, `TI` e `TECNOLOGIA`.
- Erros em `data_compra` tratados no Power Query.
- Valores monetários sujeitos a artefatos de ponto flutuante.

Regras aplicadas:

- Converte IDs e campos descritivos para texto.
- Converte datas para `date`.
- Converte `antecedencia_dias` e `duracao_dias` para inteiro.
- Converte `remarcada` e `fora_politica` para lógico.
- Converte campos decimais com localidade `en-US`.
- Substitui erros de `data_compra` por nulo e reconstrói usando `data_ida - antecedencia_dias`.
- Remove duplicidades por `viagem_id`.
- Faz merge com `viajantes_raw` para recuperar `centro_custo_id` ausente.
- Preenche `motivo` vazio como `Não informado`.
- Padroniza áreas e destinos por igualdade exata.
- Arredonda campos monetários para 2 casas decimais.

## despesas_raw

Problemas confirmados:

- 15.402 linhas no CSV bruto.
- 15.372 `despesa_id` distintos.
- Categorias confirmadas: Ajuste de reembolso, Alimentação, Estacionamento, Outros, Pedágio, Taxa e Transporte terrestre.

Regras aplicadas:

- Converte `valor` com localidade `en-US`.
- Converte `data_despesa` para data.
- Converte `reembolsavel` para lógico.
- Remove duplicidades por `despesa_id`.

## orcamento_raw

Problemas confirmados:

- 552 linhas e 552 combinações distintas de `mes_referencia` + `centro_custo_id`.
- Áreas confirmadas: Administrativo, Comercial, Diretoria, Financeiro, Operações, RH e Tecnologia.

Regras aplicadas:

- Converte `mes_referencia` para data.
- Converte `orcado` com localidade `en-US`.

## aereo_raw

Problemas confirmados:

- Variações de companhias no CSV bruto: `Azul`, `AZUL`, `Azul Linhas Aéreas`, `GOL`, `gol`, `Gol Linhas Aéreas`, `LATAM`, `latam`, `LATAM Airlines`, `Latam Airlines` e vazios.

Regras aplicadas:

- Converte valores financeiros com localidade `en-US`.
- Converte `antecedencia_dias` para inteiro.
- Converte `remarcada` e `cancelada` para lógico.
- Padroniza companhias para `Azul`, `GOL`, `LATAM` e `Não informado`.

## hospedagem_raw

Problemas confirmados:

- Variações de cidade como `Brasilia`, `DF - Brasília`, `FEIRA DE SANTANA`, `Rio`, `RIO DE JANEIRO`, `Sao Paulo`, `SP - São Paulo`, `Vit. da Conquista` e `Vitoria da Conquista`.

Regras aplicadas:

- Converte `diarias` para inteiro.
- Converte valores de diária e hospedagem com localidade `en-US`.
- Converte `fora_politica_hotel` para lógico.
- Padroniza cidades.
- Substitui hotel vazio por `Não Informado`.

## Observações

Os CSVs permanecem como camada bruta. As limpezas documentadas são aplicadas no modelo pelo Power Query.
