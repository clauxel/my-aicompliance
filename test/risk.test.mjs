import test from 'node:test'
import assert from 'node:assert/strict'

import { classifyAiSystem, daysUntilHighRiskDeadline } from '../src/lib/risk.js'
import { buildSitemapXml } from '../worker/index.js'

test('classifies employment AI as high risk', () => {
  const result = classifyAiSystem({
    name: 'Hiring ranker',
    sector: 'employment',
    purpose: 'Ranks job candidates and recommends interviews',
    decisions: 'Supports hiring decisions',
    data: 'CV personal data',
  })

  assert.equal(result.level, 'High')
  assert.ok(result.matchedHighRisk.some((category) => category.id === 'employment'))
  assert.ok(result.gaps.length >= 3)
})

test('keeps a simple drafting assistant below high risk', () => {
  const result = classifyAiSystem({
    name: 'Internal drafting assistant',
    sector: 'marketing',
    purpose: 'Drafts internal campaign copy',
    decisions: 'No automated decisions',
    humanOversight: true,
    logging: true,
    vendorDocs: true,
    impactAssessment: true,
  })

  assert.equal(result.level, 'Low')
})

test('counts down to 2 August 2026', () => {
  assert.equal(daysUntilHighRiskDeadline(new Date('2026-05-11T12:00:00Z')), 83)
  assert.equal(daysUntilHighRiskDeadline(new Date('2026-08-03T00:00:00Z')), 0)
})

test('sitemap includes homepage and keyword pages', () => {
  const xml = buildSitemapXml()
  assert.match(xml, /https:\/\/aicompliance\.online\//)
  assert.match(xml, /\/resources\/eu-ai-act-summary/)
  assert.match(xml, /\/resources\/ai-compliance-checklist/)
})
