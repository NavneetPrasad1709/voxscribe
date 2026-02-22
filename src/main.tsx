import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ThemeProvider } from './lib/ThemeContext'
import './styles/globals.css'

const KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (!KEY) console.warn('Add VITE_CLERK_PUBLISHABLE_KEY to .env.local')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <ClerkProvider
        publishableKey={KEY || 'pk_test_placeholder'}
        appearance={{
          variables: {
            colorPrimary: '#7c3aed',
            colorBackground: '#0b0b0e',
            colorInputBackground: '#111115',
            colorText: '#f4eedf',
            colorTextSecondary: '#b0a898',
            borderRadius: '2px',
            fontFamily: 'Inter, system-ui, sans-serif',
          },
          elements: {
            card: {
              background: 'rgba(11,11,14,0.98)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 32px 100px rgba(0,0,0,0.7)',
              borderRadius: '2px',
            },
            formButtonPrimary: { background: '#7c3aed', color: '#f0eeff', fontWeight: '700' },
            headerTitle: { fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.5rem' },
          },
        }}
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ClerkProvider>
    </ThemeProvider>
  </React.StrictMode>
)
