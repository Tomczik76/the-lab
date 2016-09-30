import { combineReducers } from 'redux-immutable'
import song from './song'
import sequence from './sequence'

export default combineReducers({ song, sequence })
