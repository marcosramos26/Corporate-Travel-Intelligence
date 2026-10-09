# Design System do Dashboard

## Direção visual

O relatório foi desenhado como uma interface executiva corporativa: hierarquia clara, leitura rápida, baixo ruído e consistência entre páginas. O design evita ícones decorativos, gradientes, sombras pesadas, gráficos 3D e cores sem significado analítico.

## Tokens principais

| Uso | Valor |
|---|---|
| Canvas | `1440 × 900` |
| Fundo geral | `#F4F7FB` |
| Header | `#0B1F3A` |
| Realizado / destaque | `#2F80ED` |
| Texto principal | `#172B4D` |
| Texto secundário | `#6B778C` |
| Superfície | `#FFFFFF` |
| Borda | `#DCE5F0` |
| Favorável | `#159B76` |
| Desfavorável | `#D94B4B` |
| Raio padrão | 12 px |
| Margem externa | 24 px |

## Hierarquia das páginas

1. Header com título, subtítulo e filtros.
2. Linha de cinco KPIs uniformes.
3. Área principal de análise.
4. Análises complementares ou detalhamento.

O espaçamento segue aproximadamente múltiplos de 8 px, com gaps de 16 px e margens externas de 24 px.

## Cards de KPI

- Cinco cards por página, com dimensões equivalentes.
- Rótulo pequeno acima do valor.
- Azul para Gasto Total; azul-marinho para valores neutros.
- Verde e vermelho somente para desempenho.
- Sem ícones, sparklines ou elementos decorativos.
- Fundo branco, borda discreta e sem sombra perceptível.

## Semântica de cor

- Realizado: azul.
- Orçamento: azul-marinho ou cinza-azulado.
- `Desvio > 0`: vermelho, pois representa gasto acima do orçamento.
- `Desvio < 0`: verde, pois representa gasto abaixo do orçamento.
- Zero: neutro.

A cor deve ser acompanhada de sinal ou texto explicativo. Um valor verde entre parênteses representa resultado numericamente negativo e gerencialmente favorável.

## Gráficos

- Títulos com Segoe UI Semibold e subtítulos em Segoe UI regular.
- Gridlines extremamente sutis.
- Legendas compactas.
- Rótulos apenas quando agregam leitura.
- Eixos quantitativos podem ser ocultados quando os rótulos já comunicam o valor.
- Deneb é restrito ao desvio divergente da Página 1.

## Filtros

- Área e Período aparecem no canto superior direito do header.
- Superfície clara sobre fundo escuro.
- Os mesmos campos são usados nas duas páginas.
- Os slicers ainda não estão sincronizados entre páginas.

## Páginas

### 01 - Visão Executiva

- Tendência mensal ocupa a principal área de atenção.
- Ranking de gasto e desvio por área completam a leitura.

### 02 - Custos & Orçamento

- Mantém o mesmo header, grid, cards, bordas e tipografia.
- Organiza análise mensal, composição, desvios, centro de custo e matriz.
- O gráfico mensal ainda apresenta sobreposição analítica com a Página 1 e está previsto para refinamento.

## Acessibilidade

- Alto contraste entre textos e superfícies.
- Cor não deve ser a única indicação de significado.
- Valores não podem ficar truncados.
- Tooltips devem trazer contexto de orçamento, realizado e desvio.
- O layout deve permanecer legível em `Fit to page`.
