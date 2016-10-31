import { combineReducers } from 'redux-immutable'
import { combineEpics } from 'redux-observable'

import song from './song'
import sequence, { epics as sequenceEpics } from './sequence'
import panel, { epics as panelEpics } from './panel'

export const rootEpic = combineEpics(
  ...panelEpics,
  ...sequenceEpics
)
export default combineReducers({ song, sequence, panel })
