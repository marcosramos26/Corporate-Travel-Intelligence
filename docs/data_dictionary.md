# Dicionário de Dados

Este dicionário foi gerado a partir dos CSVs e arquivos TMDL confirmados no projeto. Descrições são inferidas por nome de campo e uso no modelo quando não há metadado explícito.

## Resumo das Tabelas

| Tabela | Grão | Linhas no CSV | Chave |
|---|---|---:|---|
| `viagens_raw` | Uma viagem/solicitação consolidada | 5.015 | `viagem_id` |
| `despesas_raw` | Uma despesa associada a uma viagem | 15.402 | `despesa_id` |
| `orcamento_raw` | Orçamento mensal por centro de custo | 552 | `mes_referencia` + `centro_custo_id` |
| `aereo_raw` | Registro aéreo por viagem | 4.564 | `viagem_id` |
| `hospedagem_raw` | Registro de hospedagem por viagem | 3.999 | `viagem_id` |
| `viajantes_raw` | Cadastro de viajantes | 190 | `viajante_id` |
| `centros_custo_raw` | Cadastro organizacional de centros de custo | 23 | `centro_custo_id` |
| `DimData` | Um dia do calendário | Calculada | `Data` |

## viagens_raw

| Coluna | Tipo no modelo | Descrição | Regra/observação |
|---|---|---|---|
| `viagem_id` | Texto | Identificador da viagem | Chave lógica; duplicidades removidas no Power Query |
| `viajante_id` | Texto | Identificador do viajante | Relaciona com `viajantes_raw` |
| `area` | Texto | Área solicitante | Padronizada no Power Query |
| `centro_custo_id` | Texto | Centro de custo | Nulos recuperados via cadastro de viajantes |
| `motivo` | Texto | Motivo da viagem | Vazios tratados como `Não informado` |
| `origem` | Texto | Cidade de origem | Campo descritivo |
| `destino` | Texto | Cidade de destino | Padronizada por igualdade exata |
| `uf_destino` | Texto | UF de destino | Campo geográfico |
| `regiao_destino` | Texto | Região do destino | Campo geográfico |
| `data_solicitacao` | Data | Data de solicitação | Relacionada a tabela local automática |
| `data_aprovacao` | Data | Data de aprovação | Relacionada a tabela local automática |
| `data_compra` | Data | Data de compra | Erros convertidos em nulo e reconstruídos |
| `data_ida` | Data | Data de início da viagem | Relacionada à `DimData` |
| `data_volta` | Data | Data de retorno | Relacionada a tabela local automática |
| `antecedencia_dias` | Inteiro | Dias entre compra e viagem | Usado em eficiência e política |
| `duracao_dias` | Inteiro | Duração da viagem | Campo operacional |
| `status` | Texto | Status da viagem | Valores brutos confirmados: Cancelada, Concluída |
| `remarcada` | Booleano | Indica remarcação | Usado em taxa de remarcação |
| `fora_politica` | Booleano | Indica violação de política | Usado em compliance |
| `tempo_aprovacao_horas` | Decimal | Tempo de aprovação em horas | Média usada em KPI de processo |
| `saving_pct_referencia` | Decimal | Percentual de economia em relação à referência | Não arredondado no Power Query |
| `valor_aereo_realizado` | Decimal | Gasto aéreo realizado | Arredondado a 2 casas |
| `valor_hospedagem_realizado` | Decimal | Gasto de hospedagem realizado | Arredondado a 2 casas |
| `valor_despesas_reembolsaveis` | Decimal | Despesas reembolsáveis | Arredondado a 2 casas |
| `gasto_total_realizado` | Decimal | Gasto total realizado | Base do KPI Gasto Total |
| `valor_referencia` | Decimal | Valor de referência para saving | Usado em `Saving %` |
| `saving_estimado` | Decimal | Economia estimada | Usado em `Saving Estimado` |

## despesas_raw

| Coluna | Tipo no modelo | Descrição | Regra/observação |
|---|---|---|---|
| `despesa_id` | Texto | Identificador da despesa | Chave lógica; duplicidades removidas |
| `viagem_id` | Texto | Viagem vinculada | Relaciona com `viagens_raw` |
| `categoria` | Texto | Categoria da despesa | Valores confirmados: Ajuste de reembolso, Alimentação, Estacionamento, Outros, Pedágio, Taxa, Transporte terrestre |
| `valor` | Decimal | Valor da despesa | Convertido com localidade `en-US` |
| `data_despesa` | Data | Data da despesa | Relacionada a tabela local automática |
| `reembolsavel` | Booleano | Indica se a despesa é reembolsável | Tipo lógico |

## orcamento_raw

| Coluna | Tipo no modelo | Descrição | Regra/observação |
|---|---|---|---|
| `mes_referencia` | Data | Mês de referência do orçamento | Relaciona com `DimData` |
| `area` | Texto | Área orçamentária | Áreas confirmadas: Administrativo, Comercial, Diretoria, Financeiro, Operações, RH, Tecnologia |
| `centro_custo_id` | Texto | Centro de custo orçado | Relaciona com `centros_custo_raw` |
| `orcado` | Decimal | Valor orçado | Convertido com localidade `en-US` |

## aereo_raw

| Coluna | Tipo no modelo | Descrição | Regra/observação |
|---|---|---|---|
| `viagem_id` | Texto | Viagem vinculada | Chave no grão de aéreo |
| `companhia_aerea` | Texto | Companhia aérea | Variantes padronizadas no Power Query |
| `rota` | Texto | Rota do voo | Campo descritivo |
| `tarifa_base` | Decimal | Tarifa base | Convertida com localidade `en-US` |
| `taxa_remarcacao` | Decimal | Custo de remarcação | Usado em `Custo Remarcações` |
| `taxa_cancelamento` | Decimal | Custo de cancelamento | Usado em `Custo Cancelamentos` |
| `valor_aereo_realizado` | Decimal | Valor aéreo realizado | Usado em `Tarifa Média Aérea` |
| `antecedencia_dias` | Inteiro | Antecedência de compra | Campo de eficiência |
| `remarcada` | Booleano | Indica remarcação | Campo operacional |
| `cancelada` | Booleano | Indica cancelamento | Usado em `Taxa de Cancelamento` |

## hospedagem_raw

| Coluna | Tipo no modelo | Descrição | Regra/observação |
|---|---|---|---|
| `viagem_id` | Texto | Viagem vinculada | Chave no grão de hospedagem |
| `hotel` | Texto | Nome do hotel | Vazios tratados como `Não Informado` |
| `cidade` | Texto | Cidade da hospedagem | Padronizada no Power Query |
| `diarias` | Inteiro | Quantidade de diárias | Usado em `Noites Médias` |
| `valor_diaria` | Decimal | Valor médio/registrado da diária | Usado em `Diária Média Hotel` |
| `valor_hospedagem_realizado` | Decimal | Valor total de hospedagem | Campo financeiro |
| `fora_politica_hotel` | Booleano | Indica hospedagem fora da política | Campo de compliance |

## viajantes_raw

| Coluna | Tipo no modelo | Descrição | Regra/observação |
|---|---|---|---|
| `viajante_id` | Texto | Identificador do viajante | Chave lógica |
| `nome_viajante` | Texto | Nome do viajante | Campo cadastral sintético |
| `area` | Texto | Área do viajante | Usado para enriquecimento |
| `centro_custo_id` | Texto | Centro de custo do viajante | Usado para recuperar centro de custo em viagens |
| `senioridade` | Texto | Senioridade | Segmentação cadastral |
| `risco_comportamental` | Decimal | Indicador sintético de risco | Convertido com localidade `en-US` |
| `ativo` | Booleano | Situação cadastral | Tipo lógico |

## centros_custo_raw

| Coluna | Tipo no modelo | Descrição | Regra/observação |
|---|---|---|---|
| `centro_custo_id` | Texto | Identificador do centro de custo | Chave lógica |
| `area` | Texto | Área organizacional | Filtro da página executiva |
| `centro_custo` | Texto | Nome do centro de custo | Campo cadastral |
| `diretoria` | Texto | Diretoria responsável | Segmentação organizacional |

## DimData

| Coluna | Tipo no modelo | Descrição | Regra/observação |
|---|---|---|---|
| `Data` | Data | Dia do calendário | Chave; calendário 01/01/2024 a 31/12/2025 |
| `Ano` | Inteiro | Ano | Derivado de `Data` |
| `MesNumero` | Inteiro | Número do mês | Ordena `Mes` |
| `Mes` | Texto | Nome do mês | Ordenado por `MesNumero` |
| `AnoMes` | Texto | Ano e mês | Eixo temporal da página executiva |
| `Trimestre` | Texto | Trimestre | Derivado de `Data` |
