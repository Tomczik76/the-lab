import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Map } from 'immutable'
import { Provider } from 'react-redux'

import reducer from './store/index'

import App from './App'

const store = createStore(reducer, Map())

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('root'))
