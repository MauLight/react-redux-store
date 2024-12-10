/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react'
import ReactDOM from 'react-dom'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import store from './store/store.ts'
import App from './App.tsx'
import './index.css'

if (import.meta.env.DEV) {
  const axe = await import('@axe-core/react')
  axe.default(React, ReactDOM, 1000)
}

const root = createRoot(document.getElementById('root')!)

const render = () => {
  root.render(

    <Router>
      <App state={store.getState()} dispatch={store.dispatch} />
    </Router>
  )
}

render()
store.subscribe(render)
