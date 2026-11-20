import Image from "next/image";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Localized } from "@/components/ui/Localized";
import { i18n } from "@/lib/i18n";

export default function Music() {
  const m = i18n.music;

  return (
    <section id="music" data-nav-surface="light" style={{ background: "#fff" }} className="py-32 md:py-44">
      <div className="max-w-[1100px] mx-auto px-5">
        <ScrollReveal className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          <div>
            <p className="section-label mb-4"><Localized {...m.label} /></p>
            <h2 className="font-semibold leading-[1.04] tracking-tight mb-7" style={{ fontSize: "clamp(1.8rem, 3.2vw, 2.8rem)", color: "#1d1d1f", letterSpacing: "-0.025em" }}>
              <Localized {...m.headline1} /><br />
              <Localized {...m.headline2} /><br />
              <span style={{ color: "#86868b" }}><Localized {...m.headline3} /></span>
            </h2>
            <div className="space-y-4 font-light leading-[1.8] mb-10" style={{ fontSize: "clamp(1rem, 1.4vw, 1.125rem)", color: "#6e6e73" }}>
              <p><Localized {...m.p1} /></p>
              <p><Localized {...m.p2} /></p>
              <p><Localized {...m.p3} /></p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {m.credentials.map((item) => (
                <div key={item.key} className="rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02]"
                  style={{ background: "#f5f5f7", border: "1px solid rgba(0,0,0,0.06)" }}
                >
                  <p className="font-semibold text-sm mb-1" style={{ color: "#1d1d1f" }}><Localized {...item.name} /></p>
                  <p className="text-xs font-medium" style={{ color: "#6e6e73" }}><Localized {...item.credential} /></p>
                  <p className="text-[11px] font-mono mt-1" style={{ color: "#86868b" }}><Localized {...item.meta} /></p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="/photos/music-piano.jpg"
              alt="Playing piano"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1023px) calc(100vw - 40px), (max-width: 1100px) calc(50vw - 68px), 482px"
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
