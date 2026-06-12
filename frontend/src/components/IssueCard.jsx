import { Link } from 'react-router-dom'
import { useIssueHistory } from '../hooks/useIssueHistory'
import {
  DIFFICULTY_LABELS,
  STATE_LABELS,
  formatIssueDate,
  normalizeIssue,
} from '../utils/issue'
import FavoriteButton from './FavoriteButton'

const difficultyStyles = {
  beginner: 'bg-emerald-100 text-emerald-800',
  intermediate: 'bg-sky-100 text-sky-800',
  'all-levels': 'bg-violet-100 text-violet-800',
}

const stateStyles = {
  open: 'bg-green-100 text-green-800',
  closed: 'bg-slate-200 text-slate-700',
}

export default function IssueCard({ issue: rawIssue, showFavorite = true }) {
  const issue = normalizeIssue(rawIssue)
  const { addToHistory } = useIssueHistory()

  const handleOpen = () => {
    addToHistory(issue)
  }

  return (
    <article className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md">
      {showFavorite && (
        <div className="flex shrink-0 items-start pt-0.5">
          <FavoriteButton issue={issue} />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              stateStyles[issue.state] ?? stateStyles.open
            }`}
          >
            {STATE_LABELS[issue.state] ?? issue.state}
          </span>
          {issue.difficulty && (
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                difficultyStyles[issue.difficulty] ?? difficultyStyles['all-levels']
              }`}
            >
              {DIFFICULTY_LABELS[issue.difficulty] ?? issue.difficulty}
            </span>
          )}
          {issue.repository && (
            <span className="truncate text-xs text-slate-500">{issue.repository}</span>
          )}
          {issue.number && <span className="text-xs text-slate-400">#{issue.number}</span>}
        </div>
        <h3 className="line-clamp-2 font-semibold text-slate-900">{issue.title}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
          {issue.author?.login && (
            <span>
              Par{' '}
              {issue.author.avatar_url ? (
                <span className="inline-flex items-center gap-1">
                  <img
                    src={issue.author.avatar_url}
                    alt=""
                    className="inline h-4 w-4 rounded-full"
                  />
                  <span className="font-medium text-slate-700">{issue.author.login}</span>
                </span>
              ) : (
                <span className="font-medium text-slate-700">{issue.author.login}</span>
              )}
            </span>
          )}
          {issue.created_at && <span>Créée le {formatIssueDate(issue.created_at)}</span>}
          <span>
            {issue.comments_count} commentaire{issue.comments_count !== 1 ? 's' : ''}
          </span>
        </div>
        {issue.labels?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {issue.labels.slice(0, 6).map((label) => (
              <span
                key={label}
                className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
              >
                {label}
              </span>
            ))}
          </div>
        )}
        <div className="mt-3 flex gap-3 text-xs">
          <a
            href={issue.url}
            target="_blank"
            rel="noreferrer"
            onClick={handleOpen}
            className="font-medium text-indigo-600 hover:underline"
          >
            Voir sur GitHub →
          </a>
          <Link to="/favorites" className="text-slate-500 hover:text-slate-700">
            Mes favoris
          </Link>
        </div>
      </div>
    </article>
  )
}
