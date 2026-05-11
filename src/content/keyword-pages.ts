export type KeywordSection = {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

export type KeywordFaq = {
  question: string
  answer: string
}

export type KeywordPage = {
  path: string
  eyebrow: string
  title: string
  description: string
  h1: string
  lede: string
  intent: string
  ctaLabel: string
  sections: KeywordSection[]
  faqs: KeywordFaq[]
}

export const keywordPages: KeywordPage[] = [
  {
    path: '/voice-ai-agent-github',
    eyebrow: 'GitHub evaluation',
    title: 'Voice AI Agent GitHub Evaluation Guide',
    description:
      'A practical guide for reviewing Voice AI Agent GitHub projects, open-source demos, telephony risk, calendar integration, and production readiness.',
    h1: 'Use Voice AI Agent GitHub projects for learning, then verify production gaps',
    lede:
      'GitHub repositories can show how voice pipelines fit together, but a clinic-grade receptionist needs more than a demo. Telephony, latency, call summaries, appointment rules, consent, failover, and support all matter once real patients call.',
    intent: 'For founders, developers, and clinic operators comparing open-source voice agent code with a hosted production workflow.',
    ctaLabel: 'Compare hosted Pro annual',
    sections: [
      {
        heading: 'What to inspect before cloning',
        paragraphs: [
          'Start by mapping the repository to a real inbound-call path. A useful project should show how calls enter the system, how speech is transcribed, how intent is classified, how the response is spoken, and where operational records are stored.',
          'The hard part is rarely the first greeting. Production risk appears in interruptions, noisy calls, appointment conflicts, caller consent, emergency routing, and billing for minutes.',
        ],
        bullets: [
          'Twilio or equivalent phone-number handling.',
          'Streaming STT, low-latency reasoning, and TTS handoff.',
          'Calendar write rules and conflict handling.',
          'Transcripts, recordings, summaries, and admin review.',
          'Failure states for unclear speech, urgent calls, and human handoff.',
        ],
      },
      {
        heading: 'Where a hosted platform is safer',
        paragraphs: [
          'A hosted Voice AI Agent flow is usually safer when the buyer wants a working phone number, admin visibility, billing, support, and repeatable onboarding rather than an engineering project.',
          'For a dental clinic, the value is not the model alone. The value is the full call outcome: appointment captured, summary sent, missed-call SMS delivered, and monthly volume visible to the office manager.',
        ],
      },
      {
        heading: 'Recommended path',
        paragraphs: [
          'Use GitHub to understand architecture and integration tradeoffs. Use the hosted platform when the business outcome is missed-call recovery, appointment conversion, and reliable after-hours answering.',
          'Professional annual is the default path when a clinic expects meaningful call volume and wants included minutes with lower usage cost.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is a Voice AI Agent GitHub repo enough for a clinic?',
        answer:
          'Usually no. It can be enough for a prototype, but a clinic needs telephony setup, calendar rules, summaries, SMS follow-up, monitoring, and operational support.',
      },
      {
        question: 'Can developers still use their own stack?',
        answer:
          'Yes. Developers can use open-source components, while the hosted platform provides a faster production path for clinics that do not want to maintain the voice stack.',
      },
      {
        question: 'What should be tested first?',
        answer:
          'Test interruptions, rescheduling, price questions, unclear caller speech, after-hours behavior, and calendar conflicts before trusting any repo in production.',
      },
    ],
  },
  {
    path: '/voice-ai-agent-platform',
    eyebrow: 'Platform choice',
    title: 'Voice AI Agent Platform for Clinic Calls',
    description:
      'Choose a Voice AI Agent platform by call outcomes: phone answering, intent detection, Google Calendar booking, summaries, missed-call SMS, and reporting.',
    h1: 'A Voice AI Agent platform should prove call outcomes, not just demo voices',
    lede:
      'A convincing voice demo is not the same as a reliable receptionist. The platform should show what happens after every call: booked appointment, reschedule request, price question, email summary, SMS link, or human-review flag.',
    intent: 'For dental clinics and small service businesses comparing hosted voice AI agent platforms before buying.',
    ctaLabel: 'Review platform pricing',
    sections: [
      {
        heading: 'The outcome checklist',
        paragraphs: [
          'The best platform evaluation starts from office operations. Ask what the front desk needs to know when the call ends, what the patient receives, and how the calendar stays clean.',
          'Voice AI Agent focuses the MVP on dental appointment calls because the workflow is repeatable and valuable: answer, classify, respond, book, summarize, and follow up.',
        ],
        bullets: [
          'Appointment booking and rescheduling with Google Calendar.',
          'Price and insurance questions answered within approved scripts.',
          'Email summaries to the clinic administrator.',
          'Missed-call SMS links for patients who did not reach the office.',
          'Recordings, transcripts, and monthly call statistics.',
        ],
      },
      {
        heading: 'Why dental clinics are the first vertical',
        paragraphs: [
          'Dental practices lose real revenue when after-hours or lunch-hour calls go unanswered. The caller often wants an appointment, a reschedule, or a price range, so the AI receptionist can resolve enough of the intent to move the patient forward.',
          'A focused vertical also makes the scripts, escalation rules, and reporting easier to trust.',
        ],
      },
      {
        heading: 'What the middle tier covers',
        paragraphs: [
          'Pro includes 1,000 minutes and a lower per-minute rate, which fits clinics that want the AI receptionist to handle meaningful daily call volume.',
          'Annual billing stays selected by default because the strongest conversion case is a long-running front-desk capacity improvement, not a one-week experiment.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What makes a voice AI agent platform trustworthy?',
        answer:
          'Clear call outcomes, transparent transcripts, calendar auditability, usage reporting, secure payment, and a support path make the platform easier to trust.',
      },
      {
        question: 'Does the platform replace staff?',
        answer:
          'It is designed to catch routine calls and after-hours intent. Clinics should keep human oversight for emergencies, sensitive issues, and exceptions.',
      },
      {
        question: 'Can the platform support other verticals later?',
        answer:
          'Yes. The roadmap can extend to law firms, education, healthcare, retail, and hotels after the dental workflow is reliable.',
      },
    ],
  },
  {
    path: '/voice-ai-agent-for-developers',
    eyebrow: 'Developer workflow',
    title: 'Voice AI Agent for Developers',
    description:
      'Build and evaluate Voice AI Agent developer workflows with Twilio, Deepgram, GPT-4o, ElevenLabs, Supabase, Google Calendar, and Next.js.',
    h1: 'Voice AI Agent for developers starts with latency, state, and handoff design',
    lede:
      'Developers building voice agents need a clean call loop: receive audio, stream transcription, decide intent, speak naturally, update calendar state, and store the operational record without making the caller wait.',
    intent: 'For developers deciding whether to build a custom voice receptionist or buy a hosted workflow for a first vertical.',
    ctaLabel: 'Use hosted workflow first',
    sections: [
      {
        heading: 'Reference architecture',
        paragraphs: [
          'A practical MVP can use Twilio for phone numbers and inbound calls, Deepgram for speech-to-text, GPT-4o for dialog and business logic, ElevenLabs for text-to-speech, Supabase for storage, and a Next.js or Cloudflare-hosted dashboard.',
          'The call loop should keep state explicit: caller intent, patient status, candidate appointment time, confidence, escalation reason, and post-call tasks.',
        ],
        bullets: [
          'Inbound call webhook and streaming audio session.',
          'Intent classifier for booking, rescheduling, pricing, and handoff.',
          'Google Calendar write with conflict checks.',
          'Email summary and SMS recovery link.',
          'Admin dashboard for recordings, transcripts, and monthly totals.',
        ],
      },
      {
        heading: 'Production issues that appear early',
        paragraphs: [
          'Latency, barge-in handling, unclear speech, no-show appointment rules, and emergency escalation are the issues that separate a useful agent from a clever demo.',
          'Developers should log every decision path and make it easy for a clinic admin to review what happened without reading raw model traces.',
        ],
      },
      {
        heading: 'Buy-versus-build decision',
        paragraphs: [
          'Build when the voice workflow is core IP and the team can maintain telephony, observability, compliance review, and support.',
          'Buy when the buyer wants a reliable front-desk conversion outcome now and does not want to carry the operational burden of a voice stack.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Which stack does the MVP suggest?',
        answer:
          'Twilio, Deepgram, GPT-4o, ElevenLabs, Supabase, Google Calendar, and a modern dashboard are a practical starting point.',
      },
      {
        question: 'What is hardest for developers?',
        answer:
          'Reliable state management during live calls, interruption handling, calendar correctness, and safe escalation are usually harder than the demo script.',
      },
      {
        question: 'Can developers integrate the hosted product later?',
        answer:
          'Yes. A hosted workflow can validate demand while developers decide which parts deserve custom engineering.',
      },
    ],
  },
  {
    path: '/ai-voice-agents-india',
    eyebrow: 'India market',
    title: 'AI Voice Agents India Market Guide',
    description:
      'Plan AI voice agents for India with Hinglish support, healthcare and education use cases, appointment flows, SMS follow-up, and regional rollout considerations.',
    h1: 'AI voice agents in India need language flexibility and operational restraint',
    lede:
      'India is a strong second-market opportunity for AI voice agents because healthcare and education receive high call volume, but the product must handle Hinglish, local expectations, consent, escalation, and price sensitivity.',
    intent: 'For operators preparing an India rollout after proving the English dental receptionist workflow in the United States.',
    ctaLabel: 'Plan India-ready rollout',
    sections: [
      {
        heading: 'What changes from the US market',
        paragraphs: [
          'The underlying workflow remains similar: answer, understand intent, schedule or route, summarize, and follow up. The localization work is where trust is won or lost.',
          'Hinglish handling, local accent robustness, clinic or school scripts, WhatsApp/SMS expectations, and pricing sensitivity should be tested before broad rollout.',
        ],
        bullets: [
          'Hinglish and regional-language roadmap.',
          'Healthcare appointment and education inquiry flows.',
          'Local consent and call-recording notices.',
          'Payment and support model suited to local budgets.',
          'Escalation to staff for sensitive or urgent conversations.',
        ],
      },
      {
        heading: 'Best first use cases',
        paragraphs: [
          'Healthcare and education are strong because callers often need appointment slots, fee ranges, schedule changes, admission details, or status updates.',
          'The AI agent should keep answers inside approved scripts and hand off anything uncertain rather than trying to sound overly confident.',
        ],
      },
      {
        heading: 'Rollout sequence',
        paragraphs: [
          'Prove call handling in a narrow English workflow first, then add Hinglish testing, local templates, and operator review.',
          'A measured rollout preserves trust because voice products are judged by the worst call, not the best demo.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Should India be the first market?',
        answer:
          'The recommended sequence is United States first for mature paid demand, then India for healthcare and education once language handling is validated.',
      },
      {
        question: 'Does India require Hinglish support?',
        answer:
          'For many real deployments, yes. Hinglish and accent robustness should be treated as product requirements rather than optional polish.',
      },
      {
        question: 'Which verticals are strongest in India?',
        answer:
          'Healthcare and education are attractive because call volume and repetitive inquiry patterns are both high.',
      },
    ],
  },
  {
    path: '/voice-ai-agent-n8n',
    eyebrow: 'Automation',
    title: 'Voice AI Agent n8n Workflow Guide',
    description:
      'Connect Voice AI Agent workflows to n8n for post-call automation, CRM updates, calendar workflows, email summaries, SMS recovery, and admin alerts.',
    h1: 'Voice AI Agent and n8n work best after the call is understood',
    lede:
      'n8n is strongest when the voice agent has already produced a structured event: booking request, reschedule, price question, missed call, escalation, or completed appointment entry.',
    intent: 'For teams using n8n to automate post-call operations around a hosted or custom voice AI receptionist.',
    ctaLabel: 'Automate with Pro annual',
    sections: [
      {
        heading: 'Where n8n fits',
        paragraphs: [
          'The live call path should stay low-latency and reliable. n8n is ideal for the workflow after the call: notify staff, update CRM, create tasks, send approved links, and archive summaries.',
          'That separation keeps callers from waiting while still giving operators a powerful automation layer.',
        ],
        bullets: [
          'Send call summaries to email, Slack, or a CRM.',
          'Create follow-up tasks for staff review.',
          'Route urgent or low-confidence calls to the right owner.',
          'Sync appointment metadata after Google Calendar writes.',
          'Trigger missed-call recovery sequences.',
        ],
      },
      {
        heading: 'Structured payload design',
        paragraphs: [
          'A good payload should include caller intent, confidence, appointment status, transcript link, recording link, summary, next action, and escalation reason.',
          'Avoid sending raw private details into every downstream tool. Keep the workflow narrow and purposeful.',
        ],
      },
      {
        heading: 'Human review still matters',
        paragraphs: [
          'Automation should accelerate front-desk operations without hiding uncertainty. Low-confidence calls, emergencies, payment disputes, and sensitive medical or legal issues should be reviewed by a person.',
          'The hosted dashboard keeps recordings, transcripts, and monthly statistics visible so automation does not become a black box.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Can n8n answer the call directly?',
        answer:
          'It can orchestrate workflows, but live voice interaction is better handled by a dedicated telephony and voice pipeline.',
      },
      {
        question: 'What should be sent to n8n?',
        answer:
          'Structured post-call events, not unnecessary sensitive data. Send only what the downstream workflow needs.',
      },
      {
        question: 'Can missed calls trigger automation?',
        answer:
          'Yes. A missed-call event can trigger an SMS booking link, an admin alert, and a follow-up task.',
      },
    ],
  },
  {
    path: '/best-ai-voice-agents',
    eyebrow: 'Buyer criteria',
    title: 'Best AI Voice Agents Buyer Checklist',
    description:
      'Compare the best AI voice agents by real call handling, latency, calendar actions, summaries, missed-call recovery, pricing, and operator controls.',
    h1: 'The best AI voice agents convert calls into clean next steps',
    lede:
      'The best AI voice agents are not simply the most human-sounding. They are the ones that answer quickly, understand intent, complete approved actions, summarize clearly, and know when to hand off.',
    intent: 'For buyers creating a shortlist of AI voice agents for appointments, front-desk support, or after-hours call recovery.',
    ctaLabel: 'Score the Pro plan',
    sections: [
      {
        heading: 'Evaluation criteria',
        paragraphs: [
          'A buyer should test the agent against common and awkward calls, not just a prepared demo. Ask it to book, reschedule, answer price questions, recover a missed call, and escalate an urgent issue.',
          'The score should include operational visibility: recordings, transcripts, summaries, usage, and failure modes.',
        ],
        bullets: [
          'Answer speed and voice latency.',
          'Intent accuracy for the business vertical.',
          'Calendar action correctness and conflict handling.',
          'Post-call summaries that staff can trust.',
          'Pricing that matches expected minute volume.',
          'Clear human handoff and review controls.',
        ],
      },
      {
        heading: 'Why vertical focus matters',
        paragraphs: [
          'A generic voice agent can sound impressive while missing the operational details of a dental office, law firm, hotel, or school.',
          'A focused dental MVP narrows the scripts, appointment rules, and reporting so the agent can become useful faster.',
        ],
      },
      {
        heading: 'Pricing fit',
        paragraphs: [
          'Starter works for light volume and validation. Pro fits clinics that want included minutes and lower usage cost. Enterprise is for custom controls, language expansion, and deeper operations.',
          'The middle plan is selected by default because it is the most credible starting point for a business that expects real call volume.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What separates the best AI voice agents from demos?',
        answer:
          'They complete safe actions, store reviewable records, handle exceptions, and support staff workflows after the call ends.',
      },
      {
        question: 'Should voice quality be the top criterion?',
        answer:
          'Voice quality matters, but outcome reliability, latency, handoff, and calendar correctness are usually more important.',
      },
      {
        question: 'Which plan should a clinic start with?',
        answer:
          'Pro annual is the default when the clinic expects regular call volume and wants included minutes plus lower usage pricing.',
      },
    ],
  },
  {
    path: '/voice-ai-agents-servicenow',
    eyebrow: 'Enterprise ops',
    title: 'Voice AI Agents ServiceNow Workflow Guide',
    description:
      'Use Voice AI agents with ServiceNow-style operations by creating tickets, call summaries, escalation tasks, audit trails, and support workflows.',
    h1: 'Voice AI agents and ServiceNow workflows should meet at the ticket boundary',
    lede:
      'A voice AI agent can gather caller intent and context, while ServiceNow-style operations can manage the follow-up work: ticket creation, ownership, escalation, status, and auditability.',
    intent: 'For enterprise teams thinking about how voice AI agents fit support, ITSM, facilities, or service operations workflows.',
    ctaLabel: 'Map support workflow',
    sections: [
      {
        heading: 'What belongs in the voice layer',
        paragraphs: [
          'The voice layer should answer, clarify, summarize, and classify. It should not pretend to resolve every operational issue during a live call.',
          'Once intent is understood, the agent can create a structured event that ServiceNow or a similar system uses for ticketing and ownership.',
        ],
        bullets: [
          'Caller identity and contact method when appropriate.',
          'Intent, urgency, confidence, and category.',
          'Transcript and recording links.',
          'Summary and recommended next action.',
          'Escalation reason for human review.',
        ],
      },
      {
        heading: 'How this applies to the dental MVP',
        paragraphs: [
          'Dental clinics may not use ServiceNow, but the operational pattern is the same. A call becomes a record with owner, status, and next action.',
          'That pattern makes the product easier to extend later into law firms, hotels, retail, healthcare groups, and larger service organizations.',
        ],
      },
      {
        heading: 'Enterprise requirements',
        paragraphs: [
          'Enterprise buyers usually care about audit trails, role-based review, integrations, retention rules, and human escalation more than a flashy voice demo.',
          'That is why Enterprise pricing is custom: the integration surface and compliance requirements vary by organization.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Does Voice AI Agent include ServiceNow integration today?',
        answer:
          'The dental MVP focuses on calls, calendar booking, summaries, SMS follow-up, and dashboard reporting. ServiceNow-style workflow integration belongs in the enterprise roadmap.',
      },
      {
        question: 'What data should enter a ticket?',
        answer:
          'Only the information needed for follow-up: summary, category, urgency, owner, links, and consent-aware records.',
      },
      {
        question: 'Why not resolve everything during the call?',
        answer:
          'Some issues require human judgment, policy review, regulated handling, or back-office work. The agent should identify and route those cleanly.',
      },
    ],
  },
  {
    path: '/ai-voice-agent-open-source',
    eyebrow: 'Open source',
    title: 'AI Voice Agent Open Source Production Guide',
    description:
      'Evaluate AI voice agent open source options against production needs: telephony, speech, reasoning, TTS, calendar booking, summaries, SMS, and monitoring.',
    h1: 'AI voice agent open source choices are useful when the operating model is clear',
    lede:
      'Open-source voice agent tools can accelerate experiments, but production answering requires a maintained operating model around phone numbers, latency, data handling, logs, escalation, and billing.',
    intent: 'For teams comparing open-source voice agents with a hosted SaaS product before committing engineering time.',
    ctaLabel: 'Choose hosted operating model',
    sections: [
      {
        heading: 'Open source is a component decision',
        paragraphs: [
          'A complete AI voice receptionist includes multiple layers. Open source may cover orchestration or agent logic, while the team still needs telephony, STT, TTS, storage, monitoring, and business workflow glue.',
          'Before choosing a repo, define the operating owner for every layer.',
        ],
        bullets: [
          'Who owns phone-number setup and reliability?',
          'Who monitors latency, failed calls, and dropped sessions?',
          'Who updates scripts and handoff rules?',
          'Who reviews transcripts and sensitive calls?',
          'Who pays and reconciles minute usage across providers?',
        ],
      },
      {
        heading: 'Hosted product advantage',
        paragraphs: [
          'A hosted product packages the business outcome instead of asking the buyer to assemble every provider. For dental clinics, the outcome is simple: fewer missed calls and more completed appointment paths.',
          'The right hosted product should still be transparent about architecture, recordings, summaries, and pricing.',
        ],
      },
      {
        heading: 'Hybrid path',
        paragraphs: [
          'A hybrid approach can work well: validate commercial demand with the hosted platform, then build custom layers later where differentiation is real.',
          'Developers can keep learning from open-source projects while clinic operators get a working call flow sooner.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is open source cheaper?',
        answer:
          'It can reduce software license cost, but it does not remove telephony, speech, model, engineering, monitoring, support, or compliance review costs.',
      },
      {
        question: 'Can open source be production ready?',
        answer:
          'Yes, if the team can own reliability, data handling, integration maintenance, and ongoing review. Many buyers prefer hosted operations first.',
      },
      {
        question: 'What is the fastest commercial test?',
        answer:
          'Run a focused hosted receptionist workflow for one vertical, measure call recovery and bookings, then decide what to customize.',
      },
    ],
  },
]

export function findKeywordPageByPath(pathname: string) {
  const normalized = pathname.replace(/\/+$/, '') || '/'
  return keywordPages.find((page) => page.path === normalized) ?? null
}
