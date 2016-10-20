import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import shallowCompare from 'react/lib/shallowCompare'
import { Range, List } from 'immutable'
import { bindActionCreators } from 'redux'
import { Observable } from '@reactivex/rxjs'

import { actions as synthActions } from '../../store/synth'

import OctaveKeys from './OctaveKeys'
import OctaveGraph from './OctaveGraph'
import DragPanel from '../DragPanel'

import { getSelectedSequence } from '../../selectors'

import './PianoRoll.css'

class PianoRoll extends React.Component {
  componentDidMount () {
    const clickStream = Observable.fromEvent(this.node, 'click')

    const bufferedClickStream = clickStream
      .buffer(clickStream.debounceTime(250))

    bufferedClickStream
      .filter(x => x.length === 1)
      .map(x => x[x.length - 1])
      .subscribe(e => this.onClickGraph(e))

    bufferedClickStream
      .filter(x => x.length === 2)
      .map(x => x[x.length - 1])
      .subscribe(e => this.onDoubleClickGraph(e))
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  onClickGraph (e) {
    if (e.target.dataset.stepsIndex === undefined) {
      const { addNote, channelIndex } = this.props
      addNote(channelIndex, parseInt(e.target.dataset.stepNumber, 10), 1, e.target.dataset.note)
    }
  }

  onDoubleClickGraph (e) {
    if (e.target.dataset.stepsIndex) {
      const { deleteNote, channelIndex } = this.props
      deleteNote(channelIndex, parseInt(e.target.dataset.stepsIndex, 10))
    }
  }

  render () {
    const { resolution, bars, panelIndex, steps } = this.props
    const range = Range(8, -1)
    return (
      <DragPanel
        title={'Piano Roll'}
        type="pianoRoll"
        index={panelIndex}
        innerBorder
      >
        <div className="piano-roll">
          <div>
            {range.map(i => <OctaveKeys key={i} number={i} />)}
          </div>
          <div
            style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
            ref={(node) => { this.node = node }}
          >
            {range.map(i =>
              <OctaveGraph
                key={i}
                bars={bars}
                number={i}
                resolution={resolution}
                steps={steps}
              />)}
          </div>
        </div>
      </DragPanel>
    )
  }
}

PianoRoll.propTypes = {
  resolution: PropTypes.number.isRequired,
  bars: PropTypes.number.isRequired,
  steps: PropTypes.instanceOf(List),
  panelIndex: PropTypes.number.isRequired,
  addNote: PropTypes.func,
  deleteNote: PropTypes.func,
  channelIndex: PropTypes.number
}

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    addNote: synthActions.addNote,
    deleteNote: synthActions.removeNote
  }, dispatch)

const mapStateToProps = (state, ownProps) => {
  const selectedSequence = getSelectedSequence(state)
  return {
    steps: selectedSequence.getIn(['channels', ownProps.channelIndex, 'instrument', 'steps']),
    resolution: selectedSequence.get('resolution'),
    bars: selectedSequence.get('bars'),
    panelIndex: state.get('panel').findKey(x => x.get('type') === 'pianoRoll' && x.get('channelIndex') === ownProps.channelIndex)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PianoRoll)

