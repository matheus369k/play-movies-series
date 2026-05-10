import ReactDOM from 'react-dom/client'
import { App } from './app'
import 'react-multi-carousel/lib/styles.css'
import './style/index.css'
import React from 'react'
import ReactGA from 'react-ga4'
import { env } from './util/env'

const googleAnalyticsID = env.VITE_GA_ID
if (googleAnalyticsID) {
  ReactGA.initialize(googleAnalyticsID)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
