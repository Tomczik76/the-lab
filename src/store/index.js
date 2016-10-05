import { combineReducers } from 'redux-immutable'
import song from './song'
import sequence from './sequence'
import panel from './panel'

export default combineReducers({ song, sequence, panel })
