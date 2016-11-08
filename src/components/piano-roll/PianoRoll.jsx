import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import shallowCompare from 'react/lib/shallowCompare'
import { Range, List, Map } from 'immutable'
import { bindActionCreators } from 'redux'

import { actions as synthActions } from '../../store/synth'

import OctaveKeys from './OctaveKeys'
import NoteRow from './NoteRow'
import DragPanel from '../DragPanel'

import { getSelectedSequence } from '../../selectors'

import './PianoRoll.css'

class PianoRoll extends React.Component {

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render () {
    const { resolution, bars, panelIndex, notes } = this.props
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
            onMouseDown={this.props.pianoRollClick}
          >
            {range.map(octaveNumber =>
              ['b', 'a#', 'a', 'g#', 'g', 'f#', 'f', 'e', 'd#', 'd', 'c#', 'c']
                .map(x => x + octaveNumber)
                .map(note =>
                  <NoteRow
                    key={note}
                    bars={bars}
                    resolution={resolution}
                    note={note}
                    steps={notes.get(note, List())}
                    onDragHeadStart={this.props.dragHeadStart}
                    onDragTailStart={this.props.dragTailStart}
                    onDragNoteStart={this.props.dragNoteStart}
                  />)
            )}
          </div>
        </div>
      </DragPanel>
    )
  }
}

PianoRoll.propTypes = {
  resolution: PropTypes.number.isRequired,
  bars: PropTypes.number.isRequired,
  notes: PropTypes.instanceOf(Map),
  panelIndex: PropTypes.number.isRequired,
  pianoRollClick: PropTypes.func,
  dragHeadStart: PropTypes.func,
  dragTailStart: PropTypes.func,
  dragNoteStart: PropTypes.func
}

const mapDispatchToProps = (dispatch, ownProps) => bindActionCreators(
  {
    pianoRollClick: (e) => {
      const { stepId, note, stepNumber } = e.target.dataset
      return synthActions.pianoRollClick(
        ownProps.channelIndex,
        stepId,
        note,
        parseInt(stepNumber, 10)
      )
    },
    dragHeadStart: (...args) => synthActions.dragHeadStart(ownProps.channelIndex, ...args),
    dragTailStart: (...args) => synthActions.dragTailStart(ownProps.channelIndex, ...args),
    dragNoteStart: (...args) => synthActions.dragNoteStart(ownProps.channelIndex, ...args)
  }, dispatch)

const mapStateToProps = (state, ownProps) => {
  const selectedSequence = getSelectedSequence(state)
  return {
    notes: selectedSequence.getIn(['channels', ownProps.channelIndex, 'instrument', 'notes']),
    resolution: selectedSequence.get('resolution'),
    bars: selectedSequence.get('bars'),
    panelIndex: state.get('panel').findKey(x => x.get('type') === 'pianoRoll' && x.get('channelIndex') === ownProps.channelIndex)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PianoRoll)

