# Auditoria do Repositório

Data da atualização: 09/10/2026.

## Estrutura confirmada

- `Corporate_Travel_Intelligence.pbip`
- `Corporate_Travel_Intelligence.Report/`
- `Corporate_Travel_Intelligence.SemanticModel/`
- sete arquivos `*_raw.csv`
- `assets/`
- `docs/`
- `scripts/build_page2.js`
- `.gitignore`

## Git

Remote configurado:

`https://github.com/marcosramos26/Corporate-Travel-Intelligence.git`

O working tree foi consolidado em commit e publicado em `origin/main`.

### Toolkit de agente local

O repositório de trabalho contém um toolkit de agente (`AGENTS.md`, `skills/`, `common/`, `evals/` e os scripts `validate_toolkit.py` e `verify_upstream.py`). Esse material é de uso local e está deliberadamente excluído do versionamento pelo `.gitignore`; não faz parte da entrega publicada do projeto.

## Fontes e modelo

- Sete CSVs brutos na raiz.
- Nove tabelas no modelo: sete fontes, `DimData` e `_Medidas`.
- 21 medidas DAX.
- O relatório referencia o modelo por caminho relativo em `definition.pbir`.
- As consultas M ainda referenciam caminhos locais absolutos para os CSVs.

## Páginas PBIR

| ID | Nome | Visuais |
|---|---|---:|
| `60bf25af6c012497cd0a` | `01 - Visão Executiva` | 13 |
| `4c8a34d9e12f6b90a7cd` | `02 - Custos & Orçamento` | 15 |

Total atual: 2 páginas e 28 visuais.

## Qualidade e riscos conhecidos

- 5.015 linhas brutas de viagens e 5.000 IDs distintos.
- 15.402 linhas brutas de despesas e 15.372 IDs distintos.
- 30 viagens distintas não reconciliam saving com referência menos realizado.
- O orçamento não possui categoria.
- O gráfico mensal da Página 2 sobrepõe a pergunta respondida pela tendência da Página 1.
- Os slicers equivalentes ainda não estão sincronizados.
- Caminhos absolutos reduzem portabilidade.

## Arquivos que não devem ser publicados

- `*.pbix` e `*.pbit`
- diretórios `.pbi/`
- backups locais
- caches e arquivos temporários
- credenciais ou tokens

Os dados publicados são sintéticos e não foram identificadas credenciais nas definições textuais inspecionadas.
