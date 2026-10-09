# Automação PBIR e IA Aplicada

## Por que PBIP/PBIR

PBIP/PBIR transforma o relatório em arquivos versionáveis. Páginas, visuais, posições, bindings e propriedades de formatação podem ser revisados por diff, validados automaticamente e carregados novamente no Power BI Desktop.

## Estrutura atual

```text
Corporate_Travel_Intelligence.pbip
├── Corporate_Travel_Intelligence.Report/
│   └── definition/
│       ├── report.json
│       └── pages/
│           ├── pages.json
│           ├── 60bf25af6c012497cd0a/   # 01 - Visão Executiva
│           └── 4c8a34d9e12f6b90a7cd/   # 02 - Custos & Orçamento
└── Corporate_Travel_Intelligence.SemanticModel/
    └── definition/
```

## Inventário do relatório

| Página | Visuais | Principais tipos |
|---|---:|---|
| `01 - Visão Executiva` | 13 | 5 cards, 2 slicers, linha, barras, Deneb e 3 shapes |
| `02 - Custos & Orçamento` | 15 | 5 cards, 2 slicers, combo, 3 barras, matriz e 3 shapes |

O relatório registra o custom visual certificado Deneb. Seu uso está limitado ao gráfico de desvio por área da Página 1.

## Página 2 reproduzível

`scripts/build_page2.js` cria de forma determinística:

- metadados da página;
- header e slicers baseados na identidade da Página 1;
- cinco cards de KPI;
- quatro gráficos financeiros;
- matriz de detalhamento;
- inclusão da página em `pages.json`.

O script reutiliza estruturas da Página 1 para preservar schemas, identidade visual e bindings compatíveis.

## Fluxo de autoria e validação

1. Inspecionar páginas, visuais, TMDL e medidas existentes.
2. Consultar capabilities e propriedades suportadas pelo CLI.
3. Alterar apenas a pasta `.Report` quando o trabalho for visual.
4. Executar validação estrutural.
5. Recarregar o PBIP no Power BI Desktop.
6. Capturar screenshot da página alterada.
7. Revisar clipping, dados, cores, hierarquia e espaçamento.

```powershell
powerbi-report-author preview-pages Corporate_Travel_Intelligence.Report --with-derived
powerbi-report-author preview-visuals Corporate_Travel_Intelligence.Report --with-derived
powerbi-report-author validate Corporate_Travel_Intelligence.Report --pretty
```

## Guardrails

- Não inventar medidas, campos ou números.
- Separar alterações do Report e do SemanticModel.
- Preservar IDs e bindings existentes quando possível.
- Validar após cada lote lógico.
- Não publicar sem validação estrutural e visual.
- Manter alterações reversíveis pelo Git.

## Limitações

- O schema PBIR varia entre versões do Desktop.
- Propriedades válidas podem renderizar de maneira diferente entre versões.
- A validação JSON não substitui a inspeção no Power BI Desktop.
- Scripts de autoria dependem da estrutura atual da Página 1 e devem ser revisados após mudanças profundas.
