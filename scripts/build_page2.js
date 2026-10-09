const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const report = path.join(root, 'Corporate_Travel_Intelligence.Report');
const sourcePage = '60bf25af6c012497cd0a';
const pageId = '4c8a34d9e12f6b90a7cd';
const sourceVisuals = path.join(report, 'definition', 'pages', sourcePage, 'visuals');
const pageDir = path.join(report, 'definition', 'pages', pageId);
const visualsDir = path.join(pageDir, 'visuals');

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeJson = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
};
const sourceVisual = (id) => readJson(path.join(sourceVisuals, id, 'visual.json'));
const saveVisual = (visual) => writeJson(path.join(visualsDir, visual.name, 'visual.json'), visual);
const clone = (value) => JSON.parse(JSON.stringify(value));

const literal = (value) => ({ expr: { Literal: { Value: value } } });
const bool = (value) => literal(value ? 'true' : 'false');
const num = (value, integer = false) => literal(`${value}${integer ? 'L' : 'D'}`);
const text = (value) => literal(`'${value}'`);
const color = (value) => ({ solid: { color: literal(`'${value}'`) } });
const column = (entity, property) => ({
  Column: { Expression: { SourceRef: { Entity: entity } }, Property: property }
});
const measure = (property) => ({
  Measure: { Expression: { SourceRef: { Entity: '_Medidas' } }, Property: property }
});
const aggregation = (entity, property, fn = 0) => ({
  Aggregation: { Expression: column(entity, property), Function: fn }
});
const projection = (field, queryRef, nativeQueryRef, displayName) => ({
  field,
  queryRef,
  nativeQueryRef,
  ...(displayName ? { displayName } : {})
});

function renameVisual(visual, name, position) {
  visual.name = name;
  visual.position = { ...visual.position, ...position };
  return visual;
}

function replaceStrings(value, replacements) {
  if (typeof value === 'string') {
    let result = value;
    for (const [from, to] of replacements) result = result.split(from).join(to);
    return result;
  }
  if (Array.isArray(value)) return value.map((item) => replaceStrings(item, replacements));
  if (value && typeof value === 'object') {
    for (const key of Object.keys(value)) value[key] = replaceStrings(value[key], replacements);
  }
  return value;
}

function setTitle(vco, title, subtitle) {
  const result = clone(vco);
  result.title ??= [{ properties: {} }];
  result.title[0].properties.show = bool(true);
  result.title[0].properties.text = text(title);
  result.title[0].properties.fontFamily = text("'Segoe UI Semibold', wf_segoe-ui_semibold, helvetica, arial, sans-serif");
  result.title[0].properties.fontSize = num(14);
  result.title[0].properties.fontColor = color('#172B4D');
  result.subTitle ??= [{ properties: {} }];
  result.subTitle[0].properties.show = bool(true);
  result.subTitle[0].properties.text = text(subtitle);
  result.subTitle[0].properties.fontFamily = text("'Segoe UI', wf_segoe-ui_normal, helvetica, arial, sans-serif");
  result.subTitle[0].properties.fontSize = num(9);
  result.subTitle[0].properties.fontColor = color('#6B778C');
  result.padding = [{ properties: { top: num(10), bottom: num(8), left: num(14), right: num(14) } }];
  result.spacing = [{ properties: {
    customizeSpacing: bool(true),
    spaceBelowTitle: num(1),
    spaceBelowSubTitle: num(2),
    spaceAbovePlotArea: num(0)
  } }];
  result.background = [{ properties: { show: bool(true), color: color('#FFFFFF'), transparency: num(0) } }];
  result.border = [{ properties: { show: bool(true), color: color('#DCE5F0'), radius: num(12), width: num(1) } }];
  result.dropShadow = [{ properties: { show: bool(false) } }];
  result.visualHeader = [{ properties: { show: bool(false) } }];
  return result;
}

function baseChart(name, type, position, title, subtitle) {
  const template = sourceVisual('994b8a19d8658f7281a2');
  return {
    $schema: template.$schema,
    name,
    position,
    visual: {
      visualType: type,
      query: { queryState: {} },
      objects: {},
      visualContainerObjects: setTitle(template.visual.visualContainerObjects, title, subtitle),
      drillFilterOtherVisuals: true
    }
  };
}

function makeCard(templateId, name, position, fromMeasure, toMeasure, label, colorReplacement) {
  const visual = renameVisual(clone(sourceVisual(templateId)), name, position);
  replaceStrings(visual, [
    [`_Medidas.${fromMeasure}`, `_Medidas.${toMeasure}`],
    [fromMeasure, toMeasure],
    ...(colorReplacement ? [[colorReplacement.from, colorReplacement.to]] : [])
  ]);
  const data = visual.visual.query.queryState.Data.projections[0];
  data.field.Measure.Property = toMeasure;
  data.queryRef = `_Medidas.${toMeasure}`;
  data.nativeQueryRef = toMeasure;
  data.displayName = label;
  return visual;
}

fs.mkdirSync(visualsDir, { recursive: true });

const sourcePageJson = readJson(path.join(report, 'definition', 'pages', sourcePage, 'page.json'));
writeJson(path.join(pageDir, 'page.json'), {
  ...sourcePageJson,
  name: pageId,
  displayName: '02 - Custos & Orçamento'
});

const pagesFile = path.join(report, 'definition', 'pages', 'pages.json');
const pages = readJson(pagesFile);
if (!pages.pageOrder.includes(pageId)) pages.pageOrder.push(pageId);
writeJson(pagesFile, pages);

const headerBg = renameVisual(clone(sourceVisual('dca8c92c3e127ea5f2ba')), 'a1010000000000000001', { z: 0, tabOrder: 1000 });
const headerText = renameVisual(clone(sourceVisual('f2664c4c49bff477becf')), 'a1010000000000000002', { z: 1000, tabOrder: 0 });
headerText.visual.visualContainerObjects.subTitle[0].properties.text = text('Custos & Orçamento');
const separator = renameVisual(clone(sourceVisual('0f1e2d3c4b5a69788766')), 'a1010000000000000003', { z: 500, tabOrder: 500 });

const areaSlicer = renameVisual(clone(sourceVisual('29b28eaa0faaa7f9133a')), 'a1010000000000000004', { z: 15000, tabOrder: 15000 });
const dateSlicer = renameVisual(clone(sourceVisual('d510f55e99586fe8325d')), 'a1010000000000000005', { z: 14000, tabOrder: 14000 });

const cardPositions = [
  { x: 24, y: 128, z: 2000, height: 128, width: 266, tabOrder: 2000 },
  { x: 306, y: 128, z: 3000, height: 128, width: 266, tabOrder: 3000 },
  { x: 588, y: 128, z: 4000, height: 128, width: 266, tabOrder: 4000 },
  { x: 870, y: 128, z: 5000, height: 128, width: 266, tabOrder: 5000 },
  { x: 1152, y: 128, z: 6000, height: 128, width: 264, tabOrder: 6000 }
];
const cards = [
  makeCard('8faf69e5a3f40eda8ebb', 'b2010000000000000001', cardPositions[0], 'Gasto Total', 'Gasto Total', 'Gasto Total'),
  makeCard('4f0ae0ab608e226cee9f', 'b2010000000000000002', cardPositions[1], 'Orçado', 'Orçado', 'Orçado'),
  makeCard('1650cd17e0b0b103231d', 'b2010000000000000003', cardPositions[2], 'Desvio %', 'Desvio R$', 'Desvio R$'),
  makeCard('1650cd17e0b0b103231d', 'b2010000000000000004', cardPositions[3], 'Desvio %', 'Desvio %', 'Desvio %'),
  makeCard('8faf69e5a3f40eda8ebb', 'b2010000000000000005', cardPositions[4], 'Gasto Total', 'Saving Estimado', 'Saving', { from: '#2F80ED', to: '#159B76' })
];
for (const card of [cards[2], cards[4]]) {
  const value = card.visual.objects.value.find((entry) => entry.selector?.id === 'default').properties;
  value.fontSize = num(24);
  value.labelDisplayUnits = text('1000');
  value.labelPrecision = num(1, true);
  value.customFormatString = text('R$ #,0.0;-R$ #,0.0;R$ 0,0');
}

const combo = baseChart(
  'c3010000000000000001',
  'lineClusteredColumnComboChart',
  { x: 24, y: 272, z: 7000, height: 200, width: 944, tabOrder: 7000 },
  'Orçado x Realizado por mês',
  'Comparação da execução mensal do orçamento'
);
combo.visual.query.queryState = {
  Category: { projections: [projection(column('DimData', 'AnoMes'), 'DimData.AnoMes', 'AnoMes')] },
  Y: { projections: [projection(measure('Gasto Total'), '_Medidas.Gasto Total', 'Gasto Total', 'Realizado')] },
  Y2: { projections: [projection(measure('Orçado'), '_Medidas.Orçado', 'Orçado', 'Orçado')] }
};
combo.visual.query.sortDefinition = {
  sort: [{ field: column('DimData', 'AnoMes'), direction: 'Ascending' }],
  isDefaultSort: true
};
combo.visual.objects = {
  categoryAxis: [{ properties: {
    showAxisTitle: bool(false),
    innerPadding: num(28, true),
    fontFamily: text("'Segoe UI', wf_segoe-ui_normal, helvetica, arial, sans-serif"),
    fontSize: num(8),
    labelColor: color('#667085')
  } }],
  valueAxis: [{ properties: {
    showAxisTitle: bool(false),
    sharedAxis: bool(true),
    secShow: bool(false),
    labelDisplayUnits: num(1000000),
    labelPrecision: num(1, true),
    fontSize: num(9),
    labelColor: color('#667085'),
    gridlineShow: bool(true),
    gridlineColor: color('#DCE5F0'),
    gridlineTransparency: num(72),
    gridlineThickness: num(1)
  } }],
  dataPoint: [
    { properties: { defaultColor: color('#2F80ED'), borderShow: bool(false) } },
    { properties: { fill: color('#52677F') }, selector: { metadata: '_Medidas.Orçado' } }
  ],
  lineStyles: [{ properties: {
    strokeWidth: num(2),
    strokeTransparency: num(10),
    lineStyle: text('dashed'),
    strokeDashCap: text('round'),
    showMarker: bool(false)
  }, selector: { metadata: '_Medidas.Orçado' } }],
  legend: [{ properties: {
    show: bool(true),
    position: text('TopRight'),
    showTitle: bool(false),
    fontSize: num(9),
    labelColor: color('#475467'),
    legendMarkerRendering: text('lineAndMarker'),
    matchLineColor: bool(true)
  } }]
};

const composition = baseChart(
  'c3010000000000000002',
  'clusteredBarChart',
  { x: 984, y: 272, z: 8000, height: 200, width: 432, tabOrder: 8000 },
  'Composição do gasto',
  'Distribuição das despesas por categoria'
);
const expenseValue = aggregation('despesas_raw', 'valor', 0);
composition.visual.query.queryState = {
  Category: { projections: [projection(column('despesas_raw', 'categoria'), 'despesas_raw.categoria', 'categoria', 'Categoria')] },
  Y: { projections: [projection(expenseValue, 'Sum(despesas_raw.valor)', 'Soma de valor', 'Realizado')] }
};
composition.visual.query.sortDefinition = {
  sort: [{ field: expenseValue, direction: 'Descending' }],
  isDefaultSort: true
};
composition.visual.objects = {
  categoryAxis: [{ properties: { showAxisTitle: bool(false), innerPadding: num(38, true), fontSize: num(9), labelColor: color('#475467') } }],
  valueAxis: [{ properties: { show: bool(false), showAxisTitle: bool(false) } }],
  dataPoint: [{ properties: { defaultColor: color('#2F80ED') } }],
  labels: [{ properties: {
    show: bool(true),
    labelPosition: text('OutsideEnd'),
    optimizeLabelDisplay: bool(true),
    fontSize: num(9),
    color: color('#475467'),
    labelDisplayUnits: num(1000000),
    labelPrecision: num(2, true),
    valueCustomFormatString: text('R$ #,0.00')
  } }]
};

const deviation = baseChart(
  'c3010000000000000003',
  'clusteredBarChart',
  { x: 24, y: 488, z: 9000, height: 172, width: 688, tabOrder: 9000 },
  'Desvio por área',
  'Onde estão os principais desvios orçamentários'
);
deviation.visual.query.queryState = {
  Category: { projections: [
    projection(column('centros_custo_raw', 'area'), 'centros_custo_raw.area', 'area', 'Área'),
    projection(column('centros_custo_raw', 'centro_custo'), 'centros_custo_raw.centro_custo', 'centro_custo', 'Centro de Custo')
  ] },
  Y: { projections: [projection(measure('Desvio R$'), '_Medidas.Desvio R$', 'Desvio R$', 'Desvio R$')] },
  Tooltips: { projections: [
    projection(measure('Gasto Total'), '_Medidas.Gasto Total', 'Gasto Total', 'Realizado'),
    projection(measure('Orçado'), '_Medidas.Orçado', 'Orçado', 'Orçado'),
    projection(measure('Desvio %'), '_Medidas.Desvio %', 'Desvio %', 'Desvio %')
  ] }
};
deviation.visual.query.sortDefinition = {
  sort: [{ field: measure('Desvio R$'), direction: 'Descending' }],
  isDefaultSort: true
};
deviation.visual.objects = {
  categoryAxis: [{ properties: { showAxisTitle: bool(false), innerPadding: num(38, true), fontSize: num(9), labelColor: color('#475467') } }],
  valueAxis: [{ properties: {
    showAxisTitle: bool(false),
    labelDisplayUnits: num(1000),
    labelPrecision: num(0, true),
    fontSize: num(9),
    labelColor: color('#667085'),
    gridlineShow: bool(true),
    gridlineColor: color('#DCE5F0'),
    gridlineTransparency: num(82)
  } }],
  dataPoint: [{ properties: {
    fill: {
      solid: {
        color: {
          expr: {
            Conditional: {
              Cases: [
                {
                  Condition: { Comparison: { ComparisonKind: 1, Left: measure('Desvio R$'), Right: { Literal: { Value: '0D' } } } },
                  Value: { Literal: { Value: "'#D94B4B'" } }
                },
                {
                  Condition: { Comparison: { ComparisonKind: 3, Left: measure('Desvio R$'), Right: { Literal: { Value: '0D' } } } },
                  Value: { Literal: { Value: "'#159B76'" } }
                }
              ],
              DefaultValue: { Literal: { Value: "'#98A2B3'" } }
            }
          }
        }
      }
    }
  }, selector: { data: [{ dataViewWildcard: { matchingOption: 0 } }] } }],
  labels: [{ properties: {
    show: bool(true),
    labelPosition: text('OutsideEnd'),
    optimizeLabelDisplay: bool(true),
    fontSize: num(9),
    color: color('#475467'),
    labelDisplayUnits: num(1000),
    labelPrecision: num(1, true),
    valueCustomFormatString: text('R$ #,0.0;-R$ #,0.0;R$ 0,0')
  } }]
};
deviation.visual.visualContainerObjects.visualHeader = [{ properties: { show: bool(true) } }];

const costCenter = baseChart(
  'c3010000000000000004',
  'clusteredBarChart',
  { x: 728, y: 488, z: 10000, height: 172, width: 688, tabOrder: 10000 },
  'Orçado x Realizado por centro de custo',
  'Comparação direta nos centros com maior desvio'
);
costCenter.visual.query.queryState = {
  Category: { projections: [projection(column('centros_custo_raw', 'centro_custo'), 'centros_custo_raw.centro_custo', 'centro_custo', 'Centro de Custo')] },
  Y: { projections: [
    projection(measure('Gasto Total'), '_Medidas.Gasto Total', 'Gasto Total', 'Realizado'),
    projection(measure('Orçado'), '_Medidas.Orçado', 'Orçado', 'Orçado')
  ] },
  Tooltips: { projections: [
    projection(measure('Desvio R$'), '_Medidas.Desvio R$', 'Desvio R$', 'Desvio R$'),
    projection(measure('Desvio %'), '_Medidas.Desvio %', 'Desvio %', 'Desvio %')
  ] }
};
costCenter.visual.query.sortDefinition = {
  sort: [{ field: measure('Desvio R$'), direction: 'Descending' }],
  isDefaultSort: true
};
costCenter.visual.objects = {
  categoryAxis: [{ properties: { showAxisTitle: bool(false), innerPadding: num(30, true), fontSize: num(9), labelColor: color('#475467') } }],
  valueAxis: [{ properties: { show: bool(false), showAxisTitle: bool(false) } }],
  dataPoint: [
    { properties: { fill: color('#2F80ED') }, selector: { metadata: '_Medidas.Gasto Total' } },
    { properties: { fill: color('#8EA0B8') }, selector: { metadata: '_Medidas.Orçado' } }
  ],
  legend: [{ properties: { show: bool(true), position: text('TopRight'), showTitle: bool(false), fontSize: num(9), labelColor: color('#475467') } }]
};

const matrix = baseChart(
  'd4010000000000000001',
  'pivotTable',
  { x: 24, y: 676, z: 11000, height: 200, width: 1392, tabOrder: 11000 },
  'Detalhamento de custos',
  'Investigação por área e centro de custo — maior desvio primeiro'
);
matrix.visual.query.queryState = {
  Rows: { projections: [
    projection(column('centros_custo_raw', 'area'), 'centros_custo_raw.area', 'area', 'Área'),
    projection(column('centros_custo_raw', 'centro_custo'), 'centros_custo_raw.centro_custo', 'centro_custo', 'Centro de Custo')
  ] },
  Values: { projections: [
    projection(measure('Orçado'), '_Medidas.Orçado', 'Orçado', 'Orçado'),
    projection(measure('Gasto Total'), '_Medidas.Gasto Total', 'Gasto Total', 'Realizado'),
    projection(measure('Desvio R$'), '_Medidas.Desvio R$', 'Desvio R$', 'Desvio R$'),
    projection(measure('Desvio %'), '_Medidas.Desvio %', 'Desvio %', 'Desvio %'),
    projection(measure('Qtd Viagens'), '_Medidas.Qtd Viagens', 'Qtd Viagens', 'Qtd Viagens')
  ] }
};
matrix.visual.query.sortDefinition = {
  sort: [{ field: measure('Desvio R$'), direction: 'Descending' }],
  isDefaultSort: true
};
const conditionalFont = (queryRef) => ({
  properties: {
    fontColor: {
      solid: {
        color: {
          expr: {
            Conditional: {
              Cases: [
                {
                  Condition: { Comparison: { ComparisonKind: 1, Left: measure(queryRef.replace('_Medidas.', '')), Right: { Literal: { Value: '0D' } } } },
                  Value: { Literal: { Value: "'#D94B4B'" } }
                },
                {
                  Condition: { Comparison: { ComparisonKind: 3, Left: measure(queryRef.replace('_Medidas.', '')), Right: { Literal: { Value: '0D' } } } },
                  Value: { Literal: { Value: "'#159B76'" } }
                }
              ],
              DefaultValue: { Literal: { Value: "'#475467'" } }
            }
          }
        }
      }
    }
  },
  selector: { data: [{ dataViewWildcard: { matchingOption: 1 } }], metadata: queryRef }
});
matrix.visual.objects = {
  columnHeaders: [{ properties: {
    columnAdjustment: text('growToFit'),
    autoSizeColumnWidth: bool(true),
    fontFamily: text("'Segoe UI Semibold', wf_segoe-ui_semibold, helvetica, arial, sans-serif"),
    fontSize: num(9),
    fontColor: color('#172B4D'),
    backColor: color('#F4F7FB'),
    wordWrap: bool(false),
    showExpandCollapseButtons: bool(true),
    expandCollapseButtonsColor: color('#667085')
  } }],
  rowHeaders: [{ properties: {
    stepped: bool(false),
    autoExpand: bool(true),
    showExpandCollapseButtons: bool(true),
    fontFamily: text("'Segoe UI', wf_segoe-ui_normal, helvetica, arial, sans-serif"),
    fontSize: num(9),
    fontColor: color('#344054'),
    backColor: color('#FFFFFF'),
    wordWrap: bool(false)
  } }],
  values: [
    { properties: {
      fontFamily: text("'Segoe UI', wf_segoe-ui_normal, helvetica, arial, sans-serif"),
      fontSize: num(9),
      fontColorPrimary: color('#344054'),
      fontColorSecondary: color('#344054'),
      backColorPrimary: color('#FFFFFF'),
      backColorSecondary: color('#F8FAFC'),
      wordWrap: bool(false)
    } },
    conditionalFont('_Medidas.Desvio R$'),
    conditionalFont('_Medidas.Desvio %')
  ],
  grid: [{ properties: {
    gridVertical: bool(false),
    gridHorizontal: bool(true),
    gridHorizontalColor: color('#E9EEF5'),
    gridHorizontalWeight: num(1),
    rowPadding: num(3),
    textSize: num(9)
  } }],
  rowTotal: [{ properties: { fontColor: color('#172B4D'), backColor: color('#EEF3F8') } }],
  columnTotal: [{ properties: { fontColor: color('#172B4D'), backColor: color('#EEF3F8') } }]
};
matrix.visual.visualContainerObjects.stylePreset = [{ properties: { name: text('None') } }];

[
  headerBg,
  headerText,
  separator,
  areaSlicer,
  dateSlicer,
  ...cards,
  combo,
  composition,
  deviation,
  costCenter,
  matrix
].forEach(saveVisual);

console.log(JSON.stringify({ pageId, visualCount: 15, pageDir }, null, 2));
