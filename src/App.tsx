import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BellRing,
  CalendarCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  Clipboard,
  Clock3,
  Code2,
  ExternalLink,
  FileAudio,
  Globe2,
  Headphones,
  MailCheck,
  MessageSquareText,
  Mic2,
  PhoneCall,
  Play,
  Rocket,
  ShieldCheck,
  SignalHigh,
  X,
  Zap,
} from 'lucide-react'

import { findKeywordPageByPath, keywordPages, type KeywordPage } from './content/keyword-pages'
import { legalPrivacySections, legalTermsSections, type LegalSection } from './content/legal'
import { trackEvent, trackPageView } from './lib/analytics'
import {
  analyzeVoiceAgentSelection,
  calendarOptions,
  callerOptions,
  defaultVoiceAgentSelection,
  followupOptions,
  intentOptions,
  type Option,
  type PlanId,
  type VoiceAgentSelection,
} from './lib/mission'
import { buildSeoDocument, syncSeoDocument } from './lib/seo'
import { deriveRouteView, normalizePathname, scrollToHashTarget, type RouteView } from './lib/routing'

const defaultPublicAppOrigin = 'https://voiceaiagent.space'
const pagesApiBaseUrl = 'https://my-aicompliance.yangdengkui01.workers.dev'

type Billing = 'monthly' | 'annual'

type CheckoutModalState = {
  planId: PlanId
  billing: Billing
  loadingKey: string
  status: 'loading' | 'popup' | 'retry'
  checkoutUrl?: string
}

type Plan = {
  id: PlanId
  name: string
  shortName: string
  tagline: string
  monthlyUsd: number | null
  usage: string
  bullets: string[]
  popular?: boolean
}

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    shortName: 'Starter',
    tagline: 'For one clinic testing after-hours answering and missed-call recovery.',
    monthlyUsd: 99,
    usage: '$0.10 / minute',
    bullets: ['AI phone answering', 'Booking, reschedule, price-question scripts', 'Email call summaries', 'Admin dashboard'],
  },
  {
    id: 'pro',
    name: 'Pro',
    shortName: 'Pro',
    tagline: 'The default plan for clinics ready to recover more patient calls every week.',
    monthlyUsd: 249,
    usage: '1,000 minutes included, then $0.07 / minute',
    popular: true,
    bullets: ['Everything in Starter', 'Google Calendar appointment writes', 'Missed-call SMS booking links', 'Recordings, transcripts, monthly stats'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    shortName: 'Enterprise',
    tagline: 'For multi-location groups, language expansion, custom routing, and compliance review.',
    monthlyUsd: null,
    usage: 'Custom usage and controls',
    bullets: ['Custom integrations', 'Advanced review and routing', 'Language roadmap support', 'Priority onboarding'],
  },
]

const proofItems = [
  { label: 'Coverage', value: '24/7', detail: 'Answers after hours, lunch breaks, and busy front-desk windows' },
  { label: 'Starter', value: '$99', detail: 'Simple entry plan plus usage-based minutes' },
  { label: 'Pro minutes', value: '1,000', detail: 'Included minutes with a lower overage rate' },
  { label: 'Annual savings', value: '50%', detail: 'Annual billing is selected before checkout' },
]

const workflowCards = [
  {
    title: 'Answers like a trained receptionist',
    body: 'The agent greets callers, confirms intent, stays inside approved scripts, and knows when a human should review.',
    icon: <Headphones size={21} />,
  },
  {
    title: 'Books into Google Calendar',
    body: 'Appointment requests become calendar-ready actions with conflict checks and a staff-readable summary.',
    icon: <CalendarCheck size={21} />,
  },
  {
    title: 'Recovers missed calls with SMS',
    body: 'If a call is missed or incomplete, the caller receives a booking link and the admin gets context.',
    icon: <MessageSquareText size={21} />,
  },
  {
    title: 'Keeps the admin loop visible',
    body: 'Recordings, transcripts, summaries, monthly statistics, and call outcomes stay reviewable in one place.',
    icon: <BarChart3 size={21} />,
  },
]

const trustLinks = [
  { label: 'Platform guide', href: '/voice-ai-agent-platform', icon: <SignalHigh size={17} /> },
  { label: 'Developers', href: '/voice-ai-agent-for-developers', icon: <Code2 size={17} /> },
  { label: 'Best AI voice agents', href: '/best-ai-voice-agents', icon: <BadgeCheck size={17} /> },
]

function formatMoney(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value)
}

function resolveApiBaseUrl() {
  const configured = (import.meta.env.VITE_API_BASE_URL ?? '').trim().replace(/\/+$/, '')
  if (configured) return configured
  if (window.location.hostname.endsWith('.pages.dev')) return pagesApiBaseUrl
  return ''
}

function resolveApiUrl(path: string) {
  const apiBaseUrl = resolveApiBaseUrl()
  return apiBaseUrl ? `${apiBaseUrl}${path}` : path
}

async function readJsonResponse<T>(response: Response): Promise<T | null> {
  const rawText = await response.text()
  if (!rawText.trim()) return null
  try {
    return JSON.parse(rawText) as T
  } catch {
    return null
  }
}

async function createCheckoutSession(planId: PlanId, billing: Billing) {
  const response = await fetch(resolveApiUrl('/api/checkout'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planId, billing }),
  })

  const payload = await readJsonResponse<{ ok?: boolean; checkoutUrl?: string; error?: string }>(response)
  if (!response.ok || !payload?.ok || !payload.checkoutUrl) {
    throw new Error(payload?.error || 'Checkout could not be started.')
  }

  return payload.checkoutUrl
}

function openCenteredCheckoutWindow() {
  const width = 560
  const height = 760
  const left = Math.max(0, Math.round(window.screenX + (window.outerWidth - width) / 2))
  const top = Math.max(0, Math.round(window.screenY + (window.outerHeight - height) / 2))
  const popup = window.open(
    'about:blank',
    'voiceaiagent-checkout',
    `popup=yes,width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`,
  )

  if (popup) {
    try {
      popup.document.title = 'Opening secure checkout'
      popup.document.body.innerHTML =
        '<main style="min-height:100vh;display:grid;place-items:center;background:#111827;color:#f8fafc;font-family:ui-sans-serif,system-ui,sans-serif;text-align:center;padding:32px"><div><h1 style="font-size:22px;margin:0 0 8px">Opening secure checkout...</h1><p style="margin:0;color:#cbd5e1">Your Voice AI Agent payment window is being prepared.</p></div></main>'
    } catch {
      /* Existing named checkout windows can be cross-origin. */
    }
  }

  return popup
}

function sendPopupToCheckout(popup: Window | null, url: string) {
  if (!popup || popup.closed) return false

  try {
    popup.location.replace(url)
    popup.focus()
    return true
  } catch {
    return false
  }
}

function useRouteSignal() {
  const [pathname, setPathname] = useState(() => window.location.pathname)
  const [search, setSearch] = useState(() => window.location.search)

  function navigate(to: string) {
    const url = new URL(to, window.location.origin)
    window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`)
    setPathname(url.pathname)
    setSearch(url.search)

    if (url.hash) {
      requestAnimationFrame(() => scrollToHashTarget(url.hash))
      return
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const onPop = () => {
      setPathname(window.location.pathname)
      setSearch(window.location.search)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  return { pathname, search, navigate }
}

function CheckoutDoneBridge({ publicAppOrigin }: { publicAppOrigin: string }) {
  useEffect(() => {
    const origin = window.location.origin || new URL(publicAppOrigin).origin

    if (window.parent !== window) {
      window.parent.postMessage({ type: 'voiceaiagent-checkout-complete' }, origin)
      return
    }

    if (window.opener) {
      try {
        window.opener.postMessage({ type: 'voiceaiagent-checkout-complete' }, origin)
      } catch {
        /* The opener may be closed or cross-origin. */
      }
      window.close()
      return
    }

    window.location.replace(`${origin}/?payment=success`)
  }, [publicAppOrigin])

  return (
    <main className="vai-main">
      <section className="vai-center-panel">
        <p className="vai-eyebrow">Checkout</p>
        <h1>Finishing checkout...</h1>
        <p className="vai-muted">You will return to the Voice AI Agent homepage when the hosted payment session closes.</p>
      </section>
    </main>
  )
}

export default function App() {
  const { pathname, search, navigate } = useRouteSignal()
  const routeView: RouteView = useMemo(() => deriveRouteView(pathname), [pathname])
  const normalizedPath = normalizePathname(pathname)
  const keywordPage = useMemo(() => findKeywordPageByPath(pathname), [pathname])

  const [publicAppOrigin, setPublicAppOrigin] = useState(defaultPublicAppOrigin)
  const [headerCompact, setHeaderCompact] = useState(() => window.scrollY > 18)
  const [billing, setBilling] = useState<Billing>('annual')
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>('pro')
  const [selection, setSelection] = useState<VoiceAgentSelection>(defaultVoiceAgentSelection)
  const [copied, setCopied] = useState(false)
  const [checkoutModal, setCheckoutModal] = useState<CheckoutModalState | null>(null)
  const [checkoutLoadingKey, setCheckoutLoadingKey] = useState<string | null>(null)

  const callPlan = useMemo(() => analyzeVoiceAgentSelection(selection), [selection])

  useEffect(() => {
    const onScroll = () => setHeaderCompact(window.scrollY > 18)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const seo = buildSeoDocument({ pathname, routeView, publicAppOrigin, keywordPage })
    syncSeoDocument(seo)
    trackPageView(`${pathname}${search}`)
  }, [keywordPage, pathname, publicAppOrigin, routeView, search])

  useEffect(() => {
    let active = true
    fetch(resolveApiUrl('/api/runtime'))
      .then((response) => readJsonResponse<{ publicAppOrigin?: string }>(response))
      .then((payload) => {
        if (active && payload?.publicAppOrigin) setPublicAppOrigin(payload.publicAppOrigin)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      if (event.data?.type !== 'voiceaiagent-checkout-complete') return
      setCheckoutModal(null)
      setCheckoutLoadingKey(null)
      trackEvent('checkout_success_return', { provider: 'creem' })
      navigate('/?payment=success')
    }

    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [navigate])

  function openPage(path: string) {
    trackEvent('internal_navigation', { target: path })
    navigate(path)
  }

  function updateSelection<K extends keyof VoiceAgentSelection>(key: K, value: VoiceAgentSelection[K]) {
    setSelection((current) => ({ ...current, [key]: value }))
    trackEvent('call_simulator_change', { field: key, value })
  }

  function renderOptionButtons<K extends keyof VoiceAgentSelection>(key: K, options: Option<VoiceAgentSelection[K]>[]) {
    return (
      <div className="vai-option-grid">
        {options.map((option) => (
          <button
            type="button"
            className="vai-option"
            data-active={selection[key] === option.id ? 'true' : 'false'}
            onClick={() => updateSelection(key, option.id)}
            key={option.id}
          >
            <strong>{option.label}</strong>
            <span>{option.summary}</span>
          </button>
        ))}
      </div>
    )
  }

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(callPlan.adminSummary)
      setCopied(true)
      trackEvent('call_summary_copy', { intent: selection.intent, caller: selection.caller })
      window.setTimeout(() => setCopied(false), 1800)
    } catch {}
  }

  async function startHostedCheckout(planId: PlanId, billingCycle: Billing, loadingKey: string) {
    if (planId === 'enterprise') return

    const popup = openCenteredCheckoutWindow()
    setSelectedPlanId(planId)
    setBilling(billingCycle)
    setCheckoutLoadingKey(loadingKey)
    setCheckoutModal({ planId, billing: billingCycle, loadingKey, status: 'loading' })
    trackEvent('checkout_open_start', { planId, billing: billingCycle, popup: Boolean(popup) })

    try {
      const checkoutUrl = await createCheckoutSession(planId, billingCycle)
      const popupReady = sendPopupToCheckout(popup, checkoutUrl)
      trackEvent('checkout_session_created', { planId, billing: billingCycle, popupReady })
      setCheckoutModal({ planId, billing: billingCycle, loadingKey, status: popupReady ? 'popup' : 'retry', checkoutUrl })
    } catch (error) {
      try {
        popup?.close()
      } catch {}
      trackEvent('checkout_session_failed', { planId, billing: billingCycle, message: error instanceof Error ? error.message : 'unknown' })
      setCheckoutModal({ planId, billing: billingCycle, loadingKey, status: 'retry' })
    } finally {
      setCheckoutLoadingKey(null)
    }
  }

  function chooseProAnnual(source: string) {
    setBilling('annual')
    setSelectedPlanId('pro')
    trackEvent('primary_cta_click', { source, planId: 'pro', billing: 'annual' })
    navigate('/pricing#pricing')
  }

  const renderHeader = () => (
    <header className={`vai-header${headerCompact ? ' compact' : ''}`}>
      <div className="vai-header-inner">
        <a
          className="vai-brand"
          href="/"
          onClick={(event) => {
            event.preventDefault()
            openPage('/')
          }}
        >
          <span className="vai-brand-mark">
            <Mic2 size={22} />
          </span>
          <span className="vai-brand-copy">
            <strong>Voice AI Agent</strong>
            <span>24/7 AI receptionist</span>
          </span>
        </a>
        <nav className="vai-nav" aria-label="Primary navigation">
          <a href="/voice-ai-agent-platform" onClick={(event) => { event.preventDefault(); openPage('/voice-ai-agent-platform') }}>Platform</a>
          <a href="/voice-ai-agent-for-developers" onClick={(event) => { event.preventDefault(); openPage('/voice-ai-agent-for-developers') }}>Developers</a>
          <a href="/ai-voice-agents-india" onClick={(event) => { event.preventDefault(); openPage('/ai-voice-agents-india') }}>India</a>
          <a href="/pricing" onClick={(event) => { event.preventDefault(); openPage('/pricing') }}>Pricing</a>
        </nav>
        <button type="button" className="vai-btn vai-btn-primary vai-header-cta" onClick={() => chooseProAnnual('header')}>
          <Rocket size={18} />
          Choose Pro annual
        </button>
      </div>
    </header>
  )

  const renderCallSimulator = () => (
    <aside className="vai-workspace-panel" id="simulator" aria-label="Voice AI Agent call simulator">
      <div className="vai-panel-top">
        <div>
          <p className="vai-eyebrow">Live call flow</p>
          <h2>{callPlan.headline}</h2>
        </div>
        <div className="vai-score">
          <strong>{callPlan.fitScore}</strong>
          <span>{callPlan.fitLabel}</span>
        </div>
      </div>

      <div className="vai-choice-stack">
        <section>
          <div className="vai-choice-label">Caller intent</div>
          {renderOptionButtons('intent', intentOptions)}
        </section>
        <section>
          <div className="vai-choice-label">Caller profile</div>
          {renderOptionButtons('caller', callerOptions)}
        </section>
        <section>
          <div className="vai-choice-label">Calendar path</div>
          {renderOptionButtons('calendar', calendarOptions)}
        </section>
        <section>
          <div className="vai-choice-label">Follow-up</div>
          {renderOptionButtons('followup', followupOptions)}
        </section>
      </div>

      <div className="vai-result-grid">
        {callPlan.modules.map((module) => (
          <article key={module.label}>
            <span>{module.label}</span>
            <strong>{module.detail}</strong>
          </article>
        ))}
      </div>

      <div className="vai-transcript-box">
        <div className="vai-config-head">
          <div>
            <p className="vai-eyebrow">Transcript preview</p>
            <h3>Caller handled, next step captured</h3>
          </div>
          <PhoneCall size={22} />
        </div>
        <div className="vai-transcript-lines">
          {callPlan.transcriptLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>

      <div className="vai-config-box">
        <div className="vai-config-head">
          <div>
            <p className="vai-eyebrow">Admin summary</p>
            <h3>{callPlan.callOutcome}</h3>
          </div>
          <button type="button" className="vai-icon-btn" onClick={() => void copySummary()} aria-label="Copy admin summary">
            <Clipboard size={17} />
          </button>
        </div>
        <p>{callPlan.adminSummary}</p>
        {copied ? <span className="vai-copy-note">Copied</span> : null}
      </div>

      <div className="vai-next-box">
        <div>
          <p className="vai-eyebrow">Recommended next move</p>
          <h3>Pro annual is the clean default for a clinic with steady call volume.</h3>
          <p>{callPlan.checklist[0]}</p>
        </div>
        <button type="button" className="vai-btn vai-btn-primary" onClick={() => chooseProAnnual('simulator')}>
          <Play size={18} />
          Review Pro annual
        </button>
      </div>
    </aside>
  )

  const renderPricingSection = (standalone = false) => (
    <section className={`vai-section vai-pricing-section${standalone ? ' standalone' : ''}`} id="pricing">
      <div className="vai-section-head vai-pricing-head">
        <div>
          <p className="vai-eyebrow">Pricing</p>
          <h2>Pro is selected because real clinics need calendar booking, SMS recovery, transcripts, and included minutes.</h2>
          <p>Annual billing is active by default and is 50% cheaper than paying month to month.</p>
        </div>
        <div className="vai-cycle" role="group" aria-label="Billing cycle">
          <button
            type="button"
            data-active={billing === 'monthly' ? 'true' : 'false'}
            onClick={() => {
              setBilling('monthly')
              trackEvent('billing_cycle_change', { billing: 'monthly' })
            }}
          >
            Monthly
          </button>
          <button
            type="button"
            data-active={billing === 'annual' ? 'true' : 'false'}
            onClick={() => {
              setBilling('annual')
              trackEvent('billing_cycle_change', { billing: 'annual' })
            }}
          >
            Annual - 50% off
          </button>
        </div>
      </div>

      <div className="vai-plan-grid">
        {plans.map((planItem) => {
          const monthly = planItem.monthlyUsd === null ? null : billing === 'annual' ? planItem.monthlyUsd * 0.5 : planItem.monthlyUsd
          const strike = planItem.monthlyUsd !== null && billing === 'annual' ? planItem.monthlyUsd : null
          const loadingKey = `plan-${planItem.id}-${billing}`
          const active = selectedPlanId === planItem.id
          const checkoutEnabled = planItem.id !== 'enterprise'

          return (
            <article className="vai-plan-card" data-popular={planItem.popular ? 'true' : 'false'} data-active={active ? 'true' : 'false'} key={planItem.id}>
              {planItem.popular ? <span className="vai-plan-badge">Default choice</span> : null}
              <h3>{planItem.name}</h3>
              <p>{planItem.tagline}</p>
              <div className="vai-price-line">
                {monthly === null ? 'Custom' : formatMoney(monthly)}
                {monthly !== null ? <small>/mo</small> : null}
                {strike ? <span>{formatMoney(strike)}</span> : null}
              </div>
              <strong className="vai-billing-note">
                {monthly === null ? planItem.usage : billing === 'annual' ? `${formatMoney(monthly * 12)} billed annually` : 'Billed monthly'}
              </strong>
              <small className="vai-usage-note">{planItem.usage}</small>
              <ul>
                {planItem.bullets.map((bullet) => (
                  <li key={bullet}>
                    <Check size={15} />
                    {bullet}
                  </li>
                ))}
              </ul>
              <div className="vai-plan-actions">
                {checkoutEnabled ? (
                  <button
                    type="button"
                    className={planItem.popular ? 'vai-btn vai-btn-primary' : 'vai-btn vai-btn-ghost'}
                    onClick={() => void startHostedCheckout(planItem.id, billing, loadingKey)}
                    onMouseEnter={() => setSelectedPlanId(planItem.id)}
                    disabled={checkoutLoadingKey !== null}
                  >
                    {checkoutLoadingKey === loadingKey ? 'Opening secure checkout...' : planItem.id === 'pro' ? `Checkout Pro ${billing}` : `Checkout ${planItem.shortName} ${billing}`}
                  </button>
                ) : (
                  <a
                    className="vai-btn vai-btn-ghost"
                    href="mailto:support@aigeamy.com?subject=Voice%20AI%20Agent%20Enterprise"
                    onClick={() => {
                      setSelectedPlanId('enterprise')
                      trackEvent('enterprise_contact_click', { billing })
                    }}
                  >
                    <MailCheck size={18} />
                    Contact enterprise
                  </a>
                )}
                {active ? <span className="vai-plan-selected">Selected</span> : null}
              </div>
            </article>
          )
        })}
      </div>

      {standalone ? (
        <div className="vai-faq-grid">
          <article>
            <h3>Why is Pro selected?</h3>
            <p>Most clinics need calendar writes, missed-call SMS, transcripts, recordings, monthly stats, and enough included minutes to judge the business outcome.</p>
          </article>
          <article>
            <h3>Does checkout replace this page?</h3>
            <p>No. Creem opens in a centered popup and the site stays visible behind a blurred overlay.</p>
          </article>
          <article>
            <h3>What happens after payment?</h3>
            <p>The hosted checkout returns to the homepage and onboarding continues through the email used during payment.</p>
          </article>
        </div>
      ) : null}
    </section>
  )

  const renderHome = () => {
    const paymentSuccess = new URLSearchParams(search).get('payment') === 'success'

    return (
      <main className="vai-main">
        {paymentSuccess ? (
          <section className="vai-success-banner">
            <CheckCircle2 size={18} />
            Payment received. Voice AI Agent onboarding will continue from the email used at checkout.
          </section>
        ) : null}

        <section className="vai-hero">
          <div className="vai-hero-copy">
            <p className="vai-eyebrow">Voice AI Agent for dental clinics</p>
            <h1>Never miss another patient call.</h1>
            <p className="vai-lede">
              Voice AI Agent is a 24/7 AI receptionist that answers dental calls, understands booking and rescheduling intent, writes appointments to Google Calendar, emails summaries, and sends missed-call SMS links.
            </p>

            <div className="vai-hero-actions">
              <button type="button" className="vai-btn vai-btn-primary" onClick={() => chooseProAnnual('hero')}>
                <Rocket size={18} />
                Review Pro annual
              </button>
              <button
                type="button"
                className="vai-btn vai-btn-ghost"
                onClick={() => {
                  trackEvent('simulator_review', { source: 'hero-secondary' })
                  navigate('/#simulator')
                }}
              >
                <PhoneCall size={18} />
                Tune call flow
              </button>
              <button type="button" className="vai-btn vai-btn-subtle" onClick={() => openPage('/voice-ai-agent-for-developers')}>
                <Code2 size={18} />
                See developer stack
              </button>
            </div>
            <p className="vai-payment-note">
              <CheckCircle2 size={16} />
              <span>Starts at $99/mo. Pro annual is selected by default and saves 50%.</span>
            </p>

            <div className="vai-trust-row">
              {trustLinks.map((link) => (
                <a
                  href={link.href}
                  key={link.href}
                  onClick={(event) => {
                    event.preventDefault()
                    openPage(link.href)
                  }}
                >
                  {link.icon}
                  {link.label}
                  <ChevronRight size={13} />
                </a>
              ))}
            </div>

            <div className="vai-hero-proof">
              <div>
                <span>Best first vertical</span>
                <strong>US dental clinics with appointment calls, price questions, and after-hours missed-call leakage.</strong>
              </div>
              <div>
                <span>Buyer outcome</span>
                <strong>More patient calls become booked appointments, staff summaries, or recoverable SMS follow-ups.</strong>
              </div>
            </div>
          </div>

          {renderCallSimulator()}
        </section>

        <section className="vai-proof-strip" aria-label="Voice AI Agent proof points">
          {proofItems.map((item) => (
            <article key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </section>

        <section className="vai-section vai-media-section">
          <div className="vai-section-head">
            <p className="vai-eyebrow">Clinic operations dashboard</p>
            <h2>The promise is not a voice demo. It is a completed call record the office can trust.</h2>
            <p>Every call should end as a booked slot, a clear summary, a missed-call recovery link, or a human-review task.</p>
          </div>
          <div className="vai-media-grid">
            <figure className="vai-dashboard-shot">
              <img src="/voice-ai-agent-dashboard.png" alt="Voice AI Agent dashboard showing live call, Google Calendar appointment, transcript, missed-call SMS, and call summary" />
              <figcaption>Voice AI Agent dashboard mockup for call review, appointment capture, and missed-call recovery.</figcaption>
            </figure>
            <div className="vai-signal-list">
              <article>
                <Clock3 size={20} />
                <h3>After-hours coverage</h3>
                <p>Catch booking intent when staff is unavailable and keep the clinic's next step visible.</p>
              </article>
              <article>
                <FileAudio size={20} />
                <h3>Recordings and transcripts</h3>
                <p>Review what the caller asked, how the agent responded, and what action was taken.</p>
              </article>
              <article>
                <BellRing size={20} />
                <h3>Admin summaries</h3>
                <p>Send concise email summaries so staff can scan the call without replaying audio first.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="vai-section">
          <div className="vai-section-head">
            <p className="vai-eyebrow">Operating model</p>
            <h2>Designed around the office manager's day, not around a lab demo.</h2>
            <p>The first release stays focused on the highest-conversion dental calls: appointments, reschedules, price questions, summaries, and missed-call recovery.</p>
          </div>

          <div className="vai-card-grid">
            {workflowCards.map((card) => (
              <article className="vai-card" key={card.title}>
                <div className="vai-card-icon">{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="vai-section vai-stack-section">
          <div className="vai-section-head">
            <p className="vai-eyebrow">Suggested MVP stack</p>
            <h2>Telephony, speech, reasoning, voice, storage, and dashboard are separated on purpose.</h2>
            <p>Twilio handles phone numbers and inbound calls. Deepgram transcribes. GPT-4o runs dialog logic. ElevenLabs speaks. Supabase stores records. The dashboard gives admins review and metrics.</p>
          </div>
          <div className="vai-stack-grid">
            {['Twilio', 'Deepgram', 'GPT-4o', 'ElevenLabs', 'Supabase', 'Google Calendar', 'Next.js dashboard', 'Cloudflare edge'].map((item) => (
              <article key={item}>
                <ShieldCheck size={18} />
                <strong>{item}</strong>
              </article>
            ))}
          </div>
        </section>

        {renderPricingSection(false)}

        <section className="vai-section">
          <div className="vai-section-head">
            <p className="vai-eyebrow">Decision pages</p>
            <h2>Useful guides for buyers and developers comparing voice AI agent options.</h2>
            <p>Each guide answers a real implementation, market, or procurement question and brings the visitor back to a focused checkout path.</p>
          </div>
          <div className="vai-guide-grid">
            {[
              ...keywordPages,
              {
                path: '/pricing',
                eyebrow: 'Pricing',
                h1: 'Voice AI Agent pricing',
                intent: 'Choose Starter, Pro, or Enterprise with Pro annual already selected.',
              },
            ].map((page) => (
              <a
                className="vai-guide-card"
                href={page.path}
                key={page.path}
                onClick={(event) => {
                  event.preventDefault()
                  openPage(page.path)
                }}
              >
                <span>{page.eyebrow}</span>
                <strong>{page.h1}</strong>
                <p>{page.intent}</p>
                <ChevronRight size={18} />
              </a>
            ))}
          </div>
        </section>
      </main>
    )
  }

  const renderKeywordPage = (page: KeywordPage) => (
    <main className="vai-main">
      <article className="vai-article">
        <a
          className="vai-back-link"
          href="/"
          onClick={(event) => {
            event.preventDefault()
            navigate('/')
          }}
        >
          <ArrowRight size={16} />
          Back to Voice AI Agent
        </a>
        <p className="vai-eyebrow">{page.eyebrow}</p>
        <h1>{page.h1}</h1>
        <p className="vai-lede">{page.lede}</p>
        <div className="vai-article-intent">
          <strong>Best for</strong>
          <span>{page.intent}</span>
        </div>

        {page.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.bullets ? (
              <ul>
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        <section>
          <h2>Common questions</h2>
          <div className="vai-faq-list">
            {page.faqs.map((faq) => (
              <article key={faq.question}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <aside className="vai-article-cta">
          <div>
            <p className="vai-eyebrow">Recommended next step</p>
            <h2>Run the call-flow simulator, then keep Pro annual selected if the workflow matches your clinic.</h2>
            <p>Checkout stays in a centered Creem popup, with annual billing selected by default.</p>
          </div>
          <div className="vai-article-cta-actions">
            <button type="button" className="vai-btn vai-btn-primary" onClick={() => chooseProAnnual(`article-${page.path}`)}>
              <Play size={18} />
              {page.ctaLabel}
            </button>
            <button type="button" className="vai-btn vai-btn-ghost" onClick={() => navigate('/#simulator')}>
              <Zap size={18} />
              Open simulator
            </button>
          </div>
        </aside>
      </article>
    </main>
  )

  const renderPricingPage = () => (
    <main className="vai-main">
      <section className="vai-pricing-page-hero">
        <p className="vai-eyebrow">Pricing</p>
        <h1>Voice AI Agent pricing starts with Pro annual selected.</h1>
        <p className="vai-lede">
          Starter validates one clinic. Pro is the default for real call recovery with included minutes. Enterprise supports multi-location and custom compliance workflows.
        </p>
      </section>
      {renderPricingSection(true)}
    </main>
  )

  const renderLegalPage = (title: string, intro: string, sections: LegalSection[]) => (
    <main className="vai-main">
      <article className="vai-article">
        <p className="vai-eyebrow">Legal</p>
        <h1>{title}</h1>
        <p className="vai-lede">{intro}</p>
        {sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
      </article>
    </main>
  )

  const renderCheckoutModal = () => {
    if (!checkoutModal) return null

    const selectedPlan = plans.find((item) => item.id === checkoutModal.planId) ?? plans[1]
    const monthly = selectedPlan.monthlyUsd === null ? null : checkoutModal.billing === 'annual' ? selectedPlan.monthlyUsd * 0.5 : selectedPlan.monthlyUsd

    return (
      <div className="vai-checkout-backdrop" role="dialog" aria-modal="true" aria-label="Secure checkout status">
        <section className="vai-checkout-modal">
          <button
            type="button"
            className="vai-checkout-close"
            aria-label="Close checkout status"
            onClick={() => {
              setCheckoutModal(null)
              setCheckoutLoadingKey(null)
              trackEvent('checkout_overlay_closed', { planId: checkoutModal.planId, billing: checkoutModal.billing })
            }}
          >
            <X size={18} />
          </button>
          {checkoutModal.status === 'loading' ? (
            <div className="vai-checkout-loading">
              <span aria-hidden />
              <div>
                <h2>Preparing Creem checkout...</h2>
                <p>Pro annual stays selected while the secure payment window opens.</p>
              </div>
            </div>
          ) : (
            <div className="vai-checkout-copy">
              <p className="vai-eyebrow">Secure checkout</p>
              <h2>{checkoutModal.status === 'popup' ? 'Your Creem payment window is open.' : 'Popup blocked or checkout needs a retry.'}</h2>
              <p>
                {selectedPlan.name} {checkoutModal.billing} is set
                {monthly !== null ? ` to ${formatMoney(monthly)}/mo` : ''}
                {checkoutModal.billing === 'annual' ? ' with 50% annual savings.' : '.'}
              </p>
              <div className="vai-checkout-actions">
                {checkoutModal.checkoutUrl ? (
                  <button
                    type="button"
                    className="vai-btn vai-btn-primary"
                    onClick={() => {
                      trackEvent('checkout_focus_click', { planId: checkoutModal.planId, billing: checkoutModal.billing })
                      sendPopupToCheckout(openCenteredCheckoutWindow(), checkoutModal.checkoutUrl || '')
                    }}
                  >
                    <ExternalLink size={18} />
                    Focus checkout
                  </button>
                ) : (
                  <button
                    type="button"
                    className="vai-btn vai-btn-primary"
                    onClick={() => void startHostedCheckout(checkoutModal.planId, checkoutModal.billing, checkoutModal.loadingKey)}
                  >
                    <ExternalLink size={18} />
                    Retry checkout
                  </button>
                )}
                <button type="button" className="vai-btn vai-btn-ghost" onClick={() => setCheckoutModal(null)}>
                  Keep reviewing
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    )
  }

  const renderNotFound = () => (
    <main className="vai-main">
      <section className="vai-center-panel">
        <p className="vai-eyebrow">404</p>
        <h1>Page not found</h1>
        <p className="vai-muted">That route is not available.</p>
        <button type="button" className="vai-btn vai-btn-primary" onClick={() => navigate('/')}>
          Return home
        </button>
      </section>
    </main>
  )

  let body: React.ReactNode
  if (routeView === 'home' && normalizedPath === '/') {
    body = renderHome()
  } else if (routeView === 'keyword' && keywordPage) {
    body = renderKeywordPage(keywordPage)
  } else if (routeView === 'pricing') {
    body = renderPricingPage()
  } else if (routeView === 'privacy') {
    body = renderLegalPage('Privacy Policy', 'This policy covers how Voice AI Agent handles analytics, checkout, support, and related public-site interactions.', legalPrivacySections)
  } else if (routeView === 'terms') {
    body = renderLegalPage('Terms of Service', 'These terms describe the limits and responsibilities of the Voice AI Agent site, hosted checkout, and AI receptionist workflows.', legalTermsSections)
  } else if (routeView === 'checkout-done') {
    body = <CheckoutDoneBridge publicAppOrigin={publicAppOrigin} />
  } else {
    body = renderNotFound()
  }

  return (
    <div className="vai-shell">
      <div className="vai-page-texture" aria-hidden />
      {renderHeader()}
      {body}
      {renderCheckoutModal()}
      <footer className="vai-footer">
        <div className="vai-footer-inner">
          <span>Voice AI Agent</span>
          <a
            href="/privacy"
            onClick={(event) => {
              event.preventDefault()
              navigate('/privacy')
            }}
          >
            Privacy
          </a>
          <a
            href="/terms"
            onClick={(event) => {
              event.preventDefault()
              navigate('/terms')
            }}
          >
            Terms
          </a>
          <a href="/sitemap.xml">Sitemap</a>
          <a href="mailto:support@aigeamy.com">support@aigeamy.com</a>
          <small>
            <Globe2 size={15} />
            Markets: United States, India, GCC
          </small>
        </div>
      </footer>
    </div>
  )
}
