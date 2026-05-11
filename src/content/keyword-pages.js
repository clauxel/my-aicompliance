const eurLexBase = 'https://eur-lex.europa.eu'
const aiActCelex = 'CELEX:32024R1689'

export const officialLinks = {
  eurLex: `${eurLexBase}/legal-content/EN/TXT/?uri=${aiActCelex}`,
  pdf: `${eurLexBase}/legal-content/EN/TXT/PDF/?uri=${aiActCelex}`,
  greek: `${eurLexBase}/legal-content/EL/TXT/?uri=${aiActCelex}`,
  eli: `${eurLexBase}/eli/reg/2024/1689/oj`,
  commission: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai',
}

const aiCompliancePages = [
  page({
    keyword: 'AI compliance jobs',
    path: '/resources/ai-compliance-jobs',
    title: 'AI Compliance Jobs and Team Roles',
    h1: 'AI compliance jobs: the roles a readiness team actually needs',
    description:
      'A practical map of AI compliance jobs, responsibilities, evidence ownership, and hiring signals for teams preparing for the EU AI Act.',
    intent: 'Leaders building an AI governance function without over-hiring before the risk inventory is clear.',
    sections: [
      section('What the role covers', [
        'AI compliance work is rarely one job title. The durable function combines legal interpretation, product governance, model-risk controls, security, data protection, procurement, and documentation discipline.',
        'The first hire should usually own the AI systems inventory and evidence model. Specialist counsel, security, and model validation can then attach to the systems that are actually high risk.',
      ], [
        'AI systems inventory owner',
        'EU AI Act risk classification lead',
        'DPIA and fundamental-rights assessment coordinator',
        'Technical documentation and vendor evidence owner',
        'Monitoring, incident, and audit-readiness owner',
      ]),
      section('Hiring signals', [
        'The strongest candidates can translate law into checklists, but they do not turn every product conversation into a legal memo. They know when to ask for evidence, when to escalate, and how to keep product teams moving.',
        'For smaller teams, a fractional compliance lead plus a structured tool can often beat hiring multiple full-time roles before the scope is known.',
      ]),
    ],
  }),
  page({
    keyword: 'AI compliance checklist',
    path: '/resources/ai-compliance-checklist',
    title: 'AI Compliance Checklist',
    h1: 'AI compliance checklist for EU AI Act readiness',
    description:
      'A focused AI compliance checklist for inventory, risk classification, documentation, DPIA, human oversight, monitoring, and board-level follow-up.',
    intent: 'Operators who need a first pass before legal review or vendor procurement.',
    sections: [
      section('The first-pass checklist', [
        'Start with a complete inventory. The most expensive compliance mistakes usually begin with systems that nobody classified because they were bought as a small feature or embedded inside a workflow.',
        'For every AI system, record the intended purpose, user group, impacted people, provider, deployment geography, data categories, automation level, and decision consequence.',
      ], [
        'Classify the system against Annex III high-risk categories.',
        'Identify prohibited-use risk before procurement or launch.',
        'Collect provider documentation and data-processing evidence.',
        'Write human oversight, logging, monitoring, incident, and change-control procedures.',
        'Prepare DPIA or fundamental-rights impact assessment materials where needed.',
      ]),
      section('What to do after the checklist', [
        'A checklist is not the compliance program. Use it to route systems into low, medium, and high-risk tracks, then give each track a deadline, owner, evidence folder, and re-review cadence.',
      ]),
    ],
  }),
  page({
    keyword: 'AI compliance course',
    path: '/resources/ai-compliance-course',
    title: 'AI Compliance Course Outline',
    h1: 'AI compliance course outline for product and governance teams',
    description:
      'A useful AI compliance course outline for training teams on EU AI Act risk categories, evidence, DPIA workflows, and launch controls.',
    intent: 'Teams designing internal training before the high-risk deadline.',
    sections: [
      section('A course structure that sticks', [
        'AI compliance training works best when it follows a real product journey: intake, classification, evidence, approval, launch, monitoring, and incident response.',
        'Avoid a course that only explains the law. Product managers, engineers, procurement, and customer teams need decision points they can recognise during normal work.',
      ], [
        'Module 1: AI inventory and role mapping.',
        'Module 2: EU AI Act risk categories and examples.',
        'Module 3: Documentation, data, logging, and human oversight.',
        'Module 4: DPIA and fundamental-rights assessment workflow.',
        'Module 5: Monitoring, incidents, vendor updates, and re-classification.',
      ]),
      section('Assessment ideas', [
        'Give learners three realistic AI systems and ask them to classify each one, identify evidence gaps, and decide whether the system should be blocked, escalated, or monitored.',
      ]),
    ],
  }),
  page({
    keyword: 'AI compliance examples',
    path: '/resources/ai-compliance-examples',
    title: 'AI Compliance Examples',
    h1: 'AI compliance examples by risk level',
    description:
      'Concrete AI compliance examples for low-risk, medium-risk, and EU AI Act high-risk systems, with evidence and next-step guidance.',
    intent: 'Teams trying to classify real systems without overreacting to every AI feature.',
    sections: [
      section('Examples that usually need careful review', [
        'A hiring-screening model, a credit eligibility model, a biometric access system, or an exam-scoring assistant should be escalated quickly because they touch categories that are likely to matter under Annex III.',
        'A support summariser or internal knowledge-search assistant may be lower risk, but it still needs data, accuracy, security, transparency, and monitoring controls.',
      ], [
        'High-risk signal: employment candidate ranking.',
        'High-risk signal: creditworthiness or essential service eligibility.',
        'Medium-risk signal: customer-impacting recommendations.',
        'Lower-risk signal: internal drafting with no automated decision consequence.',
      ]),
      section('How to use examples safely', [
        'Examples are a routing aid, not a substitute for facts. The same model can move from lower risk to high risk when the intended purpose, user group, or decision consequence changes.',
      ]),
    ],
  }),
  page({
    keyword: 'AI compliance standards',
    path: '/resources/ai-compliance-standards',
    title: 'AI Compliance Standards',
    h1: 'AI compliance standards to map before legal review',
    description:
      'A practical overview of AI compliance standards, management systems, risk controls, data governance, security, and EU AI Act evidence mapping.',
    intent: 'Governance teams translating standards work into a system-level evidence pack.',
    sections: [
      section('Standards as evidence, not decoration', [
        'AI standards help when they produce evidence: policies, risk registers, model cards, logs, testing plans, incident handling, vendor documentation, and review cadence.',
        'For EU AI Act preparation, standards should map to obligations such as risk management, data governance, technical documentation, transparency, human oversight, accuracy, robustness, cybersecurity, and post-market monitoring.',
      ], [
        'AI management system and governance controls.',
        'Information security and supplier controls.',
        'Data governance and privacy impact assessment practices.',
        'Model validation, testing, monitoring, and incident management.',
      ]),
      section('How to prioritise', [
        'Do not begin by buying certifications. Begin by classifying systems, finding the high-risk queue, and attaching the right controls to the systems that carry real exposure.',
      ]),
    ],
  }),
  page({
    keyword: 'AI compliance certification',
    path: '/resources/ai-compliance-certification',
    title: 'AI Compliance Certification',
    h1: 'AI compliance certification: what it can and cannot prove',
    description:
      'A plain-English guide to AI compliance certification, conformity evidence, third-party claims, and when certification helps EU AI Act readiness.',
    intent: 'Buyers evaluating badges, audits, and certification claims.',
    sections: [
      section('Certification is not a shortcut', [
        'Certification can be useful when it is tied to a recognised scheme, defined scope, competent audit, and current evidence. It is weak when it is only a marketing badge with no system boundary.',
        'For high-risk AI systems, the useful question is whether certification helps prove specific obligations for a specific system and version.',
      ], [
        'What system, model, version, and intended purpose are covered?',
        'Which controls were tested and when?',
        'Does the certificate cover the provider, the deployer, or both?',
        'What evidence remains your responsibility?',
      ]),
      section('Buyer due diligence', [
        'Ask vendors for the certificate scope, technical documentation, change-notice process, data assumptions, incident process, and any limitations that would matter for your use case.',
      ]),
    ],
  }),
  page({
    keyword: 'AI compliance tool',
    path: '/resources/ai-compliance-tool',
    title: 'AI Compliance Tool',
    h1: 'AI compliance tool: what to expect from a useful first scan',
    description:
      'How to evaluate an AI compliance tool for EU AI Act inventory, risk classification, gap reporting, reminders, and evidence tracking.',
    intent: 'Teams choosing whether to use a tool before hiring more advisory hours.',
    sections: [
      section('Minimum useful capabilities', [
        'A useful AI compliance tool should make the first hour simpler: capture systems, classify risk, explain why, surface gaps, export a report, and remind owners before deadlines.',
        'The tool should not pretend to replace counsel. It should give legal and product teams a shared evidence base so the expensive review time starts with facts.',
      ], [
        'AI systems inventory with owners and providers.',
        'EU AI Act Annex III risk classification with reasons.',
        'DPIA and impact-assessment prompts.',
        'PDF export for internal review.',
        'Deadline and reminder workflow.',
      ]),
      section('Questions before buying', [
        'Ask how the tool handles evidence ownership, data retention, high-risk updates, audit logs, and payment/security boundaries.',
      ]),
    ],
  }),
  page({
    keyword: 'AI compliance framework',
    path: '/resources/ai-compliance-framework',
    title: 'AI Compliance Framework',
    h1: 'AI compliance framework for EU AI Act readiness',
    description:
      'A practical AI compliance framework that moves from inventory to classification, evidence, approvals, monitoring, and deadline governance.',
    intent: 'Executives and operators who need a repeatable operating model.',
    sections: [
      section('The operating model', [
        'A practical AI compliance framework has six loops: intake, classification, evidence, approval, monitoring, and re-review. The point is not paperwork. The point is that every AI system has an owner, a risk level, and a defensible next action.',
        'High-risk systems need deeper evidence and executive visibility. Lower-risk systems still need transparency, data, security, and change controls.',
      ], [
        'Inventory every AI system and vendor AI feature.',
        'Classify against prohibited, high-risk, transparency, GPAI, and lower-risk tracks.',
        'Attach evidence and control owners.',
        'Review before launch and after material changes.',
        'Monitor incidents, drift, complaints, and provider changes.',
      ]),
      section('Where the framework starts', [
        'Begin with the systems currently used in Germany, France, the Netherlands, Spain, and other EU markets. Add US and GCC cross-border deployments next if they touch EU users, providers, or distribution.',
      ]),
    ],
  }),
]

const euAiActPages = [
  page({
    keyword: 'AI Act Regulation',
    path: '/resources/ai-act-regulation',
    title: 'AI Act Regulation Guide',
    h1: 'AI Act Regulation: what teams should read first',
    description:
      'A practical guide to the AI Act Regulation, official EUR-Lex text, risk-based obligations, and the first compliance questions for companies.',
    intent: 'Teams moving from awareness to a concrete AI systems inventory.',
    links: [officialLinks.eurLex, officialLinks.eli],
    sections: [
      section('The regulation in one workflow', [
        'The AI Act Regulation is a risk-based legal framework for AI systems placed on the EU market or used in ways that affect people in the EU.',
        'For a company, the first workflow is simple: list systems, map roles, identify prohibited and high-risk uses, collect evidence, and set owners for obligations and deadlines.',
      ], [
        'Provider, deployer, importer, distributor, and product-manufacturer role checks.',
        'Prohibited practice screening.',
        'Annex III high-risk classification.',
        'Transparency and GPAI obligation routing.',
      ]),
      section('Official text', [
        'Use EUR-Lex for the legal text and language versions. Internal summaries should link back to the official source so teams do not rely on stale PDFs.',
      ]),
    ],
  }),
  page({
    keyword: 'AI Act latest version PDF',
    path: '/resources/ai-act-latest-version-pdf',
    title: 'AI Act Latest Version PDF',
    h1: 'AI Act latest version PDF: how to use the official source',
    description:
      'Where to find the AI Act latest version PDF and how to avoid stale copies when building a compliance evidence pack.',
    intent: 'People looking for an official PDF without losing version control.',
    links: [officialLinks.pdf, officialLinks.eurLex],
    sections: [
      section('Use the PDF, but govern the source', [
        'PDF copies are convenient for annotation, but the source of truth should remain the official EUR-Lex record. Save the date accessed and the URL with every internal copy.',
        'When teams ask for the latest PDF, also give them a link to the HTML text so language changes, corrigenda, or related acts are easier to check.',
      ], [
        'Record the access date.',
        'Store the PDF with a source link.',
        'Do not paste uncontrolled excerpts into policy documents.',
        'Re-check official sources before board or audit use.',
      ]),
      section('Operational use', [
        'Turn the PDF into a control map: article, obligation, owner, evidence, deadline, and system scope. That is more useful than a shared folder full of legal downloads.',
      ]),
    ],
  }),
  page({
    keyword: 'Artificial intelligence Act 2024',
    path: '/resources/artificial-intelligence-act-2024',
    title: 'Artificial Intelligence Act 2024',
    h1: 'Artificial Intelligence Act 2024: what changed for companies',
    description:
      'A practical summary of the Artificial Intelligence Act 2024 for companies that build, buy, or deploy AI systems in Europe.',
    intent: 'Business readers who need the operational meaning of the 2024 act.',
    links: [officialLinks.eli, officialLinks.commission],
    sections: [
      section('From law to operating work', [
        'Regulation (EU) 2024/1689 is the Artificial Intelligence Act. For companies, the important shift is that AI use needs a controlled inventory and risk route rather than informal experimentation.',
        'The act entered the operational calendar in stages, so the right question is not only whether a system is covered, but which deadline, role, and evidence trail applies.',
      ], [
        'Inventory AI systems currently used or offered in EU markets.',
        'Separate provider and deployer obligations.',
        'Escalate Annex III high-risk systems.',
        'Prepare evidence before procurement and launch.',
      ]),
      section('A practical next step', [
        'Run a first scan and then schedule legal review for systems where classification, intended purpose, or decision impact is uncertain.',
      ]),
    ],
  }),
  page({
    keyword: 'EU AI Act EUR-Lex',
    path: '/resources/eu-ai-act-eurlex',
    title: 'EU AI Act EUR-Lex Source',
    h1: 'EU AI Act EUR-Lex: official text and language versions',
    description:
      'How to use EUR-Lex for the EU AI Act official text, language versions, PDF, and internal control mapping.',
    intent: 'Readers looking for the official legal source rather than commentary.',
    links: [officialLinks.eurLex, officialLinks.pdf, officialLinks.greek],
    sections: [
      section('Why EUR-Lex matters', [
        'EUR-Lex is the official place to read EU law. It is the right source for legal text, language versions, bibliographic data, and PDF exports.',
        'Use commentary for explanation, but link internal policies and evidence maps to the EUR-Lex record so review teams can trace the source.',
      ], [
        'English text for operating teams.',
        'Local-language text for country teams.',
        'PDF export for annotated review.',
        'ELI link for durable references.',
      ]),
      section('Control mapping tip', [
        'Build a spreadsheet with article, obligation, system scope, owner, evidence, and status. Then use the scanner output as the first row of system-level facts.',
      ]),
    ],
  }),
  page({
    keyword: 'EU AI Act in Greek',
    path: '/resources/eu-ai-act-in-greek',
    title: 'EU AI Act in Greek',
    h1: 'EU AI Act in Greek: official language link and team workflow',
    description:
      'Find the EU AI Act in Greek and learn how bilingual teams can keep Greek and English compliance materials aligned.',
    intent: 'Greek-speaking teams and cross-border companies needing the official Greek version.',
    links: [officialLinks.greek, officialLinks.eurLex],
    sections: [
      section('Use the official Greek version', [
        'Greek-speaking legal, product, and compliance teams should use the official Greek EUR-Lex version when local-language precision matters.',
        'For multinational work, keep a bilingual control map: English operating wording for the product team, Greek legal references for local reviewers, and one shared system inventory.',
      ], [
        'Record the language version used.',
        'Keep article references stable across languages.',
        'Avoid translating obligations informally in approval records.',
        'Use the same risk classification for every language version.',
      ]),
      section('When to escalate', [
        'Escalate when translated wording affects product commitments, customer terms, employment use, credit eligibility, biometric use, or public-sector obligations.',
      ]),
    ],
  }),
  page({
    keyword: 'EU AI Act bare text',
    path: '/resources/eu-ai-act-bare-text',
    title: 'EU AI Act Bare Text',
    h1: 'EU AI Act bare text: how to turn legal text into controls',
    description:
      'A practical way to use the EU AI Act bare text without losing the operating steps needed for product, security, and compliance teams.',
    intent: 'Readers who want the text stripped back to obligations and controls.',
    links: [officialLinks.eurLex],
    sections: [
      section('Bare text is the start, not the system', [
        'The bare legal text is necessary, but it does not tell a product team who owns evidence, which system is in scope, or what must happen before launch.',
        'Translate the text into a control map only after you know your role and the intended purpose of each AI system.',
      ], [
        'Article or annex reference.',
        'Plain-language obligation.',
        'System scope.',
        'Owner and approver.',
        'Evidence, deadline, and status.',
      ]),
      section('Keep the legal source attached', [
        'Every internal control should link back to the official source. That keeps the operating version useful without pretending to be the law itself.',
      ]),
    ],
  }),
  page({
    keyword: 'EU AI Act PDF',
    path: '/resources/eu-ai-act-pdf',
    title: 'EU AI Act PDF',
    h1: 'EU AI Act PDF: download, annotate, and control the version',
    description:
      'Where the official EU AI Act PDF fits in a compliance program, plus a version-control workflow for internal evidence packs.',
    intent: 'Teams downloading the official PDF for review or internal training.',
    links: [officialLinks.pdf],
    sections: [
      section('How to use the PDF well', [
        'The PDF is useful for legal review sessions, board packets, and annotated training. It is less useful as the only source for day-to-day compliance operations.',
        'After downloading it, create a control map that ties obligations to actual systems and owners.',
      ], [
        'File name with regulation number and access date.',
        'Source URL stored beside the file.',
        'Internal notes separated from official text.',
        'Periodic re-check before major decisions.',
      ]),
      section('Avoid stale copies', [
        'If a PDF circulates without a source URL, access date, and owner, it can create false confidence. Link back to EUR-Lex in every policy packet.',
      ]),
    ],
  }),
  page({
    keyword: 'EU AI Act summary',
    path: '/resources/eu-ai-act-summary',
    title: 'EU AI Act Summary',
    h1: 'EU AI Act summary for operators',
    description:
      'A concise EU AI Act summary for product, legal, and compliance teams: roles, risk categories, obligations, evidence, and deadlines.',
    intent: 'Busy teams that need an accurate first orientation before starting an inventory.',
    links: [officialLinks.commission, officialLinks.eurLex],
    sections: [
      section('The short version', [
        'The EU AI Act uses a risk-based approach. Some practices are prohibited, high-risk systems face strict controls, transparency obligations apply to certain user-facing systems, and general-purpose AI has its own obligations.',
        'For most companies, the practical beginning is an AI systems inventory and role map. Without that, summaries stay abstract and deadlines become hard to manage.',
      ], [
        'List every AI system and vendor feature.',
        'Map provider and deployer roles.',
        'Check prohibited and high-risk categories.',
        'Collect technical, data, monitoring, and oversight evidence.',
        'Set deadline reminders for owners.',
      ]),
      section('What a summary cannot do', [
        'A summary cannot classify a system without facts. Intended purpose, market, user group, decision impact, and data categories decide the route.',
      ]),
    ],
  }),
]

export const keywordPages = [...aiCompliancePages, ...euAiActPages]

function page({ keyword, path, title, h1, description, intent, sections, links = [] }) {
  return {
    keyword,
    path,
    title,
    h1,
    description,
    eyebrow: keyword,
    lede: description,
    intent,
    sections,
    links,
    faqs: [
      {
        question: `Is this ${keyword} page legal advice?`,
        answer:
          'No. It is operational guidance for preparing facts, evidence, and questions before qualified legal review.',
      },
      {
        question: 'What should I do first?',
        answer:
          'Start with an AI systems inventory, classify likely risk level, record evidence gaps, and assign an owner for the next review step.',
      },
    ],
  }
}

function section(heading, paragraphs, bullets = []) {
  return { heading, paragraphs, bullets }
}
