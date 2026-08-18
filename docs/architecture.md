# Arquitetura

## Escopo

O projeto é um case de Business Intelligence para viagens corporativas, construído em Power BI com arquivos versionáveis no formato PBIP/PBIR.

## Fluxo Confirmado

```mermaid
flowchart TD
    A[Gerador Python] --> B[Arquivos CSV sintéticos]
    B --> C[Consultas Power Query / M]
    C --> D[Modelo semântico TMDL]
    D --> E[Tabela DimData]
    D --> F[Tabela _Medidas]
    E --> G[Relatório Power BI]
    F --> G
    G --> H[PBIR: páginas e visual.json]
    H --> I[Documentação para portfólio]
```

## Camadas

| Camada | Artefatos | Responsabilidade |
|---|---|---|
| Geração | `scripts/generate_synthetic_data.py` | Reprodução de bases sintéticas com contrato semelhante |
| Fonte | `*_raw.csv` | Dados sintéticos brutos publicados com o projeto |
| Transformação | Partitions M nos arquivos `.tmdl` | Tipagem, limpeza, padronização e regras de qualidade |
| Modelo | `Corporate_Travel_Intelligence.SemanticModel/definition` | Tabelas, relacionamentos, DimData e medidas |
| Relatório | `Corporate_Travel_Intelligence.Report/definition` | Páginas, visuais, filtros e formatação PBIR |
| Documentação | `README.md` e `docs/` | Explicação técnica e narrativa de portfólio |

## Artefatos Principais

- `Corporate_Travel_Intelligence.pbip`: arquivo de abertura do projeto no Power BI.
- `Corporate_Travel_Intelligence.Report/definition.pbir`: referência do relatório ao modelo semântico por caminho relativo.
- `Corporate_Travel_Intelligence.SemanticModel/definition.pbism`: definição do modelo semântico.
- `Corporate_Travel_Intelligence.SemanticModel/definition/tables/*.tmdl`: tabelas, colunas, medidas e consultas M.
- `Corporate_Travel_Intelligence.Report/definition/pages/*`: páginas e visuais em PBIR.
- `scripts/generate_synthetic_data.py`: gerador Python determinístico para novas bases sintéticas.

## Reprodutibilidade

As consultas M atualmente apontam para caminhos locais absolutos nos arquivos TMDL. Para outra máquina, pode ser necessário ajustar a origem dos CSVs no Power Query.

## Segurança

Os dados são sintéticos. Não foram identificadas credenciais em arquivos de texto inspecionados. Arquivos locais de cache, backups e PBIX foram adicionados ao `.gitignore`.
