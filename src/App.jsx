import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Song, Sequencer } from 'react-music'
import { Map } from 'immutable'

import { playSelector, tempoSelector } from './selectors'
import StepSequence from './components/StepSequence'
import { actions as sequenceActions } from './store/sequence'

const { toggleStep } = sequenceActions
const App = (props) => {
  const { tempo, play, sequence, onToggleStep } = props

  return (
    <div>
      <Song tempo={tempo} autoPlay={play} />
      {
          sequence.get('channels')
            .toArray()
            .map((chan, i) =>
              <StepSequence
                key={`StepSequence_${i}`}
                resolution={sequence.get('resolution')}
                bars={sequence.get('bars')}
                steps={chan.get('instrument').get('steps')}
                onToggleStepClick={(...args) => onToggleStep(i, ...args)}
              />
          )
      }
    </div>
  )
}

App.propTypes = {
  tempo: PropTypes.number.isRequired,
  play: PropTypes.bool.isRequired,
  sequence: PropTypes.instanceOf(Map)
}

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    onToggleStep: toggleStep
  }, dispatch)

const mapStateToProps = state => ({
  tempo: tempoSelector(state),
  play: playSelector(state),
  sequence: state.getIn(['sequence', 'sequences', state.getIn(['sequence', 'selectedIndex'])])
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
