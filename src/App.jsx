import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarClock,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  Globe2,
  Lock,
  MailCheck,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'

import { keywordPages } from './content/keyword-pages.js'
import { trackEvent } from './lib/analytics.js'
import { SITE, applyDocumentSeo, getPageByPath } from './lib/seo.js'
import { buildReportLines, classifyAiSystem, daysUntilHighRiskDeadline } from './lib/risk.js'

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    monthly: 99,
    limit: '3 AI systems',
    summary: 'For a first inventory and executive scan.',
    features: ['AI system inventory', 'Risk classification', 'PDF gap report', 'Deadline dashboard'],
  },
  {
    id: 'pro',
    name: 'Pro',
    monthly: 299,
    limit: '15 AI systems',
    summary: 'The default plan for teams preparing the 2026 high-risk deadline.',
    features: ['Everything in Basic', 'DPIA framework', 'Reminder workflow', 'Priority evidence checklist'],
    recommended: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthly: 499,
    limit: 'Unlimited systems',
    summary: 'For cross-border portfolios and executive oversight.',
    features: ['Everything in Pro', 'Unlimited inventory', 'Consulting call', 'Country-level review queue'],
  },
]

const defaultSystem = {
  name: 'Candidate screening assistant',
  region: 'Germany, France, Netherlands, Spain',
  sector: 'Employment and worker management',
  purpose: 'Ranks candidates, summarises interviews, and recommends next hiring steps.',
  decisions: 'Supports hiring decisions for EU applicants.',
  data: 'CVs, interview notes, work history, and personal data.',
  humanOversight: true,
  logging: false,
  vendorDocs: false,
  impactAssessment: false,
  reminderEmail: '',
}

const deadlineDate = '2 August 2026'

export default function App() {
  const [path, setPath] = useState(() => window.location.pathname.replace(/\/+$/, '') || '/')
  const [system, setSystem] = useState(defaultSystem)
  const [result, setResult] = useState(() => classifyAiSystem(defaultSystem))
  const [billing, setBilling] = useState('annual')
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [payment, setPayment] = useState({ open: false, loading: false, error: '', url: '' })

  const page = useMemo(() => getPageByPath(path), [path])
  const daysLeft = daysUntilHighRiskDeadline()
  const annual = billing === 'annual'

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname.replace(/\/+$/, '') || '/')
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    if (path === '/') applyDocumentSeo(null)
    else if (page) applyDocumentSeo(page)
    else {
      document.title = `${path === '/privacy' ? 'Privacy' : 'Terms'} | ${SITE.name}`
    }
    trackEvent('page_view', { route: path })
  }, [path, page])

  function updateField(name, value) {
    setSystem((current) => ({ ...current, [name]: value }))
  }

  function runScan(event) {
    event.preventDefault()
    const next = classifyAiSystem(system)
    setResult(next)
    if (next.recommendedPlan) setSelectedPlan(next.recommendedPlan === 'basic' ? 'basic' : 'pro')
    trackEvent('scan_complete', {
      riskLevel: next.level,
      readiness: next.readiness,
      highRiskSignals: next.matchedHighRisk.length,
      reminderRequested: Boolean(next.system.reminderEmail),
    })
    if (next.system.reminderEmail) {
      fetch('/api/reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: next.system.reminderEmail, systemName: next.system.name }),
        keepalive: true,
      }).catch(() => {})
    }
    document.getElementById('scan-result')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  function navigate(event, href) {
    if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.includes('#')) return
    event.preventDefault()
    window.history.pushState({}, '', href)
    setPath(href.replace(/\/+$/, '') || '/')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function openCheckout(planId = selectedPlan, cycle = billing) {
    setSelectedPlan(planId)
    setBilling(cycle)
    setPayment({ open: true, loading: true, error: '', url: '' })
    trackEvent('checkout_click', { planId, billing: cycle })

    const popup = window.open('', 'creemCheckout', centeredPopupFeatures(560, 760))
    if (popup) {
      popup.document.write(
        '<!doctype html><title>Secure checkout</title><body style="font-family:Arial,sans-serif;padding:28px;background:#f4f8f6;color:#0b2323"><h1>Opening secure checkout...</h1><p>You can keep AI Compliance open in the original tab.</p></body>',
      )
      popup.document.close()
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, billing: cycle }),
      })
      const payload = await response.json()
      if (!response.ok || !payload.ok || !payload.checkoutUrl) {
        throw new Error(payload.error || 'Secure checkout is not available yet.')
      }
      setPayment({ open: true, loading: false, error: '', url: payload.checkoutUrl })
      if (popup && !popup.closed) {
        popup.location.assign(payload.checkoutUrl)
      } else {
        window.open(payload.checkoutUrl, 'creemCheckout', centeredPopupFeatures(560, 760))
      }
    } catch (error) {
      setPayment({
        open: true,
        loading: false,
        error: error instanceof Error ? error.message : 'Secure checkout is not available yet.',
        url: '',
      })
      if (popup && !popup.closed) popup.close()
      trackEvent('checkout_error', { planId, billing: cycle })
    }
  }

  if (page) {
    return (
      <SiteShell navigate={navigate} onCheckout={() => openCheckout('pro', 'annual')}>
        <KeywordPage page={page} onCheckout={() => openCheckout('pro', 'annual')} />
        <CheckoutOverlay payment={payment} setPayment={setPayment} />
      </SiteShell>
    )
  }

  if (path === '/privacy' || path === '/terms') {
    return (
      <SiteShell navigate={navigate} onCheckout={() => openCheckout('pro', 'annual')}>
        {path === '/privacy' ? <Privacy /> : <Terms />}
        <CheckoutOverlay payment={payment} setPayment={setPayment} />
      </SiteShell>
    )
  }

  return (
    <SiteShell navigate={navigate} onCheckout={() => openCheckout('pro', 'annual')}>
      <main>
        <section className="hero" id="scanner">
          <div className="hero-copy">
            <p className="eyebrow">AI Compliance for EU AI Act readiness</p>
            <h1>Find high-risk AI systems before the 2026 deadline finds you.</h1>
            <p className="lede">
              Run a 30-minute AI Compliance scan, classify likely EU AI Act risk, export a gap report, and start with
              the Pro annual plan already selected.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#scanner">
                Run the scan <ArrowRight size={18} />
              </a>
              <button className="btn btn-quiet" type="button" onClick={() => openCheckout('pro', 'annual')}>
                Choose Pro annual
              </button>
            </div>
            <div className="trust-row" aria-label="Compliance proof points">
              <span>
                <ShieldCheck size={16} /> Annex III routing
              </span>
              <span>
                <FileText size={16} /> PDF report
              </span>
              <span>
                <Lock size={16} /> Secure checkout
              </span>
            </div>
          </div>

          <ComplianceScanner
            system={system}
            result={result}
            daysLeft={daysLeft}
            onChange={updateField}
            onSubmit={runScan}
          />
        </section>

        <section className="deadline-band" aria-label="Deadline countdown">
          <div>
            <p className="eyebrow">High-risk deadline</p>
            <strong>{daysLeft}</strong>
            <span>days until {deadlineDate}</span>
          </div>
          <div>
            <p className="eyebrow">Penalty exposure</p>
            <strong>up to 3%</strong>
            <span>of worldwide annual turnover for many obligation failures</span>
          </div>
          <div>
            <p className="eyebrow">Fastest path</p>
            <strong>30 min</strong>
            <span>to a first inventory, risk route, and gap report</span>
          </div>
        </section>

        <section className="section" id="scan-result">
          <div className="section-heading">
            <p className="eyebrow">Your first-pass output</p>
            <h2>Risk classification that explains its work.</h2>
            <p>
              The scanner gives teams a clear reason, not a black-box label. Use it to prepare legal review, vendor
              questions, and internal evidence owners.
            </p>
          </div>
          <ResultPanel result={result} onDownload={() => downloadPdfReport(result)} />
        </section>

        <section className="section proof-section">
          <div className="section-heading">
            <p className="eyebrow">Why teams start here</p>
            <h2>Compliance work gets cheaper when the facts are already organised.</h2>
          </div>
          <div className="proof-grid">
            <ProofCard
              icon={<Building2 />}
              title="System inventory first"
              text="Capture who owns each AI system, where it is used, what it decides, and which evidence is missing."
            />
            <ProofCard
              icon={<BadgeCheck />}
              title="EU AI Act risk route"
              text="Map supplied facts against Annex III high-risk signals before the expensive advisory call."
            />
            <ProofCard
              icon={<MailCheck />}
              title="Deadline reminders"
              text="Keep owners moving as the 2026 high-risk deadline approaches, with email capture built into the scan."
            />
          </div>
        </section>

        <Pricing billing={billing} setBilling={setBilling} selectedPlan={selectedPlan} openCheckout={openCheckout} />

        <section className="section resources-section" id="resources">
          <div className="section-heading">
            <p className="eyebrow">Useful pages</p>
            <h2>Practical guides for the searches your team is already making.</h2>
            <p>Each page is written to help an operator do the next right thing, not to pad a keyword list.</p>
          </div>
          <div className="resource-grid">
            {keywordPages.map((resource) => (
              <a key={resource.path} className="resource-link" href={resource.path} onClick={(event) => navigate(event, resource.path)}>
                <span>{resource.keyword}</span>
                <ArrowRight size={16} />
              </a>
            ))}
          </div>
        </section>
      </main>
      <CheckoutOverlay payment={payment} setPayment={setPayment} />
    </SiteShell>
  )
}

function SiteShell({ children, navigate, onCheckout }) {
  return (
    <>
      <header className="site-header">
        <a className="brand" href="/" onClick={(event) => navigate(event, '/')}>
          <span className="brand-mark">AI</span>
          <span>AI Compliance</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="/#scanner">Scanner</a>
          <a href="/#pricing">Pricing</a>
          <a href="/#resources">Resources</a>
          <button type="button" onClick={onCheckout}>
            Checkout
          </button>
        </nav>
      </header>
      {children}
      <Footer navigate={navigate} />
    </>
  )
}

function ComplianceScanner({ system, result, daysLeft, onChange, onSubmit }) {
  return (
    <form className="scanner-panel" onSubmit={onSubmit}>
      <div className="scanner-top">
        <div>
          <p className="eyebrow">Live scan</p>
          <h2>AI system intake</h2>
        </div>
        <div className={`risk-pill risk-${result.level.toLowerCase()}`}>{result.level} risk</div>
      </div>

      <div className="field-grid">
        <label>
          AI system
          <input value={system.name} onChange={(event) => onChange('name', event.target.value)} />
        </label>
        <label>
          EU market
          <input value={system.region} onChange={(event) => onChange('region', event.target.value)} />
        </label>
        <label>
          Sector or function
          <input value={system.sector} onChange={(event) => onChange('sector', event.target.value)} />
        </label>
        <label>
          Reminder email
          <input
            type="email"
            placeholder="compliance@company.com"
            value={system.reminderEmail}
            onChange={(event) => onChange('reminderEmail', event.target.value)}
          />
        </label>
      </div>

      <label>
        Intended purpose
        <textarea value={system.purpose} onChange={(event) => onChange('purpose', event.target.value)} rows={3} />
      </label>
      <label>
        Decision impact
        <textarea value={system.decisions} onChange={(event) => onChange('decisions', event.target.value)} rows={2} />
      </label>
      <label>
        Data used
        <textarea value={system.data} onChange={(event) => onChange('data', event.target.value)} rows={2} />
      </label>

      <div className="checkbox-grid">
        <label>
          <input
            type="checkbox"
            checked={system.humanOversight}
            onChange={(event) => onChange('humanOversight', event.target.checked)}
          />
          Human oversight defined
        </label>
        <label>
          <input type="checkbox" checked={system.logging} onChange={(event) => onChange('logging', event.target.checked)} />
          Logging and monitoring defined
        </label>
        <label>
          <input
            type="checkbox"
            checked={system.vendorDocs}
            onChange={(event) => onChange('vendorDocs', event.target.checked)}
          />
          Vendor documentation collected
        </label>
        <label>
          <input
            type="checkbox"
            checked={system.impactAssessment}
            onChange={(event) => onChange('impactAssessment', event.target.checked)}
          />
          DPIA workstream started
        </label>
      </div>

      <div className="scanner-footer">
        <div>
          <CalendarClock size={18} />
          <span>{daysLeft} days to the high-risk deadline</span>
        </div>
        <button className="btn btn-primary" type="submit">
          Scan compliance gaps <Sparkles size={18} />
        </button>
      </div>
    </form>
  )
}

function ResultPanel({ result, onDownload }) {
  return (
    <div className="result-panel">
      <div className="result-score">
        <p className="eyebrow">Classification</p>
        <h3>{result.level} risk</h3>
        <div className="score-ring" style={{ '--score': `${result.readiness}%` }}>
          <span>{result.readiness}%</span>
          <small>ready</small>
        </div>
      </div>
      <div className="result-detail">
        <p>{result.summary}</p>
        <div className="signal-list">
          {result.matchedHighRisk.length ? (
            result.matchedHighRisk.map((category) => (
              <div className="signal signal-warning" key={category.id}>
                <AlertTriangle size={18} />
                <div>
                  <strong>{category.label}</strong>
                  <span>
                    {category.article}. {category.evidence}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="signal">
              <CheckCircle2 size={18} />
              <div>
                <strong>No high-risk category detected from supplied facts</strong>
                <span>Confirm classification with counsel before launch or procurement.</span>
              </div>
            </div>
          )}
        </div>
        <div className="gap-list">
          {(result.gaps.length ? result.gaps : ['Starter evidence looks covered. Keep monitoring changes.']).map((gap) => (
            <span key={gap}>{gap}</span>
          ))}
        </div>
        <button className="btn btn-secondary" type="button" onClick={onDownload}>
          Export PDF gap report <Download size={18} />
        </button>
      </div>
    </div>
  )
}

function ProofCard({ icon, title, text }) {
  return (
    <article className="proof-card">
      <div className="proof-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  )
}

function Pricing({ billing, setBilling, selectedPlan, openCheckout }) {
  const annual = billing === 'annual'

  return (
    <section className="section pricing-section" id="pricing">
      <div className="section-heading">
        <p className="eyebrow">Pricing</p>
        <h2>Start with Pro annual selected.</h2>
        <p>Annual billing is 50% lower than paying month to month.</p>
      </div>

      <div className="billing-toggle" role="group" aria-label="Billing cycle">
        <button className={annual ? 'active' : ''} type="button" onClick={() => setBilling('annual')}>
          Annual - save 50%
        </button>
        <button className={!annual ? 'active' : ''} type="button" onClick={() => setBilling('monthly')}>
          Monthly
        </button>
      </div>

      <div className="pricing-grid">
        {plans.map((plan) => {
          const monthlyEquivalent = annual ? plan.monthly * 0.5 : plan.monthly
          const billed = annual ? monthlyEquivalent * 12 : monthlyEquivalent
          const selected = selectedPlan === plan.id
          return (
            <article className={`plan-card ${plan.recommended ? 'featured' : ''}`} key={plan.id}>
              {plan.recommended ? <span className="plan-badge">Default choice</span> : null}
              <h3>{plan.name}</h3>
              <p>{plan.summary}</p>
              <div className="plan-price">
                <strong>${formatPrice(monthlyEquivalent)}</strong>
                <span>/mo</span>
              </div>
              <p className="billing-note">{annual ? `Billed $${formatPrice(billed)} yearly` : 'Billed monthly'}</p>
              <p className="plan-limit">{plan.limit}</p>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <CheckCircle2 size={16} /> {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`btn ${selected ? 'btn-primary' : 'btn-secondary'}`}
                type="button"
                onClick={() => openCheckout(plan.id, billing)}
              >
                Checkout <ArrowRight size={18} />
              </button>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function KeywordPage({ page, onCheckout }) {
  return (
    <main className="article-wrap">
      <article className="article">
        <a className="back-link" href="/">
          AI Compliance scanner
        </a>
        <p className="eyebrow">{page.eyebrow}</p>
        <h1>{page.h1}</h1>
        <p className="lede">{page.lede}</p>
        <div className="intent-box">
          <strong>Best for</strong>
          <span>{page.intent}</span>
        </div>
        {page.links.length ? (
          <div className="official-links">
            {page.links.map((link) => (
              <a href={link} key={link} target="_blank" rel="noreferrer">
                Official source <ExternalLink size={15} />
              </a>
            ))}
          </div>
        ) : null}
        {page.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.bullets.length ? (
              <ul>
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
        <section>
          <h2>Quick answers</h2>
          {page.faqs.map((faq) => (
            <article className="faq-item" key={faq.question}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </section>
        <aside className="article-cta">
          <div>
            <p className="eyebrow">Next step</p>
            <h2>Run the scan while the facts are fresh.</h2>
            <p>Turn this guidance into a system-level risk route and exportable evidence gap report.</p>
          </div>
          <button className="btn btn-primary" type="button" onClick={onCheckout}>
            Choose Pro annual <ArrowRight size={18} />
          </button>
        </aside>
      </article>
    </main>
  )
}

function Privacy() {
  return (
    <main className="article-wrap">
      <article className="article legal">
        <a className="back-link" href="/">
          AI Compliance scanner
        </a>
        <h1>Privacy Policy</h1>
        <p className="lede">
          AI Compliance collects only the information needed to operate the scanner, payment flow, support channel, and
          product analytics.
        </p>
        <section>
          <h2>Information we process</h2>
          <p>
            You may provide AI system names, business context, market information, reminder email addresses, support
            messages, and payment metadata. Payment card details are handled by the hosted payment provider and are not
            stored by this site.
          </p>
        </section>
        <section>
          <h2>How it is used</h2>
          <p>
            We use information to provide the scan, generate reports, operate checkout, respond to support requests,
            maintain security, understand conversion and reliability, and improve the service.
          </p>
        </section>
        <section>
          <h2>Retention and security</h2>
          <p>
            We keep operational records only as long as needed for service, security, accounting, dispute handling, and
            legal obligations. Sensitive secrets are not committed to source code and payment is handled through hosted
            checkout.
          </p>
        </section>
        <section>
          <h2>Contact</h2>
          <p>
            Privacy and support questions can be sent to <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>.
          </p>
        </section>
      </article>
    </main>
  )
}

function Terms() {
  return (
    <main className="article-wrap">
      <article className="article legal">
        <a className="back-link" href="/">
          AI Compliance scanner
        </a>
        <h1>Terms of Service</h1>
        <p className="lede">
          These terms govern access to AI Compliance, including scans, reports, checkout, reminders, support, and related
          materials.
        </p>
        <section>
          <h2>No legal advice</h2>
          <p>
            The service provides operational workflow assistance, risk routing, checklists, and report templates. It does
            not provide legal advice, does not create an attorney-client relationship, and does not guarantee any legal,
            regulatory, audit, commercial, or litigation outcome.
          </p>
        </section>
        <section>
          <h2>Your responsibilities</h2>
          <p>
            You are responsible for the accuracy of information supplied to the service, for obtaining qualified legal and
            professional advice where appropriate, for evaluating whether your AI systems comply with applicable law, and
            for maintaining your own records and controls.
          </p>
        </section>
        <section>
          <h2>Payment and subscriptions</h2>
          <p>
            Paid plans are charged through hosted checkout. Plan limits, billing cadence, renewal, taxes, cancellation,
            and refund eligibility may depend on the checkout terms shown at purchase and applicable law.
          </p>
        </section>
        <section>
          <h2>Liability limits</h2>
          <p>
            To the maximum extent permitted by law, the service is provided as is and as available. The operator disclaims
            implied warranties and will not be liable for indirect, incidental, special, consequential, exemplary, or
            punitive damages. Total liability is limited to the amount paid for the service in the three months before the
            claim, unless a non-waivable law requires otherwise.
          </p>
        </section>
        <section>
          <h2>Disputes</h2>
          <p>
            Before filing a claim, you agree to contact support and attempt a good-faith resolution. Class, collective,
            and representative actions are waived to the maximum extent permitted by law.
          </p>
        </section>
        <section>
          <h2>Contact</h2>
          <p>
            Terms and support questions can be sent to <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>.
          </p>
        </section>
      </article>
    </main>
  )
}

function Footer({ navigate }) {
  return (
    <footer className="site-footer">
      <div>
        <a className="brand" href="/" onClick={(event) => navigate(event, '/')}>
          <span className="brand-mark">AI</span>
          <span>AI Compliance</span>
        </a>
        <p>
          AI Compliance scanner for EU27 teams, with emphasis on Germany, France, the Netherlands, and Spain. Next
          market focus: US companies with European operations and GCC cross-border teams in Saudi Arabia and the UAE.
        </p>
        <p>
          Support: <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>
        </p>
      </div>
      <nav aria-label="Footer navigation">
        <a href="/privacy" onClick={(event) => navigate(event, '/privacy')}>
          Privacy
        </a>
        <a href="/terms" onClick={(event) => navigate(event, '/terms')}>
          Terms
        </a>
        <a href="/sitemap.xml">Sitemap</a>
        <a href="/resources/eu-ai-act-summary" onClick={(event) => navigate(event, '/resources/eu-ai-act-summary')}>
          EU AI Act summary
        </a>
      </nav>
    </footer>
  )
}

function CheckoutOverlay({ payment, setPayment }) {
  if (!payment.open) return null

  return (
    <div className="checkout-overlay" role="dialog" aria-modal="true" aria-label="Checkout status">
      <div className="checkout-modal">
        <button className="icon-button" type="button" onClick={() => setPayment({ open: false, loading: false, error: '', url: '' })}>
          <X size={18} />
        </button>
        <p className="eyebrow">Secure checkout</p>
        <h2>{payment.error ? 'Checkout needs attention' : payment.loading ? 'Opening Creem checkout' : 'Checkout is open'}</h2>
        <p>
          {payment.error
            ? payment.error
            : 'The payment window is centered while this page stays open. The checkout returns to the AI Compliance homepage after payment.'}
        </p>
        {payment.url ? (
          <button className="btn btn-primary" type="button" onClick={() => window.open(payment.url, 'creemCheckout', centeredPopupFeatures(560, 760))}>
            Reopen payment window <ArrowRight size={18} />
          </button>
        ) : null}
      </div>
    </div>
  )
}

function centeredPopupFeatures(width, height) {
  const left = Math.max(0, Math.round(window.screenX + (window.outerWidth - width) / 2))
  const top = Math.max(0, Math.round(window.screenY + (window.outerHeight - height) / 2))
  return `popup=yes,width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
}

function formatPrice(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2)
}

function downloadPdfReport(result) {
  const lines = buildReportLines(result).flatMap((line) => wrapLine(line, 86))
  const pdf = buildPdf(lines)
  const blob = new Blob([pdf], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${result.system.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'ai-system'}-compliance-report.pdf`
  anchor.click()
  URL.revokeObjectURL(url)
  trackEvent('pdf_export', { riskLevel: result.level })
}

function wrapLine(line, maxLength) {
  if (!line) return ['']
  const words = String(line).split(/\s+/)
  const lines = []
  let current = ''
  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (next.length > maxLength && current) {
      lines.push(current)
      current = word
    } else {
      current = next
    }
  }
  if (current) lines.push(current)
  return lines
}

function buildPdf(lines) {
  const encoder = new TextEncoder()
  const objects = [null]
  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>'
  objects[2] = ''
  objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'

  const chunks = []
  for (let index = 0; index < lines.length; index += 45) chunks.push(lines.slice(index, index + 45))
  const pageRefs = []

  for (const chunk of chunks) {
    const stream = renderPdfTextStream(chunk)
    const contentId = objects.push(`<< /Length ${encoder.encode(stream).length} >>\nstream\n${stream}\nendstream`) - 1
    const pageId =
      objects.push(
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentId} 0 R >>`,
      ) - 1
    pageRefs.push(`${pageId} 0 R`)
  }

  objects[2] = `<< /Type /Pages /Kids [${pageRefs.join(' ')}] /Count ${pageRefs.length} >>`

  let output = '%PDF-1.4\n'
  const offsets = [0]
  for (let index = 1; index < objects.length; index += 1) {
    offsets[index] = encoder.encode(output).length
    output += `${index} 0 obj\n${objects[index]}\nendobj\n`
  }
  const xrefOffset = encoder.encode(output).length
  output += `xref\n0 ${objects.length}\n0000000000 65535 f \n`
  for (let index = 1; index < objects.length; index += 1) {
    output += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`
  }
  output += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`
  return output
}

function renderPdfTextStream(lines) {
  const escaped = lines.map((line) => `(${escapePdfText(line)}) Tj`)
  return `BT\n/F1 11 Tf\n54 748 Td\n14 TL\n${escaped.join('\nT*\n')}\nET`
}

function escapePdfText(value) {
  return String(value)
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, '')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
}
