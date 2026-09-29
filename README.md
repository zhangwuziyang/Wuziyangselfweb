# zwzy.space

Personal portfolio of Wuziyang Zhang (张吴梓洋), live at [zwzy.space](https://zwzy.space).

Bilingual (English at `/`, Chinese at `/zh`), with an "Ask me" assistant that answers from the profile data and can polish replies with a small model running in the browser via WebGPU.

## Stack

- Next.js 16 (App Router, Cache Components), React 19, TypeScript
- Tailwind CSS 4, Framer Motion
- [WebLLM](https://github.com/mlc-ai/web-llm) running Qwen2.5-0.5B locally for the assistant

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

## Where things live

| Path | What |
| --- | --- |
| `app/` | Routes. `app/zh/` mirrors the English pages for the Chinese site. |
| `components/` | Home page sections, navbar, footer, assistant UI |
| `lib/i18n.ts` | English and Chinese copy for the home page |
| `lib/experienceData.ts` | Experience cards and detail pages (newest first) |
| `lib/profileChatData.ts` | Knowledge base the assistant answers from |
| `lib/locale.ts` | `/zh` path helpers and hreflang metadata |
| `public/photos/`, `public/images/` | Photos and logos |

Set `NEXT_PUBLIC_SITE_URL` to the production origin so canonical and Open Graph URLs are absolute.

Deployed on Vercel.
