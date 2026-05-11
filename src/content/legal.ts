export type LegalSection = {
  title: string
  paragraphs: string[]
}

export const legalPrivacySections: LegalSection[] = [
  {
    title: 'Scope',
    paragraphs: [
      'This Privacy Policy explains how Voice AI Agent handles information on this public website, pricing flow, hosted checkout, analytics endpoints, and related support interactions.',
      'The public website is not a clinical system of record, legal case-management system, emergency communications channel, or regulated-data intake portal. Do not submit protected health information, legal matter details, payment-card numbers, credentials, private keys, patient charts, or sensitive records through public forms or support email unless a separate written agreement expressly authorizes it.',
    ],
  },
  {
    title: 'Information we collect',
    paragraphs: [
      'We collect information reasonably needed to operate the site, measure funnel performance, prevent abuse, process checkout, and respond to support requests.',
      'This may include page views, referral and UTM data, browser and device information, approximate location derived from network data, checkout metadata, selected plan, billing cycle, support emails, and information you intentionally provide.',
      'When a customer later uses production call-handling services, call recordings, transcripts, summaries, appointment data, and caller contact details may be processed under the applicable service order, data-processing terms, business associate agreement, or other signed agreement when required.',
    ],
  },
  {
    title: 'How we use information',
    paragraphs: [
      'We use site analytics to understand which pages, plan choices, and checkout actions help visitors evaluate the service and complete purchase decisions.',
      'We use checkout metadata to create payment sessions, confirm purchases, return users to the homepage, provide onboarding, prevent fraud, handle disputes, support accounting, and comply with legal obligations.',
      'We use support communications to respond to requests, investigate problems, verify account status, and maintain records of commercial or legal notices.',
    ],
  },
  {
    title: 'Service providers',
    paragraphs: [
      'Cloudflare provides hosting, routing, security, DNS, analytics infrastructure, and edge execution. Creem provides hosted checkout and payment processing. Other providers may support telephony, speech, messaging, email, calendar, storage, and model workflows when production service is configured.',
      'Payment details are handled by the payment provider. We do not ask users to send card numbers, passwords, API keys, patient charts, or confidential legal records by email or through this public website.',
      'Third-party providers process information under their own terms and privacy practices. Do not proceed with checkout or external integrations unless you accept the applicable third-party terms.',
    ],
  },
  {
    title: 'Security and retention',
    paragraphs: [
      'We use reasonable administrative, technical, and organizational safeguards appropriate for a SaaS marketing, analytics, checkout, and support workflow.',
      'No internet service can be guaranteed perfectly secure. You are responsible for avoiding the submission of secrets, regulated data, medical records, legal files, or confidential third-party information through channels not expressly approved for that purpose.',
      'We retain information only as long as reasonably needed for the purposes described here, including service delivery, onboarding, support, tax, accounting, fraud prevention, security, dispute handling, legal compliance, and evidence preservation.',
    ],
  },
  {
    title: 'Your choices and rights',
    paragraphs: [
      'Depending on your location, you may have rights to request access, correction, deletion, portability, restriction, or objection regarding personal information we control.',
      'California, US state privacy laws, GDPR-style laws, and other frameworks may provide additional rights when their thresholds and conditions apply. We will not discriminate against users for exercising applicable rights.',
      'To make a privacy, deletion, or support request, email support@aigeamy.com. We may need to verify the request before acting on it, and some information may be retained when required or permitted for legal, security, fraud-prevention, accounting, or dispute reasons.',
    ],
  },
  {
    title: 'Children, changes, and contact',
    paragraphs: [
      'Voice AI Agent is intended for business users and is not directed to children under 13.',
      'We may update this policy when the service, providers, laws, or operations change. The version posted on this page controls from the time it is published.',
      'Questions about privacy, support, or data handling should be sent to support@aigeamy.com.',
    ],
  },
]

export const legalTermsSections: LegalSection[] = [
  {
    title: 'Acceptance',
    paragraphs: [
      'By accessing Voice AI Agent, using the site, opening checkout, purchasing a plan, requesting onboarding, or continuing to use the service, you agree to these Terms.',
      'If you use the service for an organization, clinic, firm, school, hotel, retailer, or other entity, you represent that you have authority to bind that entity and that the entity accepts these Terms.',
      'If you do not agree, do not use the site, open checkout, submit information, or purchase a plan.',
    ],
  },
  {
    title: 'Service scope',
    paragraphs: [
      'Voice AI Agent provides a website, pricing flow, hosted checkout, analytics, and related onboarding for AI receptionist workflows. Production service may include phone answering, intent detection, speech-to-text, AI-assisted dialog, text-to-speech, Google Calendar appointment creation, call summaries, missed-call SMS links, recordings, transcripts, and dashboard reporting.',
      'The service is not an emergency line, medical provider, legal service, law firm, insurance broker, billing advisor, clinical decision tool, public-safety system, or substitute for qualified human staff.',
      'Any production configuration, regulated workflow, data-processing requirement, business associate obligation, service level, custom integration, or compliance commitment must be stated in a separate signed agreement. Marketing pages, demos, estimates, and automated output do not create those obligations.',
    ],
  },
  {
    title: 'No professional advice',
    paragraphs: [
      'Voice AI Agent does not provide medical, dental, legal, tax, accounting, security, compliance, insurance, emergency, procurement, employment, fiduciary, or other professional advice.',
      'Scripts, call responses, summaries, appointment notes, price guidance, implementation suggestions, and AI-generated output are informational workflow aids only and must be reviewed by qualified humans before reliance.',
      'You are solely responsible for clinical review, legal review, compliance decisions, patient communication, caller consent, appointment rules, emergency handling, fee disclosures, and all outcomes from your use of the service.',
    ],
  },
  {
    title: 'Customer responsibilities',
    paragraphs: [
      'You are responsible for your scripts, prompts, business rules, calendar availability, phone numbers, caller notices, consent flows, escalation rules, staff review, data permissions, and compliance obligations.',
      'You must not use the service to process information you are not authorized to process, make misleading claims, give prohibited advice, impersonate others, hide AI use where disclosure is required, violate telemarketing or messaging laws, bypass emergency processes, or replace legally required human judgment.',
      'For healthcare, dental, legal, financial, education, employment, or other regulated contexts, you must obtain appropriate legal and compliance review before enabling the service and must use human oversight for sensitive or uncertain interactions.',
    ],
  },
  {
    title: 'Telephony, messaging, and recording compliance',
    paragraphs: [
      'You are solely responsible for complying with all call recording, caller notice, consent, TCPA, DNC, CAN-SPAM, CTIA, messaging, privacy, consumer protection, healthcare, legal advertising, and professional rules that apply to your location, callers, and use case.',
      'Do not send SMS, make outbound calls, record calls, or store transcripts unless you have the required consent and legal basis. You must honor opt-outs and avoid prohibited or abusive communications.',
      'Voice AI Agent may refuse, suspend, throttle, or terminate workflows that appear abusive, unsafe, unlawful, high-risk, or inconsistent with these Terms.',
    ],
  },
  {
    title: 'AI output and service limitations',
    paragraphs: [
      'AI-assisted output, speech recognition, call classification, summaries, appointment suggestions, and generated responses may be incomplete, inaccurate, delayed, biased, unsafe, outdated, misunderstood, or wrong.',
      'Calls may fail because of network conditions, provider outages, caller audio quality, latency, API limits, calendar conflicts, model errors, misconfiguration, unsupported languages, user actions, third-party provider decisions, or force majeure events.',
      'You must independently review outputs, maintain backup processes, supervise sensitive workflows, and ensure that callers can reach a qualified human when needed.',
    ],
  },
  {
    title: 'Payments, renewals, and refunds',
    paragraphs: [
      'Payments are processed by Creem in a hosted checkout window. Successful checkouts return the user to the homepage.',
      'Displayed annual pricing reflects a 50% discount versus the monthly run-rate for the same plan. Prices, plan features, included minutes, per-minute rates, integrations, taxes, and availability may change before purchase.',
      'Starter is listed at 99 USD per month plus 0.10 USD per minute. Pro is listed at 249 USD per month plus 0.07 USD per minute and includes 1,000 minutes unless a checkout page or signed agreement states otherwise. Enterprise is custom.',
      'Unless a separate written policy or applicable law requires otherwise, purchases are final to the maximum extent permitted by law. Chargebacks, payment abuse, or attempted circumvention may result in suspension, cancellation, refusal of service, collection efforts, or preservation of evidence.',
    ],
  },
  {
    title: 'Prohibited use',
    paragraphs: [
      'You may not use the service to violate law, infringe rights, breach confidentiality duties, evade sanctions, mislead callers, deliver emergency instructions, make regulated professional decisions without required supervision, distribute malware, spam, harass, discriminate unlawfully, or process data without authority.',
      'You may not reverse engineer, overload, interfere with, resell, scrape where prohibited, frame, copy, or exploit the service except as expressly permitted in writing.',
      'You may not upload credentials, API keys, payment-card numbers, patient charts, legal case files, export-controlled material, or highly sensitive information unless a separate signed agreement and approved secure channel permit it.',
    ],
  },
  {
    title: 'Third-party services',
    paragraphs: [
      'Cloudflare, Creem, Twilio, Deepgram, OpenAI, ElevenLabs, Supabase, Google Calendar, email providers, SMS providers, browser vendors, registrars, and other third parties may be involved in hosting, checkout, telephony, speech, messaging, storage, calendar, analytics, or model workflows.',
      'We are not responsible for third-party services, outages, rate limits, account suspensions, provider policy changes, data loss, inaccurate output, payment-provider decisions, taxes, telecom fees, messaging deliverability, or third-party terms.',
      'Your use of third-party services is governed by the applicable third-party terms, privacy policies, account rules, market rules, and fees.',
    ],
  },
  {
    title: 'No warranties',
    paragraphs: [
      'The service is provided as is and as available. To the maximum extent permitted by law, we disclaim all warranties, whether express, implied, statutory, or otherwise.',
      'We do not warrant uninterrupted operation, error-free calls, perfect transcription, accurate intent detection, successful bookings, compliant scripts, emergency suitability, merchantability, fitness for a particular purpose, non-infringement, data availability, conversion results, revenue increase, or business outcomes.',
      'You use the service at your own risk and remain responsible for backups, testing, staff coverage, compliance review, security, provider bills, caller relationships, and operational outcomes.',
    ],
  },
  {
    title: 'Limitation of liability',
    paragraphs: [
      'To the maximum extent permitted by law, Voice AI Agent and its operators, affiliates, suppliers, and service providers will not be liable for missed calls, failed bookings, lost profits, lost revenue, lost patients, lost clients, lost opportunities, lost data, reputational harm, clinical issues, legal issues, telecom charges, provider outages, indirect damages, incidental damages, special damages, consequential damages, exemplary damages, or punitive damages.',
      'To the maximum extent permitted by law, total liability for any claim relating to the service is limited to the greater of 100 USD or the amount you paid for Voice AI Agent in the three months before the event giving rise to the claim.',
      'These limits apply whether the claim is based on contract, tort, negligence, strict liability, statute, warranty, equity, or any other theory, even if a remedy fails of its essential purpose.',
    ],
  },
  {
    title: 'Indemnity',
    paragraphs: [
      'You agree to defend, indemnify, and hold harmless Voice AI Agent and its operators, affiliates, suppliers, and service providers from claims, damages, liabilities, losses, costs, and fees arising from your use of the service.',
      'This includes claims arising from your callers, scripts, notices, consent practices, data, prompts, calendar rules, regulated workflows, professional obligations, messaging practices, legal violations, infringement, breach of these Terms, or unauthorized use of credentials or systems.',
    ],
  },
  {
    title: 'Disputes',
    paragraphs: [
      'Before filing a claim, you agree to email support@aigeamy.com and give us 30 days to try to resolve the dispute informally.',
      'To the maximum extent permitted by law, disputes must be resolved individually and not as a class, collective, consolidated, private attorney general, or representative action.',
      'To the maximum extent permitted by law, disputes will be resolved by binding arbitration or the courts with proper jurisdiction for the operator, and you waive jury trial where that waiver is enforceable.',
      'If any part of these dispute terms is unenforceable, the remaining provisions continue to apply to the maximum extent permitted by law.',
    ],
  },
  {
    title: 'Changes, suspension, and contact',
    paragraphs: [
      'We may update these Terms, change or discontinue features, refuse transactions, suspend access, preserve evidence, or terminate service when reasonably necessary for security, legal, operational, abuse-prevention, regulatory, provider-policy, or business reasons.',
      'If a provision is unenforceable, the rest of these Terms remains effective. A failure to enforce a provision is not a waiver.',
      'Questions, notices, support requests, and dispute notices should be sent to support@aigeamy.com.',
    ],
  },
]
