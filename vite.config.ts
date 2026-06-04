import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// This demo loads the Rebrandly SDK *through Google Tag Manager*, not via a
// direct <script> tag. The only thing the app injects into index.html is the
// GTM container snippet, parameterised by the container ID below.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const gtmId = env.VITE_GTM_ID || 'GTM-XXXXXXX'

  return {
    base: mode === 'production' ? '/conversion-tracking-demo-site-gtm/' : '/',
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'html-env-replace',
        transformIndexHtml(html) {
          return html.replaceAll('%VITE_GTM_ID%', gtmId)
        },
      },
    ],
  }
})
