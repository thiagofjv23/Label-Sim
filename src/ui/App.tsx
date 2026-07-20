import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import {
  Activity,
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Disc3,
  Factory,
  Gauge,
  Globe2,
  Home,
  Library,
  MapPin,
  Menu,
  Mic2,
  Music2,
  Radio,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  TrendingUp,
  Trophy,
  Tv,
  Users,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  byId,
  byType,
  entities,
  entityLabels,
  entityName,
  formatMoney,
  formatNumber,
  mediaTypeLabels,
  resolveName,
  type EntityRecord,
} from "./data";
import { GameDate } from "../engine/time/GameDate";
import { generateEditions, isBookingWindowOpen, MEDIA_BOOKING_LEAD_DAYS } from "../systems/media";
import type { MediaOutlet } from "../entities/MediaOutlet";

type Page = "home" | "talent" | "releases" | "charts" | "markets" | "network" | "agenda";

/** Data atual da simulacao exibida pela UI (inicio: 03 JAN 2005). */
const SIM_DATE = GameDate.fromCalendar(2005, 1, 3);
/** Horizonte da agenda de midia (dias a frente). */
const AGENDA_HORIZON_DAYS = 56;
const MONTHS_PT = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

/** Uma edicao futura de midia, com estado de reserva para exibicao. */
type EditionRow = { outlet: EntityRecord; date: string; daysUntil: number; capacity: number; bookable: boolean };

/** Gera as proximas edicoes de todas as MediaOutlets, em ordem cronologica. */
function upcomingEditions(): EditionRow[] {
  const to = SIM_DATE.addDays(AGENDA_HORIZON_DAYS);
  const rows: EditionRow[] = [];
  for (const outlet of byType("MediaOutlet")) {
    for (const edition of generateEditions(outlet as unknown as MediaOutlet, SIM_DATE, to)) {
      const [year, month, day] = edition.date.split("-").map(Number);
      const daysUntil = GameDate.fromCalendar(year, month, day).toDayIndex() - SIM_DATE.toDayIndex();
      rows.push({ outlet, date: edition.date, daysUntil, capacity: edition.capacity, bookable: isBookingWindowOpen(daysUntil) });
    }
  }
  return rows.sort((a, b) => a.date.localeCompare(b.date));
}

const mediaEditionRows = upcomingEditions();
const agendaOpenCount = mediaEditionRows.filter((row) => row.bookable).length;

type NavItem = { id: Page; label: string; icon: LucideIcon };

const navItems: NavItem[] = [
  { id: "home", label: "Início", icon: Home },
  { id: "talent", label: "Talentos", icon: Users },
  { id: "releases", label: "Catálogo", icon: Disc3 },
  { id: "charts", label: "Charts", icon: BarChart3 },
  { id: "markets", label: "Mercados", icon: Globe2 },
];

const sony = byId("label_sony_music") ?? byType("Label")[0];

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function num(parent: unknown, key: string): number {
  const value = asRecord(parent)[key];
  return typeof value === "number" ? value : 0;
}

function AppHeader({ onMenu, onSearch, onSelect }: { onMenu: () => void; onSearch: () => void; onSelect: (entity: EntityRecord) => void }) {
  return (
    <header className="topbar">
      <button className="icon-button mobile-only" onClick={onMenu} aria-label="Abrir menu"><Menu size={21} /></button>
      <button className="brand-lockup" onClick={() => sony && onSelect(sony)}>
        <span className="brand-disc"><Disc3 size={21} /></span>
        <span><strong>LABEL//SIM</strong><small>MUSIC BUSINESS 2005</small></span>
      </button>
      <div className="topbar-actions">
        <button className="search-button" onClick={onSearch}><Search size={17} /><span>Buscar artista, álbum, mercado...</span><kbd>⌘ K</kbd></button>
        <button className="date-chip"><CalendarDays size={16} /><span>03 JAN 2005</span></button>
        <button className="icon-button notification" aria-label="Notificações"><Bell size={19} /><i /></button>
      </div>
    </header>
  );
}

function SideNav({ page, open, onClose, onPage }: { page: Page; open: boolean; onClose: () => void; onPage: (page: Page) => void }) {
  return (
    <>
      {open && <button className="nav-scrim" onClick={onClose} aria-label="Fechar menu" />}
      <aside className={`sidenav ${open ? "is-open" : ""}`}>
        <div className="label-profile">
          <span className="label-monogram">SM</span>
          <div><small>VOCÊ ADMINISTRA</small><strong>{sony ? entityName(sony) : "Gravadora"}</strong><span>Brasil · Major</span></div>
        </div>
        <nav>
          <small className="nav-label">CENTRAL</small>
          {navItems.map((item) => {
            const Icon = item.icon;
            return <button key={item.id} className={page === item.id ? "active" : ""} onClick={() => { onPage(item.id); onClose(); }}><Icon size={19} /><span>{item.label}</span>{page === item.id && <i />}</button>;
          })}
          <small className="nav-label">OPERAÇÃO</small>
          <button onClick={() => { onPage("network"); onClose(); }} className={page === "network" ? "active" : ""}><Factory size={19} /><span>Estrutura</span></button>
          <button onClick={() => { onPage("agenda"); onClose(); }} className={page === "agenda" ? "active" : ""}><CalendarDays size={19} /><span>Agenda</span>{agendaOpenCount > 0 && <em>{agendaOpenCount}</em>}{page === "agenda" && <i />}</button>
          <button><CircleDollarSign size={19} /><span>Finanças</span></button>
        </nav>
        <div className="sim-controls">
          <div><span><Clock3 size={15} /> SIMULAÇÃO</span><strong>PAUSADA</strong></div>
          <button aria-label="Avançar um dia"><ChevronRight size={18} /></button>
        </div>
      </aside>
    </>
  );
}

function PageTitle({ eyebrow, title, subtitle, action }: { eyebrow: string; title: string; subtitle: string; action?: ReactNode }) {
  return <div className="page-title"><div><small>{eyebrow}</small><h1>{title}</h1><p>{subtitle}</p></div>{action}</div>;
}

function StatCard({ label, value, detail, tone = "mint", icon: Icon }: { label: string; value: string; detail: string; tone?: string; icon: LucideIcon }) {
  return <article className={`stat-card tone-${tone}`}><div><span className="stat-icon"><Icon size={19} /></span><small>{label}</small></div><strong>{value}</strong><p>{detail}</p></article>;
}

function RatingBar({ label, value, color = "mint" }: { label: string; value: number; color?: string }) {
  return <div className="rating-row"><span>{label}</span><div><i className={color} style={{ width: `${value}%` }} /></div><strong>{value}</strong></div>;
}

function Section({ title, kicker, action, children, className = "" }: { title: string; kicker?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return <section className={`panel ${className}`}><div className="panel-head"><div>{kicker && <small>{kicker}</small>}<h2>{title}</h2></div>{action}</div>{children}</section>;
}

function HomePage({ onPage, onSelect }: { onPage: (page: Page) => void; onSelect: (entity: EntityRecord) => void }) {
  const commercial = asRecord(sony?.commercial);
  const ratings = asRecord(sony?.ratings);
  const roster = byType("Artist").filter((artist) => artist.currentLabelId === sony?.id).slice(0, 4);
  const fallbackRoster = roster.length ? roster : byType("Artist").slice(0, 4);

  return <>
    <PageTitle eyebrow="SEGUNDA-FEIRA · SEMANA 01" title="Bom dia, presidente." subtitle="O mercado abriu. Veja o que exige sua atenção antes de avançar a simulação." action={<button className="primary-action"><Zap size={17} /> Avançar dia</button>} />
    <div className="stats-grid">
      <StatCard icon={CircleDollarSign} label="CAIXA DISPONÍVEL" value={formatMoney(commercial.budget)} detail="Poder financeiro 99/100" />
      <StatCard icon={TrendingUp} label="MARKET SHARE" value={`${formatNumber(commercial.marketShare)}%`} detail="Brasil · mercado principal" tone="blue" />
      <StatCard icon={Mic2} label="ARTISTAS ATIVOS" value={formatNumber(commercial.activeArtists)} detail={`${formatNumber(commercial.activeContracts)} contratos vigentes`} tone="amber" />
      <StatCard icon={Library} label="CATÁLOGO" value={formatNumber(asRecord(sony?.catalog).songs)} detail={`${formatNumber(asRecord(sony?.catalog).albums)} álbuns`} tone="violet" />
    </div>

    <div className="dashboard-grid">
      <Section title="Pulso da gravadora" kicker="CAPACIDADE OPERACIONAL" action={<button className="text-action" onClick={() => sony && onSelect(sony)}>Ver perfil <ChevronRight size={15} /></button>}>
        <div className="rating-list">
          <RatingBar label="Reputação" value={num(ratings, "reputation")} />
          <RatingBar label="Marketing" value={num(ratings, "marketing")} color="blue" />
          <RatingBar label="Distribuição" value={num(ratings, "distribution")} color="amber" />
          <RatingBar label="Desenv. artístico" value={num(ratings, "artistDevelopment")} color="violet" />
        </div>
      </Section>

      <Section title="Prioridades de hoje" kicker="CENTRAL DE DECISÕES" className="priority-panel">
        <div className="priority-list">
          <button><span className="priority-icon amber"><Radio size={18} /></span><div><strong>Planejar campanha de rádio</strong><small>2 lançamentos aguardam investimento</small></div><ChevronRight size={17} /></button>
          <button><span className="priority-icon mint"><Users size={18} /></span><div><strong>Revisar o elenco</strong><small>Contratos e desenvolvimento artístico</small></div><ChevronRight size={17} /></button>
          <button><span className="priority-icon blue"><Globe2 size={18} /></span><div><strong>Analisar novos mercados</strong><small>Japão apresenta baixa pirataria</small></div><ChevronRight size={17} /></button>
        </div>
      </Section>

      <Section title="Seu elenco" kicker="DESTAQUES" action={<button className="text-action" onClick={() => onPage("talent")}>Todos <ChevronRight size={15} /></button>} className="roster-panel">
        <div className="roster-list">
          {fallbackRoster.map((artist, index) => {
            const artistCommercial = asRecord(artist.commercial);
            return <button key={artist.id} onClick={() => onSelect(artist)}><span className={`avatar avatar-${index + 1}`}>{entityName(artist).split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><div><strong>{entityName(artist)}</strong><small>{resolveName((artist.genreIds as unknown[])?.[0])} · Popularidade {formatNumber(artistCommercial.popularity)}</small></div><span className="score">{formatNumber(artistCommercial.prestige)}<small>PREST.</small></span></button>;
          })}
        </div>
      </Section>

      <Section title="Agenda executiva" kicker="PRÓXIMOS 7 DIAS" className="agenda-panel">
        <div className="timeline">
          <div><time>04<small>JAN</small></time><i /><span><strong>Reunião de A&R</strong><small>Seleção de demos · 10:00</small></span></div>
          <div><time>06<small>JAN</small></time><i /><span><strong>Fechamento de campanha</strong><small>Marketing · Detalhes</small></span></div>
          <div><time>08<small>JAN</small></time><i /><span><strong>Atualização do chart local</strong><small>Top 100 Brasil · Singles</small></span></div>
        </div>
      </Section>
    </div>
  </>;
}

function FilterBar({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) {
  return <div className="filter-bar"><div className="filter-chips">{options.map((option) => <button key={option} className={value === option ? "active" : ""} onClick={() => onChange(option)}>{option}</button>)}</div><button className="filter-button"><SlidersHorizontal size={16} /> Filtros</button></div>;
}

function TalentPage({ onSelect }: { onSelect: (entity: EntityRecord) => void }) {
  const [filter, setFilter] = useState("Todos");
  const talents = [...byType("Artist"), ...byType("Band")];
  const filtered = talents.filter((talent) => filter === "Todos" || (filter === "Solo" ? talent.type === "Artist" : talent.type === "Band"));
  return <>
    <PageTitle eyebrow="A&R · ELENCO GLOBAL" title="Talentos" subtitle={`${talents.length} registros carregados. Compare habilidades, alcance comercial e vínculos contratuais.`} action={<button className="secondary-action"><Sparkles size={17} /> Buscar talento</button>} />
    <FilterBar value={filter} onChange={setFilter} options={["Todos", "Solo", "Bandas"]} />
    <div className="talent-grid">
      {filtered.map((talent, index) => {
        const commercial = asRecord(talent.commercial);
        const skills = asRecord(talent.skills);
        const genres = (talent.genreIds as unknown[] | undefined) ?? [];
        return <button className="talent-card" key={talent.id} onClick={() => onSelect(talent)}>
          <div className="talent-cover"><span className={`avatar avatar-${(index % 4) + 1}`}>{entityName(talent).split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><i>{talent.type === "Band" ? "BANDA" : "SOLO"}</i></div>
          <div className="talent-content"><small>{String(talent.nationality ?? "—")} · {String(talent.careerStatus ?? "Active")}</small><h2>{entityName(talent)}</h2><p>{genres.slice(0, 3).map(resolveName).join(" · ") || "Gêneros não informados"}</p>
            <div className="mini-scores"><span><strong>{formatNumber(commercial.popularity)}</strong>Popularidade</span><span><strong>{formatNumber(commercial.prestige)}</strong>Prestígio</span><span><strong>{formatNumber(skills.charisma)}</strong>Carisma</span></div>
            <div className="talent-footer"><span>{resolveName(talent.currentLabelId)}</span><ChevronRight size={17} /></div>
          </div>
        </button>;
      })}
    </div>
  </>;
}

function ReleasesPage({ onSelect }: { onSelect: (entity: EntityRecord) => void }) {
  const [filter, setFilter] = useState("Todos");
  const albums = byType("Album");
  const songs = byType("Song");
  const items = filter === "Álbuns" ? albums : filter === "Músicas" ? songs : [...albums, ...songs];
  return <>
    <PageTitle eyebrow="CATÁLOGO · REPERTÓRIO" title="Lançamentos" subtitle="Catálogo navegável com autoria, gêneros, status, avaliações e vínculos entre gravações." action={<button className="primary-action"><Music2 size={17} /> Novo projeto</button>} />
    <FilterBar value={filter} onChange={setFilter} options={["Todos", "Álbuns", "Músicas"]} />
    <div className="release-list">
      {items.map((item, index) => {
        const ratings = asRecord(item.ratings);
        const ownerId = item.artistId ?? item.bandId;
        return <button key={item.id} onClick={() => onSelect(item)}>
          <span className={`album-art art-${(index % 4) + 1}`}><Disc3 size={29} /></span>
          <div className="release-main"><small>{item.type === "Album" ? "ÁLBUM" : "SINGLE / FAIXA"} · {String(item.releaseDate ?? "SEM DATA").slice(0, 4)}</small><strong>{entityName(item)}</strong><span>{resolveName(ownerId)} · {((item.genreIds as unknown[] | undefined) ?? []).map(resolveName).join(", ")}</span></div>
          <div className="release-meta"><span><strong>{formatNumber(ratings.commercialAppeal || ratings.composition)}</strong><small>APelo</small></span><span className={`status ${String(item.status).includes("released") || asRecord(item.status).released ? "released" : ""}`}>{String(item.status).includes("released") || asRecord(item.status).released ? "Lançado" : String(item.status)}</span></div>
          <ChevronRight size={18} />
        </button>;
      })}
    </div>
  </>;
}

function ChartsPage({ onSelect }: { onSelect: (entity: EntityRecord) => void }) {
  const charts = byType("Chart");
  const [scope, setScope] = useState("Todos");
  const filtered = charts.filter((chart) => scope === "Todos" || chart.scope === scope);
  return <>
    <PageTitle eyebrow="INTELIGÊNCIA DE MERCADO" title="Charts" subtitle="Acompanhe todas as paradas padronizadas sem nomes ambíguos: mundial ou local, álbuns ou singles." action={<button className="secondary-action"><Clock3 size={17} /> Histórico</button>} />
    <FilterBar value={scope} onChange={setScope} options={["Todos", "World", "Local"]} />
    <div className="chart-summary">
      <StatCard icon={Trophy} label="CHARTS ATIVOS" value={String(charts.length)} detail="Cobertura da database" tone="amber" />
      <StatCard icon={Globe2} label="MUNDIAIS" value={String(charts.filter((chart) => chart.scope === "World").length)} detail="Álbuns e singles" tone="blue" />
      <StatCard icon={MapPin} label="LOCAIS" value={String(charts.filter((chart) => chart.scope === "Local").length)} detail="Mercados nacionais" />
    </div>
    <div className="chart-grid">
      {filtered.map((chart) => <button className="chart-card" key={chart.id} onClick={() => onSelect(chart)}><div><span className="chart-icon"><BarChart3 size={21} /></span><span className="status waiting">PRÉ-LANÇAMENTO</span></div><small>{String(chart.scope).toUpperCase()} · {String(chart.category).toUpperCase()}</small><h2>{entityName(chart)}</h2><p>{String(chart.description ?? "Parada musical da simulação.")}</p><dl><div><dt>Posições</dt><dd>{formatNumber(chart.size)}</dd></div><div><dt>Atualização</dt><dd>{String(chart.updateFrequency)}</dd></div><div><dt>Prestígio</dt><dd>{formatNumber(chart.prestige)}</dd></div></dl><footer>Primeira apuração pendente <ChevronRight size={17} /></footer></button>)}
    </div>
  </>;
}

function MarketsPage({ onSelect }: { onSelect: (entity: EntityRecord) => void }) {
  const countries = byType("Country");
  return <>
    <PageTitle eyebrow="EXPANSÃO INTERNACIONAL" title="Mercados" subtitle="Compare potencial comercial, economia, mídia, pirataria e hábitos de consumo no início de 2005." action={<button className="secondary-action"><Gauge size={17} /> Comparar</button>} />
    <div className="market-grid">
      {countries.map((country) => {
        const display = asRecord(country.display);
        return <button className="market-card" key={country.id} onClick={() => onSelect(country)} style={{ "--market-color": String(display.color ?? "#4ed7bd") } as CSSProperties}>
          <div className="market-head"><span className="flag">{String(display.flag ?? "🌐")}</span><span className="status active">ATIVO</span></div><small>{String(country.continent ?? "Mercado agregado")}</small><h2>{String(display.name ?? entityName(country))}</h2><p>{String(country.description ?? "")}</p>
          <div className="market-score"><strong>{formatNumber(country.marketSize)}</strong><span><b>Potencial de mercado</b><small>Força econômica {formatNumber(country.economicStrength)}</small></span></div>
          <div className="market-metrics"><span><i style={{ width: `${num(country, "musicCulture")}%` }} /><b>Cultura musical</b><strong>{formatNumber(country.musicCulture)}</strong></span><span><i style={{ width: `${100 - num(country, "piracyLevel")}%` }} /><b>Controle de pirataria</b><strong>{formatNumber(country.piracyLevel)}</strong></span><span><i style={{ width: `${num(country, "physicalMediaDemand")}%` }} /><b>Demanda física</b><strong>{formatNumber(country.physicalMediaDemand)}</strong></span></div>
          <footer><span><Radio size={15} /> Rádio {formatNumber(country.radioInfluence)}</span><span><Disc3 size={15} /> CDs {formatNumber(country.physicalMediaDemand)}</span><ChevronRight size={17} /></footer>
        </button>;
      })}
    </div>
  </>;
}

function NetworkPage({ onSelect }: { onSelect: (entity: EntityRecord) => void }) {
  const groups = [
    { type: "Label", title: "Gravadoras", icon: Building2, copy: "Concorrentes, majors e subsidiárias" },
    { type: "RecordingStudio", title: "Estúdios", icon: Mic2, copy: "Qualidade, tecnologia e custos" },
    { type: "Venue", title: "Venues", icon: MapPin, copy: "Capacidade, prestígio e acústica" },
    { type: "MediaOutlet", title: "Mídia", icon: Tv, copy: "Programas, rádios e publicações" },
    { type: "Genre", title: "Gêneros", icon: Music2, copy: "Afinidades e hierarquia musical" },
  ];
  const groupIcon = (type: string) =>
    type === "Label" ? <Building2 size={17} /> : type === "RecordingStudio" ? <Mic2 size={17} /> : type === "Venue" ? <MapPin size={17} /> : type === "MediaOutlet" ? <Tv size={17} /> : <Music2 size={17} />;
  const groupSubtitle = (entity: EntityRecord): string =>
    entity.type === "MediaOutlet"
      ? mediaTypeLabels[String(entity.mediaType)] ?? String(entity.mediaType ?? "Veículo de mídia")
      : String(entity.status ?? entity.technology ?? entity.city ?? entity.description ?? "Registro ativo");
  return <>
    <PageTitle eyebrow="REDE DA INDÚSTRIA" title="Estrutura" subtitle="Todos os ativos e agentes que sustentam a operação musical da simulação." />
    <div className="network-groups">
      {groups.map(({ type, title, icon: Icon, copy }) => <Section key={type} title={title} kicker={`${byType(type).length} REGISTROS`} action={<span className="section-icon"><Icon size={19} /></span>}><p className="section-copy">{copy}</p><div className="compact-list">{byType(type).slice(0, 8).map((entity) => <button key={entity.id} onClick={() => onSelect(entity)}><span>{groupIcon(type)}</span><div><strong>{entityName(entity)}</strong><small>{groupSubtitle(entity)}</small></div><ChevronRight size={16} /></button>)}</div></Section>)}
    </div>
  </>;
}

function AgendaPage({ onSelect }: { onSelect: (entity: EntityRecord) => void }) {
  return <>
    <PageTitle eyebrow="OPERAÇÃO · CALENDÁRIO" title="Agenda de mídia" subtitle={`Próximas edições de mídia a partir de 03 JAN 2005. ${agendaOpenCount} abertas para reserva; as demais já passaram do prazo mínimo de ${MEDIA_BOOKING_LEAD_DAYS} dias.`} action={<button className="secondary-action"><Tv size={17} /> Ver veículos</button>} />
    {mediaEditionRows.length === 0 ? <p className="section-copy">Nenhuma edição de mídia no horizonte atual.</p> :
    <div className="edition-list">
      {mediaEditionRows.map((row) => {
        const day = row.date.slice(8, 10);
        const month = MONTHS_PT[Number(row.date.slice(5, 7)) - 1];
        const mediaType = mediaTypeLabels[String(row.outlet.mediaType)] ?? String(row.outlet.mediaType ?? "Mídia");
        return <button key={`${row.outlet.id}-${row.date}`} className={`edition-row ${row.bookable ? "" : "is-locked"}`} onClick={() => onSelect(row.outlet)}>
          <time>{day}<small>{month}</small></time>
          <div className="edition-main"><strong>{entityName(row.outlet)}</strong><small>{mediaType} · {row.capacity} vaga(s) por edição</small></div>
          <span className={`status ${row.bookable ? "released" : "waiting"}`}>{row.bookable ? `Reserva aberta · faltam ${row.daysUntil}d` : "Prazo encerrado"}</span>
          <ChevronRight size={17} />
        </button>;
      })}
    </div>}
  </>;
}

function ValueView({ value, depth = 0 }: { value: unknown; depth?: number }) {
  if (value === null || value === undefined) return <span className="empty-value">Não informado</span>;
  if (typeof value === "boolean") return <span className={`boolean ${value ? "yes" : "no"}`}>{value ? "Sim" : "Não"}</span>;
  if (typeof value === "number") return <strong>{formatNumber(value)}</strong>;
  if (typeof value === "string") {
    const linked = byId(value);
    return <span>{linked ? entityName(linked) : value}</span>;
  }
  if (Array.isArray(value)) return value.length ? <div className="tag-list">{value.map((item, index) => <span key={index}>{typeof item === "object" ? <ValueView value={item} depth={depth + 1} /> : <ValueView value={item} depth={depth + 1} />}</span>)}</div> : <span className="empty-value">Nenhum</span>;
  return <div className="nested-values">{Object.entries(asRecord(value)).map(([key, item]) => <div key={key}><small>{humanize(key)}</small><ValueView value={item} depth={depth + 1} /></div>)}</div>;
}

function humanize(value: string): string {
  const aliases: Record<string, string> = { id: "ID", type: "Tipo", currentLabelId: "Gravadora atual", genreIds: "Gêneros", artistId: "Artista", bandId: "Banda", labelId: "Gravadora", countryId: "Mercado", songIds: "Músicas", albumId: "Álbum", __source: "Arquivo de origem", mediaType: "Tipo de mídia", audienceReach: "Alcance", editionCapacity: "Vagas por edição", bookingRules: "Regras de reserva", appearanceTypes: "Tipos de aparição", supportedEntityTypes: "Aceita", availability: "Disponibilidade", activeFromYear: "Ativo desde", activeToYear: "Ativo até", bookingLeadDays: "Antecedência (dias)", prestige: "Prestígio", status: "Situação", frequency: "Frequência", weekDays: "Dias da semana", monthDays: "Dias do mês", months: "Meses", excludedDates: "Datas excluídas", minimumArtistPrestige: "Prestígio mín. do artista", minimumArtistPopularity: "Popularidade mín. (local)", minimumLabelPrestige: "Prestígio mín. da label" };
  return aliases[value] ?? value.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
}

function Inspector({ entity, onClose }: { entity?: EntityRecord; onClose: () => void }) {
  if (!entity) return null;
  const entries = Object.entries(entity).filter(([key]) => !["name", "title", "stageName", "description", "type"].includes(key));
  return <><button className="inspector-scrim" onClick={onClose} aria-label="Fechar detalhes" /><aside className="inspector">
    <div className="inspector-top"><button className="icon-button" onClick={onClose}><X size={19} /></button><span>{entityLabels[entity.type] ?? entity.type}</span><button className="icon-button"><Star size={18} /></button></div>
    <div className="inspector-hero"><span className="entity-mark">{entity.type === "Artist" ? <Mic2 /> : entity.type === "Album" || entity.type === "Song" ? <Disc3 /> : entity.type === "Country" ? <Globe2 /> : entity.type === "MediaOutlet" ? <Tv /> : <Building2 />}</span><small>{entity.type.toUpperCase()}</small><h2>{entityName(entity)}</h2>{entity.description && <p>{entity.description}</p>}</div>
    <div className="inspector-body"><h3>DADOS COMPLETOS</h3>{entries.map(([key, value]) => <div className="detail-row" key={key}><label>{humanize(key)}</label><ValueView value={value} /></div>)}</div>
  </aside></>;
}

function SearchOverlay({ open, onClose, onSelect }: { open: boolean; onClose: () => void; onSelect: (entity: EntityRecord) => void }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    return entities.filter((entity) => !normalized || `${entityName(entity)} ${entity.type} ${entity.description ?? ""}`.toLocaleLowerCase("pt-BR").includes(normalized)).slice(0, 12);
  }, [query]);
  if (!open) return null;
  return <div className="search-overlay"><button className="search-scrim" onClick={onClose} aria-label="Fechar busca" /><div className="search-dialog"><div className="search-input"><Search size={20} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Busque em toda a indústria..." /><button onClick={onClose}><X size={18} /></button></div><div className="search-results"><small>{results.length} RESULTADOS</small>{results.map((entity) => <button key={entity.id} onClick={() => { onSelect(entity); onClose(); }}><span><Activity size={17} /></span><div><strong>{entityName(entity)}</strong><small>{entityLabels[entity.type] ?? entity.type} · {entity.id}</small></div><ChevronRight size={17} /></button>)}</div></div></div>;
}

function BottomNav({ page, onPage }: { page: Page; onPage: (page: Page) => void }) {
  return <nav className="bottom-nav">{navItems.map(({ id, label, icon: Icon }) => <button key={id} className={page === id ? "active" : ""} onClick={() => onPage(id)}><Icon size={20} /><span>{label}</span></button>)}</nav>;
}

export function App() {
  const [page, setPage] = useState<Page>("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selected, setSelected] = useState<EntityRecord | undefined>();

  const content = page === "home" ? <HomePage onPage={setPage} onSelect={setSelected} />
    : page === "talent" ? <TalentPage onSelect={setSelected} />
      : page === "releases" ? <ReleasesPage onSelect={setSelected} />
        : page === "charts" ? <ChartsPage onSelect={setSelected} />
          : page === "markets" ? <MarketsPage onSelect={setSelected} />
            : page === "agenda" ? <AgendaPage onSelect={setSelected} />
              : <NetworkPage onSelect={setSelected} />;

  return <div className="app-shell">
    <AppHeader onMenu={() => setMenuOpen(true)} onSearch={() => setSearchOpen(true)} onSelect={setSelected} />
    <SideNav page={page} open={menuOpen} onClose={() => setMenuOpen(false)} onPage={setPage} />
    <main className="content">{content}<footer className="data-footer"><span><Disc3 size={15} /> LABEL//SIM DATABASE</span><span>{entities.length} entidades carregadas · início em 2005</span></footer></main>
    <BottomNav page={page} onPage={setPage} />
    <Inspector entity={selected} onClose={() => setSelected(undefined)} />
    <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} onSelect={setSelected} />
  </div>;
}
