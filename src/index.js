import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { createEpicMiddleware } from 'redux-observable'
import 'rxjs'

import reducer, { rootEpic } from './store'

import App from './App'

const epicMiddleware = createEpicMiddleware(rootEpic)

const store = createStore(reducer, applyMiddleware(epicMiddleware))

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('root'))
