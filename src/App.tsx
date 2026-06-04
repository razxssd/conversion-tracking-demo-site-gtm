import { Routes, Route } from 'react-router'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { ProductPage } from './pages/ProductPage'
import { SignupPage } from './pages/SignupPage'
import { SetupGuidePage } from './pages/SetupGuidePage'
import { usePageViews } from './hooks/usePageViews'

function AppContent() {
  // Emit a virtual_page_view to the data layer on every SPA route change.
  // (Rebrandly page views are handled automatically by the SDK — see the hook.)
  usePageViews()

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/setup" element={<SetupGuidePage />} />
      </Routes>
    </Layout>
  )
}

export default function App() {
  return <AppContent />
}
