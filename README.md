# Label-Sim

Project Vision:

O jogador assume o papel de CEO de uma gravadora musical, competindo em um mercado vivo onde artistas, músicas, gravadoras, rádios, plataformas e festivais evoluem continuamente. O foco é gestão estratégica e observação das consequências das decisões ao longo de décadas.

Core Loop:
Descobrir artista

↓

Negociar contrato

↓

Produzir música

↓

Marketing

↓

Lançar

↓

Charts

↓

Receita

↓

Expandir gravadora

↓

Repetir

UI Guidelines:
A interface nunca toma decisões.
Ela apenas mostra.
Toda decisão pertence à simulação.

Proggraming Guidelines:
nunca alterar APIs públicas
nunca modificar módulos não solicitados
preferir composição à herança
toda entidade possui ID único
evitar números mágicos
documentar funções públicas


Criar as seguintes pastas:
ChartWarsBrasil/
│
├── docs/                        # Toda a documentação canônica
│   │
│   ├── 00_Visao/
│   ├── 01_Regras/
│   ├── 02_Arquitetura/
│   ├── 03_Entities/
│   ├── 04_Simulacao/
│   ├── 05_Economia/
│   ├── 06_Musica/
│   ├── 07_IA/
│   ├── 08_UI/
│   ├── 09_Roadmap/
│   └── decisions/
│
├── database/
│   │
│   ├── artists/
│   ├── bands/
│   ├── songs/
│   ├── albums/
│   ├── labels/
│   ├── genres/
│   ├── countries/
│   ├── charts/
│   ├── radio/
│   ├── media/
│   └── templates/
│
├── src/
│   │
│   ├── engine/
│   ├── simulation/
│   ├── entities/
│   ├── systems/
│   ├── ui/
│   ├── utils/
│   └── save/
│
├── assets/
│   ├── images/
│   ├── icons/
│   ├── logos/
│   ├── fonts/
│   └── audio/
│
├── tests/
│
├── tools/
│
├── saves/
│
└── backups/
