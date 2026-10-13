# POWERBI_TECHNICAL_MAP

Mapa técnico verificado do projeto PBIP/PBIR. Todos os caminhos são relativos à raiz do repositório.
Use este arquivo para localizar artefatos sem reexplorar o projeto. Informações não verificadas não foram incluídas.

## 1. Estrutura

| Artefato | Caminho |
|---|---|
| Projeto (raiz) | `Corporate_Travel_Intelligence.pbip` |
| Relatório (definição) | `Corporate_Travel_Intelligence.Report/definition/` |
| Report (tema, custom visuals) | `Corporate_Travel_Intelligence.Report/definition/report.json` |
| Páginas (ordem) | `Corporate_Travel_Intelligence.Report/definition/pages/pages.json` |
| Página (layout/filtros) | `Corporate_Travel_Intelligence.Report/definition/pages/<pageId>/page.json` |
| Visual | `Corporate_Travel_Intelligence.Report/definition/pages/<pageId>/visuals/<visualId>/visual.json` |
| Tema base | `Corporate_Travel_Intelligence.Report/StaticResources/SharedResources/BaseThemes/CY26SU07.json` |
| Modelo semântico | `Corporate_Travel_Intelligence.SemanticModel/definition.pbism` |
| Modelo | `Corporate_Travel_Intelligence.SemanticModel/definition/model.tmdl` |
| Relacionamentos | `Corporate_Travel_Intelligence.SemanticModel/definition/relationships.tmdl` |
| Tabelas | `Corporate_Travel_Intelligence.SemanticModel/definition/tables/<tabela>.tmdl` |
| Medidas DAX | `Corporate_Travel_Intelligence.SemanticModel/definition/tables/_Medidas.tmdl` |

Fatos verificados:

- `.pbip` declara em `artifacts` **somente** o relatório; `Corporate_Travel_Intelligence.SemanticModel/` existe ao lado e é resolvido por convenção.
- Report `$schema` 3.3.0; visual `$schema` 2.13.0; page 2.1.0; pagesMetadata 1.1.0; version.json = `2.0.0`.
- `report.json` registra `publicCustomVisuals`: `deneb7E15AEF80B9E4D4F8E12924291ECE89A` e `htmlContent443BE3AD55E043BF878BED274D3A6865`.
- Não existe pasta `CustomVisuals/` nem `RegisteredResources/` no relatório; o visual HTML é resolvido pelo GUID declarado.
- Nenhum filtro de relatório, página ou visual está configurado (não há `filterConfig` em `report.json`, `page.json` nem `visual.json`).

## 2. Páginas e visuais

Ambas as páginas: 1440 × 900, `FitToPage`, fundo `#F4F7FB`.

### Página 01 — `60bf25af6c012497cd0a` ("01 - Visão Executiva")

| Id | Tipo | Título | Medida/subcampos |
|---|---|---|---|
| `8faf69e5a3f40eda8ebb` | htmlContent443… | (KPI) | HTML KPI - Gasto Total |
| `4f0ae0ab608e226cee9f` | htmlContent443… | (KPI) | HTML KPI - Orçado |
| `1650cd17e0b0b103231d` | htmlContent443… | (KPI) | HTML KPI - Desvio vs Orçado |
| `3abea10989ea2360636d` | htmlContent443… | (KPI) | HTML KPI - Qtd Viagens |
| `ffe326c0e7545c83e73b` | htmlContent443… | (KPI) | HTML KPI - Ticket Médio |
| `994b8a19d8658f7281a2` | htmlContent443… | (barras) | HTML Barras - Gasto por Área |
| `846cb390114782d48905` | htmlContent443… | (barras) | HTML Barras - Desvio por Área |
| `ef84ccc731e2caa3748b` | lineChart | Tendência mensal | Gasto Total, Orçado, Desvio R$, Desvio %, Qtd Viagens (AnoMes) |
| `29b28eaa0faaa7f9133a` | slicer | — | area |
| `d510f55e99586fe8325d` | slicer | — | Data |
| `dca8c92c3e127ea5f2ba`, `f2664c4c49bff477becf`, `0f1e2d3c4b5a69788766` | shape | — | cabeçalho/divisória |

### Página 02 — `4c8a34d9e12f6b90a7cd` ("02 - Custos & Orçamento")

| Id | Tipo | Título | Medida/subcampos | x,y,w,h |
|---|---|---|---|---|
| `a1010000000000000001` | shape | — | fundo/topo | 0,0,1440,112 |
| `a1010000000000000002` | shape | título | — | 24,16,880,80 |
| `a1010000000000000003` | shape | — | divisória | 0,108,1440,4 |
| `a1010000000000000004` | slicer | — | area | 928,16,208,80 |
| `a1010000000000000005` | slicer | — | Data | 1152,16,240,80 |
| `b2010000000000000001` | htmlContent443… | (KPI) | HTML KPI - Gasto Total | 24,128,266,128 |
| `b2010000000000000002` | htmlContent443… | (KPI) | HTML KPI - Orçado | 306,128,266,128 |
| `b2010000000000000003` | htmlContent443… | (KPI) | HTML KPI - Desvio R$ | 588,128,266,128 |
| `b2010000000000000004` | htmlContent443… | (KPI) | HTML KPI - Desvio % | 870,128,266,128 |
| `b2010000000000000005` | htmlContent443… | (KPI) | HTML KPI - Saving | 1152,128,264,128 |
| `c3010000000000000001` | lineClusteredColumnComboChart | Orçado x Realizado por mês | Gasto Total (Y), Orçado (Y2), AnoMes | 24,272,944,200 |
| `c3010000000000000002` | htmlContent443… | (Composição do gasto) | HTML Barras - Composição do Gasto · sampling `categoria` | 977.4,271.6,438.8,218 |
| `c3010000000000000003` | htmlContent443… | (Desvio por área) | HTML Barras - Desvio por Área (P2) · sampling `area` | 24,496,688,184 |
| `c3010000000000000004` | clusteredBarChart | Orçado x Realizado por centro de custo | Gasto Total (Realizado), Orçado · `centro_custo` | 728,496,688,188 |
| `d4010000000000000001` | pivotTable | Detalhamento de custos | Orçado, Gasto Total, Desvio R$, Desvio %, Qtd Viagens · area, centro_custo | 24,676,1392,200 |

Observação: na P2 o visual de "Composição do gasto" é `c3010000000000000002` e o de "Desvio por área" é `c3010000000000000003`.

## 3. HTML Content

- Os visuais HTML usam o custom visual `htmlContent443BE3AD55E043BF878BED274D3A6865`.
- **O HTML não fica no `visual.json`.** O `visual.json` apenas aponta para uma medida DAX que monta a string HTML.
- O conteúdo fica em `_Medidas.tmdl`, pasta/formato `displayFolder: UI_HTML`.
- Estrutura da referência no PBIR (em `visual.query.queryState.content.projections[0].field.Measure`):

```
visual.visualType = htmlContent443BE3AD55E043BF878BED274D3A6865
visual.query.queryState.content.projections[0].field.Measure.Property = "<nome da medida HTML>"
```

- Visuais HTML com categoria também têm `queryState.sampling` (coluna) e `queryState.tooltips` (medidas/agregação), além de `sortDefinition`.
- O custom visual **suprime o título padrão do container** (`suppressDefaultTitle: true` nas capabilities). Título/cabeçalho deve ser embutido na própria medida HTML; definir `visualContainerObjects.title` não exibe nada.
- Como a medida `content` é avaliada **uma vez por linha de `sampling`** e os blocos são concatenados, um cabeçalho fixo dentro da medida repetiria em cada linha. Renderize-o uma única vez com uma condição de linha (ex.: `IF ( _rank = 1, "<cabeçalho>", "" ) & "<linha>"`), assumindo a ordem do `sortDefinition`.

Mapa medida HTML → visual:

| Medida HTML (em `_Medidas.tmdl`) | Visual(is) |
|---|---|
| HTML KPI - Gasto Total | P1 `8faf69e5a3f40eda8ebb`; P2 `b2010000000000000001` |
| HTML KPI - Orçado | P1 `4f0ae0ab608e226cee9f`; P2 `b2010000000000000002` |
| HTML KPI - Desvio vs Orçado | P1 `1650cd17e0b0b103231d` |
| HTML KPI - Qtd Viagens | P1 `3abea10989ea2360636d` |
| HTML KPI - Ticket Médio | P1 `ffe326c0e7545c83e73b` |
| HTML KPI - Desvio R$ | P2 `b2010000000000000003` |
| HTML KPI - Desvio % | P2 `b2010000000000000004` |
| HTML KPI - Saving | P2 `b2010000000000000005` |
| HTML Barras - Gasto por Área | P1 `994b8a19d8658f7281a2` |
| HTML Barras - Desvio por Área | P1 `846cb390114782d48905` |
| HTML Barras - Composição do Gasto | P2 `c3010000000000000002` |
| HTML Barras - Desvio por Área (P2) | P2 `c3010000000000000003` |

## 4. Medidas

Todas em `_Medidas.tmdl`. Dependências principais (sem copiar DAX completo).

Medidas base:

| Medida | Definição (resumo) | Referenciada por |
|---|---|---|
| Gasto Total | `SUM(viagens_raw[gasto_total_realizado])` | visuais P2/P1; HTML KPI - Gasto Total |
| Orçado | `SUM(orcamento_raw[orcado])` | visuais; HTML KPI - Orçado / Gasto Total / Desvio vs Orçado |
| Desvio R$ | `[Gasto Total] - [Orçado]` | visuais; HTML Barras - Desvio por Área / (P2); HTML KPI - Desvio R$ / Gasto Total / Desvio vs Orçado |
| Desvio % | `DIVIDE([Desvio R$],[Orçado],0)` | visuais; HTML KPI - Desvio % |
| Qtd Viagens | `DISTINCTCOUNT(viagens_raw[viagem_id])` | visuais; HTML KPI - Qtd Viagens |
| Ticket Médio | `DIVIDE([Gasto Total],[Qtd Viagens],0)` | HTML KPI - Ticket Médio |
| Saving Estimado | `SUM(viagens_raw[saving_estimado])` | HTML KPI - Saving |

Medidas HTML (UI_HTML):

| Medida | Dependências |
|---|---|
| HTML KPI - Gasto Total | Gasto Total, Orçado, Desvio R$, Desvio % |
| HTML KPI - Orçado | Orçado |
| HTML KPI - Desvio vs Orçado | Desvio %, Desvio R$, Orçado |
| HTML KPI - Qtd Viagens | Qtd Viagens |
| HTML KPI - Ticket Médio | Ticket Médio |
| HTML KPI - Desvio R$ | Desvio R$ |
| HTML KPI - Desvio % | Desvio % |
| HTML KPI - Saving | Saving Estimado |
| HTML Barras - Gasto por Área | Gasto Total · `centros_custo_raw[area]` |
| HTML Barras - Desvio por Área | Desvio R$ · `centros_custo_raw[area]` |
| HTML Barras - Composição do Gasto | `SUM(despesas_raw[valor])` · `despesas_raw[categoria]` |
| HTML Barras - Desvio por Área (P2) | Desvio R$ · `centros_custo_raw[area]` |
| Rank Desvio Centro | Desvio R$ · `centros_custo_raw[centro_custo]` |

Definidas e **não referenciadas** por medidas ou visuais (verificado): Taxa Fora da Política, Antecedência Média, % Compras < 7 dias, Tempo Médio Aprovação, Tarifa Média Aérea, Diária Média Hotel, Taxa de Remarcação, Taxa de Cancelamento, Noites Médias, Gasto Médio Reembolso, Gasto Fora da Política, Custo Remarcações, Custo Cancelamentos, Saving %, Rank Desvio Centro.

Tabelas do modelo e colunas-chave: `viagens_raw` (viagem_id, viajante_id, centro_custo_id, area, data_ida, gasto_total_realizado, saving_estimado, valor_referencia, valor_despesas_reembolsaveis, fora_politica, antecedencia_dias, tempo_aprovacao_horas, remarcada), `orcamento_raw` (centro_custo_id, area, mes_referencia, orcado), `centros_custo_raw` (centro_custo_id, centro_custo, area), `despesas_raw` (despesa_id, viagem_id, categoria, valor), `aereo_raw` (viagem_id, valor_aereo_realizado, cancelada, taxa_remarcacao, taxa_cancelamento), `hospedagem_raw` (viagem_id, valor_diaria, diarias), `viajantes_raw` (viajante_id), `DimData` (Data, Ano, AnoMes, Mes, MesNumero, Trimestre).

## 5. Cuidados técnicos

0. **Codificação obrigatória (PBIR):** todo arquivo `*.json` (e `*.tmdl`) do projeto deve ser gravado em **UTF-8 sem BOM**. BOM quebra a abertura do projeto no Power BI Desktop (erro de codificação). Nunca use `Set-Content -Encoding UTF8` no Windows PowerShell 5.1 (ele grava com BOM); grave bytes sem BOM, ex.: `[System.IO.File]::WriteAllBytes($p,[Text.UTF8Encoding]::new($false).GetBytes($txt))` ou remova os 3 bytes `EF BB BF` após gravar.
1. **Decimais em CSS (HTML Content):** larguras de barra são formatadas com culture `"en-US"` (ponto decimal) para gerar `width:42.5%`; valores/percentuais exibidos usam `"pt-BR"` (vírgula). Se `_w` fosse `pt-BR`, o CSS viraria `width:42,5%` e quebraria a barra. Ex.: em "Composição do Gasto" e "Desvio por Área".
2. **Estrutura do visual.json:** `position` é raiz; `padding`, `background`, `border`, `visualHeader`, `title` ficam em `visual.visualContainerObjects`, **não** na raiz (`$j.visualContainerObjects` retorna nulo). `objects` (ex. `crossFilter`) também fica dentro de `visual`.
3. **HTML não reside no visual.json:** para alterar HTML/CSS de um visual, edite a medida DAX em `_Medidas.tmdl`; o `visual.json` só referencia `content.projections[0].field.Measure`.
4. **Acentos:** nomes de medidas/colunas contêm acentos (`Orçado`, `Composição do Gasto`, `Desvio %`, `Área`). Ler TMDL/JSON sem `-Encoding UTF8` gera mojibake e quebra comparações de string.
5. **PowerShell neste ambiente:** `Find-String`, `grep`, `Head` não existem. Pipe de conteúdo bruto para `Select-String` falha com `InputObjectNotBound` (use `-Path`). Um `| Select-Object` colado logo após um bloco `foreach {}` gera `EmptyPipeElement` — acumule em array e imprima depois. Encadear `2>&1` ao fim de pipeline falha aqui.
6. **`.pbip` parcial:** `artifacts` lista só o report; o modelo semântico existe ao lado e é carregado por convenção de pasta.
7. **Nunca reserializar visual.json com `ConvertFrom-Json | ConvertTo-Json` (incidente Página 02).** Causa registrada: `Get-Content -Raw` (sem `-Encoding UTF8`) lê UTF-8 como ANSI → acentos viram mojibake no arquivo; `ConvertTo-Json -Depth N` abaixo da profundidade real substitui objetos aninhados por strings `"@{...}"` (ex.: `Aggregation.Expression.Column.Expression`, `...Expression.SourceRef`); `Set-Content -Encoding UTF8` adiciona BOM. Sintomas: erro "Falha ao carregar o relatório" mesmo com JSON válido, porque `field.Measure.Property` deixa de casar com o nome no modelo e o schema PBIR recebe string onde espera objeto. Prevenção: editar visual.json por substituição textual pontual (Python ou editor) preservando bytes; ao editar `_Medidas.tmdl` não há esse risco. Se precisar ler com PS, use `-Encoding UTF8`; para gravar, `[System.IO.File]::WriteAllBytes($p,[Text.UTF8Encoding]::new($false).GetBytes($txt))`.
8. **`RANKX`/`MAXX` sem context transition na Composição do gasto.** Causa registrada: dentro de `MAXX`/`RANKX` a expressão era um agregado cru `SUM ( despesas_raw[valor] )`, que **não** sofre context transition e retorna o mesmo valor da linha atual em toda iteração. Efeito: `_rank` = 1 em todas as categorias (número repetido) e `_max` = valor da linha → barras 100% (comprimentos iguais). O título, emitido como `IF ( _rank = 1, "<cabeçalho>", "" )`, repetia em cada categoria e estourava a altura (rolagem). Prevenção: envolver o agregado em `CALCULATE` (ou usar uma medida) dentro de `MAXX`/`RANKX` — padrão que já funciona em "Gasto por área"/"Desvio por área" porque ali a expressão é a medida `[Gasto Total]`/`[Desvio R$]`. Correto: `MAXX ( ALLSELECTED ( despesas_raw[categoria] ), CALCULATE ( SUM ( despesas_raw[valor] ) ) )` e idem em `RANKX`. Regra geral: em iteradores, use medida ou `CALCULATE` para context transition.

## 6. Procedimento de edição

Editar um visual (posição/estilo nativo):

1. Localize o id na seção 2 (ou `Select-String -Path "...\pages\*\visuals\*\visual.json" -Pattern "<titulo|medida>"`).
2. Abra `.../pages/<pageId>/visuals/<visualId>/visual.json`.
3. Ajuste `position` (raiz) ou propriedades em `visual.visualContainerObjects` / `visual.objects`.

Editar HTML Content (conteúdo visual):

1. Descubra a medida em `visual.query.queryState.content.projections[0].field.Measure.Property` do `visual.json` (ou na seção 3).
2. Edite a medida correspondente em `_Medidas.tmdl` (`displayFolder: UI_HTML`).
3. Preserve a regra de cultura: larguras em `"en-US"`, textos em `"pt-BR"`.

Adicionar/trocar a medida de um visual HTML: altere apenas `content.projections[0].field.Measure.Property` e os `queryRef`/`nativeQueryRef` correspondentes (padrão `_Medidas.<nome>`).

Regenerar/validar: confira JSON é válido (`Get-Content -Raw | ConvertFrom-Json`) e que cada `<visualId>` tem `visual.json`; abra no Power BI Desktop para conferência visual.
