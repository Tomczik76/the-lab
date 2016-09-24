import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Map } from 'immutable'
import { Provider } from 'react-redux'

import App from './App'
import reducer from './store/index'

const store = createStore(reducer, Map())

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('root'))
