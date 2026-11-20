import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Localized } from "@/components/ui/Localized";
import { i18n } from "@/lib/i18n";

function renderTags(tags: readonly string[]) {
  return tags.map((tag) => (
    <span
      key={tag}
      className="px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 hover:scale-[1.03]"
      style={{ background: "#f5f5f7", color: "#1d1d1f", border: "1px solid rgba(0,0,0,0.06)" }}
    >
      {tag}
    </span>
  ));
}

export default function About() {
  const a = i18n.about;

  return (
    <section id="about" data-nav-surface="light" style={{ background: "#fff" }} className="py-32 md:py-44">
      <div className="max-w-[1100px] mx-auto px-5">

        <ScrollReveal>
          <p className="section-label mb-14"><Localized {...a.label} /></p>
        </ScrollReveal>

        <ScrollReveal delay={60} className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Portrait */}
          <div className="relative w-full max-w-sm aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="/photos/portrait.jpg"
              alt="Wuziyang Zhang"
              fill
              className="object-cover object-center"
              sizes="(max-width: 424px) calc(100vw - 40px), 384px"
            />
          </div>

          {/* Copy */}
          <div className="lg:pt-2">
            <h2
              className="font-semibold leading-[1.04] tracking-tight mb-8"
              style={{ fontSize: "clamp(2.2rem, 4vw, 3.4rem)", color: "#1d1d1f", letterSpacing: "-0.025em" }}
            >
              <Localized en={
                <>I build where<br />strategy meets<br /><span style={{ color: "#86868b" }}>execution.</span></>
              } zh={
                <>我在战略<br />与执行的<br /><span style={{ color: "#86868b" }}>交汇处创造。</span></>
              } />
            </h2>

            <div className="space-y-4 font-light leading-[1.8]" style={{ fontSize: "clamp(1rem, 1.4vw, 1.125rem)", color: "#6e6e73" }}>
              <p>
                <Localized en={
                  <>
                    I study Economics and Information Science at the{" "}
                    <a
                      href="https://www.wisc.edu"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline transition-colors duration-200"
                      style={{ color: "#0071e3" }}
                    >
                      University of Wisconsin–Madison
                    </a>
                    , working at the intersection of market insight, data analysis, and AI-enabled product thinking.
                  </>
                } zh={
                  <>
                    就读于{" "}
                    <a
                      href="https://www.wisc.edu"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline transition-colors duration-200"
                      style={{ color: "#0071e3" }}
                    >
                      威斯康星大学麦迪逊分校
                    </a>
                    ，主修经济学与信息科学。我在市场洞察、数据分析与 AI 产品思维的交叉地带工作。
                  </>
                } />
              </p>
              <p><Localized {...a.p2} /></p>
              <p><Localized {...a.p3} /></p>
              <p><Localized {...a.p4} /></p>
            </div>

            <div className="mt-9 flex flex-wrap gap-2">
              <Localized en={renderTags(a.tags.en)} zh={renderTags(a.tags.zh)} />
            </div>

            {/* University card — links to /university */}
            <div className="mt-6">
              <Link
                href="/university"
                className="group flex items-center justify-between gap-4 px-5 py-4 rounded-2xl transition-[background,box-shadow] duration-300 hover:shadow-md"
                style={{ background: "#f5f5f7", border: "1px solid rgba(0,0,0,0.07)" }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="shrink-0 w-9 h-9 rounded-xl overflow-hidden bg-white shadow-sm flex items-center justify-center p-0.5">
                    <Image src="/photos/uw-logo.jpg" alt="UW" width={32} height={32} className="object-contain" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold leading-none truncate" style={{ color: "#1d1d1f" }}>
                      <Localized en="University of Wisconsin–Madison" zh="威斯康星大学麦迪逊分校" />
                    </p>
                    <p className="text-[11px] mt-1 font-mono" style={{ color: "#86868b" }}>
                      <Localized en="Economics · Information Science · CDIS" zh="经济学 · 信息科学 · CDIS" />
                    </p>
                  </div>
                </div>
                <span
                  className="shrink-0 text-sm font-medium transition-[color,transform] duration-200 group-hover:translate-x-0.5"
                  style={{ color: "#c5050c" }}
                >
                  <Localized en="Learn more →" zh="了解更多 →" />
                </span>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
