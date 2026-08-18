"""Generate synthetic CSVs for the Corporate Travel Intelligence case.

The script intentionally creates raw files with controlled data-quality issues
so the Power Query layer can demonstrate cleaning rules.

By default, files are written to data/generated to avoid overwriting the CSVs
published in the repository root.
"""

from __future__ import annotations

import argparse
import csv
import random
from calendar import monthrange
from dataclasses import dataclass
from datetime import date, timedelta
from pathlib import Path


AREAS = [
    "Administrativo",
    "Comercial",
    "Diretoria",
    "Financeiro",
    "Operações",
    "RH",
    "Tecnologia",
]

AREA_VARIANTS = {
    "Administrativo": ["Administrativo", "ADMINISTRATIVO", "Adm"],
    "Comercial": ["Comercial", "COMERCIAL", "Comercial "],
    "Operações": ["Operações", "OPERAÇÕES", "Operacoes"],
    "Tecnologia": ["Tecnologia", "TECNOLOGIA", "Tecnologia ", "TI"],
}

DESTINOS = [
    ("São Paulo", "SP", "Sudeste"),
    ("Rio de Janeiro", "RJ", "Sudeste"),
    ("Brasília", "DF", "Centro-Oeste"),
    ("Belo Horizonte", "MG", "Sudeste"),
    ("Curitiba", "PR", "Sul"),
    ("Porto Alegre", "RS", "Sul"),
    ("Recife", "PE", "Nordeste"),
    ("Fortaleza", "CE", "Nordeste"),
    ("Manaus", "AM", "Norte"),
    ("Salvador", "BA", "Nordeste"),
    ("Feira de Santana", "BA", "Nordeste"),
    ("Vitória da Conquista", "BA", "Nordeste"),
    ("Campinas", "SP", "Sudeste"),
    ("Aracaju", "SE", "Nordeste"),
    ("Ilhéus", "BA", "Nordeste"),
]

DESTINO_VARIANTS = {
    "São Paulo": ["São Paulo", "Sao Paulo", "SP - São Paulo", "são paulo"],
    "Rio de Janeiro": ["Rio de Janeiro", "RIO DE JANEIRO", "Rio"],
    "Brasília": ["Brasília", "Brasilia", "DF - Brasília"],
    "Feira de Santana": ["Feira de Santana", "FEIRA DE SANTANA", "Feira Santana"],
    "Vitória da Conquista": ["Vitória da Conquista", "Vitoria da Conquista", "Vit. da Conquista"],
}

MOTIVOS = [
    "Reunião comercial",
    "Treinamento",
    "Implantação de sistema",
    "Auditoria",
    "Evento corporativo",
    "Visita técnica",
    "Negociação com fornecedor",
]

CATEGORIAS_DESPESA = [
    "Ajuste de reembolso",
    "Alimentação",
    "Estacionamento",
    "Outros",
    "Pedágio",
    "Taxa",
    "Transporte terrestre",
]

COMPANHIAS = ["Azul", "GOL", "LATAM"]
COMPANHIA_VARIANTS = {
    "Azul": ["Azul", "AZUL", "Azul Linhas Aéreas"],
    "GOL": ["GOL", "gol", "Gol Linhas Aéreas"],
    "LATAM": ["LATAM", "latam", "LATAM Airlines", "Latam Airlines"],
}

HOTEIS = [
    "Hotel Executivo",
    "Business Inn",
    "Rede Central",
    "Hotel Avenida",
    "Corporate Suites",
    "Plaza Business",
]


@dataclass(frozen=True)
class CentroCusto:
    centro_custo_id: str
    area: str
    centro_custo: str
    diretoria: str


def money(value: float) -> str:
    return f"{value:.2f}"


def iso(value: date) -> str:
    return value.isoformat()


def choose_dirty_area(area: str, rng: random.Random) -> str:
    if area in AREA_VARIANTS and rng.random() < 0.18:
        return rng.choice(AREA_VARIANTS[area])
    return area


def choose_dirty_destination(destino: str, rng: random.Random) -> str:
    if destino in DESTINO_VARIANTS and rng.random() < 0.18:
        return rng.choice(DESTINO_VARIANTS[destino])
    return destino


def build_centros_custo() -> list[CentroCusto]:
    counts = {
        "Administrativo": 3,
        "Comercial": 4,
        "Diretoria": 2,
        "Financeiro": 3,
        "Operações": 4,
        "RH": 3,
        "Tecnologia": 4,
    }
    diretorias = {
        "Administrativo": "Administrativa",
        "Comercial": "Comercial",
        "Diretoria": "Presidência",
        "Financeiro": "Financeira",
        "Operações": "Operações",
        "RH": "Pessoas",
        "Tecnologia": "Tecnologia",
    }
    rows: list[CentroCusto] = []
    seq = 1
    for area, count in counts.items():
        for index in range(1, count + 1):
            rows.append(
                CentroCusto(
                    centro_custo_id=f"CC{seq:03d}",
                    area=area,
                    centro_custo=f"{area} {index}",
                    diretoria=diretorias[area],
                )
            )
            seq += 1
    return rows


def write_csv(path: Path, rows: list[dict[str, object]], fieldnames: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as fp:
        writer = csv.DictWriter(fp, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def generate(output_dir: Path, seed: int, overwrite: bool) -> None:
    rng = random.Random(seed)
    output_dir.mkdir(parents=True, exist_ok=True)

    expected_files = [
        "aereo_raw.csv",
        "centros_custo_raw.csv",
        "despesas_raw.csv",
        "hospedagem_raw.csv",
        "orcamento_raw.csv",
        "viagens_raw.csv",
        "viajantes_raw.csv",
    ]
    existing = [name for name in expected_files if (output_dir / name).exists()]
    if existing and not overwrite:
        raise SystemExit("Output files already exist. Use --overwrite or another --output-dir.")

    centros = build_centros_custo()
    centros_by_area: dict[str, list[CentroCusto]] = {}
    for centro in centros:
        centros_by_area.setdefault(centro.area, []).append(centro)

    viajantes: list[dict[str, object]] = []
    for i in range(1, 191):
        area = rng.choices(AREAS, weights=[10, 27, 5, 8, 25, 8, 17], k=1)[0]
        centro = rng.choice(centros_by_area[area])
        viajantes.append(
            {
                "viajante_id": f"VIAJ{i:04d}",
                "nome_viajante": f"Viajante {i:03d}",
                "area": area,
                "centro_custo_id": centro.centro_custo_id,
                "senioridade": rng.choice(["Analista", "Coordenador", "Gerente", "Diretor"]),
                "risco_comportamental": money(rng.uniform(0.05, 0.95)),
                "ativo": rng.random() > 0.06,
            }
        )

    viagens: list[dict[str, object]] = []
    aereo: list[dict[str, object]] = []
    hospedagem: list[dict[str, object]] = []
    despesas: list[dict[str, object]] = []
    start = date(2024, 1, 1)
    end = date(2025, 12, 31)
    total_days = (end - start).days

    for i in range(1, 5001):
        viajante = rng.choice(viajantes)
        clean_area = str(viajante["area"])
        centro_custo_id = str(viajante["centro_custo_id"])
        destino, uf, regiao = rng.choice(DESTINOS)
        data_ida = start + timedelta(days=rng.randint(0, total_days))
        duracao = rng.randint(1, 8)
        antecedencia = max(0, int(rng.gauss(18, 9)))
        data_compra = data_ida - timedelta(days=antecedencia)
        data_solicitacao = data_compra - timedelta(days=rng.randint(0, 5))
        data_aprovacao = data_solicitacao + timedelta(days=rng.randint(0, 3))
        remarcada = rng.random() < 0.12
        cancelada = rng.random() < 0.05
        fora_politica = rng.random() < (0.22 if antecedencia < 7 else 0.11)
        base_area = {
            "Comercial": 1.18,
            "Operações": 1.08,
            "Tecnologia": 1.00,
            "Diretoria": 1.45,
            "Financeiro": 0.92,
            "Administrativo": 0.88,
            "RH": 0.86,
        }[clean_area]
        seasonal = 1.14 if data_ida.month in [3, 5, 9, 10] else 1.0
        short_notice = 1.22 if antecedencia < 7 else 1.0
        valor_aereo = rng.uniform(650, 1800) * base_area * seasonal * short_notice
        valor_hospedagem = duracao * rng.uniform(220, 620) * base_area
        valor_reembolso = rng.uniform(80, 650) * (1 + duracao / 8)
        gasto_total = valor_aereo + valor_hospedagem + valor_reembolso
        valor_referencia = gasto_total * rng.uniform(1.02, 1.18)
        saving_estimado = max(0, valor_referencia - gasto_total)
        viagem_id = f"TRV{i:05d}"

        viagens.append(
            {
                "viagem_id": viagem_id,
                "viajante_id": viajante["viajante_id"],
                "area": choose_dirty_area(clean_area, rng),
                "centro_custo_id": centro_custo_id,
                "motivo": rng.choice(MOTIVOS),
                "origem": "Salvador",
                "destino": choose_dirty_destination(destino, rng),
                "uf_destino": uf,
                "regiao_destino": regiao,
                "data_solicitacao": iso(data_solicitacao),
                "data_aprovacao": iso(data_aprovacao),
                "data_compra": iso(data_compra),
                "data_ida": iso(data_ida),
                "data_volta": iso(data_ida + timedelta(days=duracao)),
                "antecedencia_dias": antecedencia,
                "duracao_dias": duracao,
                "status": "Cancelada" if cancelada else "Concluída",
                "remarcada": remarcada,
                "fora_politica": fora_politica,
                "tempo_aprovacao_horas": money(rng.uniform(2, 72)),
                "saving_pct_referencia": money(saving_estimado / valor_referencia),
                "valor_aereo_realizado": money(valor_aereo),
                "valor_hospedagem_realizado": money(valor_hospedagem),
                "valor_despesas_reembolsaveis": money(valor_reembolso),
                "gasto_total_realizado": money(gasto_total),
                "valor_referencia": money(valor_referencia),
                "saving_estimado": money(saving_estimado),
            }
        )

        if rng.random() < 0.91:
            companhia = rng.choice(COMPANHIAS)
            aereo.append(
                {
                    "viagem_id": viagem_id,
                    "companhia_aerea": rng.choice(COMPANHIA_VARIANTS[companhia]),
                    "rota": f"SSA-{uf}",
                    "tarifa_base": money(valor_aereo * rng.uniform(0.82, 0.95)),
                    "taxa_remarcacao": money(rng.uniform(120, 480) if remarcada else 0),
                    "taxa_cancelamento": money(rng.uniform(160, 620) if cancelada else 0),
                    "valor_aereo_realizado": money(valor_aereo),
                    "antecedencia_dias": antecedencia,
                    "remarcada": remarcada,
                    "cancelada": cancelada,
                }
            )

        if rng.random() < 0.80:
            hospedagem.append(
                {
                    "viagem_id": viagem_id,
                    "hotel": "" if rng.random() < 0.01 else rng.choice(HOTEIS),
                    "cidade": choose_dirty_destination(destino, rng),
                    "diarias": duracao,
                    "valor_diaria": money(valor_hospedagem / max(duracao, 1)),
                    "valor_hospedagem_realizado": money(valor_hospedagem),
                    "fora_politica_hotel": fora_politica and rng.random() < 0.55,
                }
            )

        for despesa_num in range(rng.randint(2, 5)):
            despesas.append(
                {
                    "despesa_id": f"DSP{i:05d}-{despesa_num + 1}",
                    "viagem_id": viagem_id,
                    "categoria": rng.choice(CATEGORIAS_DESPESA),
                    "valor": money(rng.uniform(25, 420)),
                    "data_despesa": iso(data_ida + timedelta(days=rng.randint(0, duracao))),
                    "reembolsavel": rng.random() < 0.82,
                }
            )

    for row in rng.sample(viagens, 15):
        viagens.append(dict(row))
    for row in rng.sample(viagens[:5000], 8):
        row["data_compra"] = "data_invalida"
    for row in rng.sample(viagens[:5000], 20):
        row["centro_custo_id"] = ""
    for row in rng.sample(viagens[:5000], 20):
        row["motivo"] = ""
    for row in rng.sample(despesas, min(30, len(despesas))):
        despesas.append(dict(row))
    for row in rng.sample(aereo, min(24, len(aereo))):
        row["companhia_aerea"] = ""

    orcamento: list[dict[str, object]] = []
    for year in [2024, 2025]:
        for month in range(1, 13):
            days = monthrange(year, month)[1]
            mes_referencia = date(year, month, 1)
            seasonal = 1.12 if month in [3, 5, 9, 10] else 1.0
            for centro in centros:
                area_factor = {
                    "Comercial": 52000,
                    "Operações": 47000,
                    "Tecnologia": 40000,
                    "Diretoria": 62000,
                    "Financeiro": 33000,
                    "Administrativo": 31000,
                    "RH": 30000,
                }[centro.area]
                budget = area_factor * seasonal * rng.uniform(0.86, 1.16)
                orcamento.append(
                    {
                        "mes_referencia": iso(mes_referencia),
                        "area": centro.area,
                        "centro_custo_id": centro.centro_custo_id,
                        "orcado": money(budget * days / 30),
                    }
                )

    write_csv(output_dir / "centros_custo_raw.csv", [c.__dict__ for c in centros], ["centro_custo_id", "area", "centro_custo", "diretoria"])
    write_csv(output_dir / "viajantes_raw.csv", viajantes, ["viajante_id", "nome_viajante", "area", "centro_custo_id", "senioridade", "risco_comportamental", "ativo"])
    write_csv(output_dir / "viagens_raw.csv", viagens, ["viagem_id", "viajante_id", "area", "centro_custo_id", "motivo", "origem", "destino", "uf_destino", "regiao_destino", "data_solicitacao", "data_aprovacao", "data_compra", "data_ida", "data_volta", "antecedencia_dias", "duracao_dias", "status", "remarcada", "fora_politica", "tempo_aprovacao_horas", "saving_pct_referencia", "valor_aereo_realizado", "valor_hospedagem_realizado", "valor_despesas_reembolsaveis", "gasto_total_realizado", "valor_referencia", "saving_estimado"])
    write_csv(output_dir / "aereo_raw.csv", aereo, ["viagem_id", "companhia_aerea", "rota", "tarifa_base", "taxa_remarcacao", "taxa_cancelamento", "valor_aereo_realizado", "antecedencia_dias", "remarcada", "cancelada"])
    write_csv(output_dir / "hospedagem_raw.csv", hospedagem, ["viagem_id", "hotel", "cidade", "diarias", "valor_diaria", "valor_hospedagem_realizado", "fora_politica_hotel"])
    write_csv(output_dir / "despesas_raw.csv", despesas, ["despesa_id", "viagem_id", "categoria", "valor", "data_despesa", "reembolsavel"])
    write_csv(output_dir / "orcamento_raw.csv", orcamento, ["mes_referencia", "area", "centro_custo_id", "orcado"])

    print(f"Synthetic data generated in: {output_dir.resolve()}")
    for name in expected_files:
        with (output_dir / name).open(encoding="utf-8") as fp:
            row_count = sum(1 for _ in fp) - 1
        print(f"{name}: {row_count} rows")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", default="data/generated", help="Directory where CSV files will be written.")
    parser.add_argument("--seed", type=int, default=42, help="Random seed.")
    parser.add_argument("--overwrite", action="store_true", help="Overwrite CSV files in output-dir.")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    generate(Path(args.output_dir), seed=args.seed, overwrite=args.overwrite)


if __name__ == "__main__":
    main()
