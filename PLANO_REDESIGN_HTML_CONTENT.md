# Plano de redesign — Corporate Travel Intelligence

Status: planejamento concluído; implementação não autorizada.

Este documento cobre somente diagnóstico, proposta, prova de conceito, riscos, validação e restauração. Nenhum PBIR, TMDL, DAX de negócio, relacionamento, CSV ou tema de produção foi modificado.

## Controle da execução

- Projeto: `C:\Users\DELL\Documents\Projetos\Github\Dashboard Viagens Corporativas`
- Formato: Power BI Project (`.pbip`) com relatório PBIR e modelo semântico TMDL.
- Backup: `backup/pre_html_redesign_20261013_080043/`
- Conteúdo do backup: 188 arquivos, 5.967.626 bytes.
- Verificação: SHA-256 arquivo a arquivo, 0 divergências.
- Manifesto: `backup/pre_html_redesign_20261013_080043/INTEGRITY_MANIFEST.csv`.
- Exclusões registradas: `backup/` para evitar recursão e `.git/` porque não é necessário para restaurar os artefatos PBIP/PBIR.
- Gate: a Fase 1 não começa sem aprovação expressa deste plano. As Fases 2 e 3 não começam sem aprovação objetiva da prova de conceito.

## A — Diagnóstico

### Arquitetura

O fluxo local confirmado é CSV sintético → Power Query/M → modelo semântico TMDL em modo Import → relatório PBIR. O arquivo `Corporate_Travel_Intelligence.Report/definition.pbir` referencia o modelo por caminho relativo. O relatório usa o schema de relatório 3.3.0, página 2.1.0 e visual container 2.11.0; o tema base registrado é `CY26SU07`.

O modelo possui 9 tabelas (`viagens_raw`, `despesas_raw`, `aereo_raw`, `hospedagem_raw`, `orcamento_raw`, `viajantes_raw`, `centros_custo_raw`, `DimData` e `_Medidas`), 8 relacionamentos e 21 medidas. A dimensão de data cobre 01/01/2024 a 31/12/2025. O conjunto amostrado tem 5.015 linhas de viagens, 5.000 viagens distintas, 23 centros de custo, 7 áreas e 7 categorias de despesas.

As consultas M usam caminhos absolutos locais. Isso não bloqueia o redesign nesta máquina, mas exige ajuste ao mover o projeto.

Estado do repositório usado como baseline: o Git registra `Corporate_Travel_Intelligence.Report/definition/pages/pages.json` modificado e `scripts/build_page2.js` e `scripts/generate_synthetic_data.py` excluídos em relação ao `HEAD`. Esses estados já estavam presentes no snapshot de backup e não foram alterados nesta execução. Por isso, os scripts citados na documentação não estão disponíveis no diretório atual e não podem ser considerados ferramentas executáveis até serem restaurados ou a documentação ser atualizada.

### Inventário das páginas

| Página | ID | Canvas | Visuais | Papel atual |
|---|---|---:|---:|---|
| 01 - Visão Executiva | `60bf25af6c012497cd0a` | 1440 × 900 | 13 | Resumo executivo: 5 KPIs, tendência, gasto e desvio por área |
| 02 - Custos & Orçamento | `4c8a34d9e12f6b90a7cd` | 1440 × 900 | 15 | Investigação financeira: 5 KPIs, 4 gráficos e matriz |

Total real: 28 visuais. A contagem inclui 6 shapes estruturais, 4 slicers, 10 cards, 5 gráficos nativos, 1 combo nativo, 1 matriz e 1 Deneb. O relatório registra apenas o custom visual Deneb; HTML Content ainda não está registrado.

### Medidas e campos

Medidas existentes: `Gasto Total`, `Orçado`, `Desvio R$`, `Desvio %`, `Qtd Viagens`, `Ticket Médio`, `Saving Estimado`, `Taxa Fora da Política`, `Antecedência Média`, `% Compras < 7 dias`, `Tempo Médio Aprovação`, `Tarifa Média Aérea`, `Diária Média Hotel`, `Taxa de Remarcação`, `Taxa de Cancelamento`, `Noites Médias`, `Gasto Médio Reembolso`, `Gasto Fora da Política`, `Custo Remarcações`, `Custo Cancelamentos` e `Saving %`.

O relatório atual usa diretamente sete medidas (`Gasto Total`, `Orçado`, `Desvio R$`, `Desvio %`, `Qtd Viagens`, `Ticket Médio`, `Saving Estimado`) e uma agregação implícita `SUM(despesas_raw[valor])`. Eixos e filtros usam `DimData[Data]`, `DimData[AnoMes]`, `centros_custo_raw[area]`, `centros_custo_raw[centro_custo]` e `despesas_raw[categoria]`.

Regras que não podem mudar:

- `Desvio R$ = Gasto Total - Orçado`; positivo é desfavorável/vermelho, negativo é favorável/verde.
- Saving compara o realizado com `valor_referencia`, não com orçamento; deve aparecer como estimativa da fonte.
- A composição de despesas usa `SUM(despesas_raw[valor])` e não reconcilia necessariamente com `Gasto Total`.
- Não existe orçamento por categoria; não criar waterfall Orçado → categorias → Realizado.
- `Qtd Viagens` é contagem distinta de `viagem_id`.

Há uma inconsistência de formatação já existente: `Desvio R$` e `Diária Média Hotel` usam hint `es-US`. O redesign deve formatar a camada de apresentação em pt-BR sem alterar as fórmulas nesta missão.

### Filtros, interações, drill e tooltips

- Cada página tem slicers de Área (`centros_custo_raw[area]`) e Período (`DimData[Data]`).
- Os slicers usam os mesmos campos, mas não há grupo de sincronização persistido.
- Não foram encontrados bookmarks, páginas de tooltip ou definições explícitas de `editInteractions`/`visualInteractions`.
- O relatório usa interações padrão: `defaultDrillFilterOtherVisuals: true`; os visuais persistem `drillFilterOtherVisuals: true`.
- Enhanced tooltips estão habilitados. A tendência da Página 1 inclui `Desvio R$`, `Desvio %` e `Qtd Viagens` no papel Tooltips. Outros gráficos possuem tooltips conforme a matriz abaixo.
- A matriz tem hierarquia de linhas Área → Centro de custo e suporta expansão/recolhimento. Não há página de drill-through dedicada.
- Ordenação confirmada: séries temporais por `DimData[AnoMes]` ascendente; rankings e desvios por medida descendente; matriz por `Desvio R$` descendente.

### Tema e estado visual atual

Pontos preserváveis: header azul-marinho, semântica azul/verde/vermelho, fundo claro, grid de 24 px e hierarquia consistente entre páginas. As capturas existentes mostram boa organização e leitura geral.

Lacunas para o alvo premium: cards excessivamente uniformes, sombras e ícones decorativos na Página 1, título genérico em vez de insight, pouca contextualização dos KPIs, clipping/scroll visível em gráficos da Página 2, diferenças de acabamento entre páginas e sobreposição analítica dos dois gráficos mensais.

### Limitações do HTML Content consideradas

- As edições são visuais AppSource distintos. `Secure` é certificado e sanitiza HTML/CSS/SVG; `Regular` é mais permissivo, não certificado e pode acessar recursos externos.
- A recomendação inicial é HTML Content Secure, sem scripts, fontes web, imagens remotas, iframes ou bibliotecas externas.
- Todo custom visual roda em iframe sandboxed. Ele recebe apenas o dataset resumido fornecido pelo Power BI; não consulta o modelo por conta própria.
- Um visual baseado em uma única medida atualiza com filtros, mas não fornece contexto de linha para selecionar uma barra/categoria. Para cross-filter, tooltip contextual e menu de drill, o campo categórico deve entrar no papel `Context` e o recurso de cross-filter deve estar habilitado.
- Conteúdo HTML/SVG complexo pode ser removido pelo sanitizador Secure. A prova deve usar o painel de diagnóstico do visual e registrar qualquer remoção.
- Secure é a alternativa adequada quando exportação PDF/PowerPoint e política de somente visuais certificados forem requisitos. Regular só deve ser considerado após falha comprovada da prova Secure e aprovação de segurança.
- Fonte técnica: [Visual Editions](https://html-content.com/docs/visual-editions), [Interactivity](https://html-content.com/docs/interactivity), [Sanitization](https://html-content.com/docs/sanitization), [Limitations](https://html-content.com/docs/limitations) e [PBIR Implementation Guide](https://html-content.com/docs/pbir-guide).

Limitação desta etapa: os arquivos e screenshots foram inspecionados, mas não houve conexão com uma instância viva do Power BI Desktop nem publicação em Power BI Service. Renderização, performance, cross-filter real, exportação e Service permanecem não verificados até a prova de conceito.

## B — Proposta visual

### Identidade premium enterprise

Conceito: **Midnight Terminal** — interface executiva inspirada em um painel de jornada corporativa, sem iconografia literal de avião. A assinatura recorrente será uma **flight-path rule**: linha fina azul-elétrico que separa o header do conteúdo e marca somente o visual principal. É o único gesto expressivo; o restante permanece silencioso e disciplinado.

Tokens propostos:

| Papel | Token |
|---|---|
| Header / navy profundo | `#081C33` |
| Realizado / ação principal | `#2563EB` |
| Canvas | `#F4F7FB` |
| Superfície | `#FFFFFF` |
| Texto principal | `#172B4D` |
| Texto secundário | `#667085` |
| Bordas e grid | `#DCE5F0` |
| Favorável | `#0F8A68` |
| Desfavorável | `#C93C3C` |

Tipografia: Segoe UI por consistência entre Desktop, Service e exportação. Título 20 pt semibold; títulos de visual 13–14 pt semibold; KPI 28–32 pt semibold; rótulos 10–11 pt; eixos e matriz 9–10 pt. Números alinhados e com abreviação pt-BR; valor completo no tooltip.

Superfícies: raio de 10–12 px, borda de 1 px e sem sombra perceptível. Não usar gradiente, glow ou ícones decorativos. Cor semântica sempre acompanhada por sinal e texto “acima/abaixo do orçamento”.

### Página 01 — Visão Executiva

Arquetipo: Executive Summary, variante B (KPI Strip), pois existem 5 KPIs de importância comparável e uma tendência principal. Preservar 1440 × 900.

- Header: título descritivo dinâmico/estático orientado à decisão, subtítulo curto, Área e Período à direita.
- KPIs: cinco cards HTML compactos. Gasto e Orçado usam azul/navy; Desvio usa status + texto de direção; Qtd Viagens e Ticket Médio ficam neutros.
- Hero: tendência Realizado vs Orçado, com linhas leves, legenda direta e tooltip completo. Migrar apenas se a prova comprovar tooltip e desempenho; caso contrário, modernizar o nativo.
- Base: Gasto por área como ranking horizontal; Desvio por área mantém Deneb por já preservar desvio divergente, tooltip e semântica com boa precisão.

### Página 02 — Custos & Orçamento

Arquetipo: Analytical Canvas, variante B (Inline Slicers), pois há apenas 2 filtros e a página precisa da largura integral para comparações e matriz. Preservar 1440 × 900.

- Header e filtros iguais à Página 1.
- KPIs: Gasto Total, Orçado, Desvio R$, Desvio % e Saving Estimado; Saving recebe rótulo “estimado vs referência”.
- Gráfico mensal: substituir a repetição de Realizado × Orçado por **Desvio mensal**, conforme ADR-016, somente após aprovação. Se não aprovado, manter a comparação atual com acabamento premium.
- Composição: ranking horizontal das 7 categorias; título explicita “despesas registradas”, evitando sugerir reconciliação com Gasto Total.
- Desvio por área: barras divergentes com labels completos e sem scroll para 7 áreas.
- Centro de custo: permanecer nativo por cardinalidade (23), rolagem, seleção e precisão de tooltip.
- Matriz: permanecer nativa para hierarquia, drill, ordenação, acessibilidade e exportação.

## C — Matriz de migração

Legenda: **Migrar** = candidato HTML Content Secure; **Condicional** = somente após POC; **Manter** = nativo/existente.

### Página 01

| ID | Tipo atual / binding | Proposta | Interações e preservação | Complexidade / risco | Critério de aceitação |
|---|---|---|---|---|---|
| `dca8c92c3e127ea5f2ba` | shape 1440×112 | Manter como fundo do header | Estrutural; sem interação | Baixa; migração não agrega valor | Mesmo alinhamento, contraste e leitura |
| `f2664c4c49bff477becf` | shape/título | Manter ou trocar por textbox nativo | Sem interação; preservar leitura e tab order decorativo | Baixa | Título sem clipping; texto acessível |
| `29b28eaa0faaa7f9133a` | slicer Área | Manter nativo | Preservar filtro, pesquisa e estado visível; planejar sync | Baixa | Filtra todos os visuais corretamente |
| `d510f55e99586fe8325d` | slicer `DimData[Data]` | Manter nativo; avaliar Ano/Período compacto | Preservar filtro temporal; mudança de grão exige aprovação | Média | Período correto, sem clipping, contexto visível |
| `0f1e2d3c4b5a69788766` | shape divisor | Manter como flight-path rule | Decorativo; fora do tab order | Baixa | 2–4 px, sem competir com dados |
| `8faf69e5a3f40eda8ebb` | card `Gasto Total` | **Migrar na POC** para KPI HTML | Responde a slicers; sem cross-filter próprio | Baixa | Valor real pt-BR, nulo/negativo tratados, render ≤1 s |
| `4f0ae0ab608e226cee9f` | card `Orçado` | Migrar após POC | Responde a slicers | Baixa | Bate com card nativo em todos os filtros testados |
| `1650cd17e0b0b103231d` | card `Desvio %` | Migrar após POC | Responde a slicers; status por sinal + texto | Média | Positivo vermelho/acima; negativo verde/abaixo; zero neutro |
| `3abea10989ea2360636d` | card `Qtd Viagens` | Migrar após POC | Responde a slicers | Baixa | Inteiro e contagem distinta preservados |
| `ffe326c0e7545c83e73b` | card `Ticket Médio` | Migrar após POC | Responde a slicers | Baixa | BRL e divisão por viagens preservados |
| `ef84ccc731e2caa3748b` | line chart; `AnoMes`, Gasto, Orçado; tooltips de desvio e viagens | **Condicional**: SVG leve ou nativo premium | Filtros preservados; tooltip/cross-highlight devem ser provados | Alta; SVG temporal e tooltips | 24 meses legíveis, valores iguais, hover e tempo de render aprovados |
| `994b8a19d8658f7281a2` | bar; Área × Gasto Total | **Migrar na POC** para barras HTML/SVG | Área no `Context`; habilitar cross-filter e tooltip | Média | 7 áreas, sort desc, clique filtra demais visuais, labels sem truncar |
| `846cb390114782d48905` | Deneb divergente; Área + Gasto/Orçado/Desvios | Manter Deneb | Preservar tooltip e semântica divergente | Baixa; troca seria regressão sem benefício provado | Render atual preservado; sem alteração de spec |

### Página 02

| ID | Tipo atual / binding | Proposta | Interações e preservação | Complexidade / risco | Critério de aceitação |
|---|---|---|---|---|---|
| `a1010000000000000001` | shape header | Manter nativo | Estrutural | Baixa | Idêntico à Página 1 |
| `a1010000000000000002` | shape/título | Manter ou textbox nativo | Sem interação | Baixa | Texto acessível e consistente |
| `a1010000000000000004` | slicer Área | Manter nativo | Preservar filtro; planejar sync | Baixa | Mesmo estado/contexto entre páginas quando sincronizado |
| `a1010000000000000005` | slicer Período | Manter nativo | Preservar filtro temporal; planejar sync | Baixa | Datas corretas e sem clipping |
| `a1010000000000000003` | divisor | Manter como flight-path rule | Decorativo | Baixa | Consistência entre páginas |
| `b2010000000000000001` | card `Gasto Total` | Migrar após POC | Responde a filtros | Baixa | Paridade com medida existente |
| `b2010000000000000002` | card `Orçado` | Migrar após POC | Responde a filtros | Baixa | Paridade com medida existente |
| `b2010000000000000003` | card `Desvio R$` | Migrar após POC | Responde a filtros; direção explícita | Média | Moeda pt-BR; negativos sem ambiguidade |
| `b2010000000000000004` | card `Desvio %` | Migrar após POC | Responde a filtros | Média | Regra de cor e zero preservadas |
| `b2010000000000000005` | card `Saving Estimado` | Migrar após POC | Responde a filtros; rótulo de estimativa obrigatório | Média; risco de interpretação | Texto “estimado vs referência”; não confundir com desvio |
| `c3010000000000000001` | combo; `AnoMes`, Gasto, Orçado | **Condicional**: HTML de Desvio mensal ou nativo revisado | Filtros e ordenação temporal | Alta; mudança analítica depende de aprovação | Sem duplicar Página 1; 24 meses; cálculo reconciliado |
| `c3010000000000000002` | bar; Categoria × `SUM(valor)` | **Condicional** para ranking HTML | Categoria no `Context`; tooltip e cross-filter | Média | 7 categorias, título/caveat corretos, soma não rotulada como Gasto Total |
| `c3010000000000000003` | bar divergente; Área/CC × Desvio R$ | **Condicional** para HTML/SVG por Área | Área no `Context`; preservar tooltips | Alta; hierarquia Área→CC não cabe na mesma POC | 7 áreas sem scroll; labels completos; seleção funciona |
| `c3010000000000000004` | bar; CC × Gasto/Orçado | Manter nativo | Preservar scroll, seleção e tooltips | Média; 23 categorias | Navegação e precisão mantidas; sem truncamento crítico |
| `d4010000000000000001` | matriz; Área→CC + 5 medidas | Manter nativa | Preservar expand/collapse, sort, show-as-table e export | Alta; HTML perderia funções essenciais | Hierarquia, ordenação, valores e acessibilidade intactos |

Resultado: **15 visuais potencialmente migráveis** — 10 KPIs com alta aderência e 5 gráficos condicionais. Permanecem 12 componentes nativos (4 slicers, 6 shapes/textos, gráfico de centro de custo e matriz) e 1 custom visual Deneb existente.

## D — Arquitetura proposta

1. Instalar/registrar somente o HTML Content Secure aprovado pelo tenant. GUID PBIR documentado: `htmlContent443BE3AD55E043BF878BED274D3A6865`.
2. Preservar todas as medidas de negócio. Criar, somente após autorização, medidas aditivas de apresentação em `_Medidas`, dentro de display folder `UI_HTML`, por exemplo `[HTML KPI - Gasto Total]` e `[HTML Barras - Gasto por Área]`.
3. As medidas HTML referenciam exclusivamente medidas/campos existentes. Não duplicar fórmulas financeiras dentro das strings HTML.
4. KPI: uma medida em `Values/content`; HTML/CSS autocontido, sem script. O valor usa `FORMAT` pt-BR, branch para `ISBLANK`, zero e negativo.
5. Barras: medida de markup em `Values/content`; `centros_custo_raw[area]` em `Context`; medidas necessárias em `Context/Tooltips`; cross-filter habilitado. Cada linha deve possuir uma raiz única selecionável.
6. CSS/SVG: preferir flex/grid simples, SVG inline leve, variáveis de tema e nenhuma dependência remota. Secure deve ser validado pelo diagnóstico de sanitização.
7. PBIR: registrar o visual em `publicCustomVisuals`, preservar IDs sempre que a conversão suportar troca controlada; se for necessário novo ID, auditar referências. Não há bookmarks atuais, mas a validação deve confirmar isso novamente.
8. Separação: alterações `.Report` pertencem ao authoring; medidas `UI_HTML` pertencem ao semantic model. Executar e validar em lotes separados, sem ocultar mudança de modelo em alteração visual.
9. Fallback: manter o visual nativo original até a comparação ser aprovada. Regular (`htmlContent443BE3AD55E043BF878BED274D3A6855`) só entra como exceção autorizada após falha técnica documentada do Secure.

## E — Plano por fases

### Fase 1 — Prova de conceito

Escopo fechado:

- KPI: `8faf69e5a3f40eda8ebb` — Gasto Total.
- Barras: `994b8a19d8658f7281a2` — Gasto por área.
- Edição: HTML Content Secure, sem JavaScript e sem recursos externos.
- Manter os visuais originais em cópia de comparação ou branch/backup reversível durante a prova.

Critérios objetivos:

| Dimensão | Aprovação |
|---|---|
| Dados | Paridade exata com os visuais nativos em estado total, 3 áreas e 3 recortes de período |
| Formatação | `R$`, mil/Mi, separadores pt-BR; negativos, zero e `BLANK()` sem HTML quebrado |
| Filtros | Área e Período atualizam KPI e barras sem estado residual |
| Interação | Clique em uma barra filtra/highlights os demais visuais; limpar seleção restaura estado |
| Tooltip | Área, gasto e contexto aparecem corretamente por barra |
| Legibilidade | Fit to page e 200% sem clipping; contraste AA; redimensionamento não quebra layout |
| Performance | Atualização visual alvo ≤1,0 s e nunca >2,0 s nos cenários testados; registrar Performance Analyzer |
| Secure | Diagnóstico sem remoção que altere conteúdo ou estilo essencial |
| Desktop | Captura “antes/depois” revisada visualmente |
| Service | Publicação de teste, filtros e renderização validados se houver workspace autorizado |
| Exportação | PDF/PowerPoint testados se Service/tenant estiver disponível |

Gate: qualquer falha de dados, filtros ou acessibilidade reprova a POC. Falha apenas estética permite até duas correções. Falha repetida ou necessidade de Regular retorna para decisão do usuário.

### Fase 2 — Visão Executiva

1. Aplicar tokens e header preservando o canvas.
2. Migrar os 4 KPIs restantes em um lote.
3. Avaliar a tendência mensal separadamente; manter nativo se tooltip ou desempenho regredir.
4. Preservar o Deneb e validar cores, filtros e tooltip.
5. Validar PBIR, recarregar Desktop e revisar screenshot.

### Fase 3 — Custos & Orçamento

1. Replicar header/tokens e migrar 5 KPIs.
2. Aprovar explicitamente a troca do gráfico mensal por Desvio mensal.
3. Testar composição e desvio por área como lotes independentes.
4. Manter centro de custo e matriz nativos; modernizar apenas formatação.
5. Validar PBIR, recarregar Desktop e revisar screenshot.

### Fase 4 — Testes

- Estrutura: `powerbi-report-author validate Corporate_Travel_Intelligence.Report --pretty` após cada lote.
- Dados: reconciliação visual × medida/fonte para total e recortes.
- Interações: slicers, cross-filter, limpar seleção, matriz e tooltips.
- Visual: 1440×900, Fit to page, clipping, scroll, alinhamento em grid de 8 px.
- Acessibilidade: contraste, cor redundante, tab order, teclado, alt text e 200%.
- Performance: Performance Analyzer por visual e por página.
- Serviço: renderização, exportação e política de custom visuals, somente em workspace de teste autorizado.

## F — Riscos e mitigação

| Risco | Impacto | Mitigação |
|---|---|---|
| Sanitização Secure remove CSS/SVG | Conteúdo incompleto | HTML mínimo, diagnóstico, fallback nativo; Regular somente com aprovação |
| HTML de medida única sem contexto de linha | Perda de cross-filter/drill | Dimensão no papel Context para gráficos; KPIs não precisam selecionar linhas |
| Regressão de tooltip/seleção | Menor capacidade analítica | POC com interação obrigatória; manter nativo se falhar |
| Medidas HTML grandes/lentas | Página lenta | Payload alvo <5 KB para KPI e <20 KB para 7 barras; sem loops desnecessários; medir |
| Formatação DAX diverge do número real | Erro de leitura | Reutilizar medidas canônicas e validar valores brutos antes do `FORMAT` |
| Secure/Regular diferem entre Desktop e Service | Inconsistência | Testar ambos os ambientes; Secure como padrão certificado |
| Atualização do custom visual muda sanitização | Regressão futura | Registrar versão aprovada, manter POC de regressão e fallback nativo |
| Saving interpretado como economia orçamentária | Decisão errada | Rótulo e tooltip “estimado vs referência”; não combinar com desvio |
| Composição confundida com Gasto Total | Reconciliação falsa | Título “despesas registradas por categoria” e caveat no tooltip |
| Gráfico mensal duplicado entre páginas | Baixo valor informacional | Página 2 passa a Desvio mensal somente após aprovação |
| Alteração acidental do modelo | Regressão | Lotes separados; somente medidas `UI_HTML` aditivas; comparar hashes/diff |
| Caminhos M absolutos | Falha em outra máquina | Documentar; fora do escopo do redesign |

## G — Checklist final

- [ ] POC aprovada por critérios de dados, filtros, interação, visual, acessibilidade e performance.
- [ ] Nenhuma medida de negócio, fórmula financeira ou relacionamento foi alterado.
- [ ] Toda medida HTML referencia métricas canônicas existentes.
- [ ] 10 KPIs reconciliados com os nativos.
- [ ] Gráficos migrados mantêm ordenação, tooltip e cross-filter; os demais permanecem nativos.
- [ ] Slicers funcionam e, se aprovado, ficam sincronizados entre páginas.
- [ ] Matriz mantém hierarquia Área → Centro de custo, sort e exportação.
- [ ] Saving e composição exibem caveats corretos.
- [ ] Desvio positivo/negativo mantém semântica, rótulo e cor.
- [ ] Nenhum recurso externo ou JavaScript foi introduzido no Secure.
- [ ] PBIR validado sem erro após cada lote.
- [ ] Capturas antes/depois revisadas em 1440×900 e Fit to page.
- [ ] Contraste, tab order, teclado, alt text e zoom 200% aprovados.
- [ ] Performance Analyzer sem regressão material.
- [ ] Desktop aprovado; Service e exportação aprovados quando ambiente autorizado estiver disponível.
- [ ] Backup e restauração testáveis; arquivos fora do escopo preservados.

## H — Restauração

1. Fechar o Power BI Desktop.
2. Preservar ou renomear o diretório atual; não sobrescrever sem autorização.
3. Copiar o conteúdo de `backup/pre_html_redesign_20261013_080043/` para a raiz, mantendo os caminhos relativos.
4. Recalcular SHA-256 e comparar com `BackupSHA256` em `INTEGRITY_MANIFEST.csv`.
5. Confirmar 0 divergências antes de abrir `Corporate_Travel_Intelligence.pbip`.
6. Abrir o PBIP e validar páginas, visuais, filtros e vínculo com o modelo.

O procedimento completo também está em `backup/pre_html_redesign_20261013_080043/BACKUP_INFO.md`.

## Contrato canônico de design

```yaml
Design Brief:
  generated_by: powerbi-report-cli
  contract_version: 1
  mode: brownfield
  design_identity:
    current_tone: "corporativo funcional com kit de cards uniforme"
    current_signature: "header navy e semântica financeira azul/verde/vermelho"
    tone: "Midnight Terminal — executivo, preciso e silencioso; superfícies claras sob um header navy profundo"
    signature: "flight-path rule — linha elétrica fina que divide o header e marca somente o visual principal"
  archetype: "Executive + Drill"
  color_map:
    - { measure: "_Medidas[Gasto Total]", color: "#2563EB", tint: "#DCE9FF" }
    - { measure: "_Medidas[Orçado]", color: "#173A67", tint: "#DDE7F2" }
    - { measure: "_Medidas[Desvio R$]", color: "semantic", tint: "#EEF2F6" }
    - { measure: "_Medidas[Desvio %]", color: "semantic", tint: "#EEF2F6" }
    - { measure: "_Medidas[Qtd Viagens]", color: "#344054", tint: "#EAECF0" }
    - { measure: "_Medidas[Ticket Médio]", color: "#344054", tint: "#EAECF0" }
    - { measure: "_Medidas[Saving Estimado]", color: "#0F8A68", tint: "#DCF3EC" }
  pages:
    - name: "01 - Visão Executiva"
      role: landing
      archetype: Executive
      layout_variant: B
      variant_rationale: "Cinco KPIs de importância comparável e uma tendência principal favorecem KPI Strip."
      page_background: "#F4F7FB"
      layout_summary: "Header com filtros, faixa de cinco KPIs, tendência em largura total e dois rankings equilibrados."
      layout_contract:
        canvas: { width: 1440, height: 900, margin: 24, gutter: 16, snap: 8 }
        grid:
          columns: 12
          rows: 12
          regions:
            header: [1, 1, 9, 2]
            filters: [9, 1, 13, 2]
            kpis: [1, 2, 13, 4]
            trend: [1, 4, 13, 8]
            ranking: [1, 8, 7, 13]
            variance: [7, 8, 13, 13]
        placements:
          - { id: page_title, region: header, kind: textbox, text: "Viagens corporativas estão abaixo do orçamento no período" }
          - { id: area_slicer, region: filters, kind: slicer, field_bindings: "centros_custo_raw[area]", slicer_type: dropdown, slot: 1, of: 2 }
          - { id: period_slicer, region: filters, kind: slicer, field_bindings: "DimData[Data]", slicer_type: between, slot: 2, of: 2 }
          - { id: kpi_gasto, region: kpis, kind: htmlContentSecure, purpose: "Quanto foi gasto?", field_bindings: "_Medidas[Gasto Total]", color_strategy: measure_match, slot: 1, of: 5 }
          - { id: kpi_orcado, region: kpis, kind: htmlContentSecure, purpose: "Qual era o orçamento?", field_bindings: "_Medidas[Orçado]", color_strategy: measure_match, slot: 2, of: 5 }
          - { id: kpi_desvio, region: kpis, kind: htmlContentSecure, purpose: "A execução está acima ou abaixo do orçamento?", field_bindings: "_Medidas[Desvio %]", color_strategy: semantic, slot: 3, of: 5 }
          - { id: kpi_viagens, region: kpis, kind: htmlContentSecure, purpose: "Quantas viagens ocorreram?", field_bindings: "_Medidas[Qtd Viagens]", color_strategy: measure_match, slot: 4, of: 5 }
          - { id: kpi_ticket, region: kpis, kind: htmlContentSecure, purpose: "Qual o gasto médio por viagem?", field_bindings: "_Medidas[Ticket Médio]", color_strategy: measure_match, slot: 5, of: 5 }
          - { id: monthly_trend, region: trend, kind: lineChart, purpose: "Como realizado e orçamento evoluem por mês?", field_bindings: { Category: "DimData[AnoMes]", Y: ["_Medidas[Gasto Total]", "_Medidas[Orçado]"] }, sort_policy: natural_order, color_strategy: measure_match }
          - { id: spend_by_area, region: ranking, kind: htmlContentSecure, purpose: "Quais áreas concentram o gasto?", field_bindings: { Context: "centros_custo_raw[area]", Value: "_Medidas[Gasto Total]" }, sort_policy: value_desc, color_strategy: gradient }
          - { id: variance_by_area, region: variance, kind: deneb, purpose: "Quais áreas estão acima ou abaixo do orçamento?", field_bindings: { Category: "centros_custo_raw[area]", Value: "_Medidas[Desvio R$]" }, sort_policy: value_desc, color_strategy: semantic }
        space_audit:
          content_cell_count: 132
          placed_cell_count: 132
          empty_cell_pct: 0
          unplaced_regions: []
          largest_region: { name: trend, pct_of_content: 36 }
          balance_rationale: "A tendência prova o estado executivo; os rankings dividem o restante sem reduzir legibilidade."
    - name: "02 - Custos & Orçamento"
      role: detail
      archetype: Analytical
      layout_variant: B
      variant_rationale: "Dois slicers cabem no header e liberam a largura integral para comparações e matriz."
      page_background: "#F4F7FB"
      layout_summary: "KPIs no topo, análise mensal e composição, duas comparações e matriz em largura total."
      layout_contract:
        canvas: { width: 1440, height: 900, margin: 24, gutter: 16, snap: 8 }
        grid:
          columns: 12
          rows: 12
          regions:
            header: [1, 1, 9, 2]
            filters: [9, 1, 13, 2]
            kpis: [1, 2, 13, 4]
            monthly: [1, 4, 9, 7]
            composition: [9, 4, 13, 7]
            area_variance: [1, 7, 7, 9]
            cost_center: [7, 7, 13, 9]
            detail: [1, 9, 13, 13]
        placements:
          - { id: page_title, region: header, kind: textbox, text: "Custos e orçamento: onde estão os principais desvios" }
          - { id: area_slicer, region: filters, kind: slicer, field_bindings: "centros_custo_raw[area]", slicer_type: dropdown, slot: 1, of: 2 }
          - { id: period_slicer, region: filters, kind: slicer, field_bindings: "DimData[Data]", slicer_type: between, slot: 2, of: 2 }
          - { id: kpi_gasto, region: kpis, kind: htmlContentSecure, purpose: "Quanto foi gasto?", field_bindings: "_Medidas[Gasto Total]", color_strategy: measure_match, slot: 1, of: 5 }
          - { id: kpi_orcado, region: kpis, kind: htmlContentSecure, purpose: "Qual era o orçamento?", field_bindings: "_Medidas[Orçado]", color_strategy: measure_match, slot: 2, of: 5 }
          - { id: kpi_desvio_rs, region: kpis, kind: htmlContentSecure, purpose: "Qual o desvio monetário?", field_bindings: "_Medidas[Desvio R$]", color_strategy: semantic, slot: 3, of: 5 }
          - { id: kpi_desvio_pct, region: kpis, kind: htmlContentSecure, purpose: "Qual o desvio relativo?", field_bindings: "_Medidas[Desvio %]", color_strategy: semantic, slot: 4, of: 5 }
          - { id: kpi_saving, region: kpis, kind: htmlContentSecure, purpose: "Qual o saving estimado contra referência?", field_bindings: "_Medidas[Saving Estimado]", color_strategy: measure_match, slot: 5, of: 5 }
          - { id: monthly_variance, region: monthly, kind: htmlContentSecure, purpose: "Em quais meses o orçamento foi excedido ou economizado?", field_bindings: { Context: "DimData[AnoMes]", Value: "_Medidas[Desvio R$]" }, sort_policy: natural_order, color_strategy: semantic }
          - { id: spend_composition, region: composition, kind: htmlContentSecure, purpose: "Quais categorias concentram despesas registradas?", field_bindings: { Context: "despesas_raw[categoria]", Value: "SUM(despesas_raw[valor])" }, sort_policy: value_desc, color_strategy: gradient }
          - { id: area_variance, region: area_variance, kind: htmlContentSecure, purpose: "Quais áreas têm maior desvio?", field_bindings: { Context: "centros_custo_raw[area]", Value: "_Medidas[Desvio R$]" }, sort_policy: value_desc, color_strategy: semantic }
          - { id: cost_center_compare, region: cost_center, kind: clusteredBarChart, purpose: "Quais centros concentram orçamento e realizado?", field_bindings: { Category: "centros_custo_raw[centro_custo]", Y: ["_Medidas[Gasto Total]", "_Medidas[Orçado]"] }, sort_policy: value_desc, color_strategy: measure_match }
          - { id: cost_detail, region: detail, kind: pivotTable, purpose: "Qual o detalhe por área e centro de custo?", field_bindings: ["centros_custo_raw[area]", "centros_custo_raw[centro_custo]", "_Medidas[Orçado]", "_Medidas[Gasto Total]", "_Medidas[Desvio R$]", "_Medidas[Desvio %]", "_Medidas[Qtd Viagens]"] }
        space_audit:
          content_cell_count: 132
          placed_cell_count: 132
          empty_cell_pct: 0
          unplaced_regions: []
          largest_region: { name: detail, pct_of_content: 36 }
          balance_rationale: "A matriz recebe quatro linhas de grid para investigação; gráficos acima mantêm largura suficiente para rótulos."
  interaction_pattern:
    drill_targets: []
    cross_filter_rules: "Nativo como padrão; HTML com dimensão em Context e cross-filter habilitado; KPI de medida única não seleciona linhas."
  accessibility:
    alt_text_strategy: "headline+trend para KPIs; chart+structure para gráficos; comparison framing para desvios"
    contrast_notes: "Texto comum >=4.5:1; marcas >=3:1; verde/vermelho sempre acompanhados de sinal e rótulo."
  theme:
    base: "tema existente preservado com delta Midnight Terminal"
    user_overrides: "preservar canvas 1440x900, semântica financeira e bindings; sem gradientes, scripts, fontes externas ou sombras pesadas"
```

## Gate de autorização

Próxima ação permitida após aprovação expressa: implementar somente a Fase 1, com um KPI e um gráfico de barras em HTML Content Secure, executar as validações e retornar para uma nova decisão antes de qualquer migração adicional.
