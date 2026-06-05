import { Link, useLocation } from 'react-router'

export function Navbar() {
  const location = useLocation()

  const linkClass = (path: string) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      location.pathname === path
        ? 'bg-indigo-600 text-white'
        : 'text-gray-700 hover:bg-gray-100'
    }`

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg text-indigo-600">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.5 19a4.5 4.5 0 1 0 0-9h-1.8A7 7 0 1 0 4 15.7" />
                <path d="M12 12v9" />
                <path d="m8 17 4 4 4-4" />
              </svg>
              NimbusDesk
            </Link>
            <div className="flex items-center gap-1">
              <Link to="/" className={linkClass('/')}>Pricing</Link>
              <Link to="/signup" className={linkClass('/signup')}>Start free trial</Link>
              <Link to="/setup" className={linkClass('/setup')}>GTM Setup Guide</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
