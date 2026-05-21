import { useEffect, useState } from 'react';
import type { UpdateController, UpdateStanje } from '../lib/sw-update';

interface Props {
  controller: UpdateController;
}

/**
 * Banner koji se prikazuje kad je nova verzija PWA-a spremna za aktivaciju.
 * Pozicioniran fiksno na vrhu (iznad tricolor stripa).
 *
 * UX:
 * - "Nova verzija spremna" + gumb "Učitaj" (poziva primjeniUpdate -> reload)
 * - "Spremno offline" — informativan toast, automatski nestaje nakon par sek
 * - "idle" — nije prikazan
 */
export function UpdatePrompt({ controller }: Props) {
  const [stanje, setStanje] = useState<UpdateStanje>(controller.getStanje());

  useEffect(() => controller.subscribe(setStanje), [controller]);

  // Offline-ready toast automatski nestane nakon 4s.
  useEffect(() => {
    if (stanje !== 'spremno-offline') return;
    const id = window.setTimeout(() => controller.odbaci(), 4000);
    return () => window.clearTimeout(id);
  }, [stanje, controller]);

  if (stanje === 'idle') return null;

  if (stanje === 'spremno-offline') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-domovina-navy text-white rounded-lg px-4 py-2 text-sm shadow-card"
      >
        Aplikacija je spremna za rad bez interneta.
      </div>
    );
  }

  // stanje === 'nova-verzija-spremna'
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-domovina-navy text-white rounded-xl px-4 py-3 shadow-card flex items-center gap-3 max-w-md w-[calc(100%-2rem)]"
    >
      <div className="flex-1 text-sm">
        <div className="font-semibold">Nova verzija dostupna</div>
        <div className="text-white/80 text-xs mt-0.5">
          Učitavanjem dobivate najnovije izmjene.
        </div>
      </div>
      <button
        type="button"
        onClick={() => controller.primjeniUpdate()}
        className="bg-white text-domovina-navy font-semibold rounded-lg px-3 py-1.5 text-sm hover:bg-domovina-navy-50 active:scale-[0.98] transition"
      >
        Učitaj
      </button>
      <button
        type="button"
        onClick={() => controller.odbaci()}
        aria-label="Odbaci"
        className="text-white/70 hover:text-white text-xl leading-none px-1"
      >
        ×
      </button>
    </div>
  );
}
