import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { Localized } from "@/components/ui/Localized";
import { i18n } from "@/lib/i18n";
import StoryName from "./StoryName";
import { COMPANY_FRAMES, HEALTH_FRAMES, OFFER_FRAMES, TRAVEL_PHOTOS } from "./story-media";

const laptopSizes = "(max-width: 1119px) 87vw, (max-width: 1720px) 49vw, 850px";
const phoneSizes = "(max-width: 1119px) 53vw, (max-width: 1720px) 16vw, 285px";

function ScreenFrame({ id, children }: { id: string; children: ReactNode }) {
  return <div className="stage-screen__frame" data-stage-frame={id}>{children}</div>;
}

function Photo({ src, mode = "cover", sizes = laptopSizes }: { src: string; mode?: "contain" | "cover"; sizes?: string }) {
  return <Image src={src} alt="" fill sizes={sizes} loading="lazy" className={mode === "contain" ? "object-contain" : "object-cover"} />;
}

export default function DeviceStage({ media }: { media: ReadonlySet<string> }) {
  const school = { en: "University of Wisconsin–Madison", zh: "威斯康星大学麦迪逊分校" };
  const music = i18n.music;
  const philosophy = i18n.philosophy;

  return (
    <>
      <div className="device-stage__light device-stage__light--campus" data-stage-light="campus" />
      <div className="device-stage__light device-stage__light--projects" data-stage-light="projects" />
      <div className="device-stage__light device-stage__light--travel" data-stage-light="travel" />

      <div className="device-stage__travel">
        {TRAVEL_PHOTOS.map(({ src }, index) => (
          <div key={src} className="stage-travel-card" data-stage-travel={index}>
            {media.has("travel-field") && <Photo src={src} sizes="24vw" />}
          </div>
        ))}
      </div>

      <div className="stage-laptop" data-stage-laptop="">
        <div className="stage-laptop__lid" data-stage-hinge="">
          <div className="stage-laptop__screen">
            <div data-stage-screen="laptop">
              <ScreenFrame id="intro">
                <div className="stage-profile">
                  <div className="stage-profile__portrait">
                    {media.has("intro") && (
                      <Image src="/photos/self-cutout.png" alt="" fill sizes="(max-width: 1119px) 46vw, 25vw" loading="eager" fetchPriority="high" className="object-contain object-bottom" />
                    )}
                  </div>
                  <div className="stage-profile__copy">
                    <div className="stage-profile__name" data-stage-name=""><StoryName /></div>
                  </div>
                </div>
              </ScreenFrame>
              <ScreenFrame id="campus">
                <div className="stage-scene-photo">
                  {media.has("campus") && <Photo src="/photos/uw-campus.jpg" />}
                  <p><Localized {...school} /></p>
                </div>
              </ScreenFrame>
              <ScreenFrame id="ranking">
                <div className="stage-ranking">
                  <div>
                    <p className="stage-screen__eyebrow">UW–Madison</p>
                    <p><Localized {...school} /></p>
                  </div>
                  <div className="stage-ranking__image">
                    {media.has("ranking") && <Photo src="/photos/uw-ranking.jpg" mode="contain" sizes="(max-width: 1119px) 45vw, 24vw" />}
                  </div>
                </div>
              </ScreenFrame>

              {COMPANY_FRAMES.map(({ id, src, name, color }) => (
                <ScreenFrame id={id} key={id}>
                  <div className="stage-company" style={{ "--company-color": color } as CSSProperties}>
                    <div className="stage-company__logo">
                      {media.has(id) && <Photo src={src} mode="contain" sizes="(max-width: 1119px) 48vw, 27vw" />}
                    </div>
                    <p>{name}</p>
                  </div>
                </ScreenFrame>
              ))}

              {OFFER_FRAMES.map((src, index) => {
                const id = `offer-${index}`;
                return <ScreenFrame id={id} key={src}>{media.has(id) && <Photo src={src} mode="contain" />}</ScreenFrame>;
              })}

              <ScreenFrame id="travel">
                <div className="stage-screen-collage">
                  {media.has("travel") && TRAVEL_PHOTOS.map(({ src }) => (
                    <div key={src}><Photo src={src} sizes="(max-width: 1119px) 34vw, 19vw" /></div>
                  ))}
                </div>
              </ScreenFrame>
              <ScreenFrame id="music">
                <div className="stage-scene-photo stage-scene-photo--music">
                  {media.has("music") && <Photo src="/photos/music-piano.jpg" />}
                  <p><Localized {...music.label} /></p>
                </div>
              </ScreenFrame>
              <ScreenFrame id="skills">
                <div className="stage-skills">
                  <p className="stage-screen__eyebrow"><Localized {...i18n.skills.label} /></p>
                  <div>
                    {i18n.skills.groups.map(({ category, symbol }) => (
                      <p key={symbol}><span>{symbol}</span><Localized {...category} /></p>
                    ))}
                  </div>
                </div>
              </ScreenFrame>
              <ScreenFrame id="philosophy">
                <div className="stage-quote">
                  <p className="stage-screen__eyebrow"><Localized {...philosophy.label} /></p>
                  <p>
                    <Localized {...philosophy.quote1} />
                    <span><Localized {...philosophy.quoteAccent} /></span>
                    {" "}<Localized {...philosophy.quote2} />
                  </p>
                </div>
              </ScreenFrame>
            </div>
            <div className="stage-screen__power" data-stage-power="" />
          </div>
          <div className="stage-laptop__camera" />
        </div>
        <div className="stage-laptop__deck">
          <span className="stage-laptop__keys" />
          <span className="stage-laptop__trackpad" />
        </div>
        <div className="stage-laptop__lip" />
      </div>

      <div className="stage-phone phone-shell" data-stage-phone="">
        <div className="phone-shell__screen" data-stage-screen="phone">
          {HEALTH_FRAMES.map((src, index) => {
            const id = `health-${index}`;
            return <ScreenFrame id={id} key={src}>{media.has(id) && <Photo src={src} mode="contain" sizes={phoneSizes} />}</ScreenFrame>;
          })}
        </div>
      </div>
    </>
  );
}
