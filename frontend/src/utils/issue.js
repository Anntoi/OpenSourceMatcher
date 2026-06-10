/** Normalise une issue API pour l'affichage et les favoris */
export function normalizeIssue(issue) {
  return {
    number: issue.number ?? issue.issue_number,
    title: issue.title,
    repository: issue.repository,
    url: issue.url,
    labels: issue.labels ?? [],
    difficulty: issue.difficulty ?? 'all-levels',
  }
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
