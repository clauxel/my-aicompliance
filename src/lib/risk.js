export const HIGH_RISK_CATEGORIES = [
  {
    id: 'biometrics',
    label: 'Biometrics or emotion recognition',
    article: 'Annex III, point 1',
    keywords: ['biometric', 'face', 'emotion', 'identity', 'recognition'],
    evidence: 'Biometric identification, categorisation, or emotion recognition can fall into high-risk AI use.',
  },
  {
    id: 'critical-infrastructure',
    label: 'Critical infrastructure',
    article: 'Annex III, point 2',
    keywords: ['critical', 'infrastructure', 'energy', 'transport', 'water', 'grid'],
    evidence: 'Systems used as safety components in critical infrastructure require elevated controls.',
  },
  {
    id: 'education',
    label: 'Education or vocational training',
    article: 'Annex III, point 3',
    keywords: ['education', 'student', 'exam', 'training', 'admission', 'grading'],
    evidence: 'Admission, evaluation, grading, and learning-path decisions are high-risk signals.',
  },
  {
    id: 'employment',
    label: 'Employment and worker management',
    article: 'Annex III, point 4',
    keywords: ['hiring', 'employment', 'recruiting', 'candidate', 'worker', 'performance'],
    evidence: 'Recruiting, selection, promotion, performance, and termination support are high-risk signals.',
  },
  {
    id: 'essential-services',
    label: 'Essential private or public services',
    article: 'Annex III, point 5',
    keywords: ['credit', 'loan', 'insurance', 'benefit', 'eligibility', 'welfare', 'healthcare'],
    evidence: 'Eligibility, access, pricing, or prioritisation for essential services can be high risk.',
  },
  {
    id: 'law-enforcement',
    label: 'Law enforcement',
    article: 'Annex III, point 6',
    keywords: ['police', 'law enforcement', 'crime', 'fraud investigation', 'evidence'],
    evidence: 'Law-enforcement AI use is a high-risk category with strict governance needs.',
  },
  {
    id: 'migration',
    label: 'Migration, asylum, or border control',
    article: 'Annex III, point 7',
    keywords: ['migration', 'asylum', 'border', 'visa', 'immigration'],
    evidence: 'Migration, asylum, border, and visa decisions are explicitly sensitive under Annex III.',
  },
  {
    id: 'justice-democracy',
    label: 'Administration of justice or democratic processes',
    article: 'Annex III, point 8',
    keywords: ['justice', 'court', 'judge', 'legal decision', 'vote', 'election'],
    evidence: 'Judicial assistance and democratic-process AI use need high-risk review.',
  },
]

const MEDIUM_RISK_SIGNALS = [
  'personal data',
  'sensitive data',
  'customer support',
  'recommendation',
  'ranking',
  'content moderation',
  'claims',
  'risk score',
  'workflow automation',
]

export function normalizeSystem(input = {}) {
  return {
    name: String(input.name || '').trim() || 'Untitled AI system',
    region: String(input.region || '').trim() || 'EU market',
    purpose: String(input.purpose || '').trim(),
    sector: String(input.sector || '').trim(),
    decisions: String(input.decisions || '').trim(),
    data: String(input.data || '').trim(),
    humanOversight: Boolean(input.humanOversight),
    logging: Boolean(input.logging),
    vendorDocs: Boolean(input.vendorDocs),
    impactAssessment: Boolean(input.impactAssessment),
    reminderEmail: String(input.reminderEmail || '').trim(),
  }
}

export function classifyAiSystem(input = {}) {
  const system = normalizeSystem(input)
  const text = `${system.name} ${system.region} ${system.purpose} ${system.sector} ${system.decisions} ${system.data}`.toLowerCase()

  const matchedHighRisk = HIGH_RISK_CATEGORIES.filter((category) =>
    category.keywords.some((keyword) => text.includes(keyword)),
  )
  const matchedMediumRisk = MEDIUM_RISK_SIGNALS.filter((signal) => text.includes(signal))

  const gaps = []
  if (!system.humanOversight) gaps.push('Document human oversight and escalation paths.')
  if (!system.logging) gaps.push('Define logging, monitoring, and incident evidence retention.')
  if (!system.vendorDocs) gaps.push('Collect model, data, provider, and technical documentation from vendors.')
  if (!system.impactAssessment) gaps.push('Prepare a DPIA or fundamental-rights impact assessment workstream.')

  const score =
    matchedHighRisk.length * 32 +
    matchedMediumRisk.length * 8 +
    (system.humanOversight ? 0 : 10) +
    (system.logging ? 0 : 8) +
    (system.vendorDocs ? 0 : 8) +
    (system.impactAssessment ? 0 : 9)

  const level = matchedHighRisk.length ? 'High' : score >= 28 ? 'Medium' : 'Low'
  const readiness = Math.max(18, Math.min(96, 100 - gaps.length * 14 - matchedHighRisk.length * 7 - matchedMediumRisk.length * 2))

  return {
    system,
    level,
    score,
    readiness,
    matchedHighRisk,
    matchedMediumRisk,
    gaps,
    recommendedPlan: level === 'High' || gaps.length >= 3 ? 'pro' : 'basic',
    summary:
      level === 'High'
        ? 'This system shows Annex III high-risk signals and should move into a documented compliance workstream.'
        : level === 'Medium'
          ? 'This system has material compliance signals. A structured inventory, documentation, and monitoring review should come next.'
          : 'This system appears lower risk from the supplied facts, but inventory, transparency, and monitoring still matter.',
  }
}

export function daysUntilHighRiskDeadline(now = new Date()) {
  const deadline = Date.UTC(2026, 7, 2, 0, 0, 0)
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0)
  return Math.max(0, Math.ceil((deadline - today) / 86400000))
}

export function buildReportLines(result) {
  const { system, level, readiness, matchedHighRisk, matchedMediumRisk, gaps, summary } = result
  return [
    'AI Compliance Readiness Report',
    '',
    `System: ${system.name}`,
    `Market: ${system.region}`,
    `Risk classification: ${level}`,
    `Readiness estimate: ${readiness}%`,
    '',
    'Executive summary',
    summary,
    '',
    'High-risk category signals',
    ...(matchedHighRisk.length
      ? matchedHighRisk.map((category) => `${category.label} - ${category.article}`)
      : ['No Annex III high-risk category was detected from the supplied facts.']),
    '',
    'Additional signals',
    ...(matchedMediumRisk.length ? matchedMediumRisk : ['No additional medium-risk signal was detected from the supplied facts.']),
    '',
    'Compliance gaps',
    ...(gaps.length ? gaps : ['No major starter gap was detected. Continue documenting evidence and monitoring obligations.']),
    '',
    'DPIA / impact assessment frame',
    '1. Describe the AI system, intended purpose, users, and affected people.',
    '2. Map data sources, model providers, training data assumptions, and human oversight.',
    '3. Assess fundamental-rights, safety, discrimination, security, and explainability risks.',
    '4. Define mitigations, responsible owners, evidence, monitoring, and review cadence.',
    '5. Re-check material changes before launch and before the 2 August 2026 high-risk deadline.',
    '',
    'This report is a workflow aid, not legal advice.',
  ]
}
