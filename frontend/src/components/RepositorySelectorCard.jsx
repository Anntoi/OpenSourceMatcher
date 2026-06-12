export default function RepositorySelectorCard({ repository, isSelected, onSelect }) {
  const handleClick = () => {
    onSelect(repository);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`w-full text-left rounded-lg border-2 transition-all p-4 ${
        isSelected
          ? 'border-indigo-600 bg-indigo-50'
          : 'border-slate-200 bg-white hover:border-indigo-300'
      }`}
    >
      <div className="flex items-start gap-3">
        <img
          src={repository.avatar_url}
          alt={repository.owner}
          className="h-10 w-10 rounded-full"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900">
            {repository.owner}/{repository.repo}
          </h3>
          {repository.description && (
            <p className="mt-1 text-sm text-slate-600 line-clamp-2">
              {repository.description}
            </p>
          )}
          <div className="mt-2 flex items-center gap-4 text-sm text-slate-500">
            <span>⭐ {repository.stars.toLocaleString()}</span>
            <span>📂 {repository.open_issues_count} issues ouvertes</span>
            {repository.language && <span>💻 {repository.language}</span>}
          </div>
        </div>
      </div>
    </button>
  );
}
