# Provjera — Domovina

PWA aplikacija za **offline samoprocjenu simptoma ADHD-a u odraslih** prema
validiranom upitniku **ASRS v1.1** Svjetske zdravstvene organizacije i Harvard
Medical School. Dio **DOMOVINA** obitelji proizvoda; prvi modul **Domovina Provjera**
obitelji alata za samoprocjenu mentalnog zdravlja.

**Produkcija:** <https://provjera.domovina.ai>

Sva obrada odgovora odvija se **isključivo u pregledniku korisnika** — nijedan
odgovor ne napušta uređaj, nema backenda, nema analitike, nema kolačića.

> ⚠️ **Ovo nije medicinska dijagnoza.** Rezultat je orijentacijski indikator
> samoprocijenjenih simptoma. ADHD u odraslih dijagnosticira isključivo
> **psihijatar** ili **klinički psiholog** kroz detaljnu kliničku procjenu. Ako
> vam rezultat ili vlastiti doživljaj sugeriraju značajne poteškoće, obratite se
> obiteljskom liječniku radi upute na specijalističku obradu.

## Stack

Iznova izgrađen u **istom tehničkom stilu kao Gnosis Pay** (`app.gnosispay.com`):

| Sloj | Tehnologija |
|---|---|
| Build tool | **Vite 5** (chunked hashed assets, `/assets/index-[hash].js`) |
| Framework | **React 18** + **TypeScript** (strict) |
| UI primitives | **Radix UI** (`@radix-ui/react-radio-group`) — accessible iz prve |
| Styling | **Tailwind CSS** s `brand` paletom |
| PWA | **vite-plugin-pwa** + **Workbox** (autoUpdate, precache, offline) |
| Routing | jednostavan state-machine u Reactu (3 koraka — nema potrebe za routerom) |

Bundle: ~174 KB main (~57 KB gzip), plus mali Workbox runtime. Service worker
pre-cache-a sve assete na prvu posjetu — sljedeća otvaranja su instant i rade
**potpuno offline**.

## Što aplikacija radi

- Dvije verzije upitnika:
  - **Kratka** — 6 pitanja (Dio A, ASRS screener)
  - **Puna** — 18 pitanja (cijeli ASRS Symptom Checklist)
- 5-stupanjska Likertova ljestvica: *Nikad / Rijetko / Ponekad / Često / Vrlo često*
- Uz svako pitanje **ilustrativni primjer iz svakodnevnog života** (neutralan,
  vizualno odvojen od izvornog teksta pitanja)
- Rezultat: **indikator simptoma 0–100**, broj pozitivnih u Dijelu A
  (≥ 4 = pozitivan screener), kategorijska interpretacija i preporuka

## Pokretanje lokalno

Potreban Node.js 20+ i npm.

```bash
npm install
npm run dev        # razvojni server, http://localhost:5173/
npm run build      # produkcijski build u dist/
npm run preview    # serviraj produkcijski build lokalno
```

Za build s ne-root base path-om (npr. ako hostaš na subpath-u):
```bash
VITE_BASE=/subpath/ npm run build
```

## PWA i self-update

Aplikacija je **instalabilna** ("Add to Home Screen" / "Install app") na svim
modernim preglednicima. Service worker:

- pri **autoUpdate** strategiji automatski preuzima novi build u pozadini i
  aktivira ga pri sljedećem otvaranju
- precache-a sve statičke assete pa app radi **potpuno offline** nakon prve
  posjete
- koristi Workbox za upravljanje cache-em (cleanup zastarjelih verzija)

## Hostanje

Produkcijski build je čisto statički (HTML + JS + CSS + service worker). Primarna
produkcija je na **Cloudflare Pages** (`provjera.domovina.ai`); raniji staging
na GitHub Pages (`stepanic.github.io/adhd-provjera`) je arhiviran i redirectira
na produkciju.

### Cloudflare Pages (produkcija)

Cloudflare Pages je primarna platforma jer:

- Daje kontrolu nad **Cache-Control** headerima (vidi `public/_headers`) — sw.js
  je no-cache, hashed asseti immutable, čime se update detektira odmah.
- `*.domovina.ai` je prirodna lokacija u Domovina ekosustavu (uz
  `pay.domovina.ai`, `gis.domovina.ai`, itd.).
- Custom domena, automatski HTTPS, brzi global edge cache.

**Setup (jednokratan, dashboard):**

1. Cloudflare dashboard → **Workers & Pages** → **Pages** → **Create application**
   → **Connect to Git** → odaberi `domovinatv/provjera.domovina.ai`, branch
   `main`.
2. Build configuration:
   - Framework preset: **None**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/`
3. Environment variables (Production):
   - `VITE_BASE` = `/`
   - `NODE_VERSION` = `22`
4. **Save and Deploy**.
5. **Custom domains** → **Set up a custom domain** → `provjera.domovina.ai`. DNS
   se automatski namjesti ako je `domovina.ai` u istom Cloudflare accountu.

**Config datoteke u repo-u:**

- `public/_redirects` — SPA fallback (`/* /index.html 200`)
- `public/_headers` — cache strategija + security headers
- `wrangler.toml` — meta za optional `wrangler pages deploy` CLI flow

**Manual CLI deploy** (za hot-fix bez čekanja CI-a):

```bash
npm install -g wrangler
wrangler login
VITE_BASE=/ npm run build
wrangler pages deploy dist --project-name provjera-domovina-ai --branch main
```

## Izvori

- Kessler RC, Adler L, Ames M, et al. *The World Health Organization Adult ADHD
  Self-Report Scale (ASRS): a short screening scale for use in the general
  population.* Psychol Med. 2005;35(2):245–256.
- WHO / Harvard Medical School ASRS: <https://www.hcp.med.harvard.edu/ncs/asrs.php>

Hrvatski prijevodi pitanja u ovoj aplikaciji su radni i nisu službeno validirana
hrvatska inačica upitnika.

**Napomena o primjerima:** uz svako pitanje aplikacija prikazuje kratki
ilustrativni primjer iz svakodnevnog života radi lakšeg razumijevanja. Primjeri
**nisu dio službenog ASRS upitnika**, vizualno su odvojeni od pitanja i napisani
neutralno (ne sugeriraju određeni odgovor). Izvorni tekst svakog pitanja preuzet
je iz ASRS v1.1.

## Gdje se prijaviti na službeno testiranje (Hrvatska)

- **Obiteljski liječnik** — prvi kontakt; izdaje uputnicu prema specijalistu.
- **Psihijatrijska ambulanta** u kliničkim bolničkim centrima i općim bolnicama.
- **Centri za mentalno zdravlje** pri županijskim zavodima za javno zdravstvo.
- **Privatni klinički psiholozi** i **psihijatri** specijalizirani za ADHD u
  odraslih.

Ponesite rezultat ove provjere na pregled isključivo kao **orijentacijsku
informaciju**.

## Licenca

Izvorni kod: MIT.
Upitnik ASRS v1.1: vlasništvo World Health Organization, slobodno dostupan za
kliničku i istraživačku upotrebu.
