# Roadmap

## Concluído

- Dataset sintético de viagens corporativas.
- Carga de CSVs no Power BI.
- Tratamentos de qualidade via Power Query.
- Modelo semântico com tabelas de viagens, despesas, orçamento, aéreo, hospedagem, viajantes e centros de custo.
- `DimData` calculada para o período de 2024 a 2025.
- Medidas DAX executivas, financeiras, operacionais e de compliance.
- Página `01 - Visão Executiva`.
- Redesign visual da página executiva em PBIR.
- Documentação técnica e de portfólio.

## Em Andamento

- Validação visual final no Power BI Desktop após os ajustes de layout.
- Preparação para publicação no GitHub.

## Planejado

- Página Custos & Orçamento.
- Página Aéreo & Hospedagem.
- Página Eficiência & Compliance.
- Página Insights.
- Alertas de desvio.
- Refresh automatizado.
- Resumo mensal.
- Narrativa automática baseada em indicadores calculados.
- What-if de economia.
- Comparações adicionais de período.

## Página Insights

Ideia planejada: criar seleção de Mês/Ano para comparar automaticamente o mês selecionado contra o mês anterior.

Indicadores possíveis:

- gasto atual vs. M-1;
- variação percentual;
- viagens atual vs. M-1;
- taxa fora da política atual vs. M-1;
- compras com menos de 7 dias;
- antecedência média;
- saving;
- alertas e oportunidades.

Regra futura para mês parcial:

Quando o mês selecionado estiver parcial, a comparação ideal deve usar janelas equivalentes. Exemplo: 01/08 a 18/08 contra 01/07 a 18/07, e não agosto parcial contra julho completo.
