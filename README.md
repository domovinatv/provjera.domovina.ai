# ADHD provjera

PWA aplikacija za **offline samoprocjenu simptoma ADHD-a u odraslih** prema
validiranom upitniku **ASRS v1.1** Svjetske zdravstvene organizacije i Harvard
Medical School.

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

Za build s ne-root base path-om:
```bash
VITE_BASE=/adhd-provjera/ npm run build
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

Produkcijski build je čisto statički (HTML + JS + CSS + service worker). Hosta
se s bilo kojeg statičkog hostinga (GitHub Pages, Netlify, Cloudflare Pages,
vlastiti web). Bez backenda.

### GitHub Pages (trenutno aktivno)

Live na <https://stepanic.github.io/adhd-provjera/>. Deploy preko GitHub
Actions workflow-a `.github/workflows/deploy.yml` na svaki push u `main`. Build
koristi `VITE_BASE=/adhd-provjera/` jer je app na subpath-u repo-imena.

### Cloudflare Pages (preporučeno za produkciju na domovina.ai poddomeni)

Cloudflare Pages se preporuča za produkciju jer:

- Bolja kontrola **Cache-Control** headera (presudno za PWA — vidi
  `public/_headers`), čime se update detektira odmah a ne nakon 24h.
- Domovina ekosustav je već vezan uz `domovina.ai` (npr. `gis.domovina.ai`,
  `pay.domovina.ai`), pa je `*.domovina.ai` prirodna lokacija.
- Custom domena, automatski HTTPS, brzi global edge cache.

**Build postavke za Cloudflare Pages dashboard:**

| Field | Vrijednost |
|---|---|
| Framework preset | None (Vite je dovoljno generičan) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` |
| Node.js version | `22` (kompatibilno s lockfile-om) |

**Environment variables** (Settings → Environment variables → Production):

| Ime | Vrijednost |
|---|---|
| `VITE_BASE` | `/` (root-hosted na poddomeni, nije subpath) |
| `NODE_VERSION` | `22` |

**Config datoteke** u repo-u već postoje:

- `public/_redirects` — SPA fallback (`/* /index.html 200`)
- `public/_headers` — Cache-Control politika (immutable za hashed assete, no-cache za `sw.js` i `index.html`)
- `wrangler.toml` — meta za optional `wrangler pages deploy` CLI workflow

**Postupak deploy-a (jednokratan setup):**

1. Cloudflare dashboard → Pages → **Create application** → Connect to Git → odaberi `stepanic/adhd-provjera` repo, branch `main`
2. Build postavke kao iznad
3. Environment variables kao iznad
4. Save and Deploy — prvi build kreira projekt s privremenim URL-om (`adhd-provjera.pages.dev`)
5. Custom domain: **Custom domains** → **Set up a custom domain** → unesi željenu poddomenu `provjera.domovina.ai`. Cloudflare automatski kreira CNAME u DNS-u ako je `domovina.ai` već u istom Cloudflare accountu.
6. Sljedeći push u `main` okida automatski build na CF Pages (paralelno s GitHub Pages workflow-om).

**Alternativa — manual CLI deploy** (bez GitHub integracije):

```bash
npm install -g wrangler
wrangler login
VITE_BASE=/ npm run build
wrangler pages deploy dist --project-name adhd-provjera --branch main
```

Korisno za hot-fix deploy iz lokalnog okruženja bez čekanja na CI.

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
