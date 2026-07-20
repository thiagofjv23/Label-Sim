# Estrutura da UI — Label Sim

## Objetivo

A interface transforma a database e o estado da simulação em uma central de decisão. Toda tela deve responder rapidamente a três perguntas:

1. O que está acontecendo?
2. Por que isso importa?
3. Qual informação o jogador precisa consultar antes de decidir?

## Direção visual

- Referência temporal: indústria musical de 2005, no período de transição entre mídia física e digital.
- Cores: azul-petróleo, prata, verde de visor, azul técnico e âmbar.
- Elementos de época: CDs, painéis de equipamento, displays compactos e tipografia condensada.
- A referência a 2005 é estética; legibilidade, contraste, responsividade e áreas de toque seguem padrões atuais.

## Navegação principal

| Área | Finalidade |
|---|---|
| Início | Resumo executivo, prioridades, elenco e agenda |
| Talentos | Artistas e bandas, habilidades e dados comerciais |
| Catálogo | Álbuns e músicas com seus relacionamentos |
| Charts | Charts mundiais e locais padronizados |
| Mercados | Comparação de países e regiões musicais |
| Estrutura | Gravadoras, estúdios, venues e gêneros |

No desktop, a navegação fica na lateral. No mobile, as cinco áreas mais frequentes permanecem na barra inferior e as áreas operacionais ficam no menu lateral.

## Acesso aos dados

- A UI lê automaticamente os JSONs presentes em `database/` durante o build.
- Arquivos com uma entidade ou arrays de entidades são suportados.
- Selecionar um registro abre o painel de detalhes completos.
- IDs relacionados são apresentados com o nome da entidade quando a referência existe.
- A busca global consulta nome, tipo e descrição de todas as entidades carregadas.
- Dados ainda não produzidos pela simulação são identificados como pendentes; a UI não inventa posições, vendas ou resultados.

## Organização técnica

```text
src/ui/
├── App.tsx       # navegação, páginas, componentes e painel de detalhes
├── data.ts       # carregamento e resolução da database
├── main.tsx      # ponto de entrada React
└── styles.css    # sistema visual e breakpoints responsivos
```

## Comandos

```bash
npm run ui
npm run ui:build
npm run ui:preview
```

O build da interface é gerado em `dist-ui/`. O build do motor permanece separado em `dist/`.

## Publicação (GitHub Pages)

O workflow `.github/workflows/deploy-ui.yml` builda a UI e publica no GitHub Pages
a cada push (main ou branch de desenvolvimento). O `base` do Vite é relativo no
build (`./`), então funciona no subcaminho do Pages.

Passo único (no GitHub): **Settings → Pages → Source: "GitHub Actions"**. Depois,
a URL do site aparece na aba **Actions** (job `deploy`) e em **Settings → Pages**
— algo como `https://<usuario>.github.io/Label-Sim/`.
