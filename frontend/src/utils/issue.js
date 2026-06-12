/** Normalise une issue API pour l'affichage et les favoris */
export function normalizeIssue(issue) {
  const labels = issue.labels ?? []
  const url = issue.html_url ?? issue.url

  return {
    id: issue.id,
    number: issue.number ?? issue.issue_number,
    title: issue.title,
    state: issue.state ?? 'open',
    repository: issue.repository ?? '',
    url,
    html_url: url,
    labels,
    author: issue.author ?? null,
    comments_count: issue.comments_count ?? 0,
    created_at: issue.created_at ?? null,
    difficulty: issue.difficulty ?? resolveDifficultyFromLabels(labels),
  }
}

function resolveDifficultyFromLabels(labels) {
  const lower = labels.map((l) => String(l).toLowerCase())
  if (lower.includes('good first issue')) return 'beginner'
  if (lower.includes('help wanted')) return 'intermediate'
  return 'all-levels'
}

export function issueToFavoritePayload(issue) {
  const normalized = normalizeIssue(issue)
  return {
    issue_number: normalized.number,
    title: normalized.title,
    repository: normalized.repository,
    url: normalized.url,
    labels: normalized.labels,
    difficulty: normalized.difficulty,
  }
}

export const DIFFICULTY_LABELS = {
  beginner: 'Débutant',
  intermediate: 'Intermédiaire',
  'all-levels': 'Tous niveaux',
}

export const STATE_LABELS = {
  open: 'Open',
  closed: 'Closed',
}

export function formatIssueDate(isoDate) {
  if (!isoDate) return ''
  return new Date(isoDate).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
