export function TricolorStrip({ position }: { position: 'top' | 'bottom' }) {
  // Tanka traka u stilu DOMOVINA.ai — eho hrvatske zastave.
  // Top: crveno-bijelo-navy; bottom: navy-bijelo-crveno (zrcalno).
  const segments =
    position === 'top'
      ? ['bg-domovina-red', 'bg-white', 'bg-domovina-navy']
      : ['bg-domovina-navy', 'bg-white', 'bg-domovina-red'];
  return (
    <div
      aria-hidden
      className="grid grid-cols-3 h-1.5 w-full"
      role="presentation"
    >
      {segments.map((c, i) => (
        <div key={i} className={c} />
      ))}
    </div>
  );
}

export function Wordmark() {
  return (
    <div className="inline-flex items-baseline gap-0 select-none">
      <span className="text-3xl font-extrabold tracking-tight text-domovina-navy">
        ADHD
      </span>
      <span className="text-3xl font-extrabold tracking-tight text-domovina-red">
        .provjera
      </span>
    </div>
  );
}

export function BrandLogo({ size = 56 }: { size?: number }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}favicon.svg`}
      width={size}
      height={size}
      alt="ADHD.provjera logo"
      className="block"
    />
  );
}

export function BrandHeader() {
  return (
    <header className="flex flex-col items-center pt-6 pb-7 gap-3">
      <BrandLogo size={56} />
      <Wordmark />
      <p className="text-sm text-domovina-muted -mt-1">
        Offline alat za samoprocjenu prema ASRS v1.1
      </p>
    </header>
  );
}

export function DomovinaFooter() {
  return (
    <div className="text-center text-[11px] text-domovina-muted mt-6">
      Dio{' '}
      <a
        href="https://domovina.ai"
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-domovina-navy hover:underline"
      >
        DOMOVINA<span className="text-domovina-red">.ai</span>
      </a>{' '}
      ekosustava
    </div>
  );
}
