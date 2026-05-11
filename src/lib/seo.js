import { keywordPages } from '../content/keyword-pages.js'

export const SITE = {
  name: 'AI Compliance',
  origin: 'https://aicompliance.online',
  supportEmail: 'support@aigeamy.com',
  primaryKeyword: 'AI Compliance',
  secondaryKeyword: 'EU AI Act',
}

export const HOME_SEO = {
  title: 'AI Compliance | EU AI Act Readiness Scanner',
  description:
    'Run a focused AI Compliance scan for EU AI Act high-risk obligations, risk classification, checklist gaps, and a downloadable readiness report.',
  canonicalPath: '/',
}

export function getPageByPath(pathname) {
  const normalized = pathname.replace(/\/+$/, '') || '/'
  return keywordPages.find((page) => page.path === normalized)
}

export function applyDocumentSeo(page) {
  const title = page ? `${page.title} | ${SITE.name}` : HOME_SEO.title
  const description = page?.description || HOME_SEO.description
  const canonicalPath = page?.path || HOME_SEO.canonicalPath
  document.title = title
  setMeta('name', 'description', description)
  setMeta('property', 'og:title', title)
  setMeta('property', 'og:description', description)
  setMeta('property', 'og:url', `${SITE.origin}${canonicalPath === '/' ? '/' : canonicalPath}`)
  setMeta('name', 'twitter:title', title)
  setMeta('name', 'twitter:description', description)
  const canonical = document.querySelector('link[rel="canonical"]')
  if (canonical) canonical.setAttribute('href', `${SITE.origin}${canonicalPath === '/' ? '/' : canonicalPath}`)
}

function setMeta(attrName, attrValue, content) {
  const element = document.querySelector(`meta[${attrName}="${attrValue}"]`)
  if (element) element.setAttribute('content', content)
}
