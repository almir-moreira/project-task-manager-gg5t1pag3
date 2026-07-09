export type NormalizedStage =
  | 'preparation'
  | 'feedback'
  | 'review'
  | 'approval'
  | 'done'
  | 'unknown'

const STAGE_SYNONYMS: Record<NormalizedStage, string[]> = {
  preparation: ['preparation', 'planning'],
  feedback: [
    'feedback',
    'consultation',
    'consultation/feedback',
    'consultation-feedback',
    'consultation feedback',
  ],
  review: ['review'],
  approval: ['approval', 'final approval', 'final_approval', 'finalapproval'],
  done: ['done', 'completed', 'complete'],
  unknown: [],
}

const STAGE_TO_CATEGORY: Record<NormalizedStage, string | null> = {
  preparation: null,
  feedback: 'Feedback',
  review: 'Review',
  approval: 'Approval',
  done: null,
  unknown: null,
}

export function normalizeStage(stage: string | null | undefined): NormalizedStage {
  if (!stage) return 'unknown'
  const lower = stage.toLowerCase().trim()
  for (const key of Object.keys(STAGE_SYNONYMS) as NormalizedStage[]) {
    if (STAGE_SYNONYMS[key].includes(lower)) return key
  }
  return 'unknown'
}

export function normalizeCategory(category: string): string {
  const lower = category.toLowerCase().trim()
  if (['feedback', 'planning', 'consultation'].includes(lower)) return 'feedback'
  if (lower === 'review') return 'review'
  if (lower === 'approval') return 'approval'
  return lower
}

export function isStageDone(stage: string | null | undefined): boolean {
  return normalizeStage(stage) === 'done'
}

export function isStagePreparation(stage: string | null | undefined): boolean {
  return normalizeStage(stage) === 'preparation'
}

export function findInProgressIndex(
  items: { status: string; category: string }[],
  stage: string | null | undefined,
): number {
  const normalized = normalizeStage(stage)

  if (normalized === 'done' || normalized === 'preparation') return -1

  const targetCategory = STAGE_TO_CATEGORY[normalized]

  if (targetCategory) {
    const targetNorm = normalizeCategory(targetCategory)
    return items.findIndex(
      (s) => s.status === 'Pending' && normalizeCategory(s.category) === targetNorm,
    )
  }

  return items.findIndex((s) => s.status === 'Pending')
}

export function getStageAwareCurrentStepName(
  inProgressStep: { label: string; stage: string } | null | undefined,
  stage: string | null | undefined,
): string {
  if (inProgressStep) {
    return `${inProgressStep.label} (${inProgressStep.stage})`
  }
  const normalized = normalizeStage(stage)
  if (normalized === 'done') return 'Done'
  if (normalized === 'preparation') return stage || 'Preparation'
  return ''
}

export function isActivityDone(activity: {
  status?: string | null
  current_stage?: string | null
}): boolean {
  if (activity.status === 'Done') return true
  return normalizeStage(activity.current_stage) === 'done'
}

export function sortActivitiesByDoneStatus(items: any[]): any[] {
  return [...items].sort((a, b) => {
    const aDone = isActivityDone(a)
    const bDone = isActivityDone(b)
    if (aDone !== bDone) return aDone ? 1 : -1
    const aDate = a.created_at || ''
    const bDate = b.created_at || ''
    return bDate.localeCompare(aDate)
  })
}
