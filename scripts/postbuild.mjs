import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { keywordPages } from '../src/content/keyword-pages.js'
import { HOME_SEO, SITE } from '../src/lib/seo.js'
import { buildRobotsTxt, buildSitemapXml } from '../worker/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const distDir = path.join(rootDir, 'dist')
const sourceIndexPath = path.join(distDir, 'index.html')
const googleVerification = (process.env.GOOGLE_SITE_VERIFICATION || '').trim()
const bingVerification = (process.env.BING_SITE_VERIFICATION || '').trim()

const sourceIndex = await fs.readFile(sourceIndexPath, 'utf8')

await writeStaticPage('/', {
  title: HOME_SEO.title,
  description: HOME_SEO.description,
  robots: 'index,follow',
  canonicalPath: '/',
  rootHtml: buildHomePrerender(),
  structuredData: [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: SITE.name,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: `${SITE.origin}/`,
      description: HOME_SEO.description,
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'USD',
        lowPrice: '49.50',
        highPrice: '249.50',
        availability: 'https://schema.org/InStock',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE.name,
      url: `${SITE.origin}/`,
    },
  ],
})

for (const page of keywordPages) {
  const title = `${page.title} | ${SITE.name}`
  await writeStaticPage(page.path, {
    title,
    description: page.description,
    robots: 'index,follow',
    canonicalPath: page.path,
    rootHtml: buildKeywordPrerender(page),
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: title,
        description: page.description,
        url: `${SITE.origin}${page.path}`,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE.origin}/` },
          { '@type': 'ListItem', position: 2, name: page.h1, item: `${SITE.origin}${page.path}` },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: page.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  })
}

await writeStaticPage('/privacy', {
  title: `Privacy | ${SITE.name}`,
  description: 'How AI Compliance handles scanner input, reminder emails, payment metadata, support, and analytics.',
  robots: 'index,follow',
  canonicalPath: '/privacy',
  rootHtml: buildLegalPrerender(
    'Privacy Policy',
    'AI Compliance collects only the information needed to operate the scanner, payment flow, support channel, and product analytics.',
  ),
  structuredData: [],
})

await writeStaticPage('/terms', {
  title: `Terms | ${SITE.name}`,
  description: 'Terms for using AI Compliance scans, reports, reminders, checkout, and related materials.',
  robots: 'index,follow',
  canonicalPath: '/terms',
  rootHtml: buildLegalPrerender(
    'Terms of Service',
    'AI Compliance provides workflow assistance and templates. It is not legal advice and does not guarantee outcomes.',
  ),
  structuredData: [],
})

await fs.writeFile(path.join(distDir, 'sitemap.xml'), buildSitemapXml())
await fs.writeFile(path.join(distDir, 'robots.txt'), buildRobotsTxt())
if (bingVerification) {
  await fs.writeFile(
    path.join(distDir, 'BingSiteAuth.xml'),
    `<?xml version="1.0"?><users><user>${escapeHtml(bingVerification)}</user></users>`,
  )
}

async function writeStaticPage(routePath, page) {
  const html = renderHtml(page)

  if (routePath === '/') {
    await fs.writeFile(sourceIndexPath, html)
    return
  }

  const outputDir = path.join(distDir, routePath.replace(/^\/+/, ''))
  await fs.mkdir(outputDir, { recursive: true })
  await fs.writeFile(path.join(outputDir, 'index.html'), html)
}

function renderHtml({ title, description, robots, canonicalPath, rootHtml, structuredData }) {
  const canonicalUrl = `${SITE.origin}${canonicalPath === '/' ? '/' : canonicalPath}`
  let html = sourceIndex
  html = html.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(title)}</title>`)
  html = upsertMeta(html, 'name', 'description', description)
  html = upsertMeta(html, 'name', 'robots', robots)
  html = upsertMeta(html, 'property', 'og:title', title)
  html = upsertMeta(html, 'property', 'og:description', description)
  html = upsertMeta(html, 'property', 'og:url', canonicalUrl)
  html = upsertMeta(html, 'name', 'twitter:title', title)
  html = upsertMeta(html, 'name', 'twitter:description', description)
  html = html.replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${escapeAttr(canonicalUrl)}" />`)
  html = html.replace('<div id="root"></div>', `<div id="root">${rootHtml}</div>`)

  if (googleVerification) {
    html = html.replace('</head>', `    <meta name="google-site-verification" content="${escapeAttr(googleVerification)}" />\n  </head>`)
  }
  if (bingVerification) {
    html = html.replace('</head>', `    <meta name="msvalidate.01" content="${escapeAttr(bingVerification)}" />\n  </head>`)
  }

  const graph =
    structuredData.length > 1
      ? { '@context': 'https://schema.org', '@graph': structuredData.map(stripContext) }
      : structuredData[0]

  if (graph) {
    html = html.replace(
      '</head>',
      `    <script type="application/ld+json" id="aicompliance-prerender-schema">${JSON.stringify(graph)}</script>\n  </head>`,
    )
  }

  return html
}

function upsertMeta(html, attrName, attrValue, content) {
  const escapedAttrValue = escapeRegExp(attrValue)
  const pattern = new RegExp(`<meta\\s+${attrName}="${escapedAttrValue}"\\s+content="[^"]*"\\s*\\/?>`, 's')
  const replacement = `<meta ${attrName}="${escapeAttr(attrValue)}" content="${escapeAttr(content)}" />`
  return html.replace(pattern, replacement)
}

function stripContext(item) {
  const { '@context': _context, ...rest } = item
  return rest
}

function buildHomePrerender() {
  return `
    <main>
      <section class="hero" id="scanner">
        <div class="hero-copy">
          <p class="eyebrow">AI Compliance for EU AI Act readiness</p>
          <h1>Find high-risk AI systems before the 2026 deadline finds you.</h1>
          <p class="lede">Run a 30-minute AI Compliance scan, classify likely EU AI Act risk, export a gap report, and start with the Pro annual plan already selected.</p>
          <p><a class="btn btn-primary" href="/#pricing">Choose Pro annual</a></p>
        </div>
        <section class="scanner-panel">
          <p class="eyebrow">Live scan</p>
          <h2>AI system intake</h2>
          <p>Inventory, Annex III routing, PDF gap report, deadline reminders, and secure checkout for EU AI Act preparation.</p>
        </section>
      </section>
    </main>`
}

function buildKeywordPrerender(page) {
  const sections = page.sections
    .map(
      (section) => `
        <section>
          <h2>${escapeHtml(section.heading)}</h2>
          ${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('\n')}
          ${section.bullets?.length ? `<ul>${section.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join('')}</ul>` : ''}
        </section>`,
    )
    .join('\n')
  const links = page.links
    .map((link) => `<a href="${escapeAttr(link)}" rel="noreferrer">Official source</a>`)
    .join('\n')
  const faqs = page.faqs
    .map((faq) => `<article><h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p></article>`)
    .join('\n')

  return `
    <main class="article-wrap">
      <article class="article">
        <a class="back-link" href="/">AI Compliance scanner</a>
        <p class="eyebrow">${escapeHtml(page.eyebrow)}</p>
        <h1>${escapeHtml(page.h1)}</h1>
        <p class="lede">${escapeHtml(page.lede)}</p>
        <div class="intent-box"><strong>Best for</strong><span>${escapeHtml(page.intent)}</span></div>
        ${links ? `<div class="official-links">${links}</div>` : ''}
        ${sections}
        <section>
          <h2>Quick answers</h2>
          ${faqs}
        </section>
      </article>
    </main>`
}

function buildLegalPrerender(title, description) {
  return `
    <main class="article-wrap">
      <article class="article">
        <a class="back-link" href="/">AI Compliance scanner</a>
        <h1>${escapeHtml(title)}</h1>
        <p class="lede">${escapeHtml(description)}</p>
      </article>
    </main>`
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, '&#96;')
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
