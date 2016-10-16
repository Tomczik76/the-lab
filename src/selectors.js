export const getTempo = state => state.getIn(['song', 'tempo'])

export const getPlay = state => state.getIn(['song', 'play'])

export const getSelectedSequence = state => state.getIn(['sequence', 'sequences', state.getIn(['sequence', 'selectedIndex'])])

