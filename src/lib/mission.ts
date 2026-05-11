export type PlanId = 'starter' | 'pro' | 'enterprise'

export type Option<T extends string = string> = {
  id: T
  label: string
  summary: string
}

export type VoiceAgentSelection = {
  intent: 'book' | 'reschedule' | 'pricing' | 'missed-call'
  caller: 'new-patient' | 'returning' | 'after-hours' | 'insurance'
  calendar: 'same-week' | 'hygiene' | 'consult' | 'emergency-route'
  followup: 'email' | 'sms' | 'both'
}

export type VoiceAgentResult = {
  fitScore: number
  fitLabel: string
  recommendedPlanId: PlanId
  headline: string
  callOutcome: string
  adminSummary: string
  modules: Array<{ label: string; detail: string }>
  transcriptLines: string[]
  checklist: string[]
  guardrails: string[]
}

export const intentOptions: Option<VoiceAgentSelection['intent']>[] = [
  { id: 'book', label: 'Book appointment', summary: 'New or returning patient wants an available slot.' },
  { id: 'reschedule', label: 'Reschedule', summary: 'Caller needs to move an existing appointment.' },
  { id: 'pricing', label: 'Ask price', summary: 'Caller asks about whitening, cleaning, or consult cost.' },
  { id: 'missed-call', label: 'Missed call', summary: 'Office missed the call and needs SMS recovery.' },
]

export const callerOptions: Option<VoiceAgentSelection['caller']>[] = [
  { id: 'new-patient', label: 'New patient', summary: 'Collect intent and offer a booking path.' },
  { id: 'returning', label: 'Returning', summary: 'Confirm known context and avoid duplicate records.' },
  { id: 'after-hours', label: 'After hours', summary: 'Answer when staff is unavailable.' },
  { id: 'insurance', label: 'Insurance question', summary: 'Stay inside approved office policy.' },
]

export const calendarOptions: Option<VoiceAgentSelection['calendar']>[] = [
  { id: 'same-week', label: 'This week', summary: 'Find the next clean slot in Google Calendar.' },
  { id: 'hygiene', label: 'Hygiene', summary: 'Routine cleaning and exam appointment.' },
  { id: 'consult', label: 'Consult', summary: 'Cosmetic or implant consult request.' },
  { id: 'emergency-route', label: 'Urgent route', summary: 'Flag urgent language for staff review.' },
]

export const followupOptions: Option<VoiceAgentSelection['followup']>[] = [
  { id: 'email', label: 'Email summary', summary: 'Send a concise admin note after the call.' },
  { id: 'sms', label: 'SMS link', summary: 'Send booking link for missed or incomplete calls.' },
  { id: 'both', label: 'Email + SMS', summary: 'Notify staff and recover the caller.' },
]

export const defaultVoiceAgentSelection: VoiceAgentSelection = {
  intent: 'book',
  caller: 'after-hours',
  calendar: 'same-week',
  followup: 'both',
}

const intentLabels: Record<VoiceAgentSelection['intent'], string> = {
  book: 'appointment booking',
  reschedule: 'appointment reschedule',
  pricing: 'price question',
  'missed-call': 'missed-call recovery',
}

const callerLabels: Record<VoiceAgentSelection['caller'], string> = {
  'new-patient': 'new patient',
  returning: 'returning patient',
  'after-hours': 'after-hours caller',
  insurance: 'insurance-question caller',
}

const slotLabels: Record<VoiceAgentSelection['calendar'], string> = {
  'same-week': 'Thursday 10:30 AM or Friday 2:15 PM',
  hygiene: 'next hygiene opening on Wednesday 9:00 AM',
  consult: 'consult block on Friday 11:00 AM',
  'emergency-route': 'staff-review route before booking',
}

export function analyzeVoiceAgentSelection(selection: VoiceAgentSelection): VoiceAgentResult {
  let score = 64
  const checklist: string[] = []
  const guardrails: string[] = []

  if (selection.intent === 'book') {
    score += 14
    checklist.push('Confirm reason for visit, preferred time, and callback number before writing the appointment.')
  } else if (selection.intent === 'reschedule') {
    score += 10
    checklist.push('Avoid duplicate bookings by confirming the existing appointment before offering a new time.')
  } else if (selection.intent === 'pricing') {
    score += 8
    checklist.push('Answer only with approved price ranges and invite booking for exact treatment planning.')
    guardrails.push('Pricing scripts should be reviewed by the clinic before launch.')
  } else {
    score += 12
    checklist.push('Send an SMS booking link and mark the caller for staff review if they do not complete the form.')
  }

  if (selection.caller === 'after-hours') {
    score += 12
    checklist.push('After-hours answering has the clearest missed-revenue recovery story.')
  } else if (selection.caller === 'new-patient') {
    score += 10
    checklist.push('New-patient calls should capture referral source and visit type for the admin summary.')
  } else if (selection.caller === 'insurance') {
    score += 6
    guardrails.push('Insurance answers must stay inside office policy and avoid eligibility promises.')
  } else {
    score += 8
    checklist.push('Returning-patient calls should be summarized without exposing unnecessary private details.')
  }

  if (selection.calendar === 'same-week' || selection.calendar === 'hygiene') {
    score += 11
    checklist.push('Google Calendar availability is strong enough for a clean booking flow.')
  } else if (selection.calendar === 'consult') {
    score += 9
    checklist.push('Consult requests should store the service interest and route preparation notes to the front desk.')
  } else {
    score += 5
    guardrails.push('Urgent language should route to staff or emergency instructions approved by the clinic.')
  }

  if (selection.followup === 'both') {
    score += 10
    checklist.push('Email summary plus SMS link gives both staff visibility and caller recovery.')
  } else if (selection.followup === 'sms') {
    score += 7
    checklist.push('SMS follow-up works best when opt-out and consent language are configured correctly.')
  } else {
    score += 5
    checklist.push('Email summaries keep staff informed even when the caller does not complete a booking.')
  }

  score = Math.max(50, Math.min(96, score))

  const recommendedPlanId: PlanId = score >= 82 ? 'pro' : selection.intent === 'missed-call' ? 'pro' : 'starter'
  const fitLabel = score >= 88 ? 'High conversion fit' : score >= 74 ? 'Strong clinic fit' : 'Needs script review'
  const slot = slotLabels[selection.calendar]
  const callOutcome =
    selection.calendar === 'emergency-route'
      ? 'Flagged for staff review with approved urgent-call handling.'
      : selection.intent === 'missed-call'
        ? 'SMS booking link sent and admin summary queued.'
        : `Appointment path prepared for ${slot}.`

  const modules = [
    { label: 'Intent', detail: intentLabels[selection.intent] },
    { label: 'Caller', detail: callerLabels[selection.caller] },
    { label: 'Calendar action', detail: selection.calendar === 'emergency-route' ? 'Human review before booking' : `Offer ${slot}` },
    { label: 'Follow-up', detail: selection.followup === 'both' ? 'Email summary and SMS link' : selection.followup === 'sms' ? 'SMS recovery link' : 'Admin email summary' },
  ]

  const transcriptLines = [
    `Caller: I need help with ${intentLabels[selection.intent]}.`,
    `Voice AI Agent: I can help. Are you looking for ${slot}?`,
    selection.intent === 'pricing'
      ? 'Voice AI Agent: I can share the office-approved range and book a consult for an exact quote.'
      : 'Voice AI Agent: I will confirm the best time and send the office a clean summary.',
    selection.followup === 'email'
      ? 'System: Email summary queued for the clinic administrator.'
      : selection.followup === 'sms'
        ? 'System: SMS booking link queued for the caller.'
        : 'System: Email summary and SMS booking link queued.',
  ]

  return {
    fitScore: score,
    fitLabel,
    recommendedPlanId,
    headline: score >= 82 ? 'This call is ready for the Pro receptionist workflow.' : 'This call needs one more script rule before launch.',
    callOutcome,
    adminSummary: `${callerLabels[selection.caller]} asked for ${intentLabels[selection.intent]}. Next action: ${callOutcome}`,
    modules,
    transcriptLines,
    checklist,
    guardrails,
  }
}
