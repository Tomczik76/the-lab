import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Map } from 'immutable'

import SoundBox from './components/SoundBox'
import { playSelector, tempoSelector } from './selectors'
import StepSequence from './components/StepSequence'
import { actions as sequenceActions } from './store/sequence'
import { actions as songActions } from './store/song'

const { toggleStep, setResolution, setBars } = sequenceActions
const { updateTempo } = songActions
const App =
  ({
    tempo,
    play,
    sequence,
    resolution,
    bars,
    onToggleStep,
    onSetResolution,
    onSetBars,
    onUpdateTempo
  }) =>
    <div>
      <SoundBox tempo={tempo} play={play} sequence={sequence} bars={bars} resolution={resolution} />
      Resolution: <input type="number" value={resolution} min="1" max="32" onChange={onSetResolution} />
      Bars: <input type="number" name="quantity" value={bars} min="1" max="8" onChange={onSetBars} />
      Tempo: <input type="number" name="tempo" value={tempo} min="1" max="360" onChange={onUpdateTempo} />
      {
          sequence.get('channels')
            .toArray()
            .map((chan, i) =>
              <StepSequence
                key={`StepSequence_${i}`}
                resolution={sequence.get('resolution')}
                bars={sequence.get('bars')}
                steps={chan.get('instrument').get('steps')}
                label={chan.get('label')}
                onToggleStepClick={(...args) => onToggleStep(i, ...args)}
              />
          )
      }
    </div>

App.propTypes = {
  tempo: PropTypes.number.isRequired,
  play: PropTypes.bool.isRequired,
  sequence: PropTypes.instanceOf(Map),
  resolution: PropTypes.number,
  bars: PropTypes.number,
  onToggleStep: PropTypes.func,
  onSetResolution: PropTypes.func,
  onSetBars: PropTypes.func,
  onUpdateTempo: PropTypes.func
}

const getValue = (e, _default) => {
  const value = parseInt(e.target.value, 10)
  return Number.isInteger(value) ? value : _default
}

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    onToggleStep: toggleStep,
    onSetResolution: e => setResolution(getValue(e, 1)),
    onSetBars: e => setBars(getValue(e, 1)),
    onUpdateTempo: e => updateTempo(getValue(e, 1))
  }, dispatch)

const mapStateToProps = state => ({
  tempo: tempoSelector(state),
  play: playSelector(state),
  sequence: state.getIn(['sequence', 'sequences', state.getIn(['sequence', 'selectedIndex'])]),
  resolution: state.getIn(['sequence', 'sequences', state.getIn(['sequence', 'selectedIndex']), 'resolution']),
  bars: state.getIn(['sequence', 'sequences', state.getIn(['sequence', 'selectedIndex']), 'bars'])
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
