import { combineReducers } from 'redux-immutable'
import song from './song'
import sequences from './sequences'

export default combineReducers({ song, sequences })
