import { createSelector } from 'reselect'

export const getTempo = state => state.getIn(['song', 'tempo'])

export const getPlay = state => state.getIn(['song', 'play'])

export const getSelectedSequence = state => state.getIn(['sequence', 'sequences', state.getIn(['sequence', 'selectedIndex'])])

export const getSelectedBars = createSelector(
  getSelectedSequence,
  sequence => sequence.get('bars')
)

export const getSelectedResolution = createSelector(
  getSelectedSequence,
  sequence => sequence.get('resolution')
)
