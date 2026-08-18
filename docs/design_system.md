# Design System do Dashboard

## Objetivo Visual

A página `01 - Visão Executiva` foi tratada como interface analítica executiva: leitura rápida, hierarquia clara, baixo ruído visual e aparência corporativa moderna.

## Paleta

| Uso | Cor |
|---|---|
| Azul principal / realizado / accent | `#1F77E5` |
| Azul-marinho estrutural / orçamento / header | `#172B4D` |
| Texto secundário | `#6B778C` |
| Fundo geral | `#EFF3F8` |
| Superfícies | `#FFFFFF` |
| Favorável / economia | `#2E7D32` |
| Desfavorável / estouro | `#C62828` |

## Hierarquia

1. Header executivo com título, subtítulo e filtros.
2. Faixa de KPIs de leitura imediata.
3. Tendência mensal em largura total.
4. Análises por área em dois painéis equivalentes.

## Cards de KPI

- Superfície branca.
- Valor com maior peso visual que o rótulo.
- Uso de azul para realizado, marinho para orçamento e verde/vermelho somente quando há semântica de desvio.
- Bordas e sombras discretas.
- Espaçamento baseado em múltiplos de 8 px.

## Gráficos

- Linha de realizado em `#1F77E5`.
- Linha de orçado em `#172B4D`.
- Desvio positivo em vermelho e negativo em verde.
- Gridlines reduzidas para diminuir ruído.
- Títulos curtos e subtítulos contextuais.
- Containers brancos com cantos arredondados sutis.

## Filtros

- Área e Período integrados ao header.
- Superfície branca para contraste sobre o header escuro.
- Alinhamento compacto com a faixa superior.

## Acessibilidade e Legibilidade

- Contraste alto entre texto principal e fundo.
- Uso de cor restrito a significado analítico.
- Evita dependência exclusiva de decoração.
- Mantém área de leitura livre para screenshot de portfólio.

## Limitações

O PBIR expõe muitas propriedades de formatação em JSON, mas nem toda opção visual do Power BI tem comportamento estável entre versões. Por isso, o redesign priorizou propriedades nativas e reversíveis: posição, tamanho, fundo, borda, sombra, títulos, cores e estilo dos visuais.
