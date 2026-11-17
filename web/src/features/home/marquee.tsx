const items = [
  'Frete grátis acima de R$ 250',
  'Até 30% off nos lançamentos',
  'Troca grátis em 30 dias',
  'Parcele em até 10x sem juros',
  'Novos drops toda semana',
];

export function Marquee() {
  const strip = (ariaHidden: boolean) => (
    <div aria-hidden={ariaHidden || undefined} className="flex shrink-0 items-center">
      {items.map((item) => (
        <span
          key={`${ariaHidden ? 'b' : 'a'}-${item}`}
          className="flex items-center gap-6 whitespace-nowrap px-6 font-heading text-sm uppercase tracking-widest"
        >
          {item}
          <span className="text-brand-400">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden border-y border-border bg-foreground py-3.5 text-background">
      <div className="flex w-max animate-marquee motion-reduce:animate-none">
        {strip(false)}
        {strip(true)}
      </div>
    </div>
  );
}
