import { useMemo, useState } from 'react';
import {
  izracunaj,
  Odgovor,
  PITANJA_KRATKO,
  PITANJA_PUNO,
} from './data/asrs';
import { Welcome } from './components/Welcome';
import { Question } from './components/Question';
import { Result } from './components/Result';
import { BrandHeader, DomovinaFooter, TricolorStrip } from './components/Brand';
import { UpdatePrompt } from './components/UpdatePrompt';
import type { UpdateController } from './lib/sw-update';

type Korak = 'pocetak' | 'upitnik' | 'rezultat';
export type Verzija = 'kratko' | 'puno';

interface AppProps {
  swController: UpdateController;
}

export default function App({ swController }: AppProps) {
  const [korak, setKorak] = useState<Korak>('pocetak');
  const [verzija, setVerzija] = useState<Verzija>('kratko');
  const [trenutni, setTrenutni] = useState(0);
  const [odgovori, setOdgovori] = useState<(Odgovor | null)[]>([]);

  const pitanja = useMemo(
    () => (verzija === 'kratko' ? PITANJA_KRATKO : PITANJA_PUNO),
    [verzija],
  );

  const rezultat = useMemo(() => izracunaj(pitanja, odgovori), [pitanja, odgovori]);

  const zapocni = (v: Verzija) => {
    const lista = v === 'kratko' ? PITANJA_KRATKO : PITANJA_PUNO;
    setVerzija(v);
    setOdgovori(new Array(lista.length).fill(null));
    setTrenutni(0);
    setKorak('upitnik');
  };

  const postaviOdgovor = (o: Odgovor) => {
    const arr = [...odgovori];
    arr[trenutni] = o;
    setOdgovori(arr);
  };

  const naprijed = () => {
    if (odgovori[trenutni] == null) return;
    if (trenutni === pitanja.length - 1) {
      setKorak('rezultat');
    } else {
      setTrenutni(trenutni + 1);
    }
  };

  const natrag = () => {
    if (trenutni > 0) setTrenutni(trenutni - 1);
  };

  const ispocetka = () => {
    setOdgovori([]);
    setTrenutni(0);
    setKorak('pocetak');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <UpdatePrompt controller={swController} />
      <TricolorStrip position="top" />

      <main className="mx-auto w-full max-w-2xl px-4 py-2 pb-10 flex-1">
        <BrandHeader />

        {korak === 'pocetak' && <Welcome onStart={zapocni} />}

        {korak === 'upitnik' && (
          <Question
            pitanje={pitanja[trenutni]}
            ukupno={pitanja.length}
            indeks={trenutni}
            odgovor={odgovori[trenutni]}
            onOdgovor={postaviOdgovor}
            onNatrag={natrag}
            onNaprijed={naprijed}
          />
        )}

        {korak === 'rezultat' && (
          <Result
            rezultat={rezultat}
            ukupno={pitanja.length}
            onIspocetka={ispocetka}
          />
        )}

        <footer className="text-center text-xs text-domovina-muted px-2 mt-2">
          <p>
            Izvor upitnika: ASRS v1.1 — World Health Organization &amp; Harvard Medical
            School (Kessler i sur., 2005). Aplikacija radi 100&nbsp;% offline; nijedan
            odgovor ne napušta vaš preglednik.
          </p>
          <DomovinaFooter />
        </footer>
      </main>

      <TricolorStrip position="bottom" />
    </div>
  );
}
