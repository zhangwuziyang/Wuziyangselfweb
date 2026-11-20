interface CountUpProps {
  end: number;
  suffix?: string;
}

export function CountUp({ end, suffix = "" }: CountUpProps) {
  return (
    <>
      <span className="sr-only">{end}{suffix}</span>
      <span aria-hidden="true"><span data-count-up={end}>{end}</span>{suffix}</span>
    </>
  );
}
