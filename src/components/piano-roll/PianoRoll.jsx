import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import shallowCompare from 'react/lib/shallowCompare'
import { Range, List } from 'immutable'
import { bindActionCreators } from 'redux'

import OctaveKeys from './OctaveKeys'
import OctaveGraph from './OctaveGraph'
import DragPanel from '../DragPanel'

import { getSelectedSequence } from '../../selectors'

import './PianoRoll.css'

class PianoRoll extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
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
          <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }} onClick={(e) => console.log(e.target)}>
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
  panelIndex: PropTypes.number.isRequired
}

const mapDispatchToProps = dispatch => bindActionCreators(
  {
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

