# ADHD provjera

Web aplikacija za **offline samoprocjenu simptoma ADHD-a u odraslih** prema validiranom
upitniku **ASRS v1.1** Svjetske zdravstvene organizacije i Harvard Medical School.

Sva obrada odgovora odvija se **isključivo u pregledniku korisnika** — nijedan odgovor
ne napušta uređaj, nema backenda, nema analitike, nema kolačića.

> ⚠️ **Ovo nije medicinska dijagnoza.** Rezultat je orijentacijski indikator
> samoprocijenjenih simptoma. ADHD u odraslih dijagnosticira isključivo **psihijatar**
> ili **klinički psiholog** kroz detaljnu kliničku procjenu. Ako vam rezultat ili
> vlastiti doživljaj sugeriraju značajne poteškoće, obratite se obiteljskom liječniku
> radi upute na specijalističku obradu.

## Što aplikacija radi

- Nudi dvije verzije upitnika:
  - **Kratku** — 6 pitanja (Dio A, ASRS screener)
  - **Punu** — 18 pitanja (cijeli ASRS Symptom Checklist)
- Pitanja se odgovaraju Likertovom ljestvicom: *Nikad / Rijetko / Ponekad / Često / Vrlo često*.
- Po završetku prikazuje:
  - **Indikator simptoma 0–100** (sirovi zbroj normaliziran na ljestvicu).
  - **Broj pozitivnih odgovora u Dijelu A** (≥ 4 = pozitivan screener).
  - **Kategorijsku interpretaciju** (niska / blaga / umjerena / izražena).
  - Jasnu preporuku za daljnju kliničku procjenu kada je to indicirano.

## Kako funkcionira bodovanje

Aplikacija slijedi standardni ASRS v1.1 obrazac:

- Svaki odgovor donosi 0–4 boda.
- Svako pitanje ima **prag pozitivnosti** (≥ 2 ili ≥ 3, ovisno o pitanju) — odgovor iznad
  praga broji se kao "pozitivan".
- **Indikator 0–100** = `(zbroj svih odgovora / maksimalni mogući zbroj) × 100`.
- **Pozitivan screener (Dio A)** = 4 ili više pozitivnih odgovora u prvih 6 pitanja —
  prema validiranoj WHO/Harvard interpretaciji ukazuje na simptome konzistentne s
  ADHD-om u odraslih.

Cijela logika nalazi se u [`src/app/asrs.ts`](src/app/asrs.ts).

## Pokretanje lokalno

Potreban je Node.js 20+ i npm.

```bash
npm install
npm start       # razvojni server na http://localhost:4200/
npm run build   # produkcijski build u dist/adhd-provjera/browser/
```

## Hostanje

Produkcijski build je čisto statički (HTML + JS + CSS) i može se servirati s bilo kojeg
statičkog hostinga (GitHub Pages, Netlify, Cloudflare Pages, vlastiti web). Ne treba
mu nikakav backend.

Aplikacija se nakon prvog učitavanja može koristiti **u potpunosti offline**.

## Izvori

- Kessler RC, Adler L, Ames M, et al. *The World Health Organization Adult ADHD
  Self-Report Scale (ASRS): a short screening scale for use in the general population.*
  Psychol Med. 2005;35(2):245–256.
- WHO / Harvard Medical School ASRS: <https://www.hcp.med.harvard.edu/ncs/asrs.php>

Hrvatski prijevodi pitanja u ovoj aplikaciji su radni i nisu službeno validirana
hrvatska inačica upitnika.

**Napomena o primjerima:** uz svako pitanje aplikacija prikazuje kratki ilustrativni
primjer iz svakodnevnog života radi lakšeg razumijevanja. Primjeri **nisu dio službenog
ASRS upitnika**, vizualno su odvojeni od pitanja i napisani neutralno (ne sugeriraju
određeni odgovor). Izvorni tekst svakog pitanja preuzet je iz ASRS v1.1.

## Gdje se prijaviti na službeno testiranje (Hrvatska)

- **Obiteljski liječnik** — prvi kontakt; izdaje uputnicu prema specijalistu.
- **Psihijatrijska ambulanta** u kliničkim bolničkim centrima i općim bolnicama.
- **Centri za mentalno zdravlje** pri županijskim zavodima za javno zdravstvo.
- **Privatni klinički psiholozi** i **psihijatri** specijalizirani za ADHD u odraslih.

Ponesite rezultat ove provjere na pregled isključivo kao **orijentacijsku informaciju**.

## Licenca

Izvorni kod: MIT.
Upitnik ASRS v1.1: vlasništvo World Health Organization, slobodno dostupan za kliničku
i istraživačku upotrebu.
