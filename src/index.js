import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Map } from 'immutable'

import App from './App'
import store from './store/index'

createStore(store, Map())

ReactDOM.render(<App />, document.getElementById('root'))
