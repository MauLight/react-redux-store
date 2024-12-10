/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react'
import ReactDOM from 'react-dom'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import store from './store/store.ts'
import { Provider } from 'react-redux'
import App from './App.tsx'
import './index.css'

if (import.meta.env.DEV) {
  const axe = await import('@axe-core/react')
  axe.default(React, ReactDOM, 1000)
}

const root = createRoot(document.getElementById('root')!)

root.render(

  <Router>
    <Provider store={store}>
      <App state={store.getState()} dispatch={store.dispatch} />
    </Provider>
  </Router>
)

