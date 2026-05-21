// PWA service worker registracija s detekcijom update-a.
//
// Strategija:
//   1. registerSW (iz vite-plugin-pwa virtual modula) postavlja SW i precache pri prvom otvaranju.
//   2. onNeedRefresh callback se okida kad workbox-window detektira da je novi SW
//      preuzeo precache i spreman se aktivirati. Tu signaliziramo UI banneru
//      "Nova verzija dostupna".
//   3. onOfflineReady se okida kad je first-install precache gotov — app je
//      sad sposobna raditi bez mreže.
//   4. onRegisteredSW dobiva ServiceWorkerRegistration — postavljamo periodičan
//      reg.update() poll svakih 60s. Bez ovoga iOS Safari može držati cached
//      sw.js satima i propustiti deploy-eve; spec garantira samo 24h cap.
//   5. updateSW() funkcija, vraćena iz registerSW, forsira skipWaiting + reload
//      kad je nova verzija dostupna i korisnik klikne "Učitaj".
//
// Reference:
// - vite-plugin-pwa: https://vite-pwa-org.netlify.app/
// - workbox-window registracija lifecycle: installing -> waiting -> active

import { registerSW as viteRegisterSW } from 'virtual:pwa-register';

export type UpdateStanje = 'idle' | 'spremno-offline' | 'nova-verzija-spremna';

export interface UpdateController {
  /** Trenutno stanje koje UI prikazuje. */
  getStanje: () => UpdateStanje;
  /** Pretplatu na promjene stanja; vraća funkciju za odjavu. */
  subscribe: (cb: (s: UpdateStanje) => void) => () => void;
  /** Aktivira čekajući SW i ponovno učita stranicu (poziva se iz UI gumba). */
  primjeniUpdate: () => void;
  /** Sakriva trenutni prompt bez aktivacije (idempotentan). */
  odbaci: () => void;
}

/**
 * Postavlja SW registraciju i vraća kontroler za UI sloj.
 * Poziva se jednom, pri bootstrap-u aplikacije (main.tsx).
 */
export function postaviSwUpdate(): UpdateController {
  let stanje: UpdateStanje = 'idle';
  const listeneri = new Set<(s: UpdateStanje) => void>();

  const postavi = (novo: UpdateStanje) => {
    stanje = novo;
    listeneri.forEach(cb => cb(novo));
  };

  // updateSW vraćamo iz registerSW; pozivom updateSW(true) workbox preuzima
  // skipWaiting kontrolu i window.location.reload() se izvršava automatski.
  const updateSW = viteRegisterSW({
    immediate: true,

    onNeedRefresh() {
      postavi('nova-verzija-spremna');
    },

    onOfflineReady() {
      postavi('spremno-offline');
    },

    onRegisteredSW(_swUrl, registration) {
      if (!registration) return;
      // Periodičan poll: workbox-window forsira fetch sw.js-a i, ako je
      // byte-different od trenutno aktivnog, započinje install/waiting flow.
      // 60s je kompromis između svježosti i potrošnje baterije/mreže.
      const INTERVAL = 60_000;
      setInterval(() => {
        // Pozivamo update() samo ako je tab aktivan i online — inače
        // nepotrebno trošimo resurse.
        if (document.visibilityState !== 'visible') return;
        if (!navigator.onLine) return;
        registration.update().catch(() => {
          // Tiho ignoriraj — sljedeći interval će ponovno probati.
        });
      }, INTERVAL);

      // Plus jedna provjera kad tab postane vidljiv (npr. korisnik se vrati
      // iz druge app-e na iOS-u). To je presudna anti-Safari mjera.
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && navigator.onLine) {
          registration.update().catch(() => {});
        }
      });
    },
  });

  return {
    getStanje: () => stanje,
    subscribe(cb) {
      listeneri.add(cb);
      return () => listeneri.delete(cb);
    },
    primjeniUpdate() {
      updateSW(true);
    },
    odbaci() {
      postavi('idle');
    },
  };
}
