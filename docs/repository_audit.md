# Auditoria do Repositório

Data da auditoria: 18/08/2026.

## Estrutura Encontrada

- `Corporate_Travel_Intelligence.pbip`
- `Corporate_Travel_Intelligence.Report/`
- `Corporate_Travel_Intelligence.SemanticModel/`
- `aereo_raw.csv`
- `assets/dashboard_visao_executiva.png`
- `centros_custo_raw.csv`
- `despesas_raw.csv`
- `hospedagem_raw.csv`
- `orcamento_raw.csv`
- `viagens_raw.csv`
- `viajantes_raw.csv`
- `scripts/generate_synthetic_data.py`
- `.gitignore`
- `backups/`

## Git

O repositório local foi inicializado e publicado no GitHub informado:

`https://github.com/marcosramos26/Corporate-Travel-Intelligence.git`

## Fontes de Dados

Sete CSVs brutos foram confirmados na raiz do projeto:

- `viagens_raw.csv`
- `viajantes_raw.csv`
- `centros_custo_raw.csv`
- `aereo_raw.csv`
- `hospedagem_raw.csv`
- `despesas_raw.csv`
- `orcamento_raw.csv`

## Scripts Python

Foi adicionado `scripts/generate_synthetic_data.py` para gerar novas bases sintéticas com contrato semelhante aos CSVs publicados.

## Power Query

As consultas M estão embutidas nas partitions dos arquivos TMDL em `Corporate_Travel_Intelligence.SemanticModel/definition/tables/`.

## Tabelas

Tabelas confirmadas:

- `aereo_raw`
- `centros_custo_raw`
- `despesas_raw`
- `hospedagem_raw`
- `orcamento_raw`
- `viagens_raw`
- `viajantes_raw`
- `DimData`
- `_Medidas`

## Medidas

Foram confirmadas 21 medidas DAX na tabela `_Medidas`.

## Páginas

Páginas confirmadas no PBIR:

- `01 - Visão Executiva`

## Assets

Assets confirmados:

- Screenshot em `assets/dashboard_visao_executiva.png`
- Ícones em `Corporate_Travel_Intelligence.Report/StaticResources/RegisteredResources/`
- Tema em `Corporate_Travel_Intelligence.Report/StaticResources/SharedResources/BaseThemes/CY26SU07.json`

## Documentação Existente

Antes desta rodada, não foram encontrados arquivos `.md` de documentação dentro do diretório auditado.

## Inconsistências e Pontos de Atenção

- A pasta local está inicializada como Git e conectada ao repositório GitHub informado.
- As consultas M usam caminhos absolutos locais para os CSVs.
- Existem backups de edição visual em `backups/`; são úteis localmente, mas não devem ser publicados no GitHub.
- Foi encontrado um arquivo `.pbix` fora da pasta auditada. Ele não faz parte da estrutura local documentada para o repositório.
- Os CSVs brutos preservam problemas de qualidade por desenho do case; a camada tratada fica no Power Query.
- As tabelas locais automáticas de data foram removidas para privilegiar a `DimData`.

## Arquivos que Não Deveriam Ir para Git

- `backups/`
- `*.pbix`
- `*.pbit`
- `**/.pbi/`
- caches e arquivos temporários de sistema/editor

Esses padrões foram adicionados ao `.gitignore`.
