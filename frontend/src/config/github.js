export const GITHUB_REPO_OWNER =
  import.meta.env.VITE_GITHUB_REPO_OWNER || 'Anntoi'

export const GITHUB_REPO_NAME =
  import.meta.env.VITE_GITHUB_REPO_NAME || 'OpenSourceMatcher'

export function repositoryIssuesPath(owner = GITHUB_REPO_OWNER, repo = GITHUB_REPO_NAME) {
  return `/repositories/${owner}/${repo}/issues`
}
