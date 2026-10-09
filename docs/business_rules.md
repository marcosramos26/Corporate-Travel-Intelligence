# Regras de Negócio

Este documento registra as regras atualmente implementadas no modelo e as interpretações que devem ser preservadas nos visuais.

## Contexto de análise

- Período disponível: 01/01/2024 a 31/12/2025.
- Data principal da viagem: `viagens_raw[data_ida]`.
- Data do orçamento: `orcamento_raw[mes_referencia]`.
- Dimensão temporal oficial: `DimData`.
- Dimensão organizacional oficial: `centros_custo_raw`.
- Grão do orçamento: mês × centro de custo.
- Grão do realizado consolidado: viagem.

## Regras financeiras

### Gasto Total

```DAX
Gasto Total = SUM(viagens_raw[gasto_total_realizado])
```

Representa o gasto realizado das viagens dentro do contexto de filtros.

### Orçado

```DAX
Orçado = SUM(orcamento_raw[orcado])
```

Representa o orçamento aprovado dentro do contexto de mês, área e centro de custo.

### Desvio R$

```DAX
Desvio R$ = [Gasto Total] - [Orçado]
```

| Condição | Significado | Tratamento visual |
|---|---|---|
| `Desvio R$ > 0` | Realizado acima do orçamento | Vermelho |
| `Desvio R$ < 0` | Realizado abaixo do orçamento | Verde |
| `Desvio R$ = 0` | Realizado igual ao orçamento | Neutro |

Um valor verde de `(R$ 43 mil)` representa R$ 43 mil abaixo do orçamento. O resultado é favorável do ponto de vista gerencial, mas negativo do ponto de vista matemático.

### Desvio %

```DAX
Desvio % = DIVIDE([Desvio R$], [Orçado], 0)
```

- Positivo: estouro percentual do orçamento.
- Negativo: execução abaixo do orçamento.
- Quando o orçamento é zero, a medida retorna zero pelo terceiro argumento de `DIVIDE`.

### Quantidade de viagens e ticket médio

```DAX
Qtd Viagens = DISTINCTCOUNT(viagens_raw[viagem_id])

Ticket Médio = DIVIDE([Gasto Total], [Qtd Viagens], 0)
```

O ticket médio representa gasto realizado por viagem distinta.

## Saving

```DAX
Saving Estimado = SUM(viagens_raw[saving_estimado])

Saving % =
DIVIDE(
    [Saving Estimado],
    SUM(viagens_raw[valor_referencia]),
    0
)
```

Saving compara o realizado com uma referência estimada de compra. Ele não compara o realizado com o orçamento aprovado.

| Indicador | Base de comparação |
|---|---|
| Desvio orçamentário | Orçamento aprovado |
| Saving | Valor de referência da viagem |

Consequentemente, os dois valores não devem ser somados, subtraídos ou reconciliados entre si como se fossem a mesma métrica.

### Limitação de qualidade

Na camada raw atual:

- existem 5.015 linhas e 5.000 viagens distintas;
- após considerar uma linha por `viagem_id`, 30 viagens não atendem à igualdade esperada `saving_estimado = valor_referencia - gasto_total_realizado`;
- a diferença acumulada dessas 30 ocorrências é R$ 65.338,70.

Até a origem ser corrigida ou a regra formalmente redefinida, Saving deve ser apresentado como **estimativa da fonte**, e não como economia financeira auditada.

## Categorias de despesas

- `despesas_raw[categoria]` classifica somente os registros da tabela de despesas.
- A composição exibida na Página 2 usa `SUM(despesas_raw[valor])`.
- Essa soma não equivale necessariamente ao `Gasto Total`, que vem de `viagens_raw[gasto_total_realizado]`.
- Aéreo e hospedagem possuem tabelas próprias e também participam do consolidado da viagem.

Categorias confirmadas: Ajuste de reembolso, Alimentação, Estacionamento, Outros, Pedágio, Taxa e Transporte terrestre.

## Orçamento por categoria

O modelo não possui categoria no grão do orçamento. Portanto:

- não é válido distribuir o orçamento entre Aéreo, Hospedagem, Alimentação ou Transporte sem uma regra adicional;
- não é válido criar waterfall `Orçado → categorias → Realizado` com os dados atuais;
- comparações de orçamento devem permanecer nos eixos suportados: tempo, área e centro de custo.

## Filtros e propagação

- O filtro de Área utiliza `centros_custo_raw[area]`.
- O filtro de Período utiliza `DimData[Data]`.
- Área e Centro de Custo filtram viagens e orçamento por meio da dimensão `centros_custo_raw`.
- O período filtra o realizado por `viagens_raw[data_ida]` e o orçamento por `orcamento_raw[mes_referencia]`.
- Os slicers das duas páginas usam os mesmos campos, mas ainda não pertencem a grupos de sincronização.

## Regras operacionais

- Viagem é contada por `viagem_id` distinto.
- Viagem fora da política é aquela em que `viagens_raw[fora_politica] = TRUE()`.
- Compra com menos de sete dias é aquela com `antecedencia_dias < 7`.
- Remarcação é identificada por `viagens_raw[remarcada] = TRUE()`.
- Cancelamento aéreo é identificado por `aereo_raw[cancelada] = TRUE()`.
- O custo de remarcação e cancelamento é somado diretamente das respectivas taxas da tabela aérea.

## Convenção visual

- Azul: realizado e informação principal.
- Azul-marinho/cinza-azulado: orçamento e estrutura.
- Verde: situação favorável, incluindo desvio numericamente negativo.
- Vermelho: situação desfavorável, incluindo desvio numericamente positivo.
- Cor não deve ser usada como único meio de interpretação; sinal, rótulo ou tooltip deve indicar “acima” ou “abaixo”.

## Regra de manutenção

Qualquer mudança futura em fórmula, grão, filtro ou semântica de cor deve atualizar simultaneamente:

1. o TMDL/DAX correspondente;
2. este documento;
3. o dicionário de KPIs;
4. os títulos, tooltips e formatações dos visuais afetados.
