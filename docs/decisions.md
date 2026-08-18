# Decisões Técnicas

## ADR-001 — Dataset Sintético

Contexto: o projeto deve ser publicável em GitHub e processos seletivos.

Decisão: usar dados sintéticos.

Motivo: demonstrar competências de BI sem expor dados confidenciais.

Trade-offs: os resultados não representam uma operação real e não devem ser usados como benchmark de mercado.

## ADR-002 — Dados RAW com Problemas Controlados

Contexto: projetos reais de BI raramente chegam com dados limpos.

Decisão: manter problemas controlados nos CSVs brutos e tratá-los no Power Query.

Motivo: evidenciar capacidade de diagnóstico, ETL e qualidade de dados.

Trade-offs: o leitor precisa entender a diferença entre camada raw e camada tratada.

## ADR-003 — Modelo Dimensional Simples

Contexto: o case precisa ser compreensível e fácil de revisar.

Decisão: usar modelo com fatos, dimensões e medidas explícitas, sem arquitetura excessiva.

Motivo: clareza semântica, manutenção e filtros previsíveis.

Trade-offs: não cobre cenários enterprise como Data Lake, RLS ou múltiplas camadas corporativas.

## ADR-004 — DimData Própria

Contexto: orçamento e realizado precisam compartilhar contexto temporal.

Decisão: criar `DimData` calculada de 01/01/2024 a 31/12/2025.

Motivo: controlar eixos de tempo e comparação mensal.

Trade-offs: ainda existem tabelas locais automáticas de data no modelo, que podem ser desabilitadas futuramente para reduzir ruído.

## ADR-005 — Desvio como Realizado Menos Orçado

Contexto: a interpretação do desvio precisa ser inequívoca.

Decisão: calcular `Desvio R$ = [Gasto Total] - [Orçado]`.

Motivo: positivo representa estouro de orçamento; negativo representa economia.

Trade-offs: exige comunicação visual clara para evitar leitura invertida.

## ADR-006 — Correção de Data de Compra

Contexto: existem erros em `data_compra`.

Decisão: reconstruir a data usando `data_ida - antecedencia_dias`.

Motivo: havia informação suficiente para recuperação sem excluir a viagem.

Trade-offs: depende da confiabilidade de `data_ida` e `antecedencia_dias`.

## ADR-007 — Recuperação de Centro de Custo

Contexto: parte das viagens possui `centro_custo_id` vazio.

Decisão: recuperar o centro de custo pelo cadastro de viajantes.

Motivo: `viajante_id` permite enriquecimento confiável pela tabela `viajantes_raw`.

Trade-offs: assume que o cadastro de viajantes está correto para o período analisado.

## ADR-008 — Motivo Ausente como Não Informado

Contexto: alguns motivos de viagem estão vazios.

Decisão: preencher com `Não informado`.

Motivo: não há fonte confiável para inferir o motivo real.

Trade-offs: preserva a linha, mas cria uma categoria operacional de ausência de informação.

## ADR-009 — Medidas Explícitas em DAX

Contexto: KPIs precisam de semântica controlada.

Decisão: centralizar medidas na tabela `_Medidas`.

Motivo: facilita reuso, auditoria e manutenção.

Trade-offs: exige disciplina para não duplicar cálculos em visuais.

## ADR-010 — Visuais Nativos

Contexto: o projeto deve ser fácil de abrir e manter no Power BI.

Decisão: usar visuais nativos do Power BI.

Motivo: reduz dependências e riscos de compatibilidade.

Trade-offs: limita algumas possibilidades visuais avançadas.

## ADR-011 — PBIP/PBIR para Versionamento Visual

Contexto: a camada visual precisava ser ajustada e auditada como código.

Decisão: manter o projeto em PBIP/PBIR.

Motivo: permite versionar páginas, visuais e formatações em JSON.

Trade-offs: requer cuidado para não alterar bindings, medidas ou interações por acidente.
