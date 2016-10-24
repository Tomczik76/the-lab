import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import shallowCompare from 'react/lib/shallowCompare'
import { Range, List, Map } from 'immutable'
import { bindActionCreators } from 'redux'
import { Observable } from '@reactivex/rxjs'

import { actions as synthActions } from '../../store/synth'

import OctaveKeys from './OctaveKeys'
import NoteRow from './NoteRow'
import DragPanel from '../DragPanel'

import { getSelectedSequence } from '../../selectors'

import './PianoRoll.css'

class PianoRoll extends React.Component {
  componentDidMount () {
    const clickStream = Observable.fromEvent(this.node, 'mousedown')

    const bufferedClickStream = clickStream
      .buffer(clickStream.debounceTime(250))

    clickStream
      .filter(e => e.target.dataset.note)
      .filter(e => e.target.dataset.stepsIndex === undefined)
      .subscribe((e) => {
        const { addNote, channelIndex } = this.props
        addNote(channelIndex, parseInt(e.target.dataset.stepNumber, 10), 1, e.target.dataset.note)
      })

    bufferedClickStream
      .filter(x => x.length === 2)
      .filter(x => x.every(e => e.target.dataset.stepsIndex !== undefined))
      .map(x => x.pop())
      .subscribe((e) => {
        const { deleteNote, channelIndex } = this.props
        deleteNote(channelIndex, parseInt(e.target.dataset.stepsIndex, 10), e.target.dataset.note)
      })
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  onResizeNote = (stepIndex, start, duration, note) => {
    const { channelIndex, resizeNote } = this.props
    resizeNote(channelIndex, stepIndex, note, start, duration)
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
            ref={(node) => { this.node = node }}
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
                    resizeNote={this.onResizeNote}
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
  addNote: PropTypes.func,
  deleteNote: PropTypes.func,
  channelIndex: PropTypes.number,
  resizeNote: PropTypes.func
}

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    addNote: synthActions.addNote,
    deleteNote: synthActions.removeNote,
    resizeNote: synthActions.resizeNote
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

