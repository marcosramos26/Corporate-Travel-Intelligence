# Roadmap

## Concluído

- Dataset sintético com sete fontes CSV.
- Tratamento em Power Query e modelo semântico TMDL.
- `DimData` explícita e Auto Date/Time desativado.
- 21 medidas DAX centralizadas.
- Página `01 - Visão Executiva` com refinamento visual profissional.
- Página `02 - Custos & Orçamento` com KPIs, análises financeiras e matriz.
- Deneb restrito ao desvio divergente da Página 1.
- Gerador determinístico da Página 2 em Node.js.
- Validação PBIR sem erros estruturais.
- Documentação técnica, de negócio, dados, KPIs e decisões.

## Próximas correções prioritárias

1. Substituir o gráfico mensal repetido da Página 2 por Desvio mensal divergente.
2. Revisar as 30 viagens cujo saving não reconcilia com referência menos realizado.
3. Decidir se Saving permanece como KPI ou é substituído por `% do orçamento consumido`.
4. Sincronizar os filtros Área e Período entre páginas.
5. Parametrizar os caminhos dos CSVs para eliminar dependência de caminho absoluto.

## Evoluções planejadas

- Página Aéreo & Hospedagem.
- Página Eficiência & Compliance.
- Alertas de desvio e resumo mensal.
- Comparação com período anterior usando janelas equivalentes para mês parcial.
- Refresh automatizado e implantação em ambiente Power BI/Fabric.
- RLS, gateway e monitoramento, caso o projeto evolua de portfólio para solução operacional.

## Fora do escopo atual

- Integração real com ERP, agência de viagens ou cartão corporativo.
- Orçamento por categoria sem fonte ou regra de alocação aprovada.
- Narrativa automática baseada em números não reconciliados.
