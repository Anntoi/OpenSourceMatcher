import { getOAuthRedirectUrl } from '../utils/auth'

function OAuthButton({ provider, label, icon, className }) {
  const handleClick = () => {
    window.location.href = getOAuthRedirectUrl(provider)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex w-full items-center justify-center gap-3 rounded-lg border px-4 py-3 text-sm font-semibold transition ${className}`}
    >
      <span className="text-lg" aria-hidden>
        {icon}
      </span>
      {label}
    </button>
  )
}

export default function SocialLoginButtons() {
  return (
    <div className="space-y-3">
      <OAuthButton
        provider="github"
        label="Continuer avec GitHub"
        icon="⎇"
        className="border-slate-800 bg-slate-900 text-white hover:bg-slate-800"
      />
      <OAuthButton
        provider="google"
        label="Continuer avec Google"
        icon="G"
        className="border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
      />
    </div>
  )
}
