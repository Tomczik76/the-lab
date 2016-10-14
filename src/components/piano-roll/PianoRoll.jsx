import React, { PropTypes } from 'react'
import shallowCompare from 'react/lib/shallowCompare'
import { Range } from 'immutable'
import OctaveKeys from './OctaveKeys'
import OctaveGraph from './OctaveGraph'
import './PianoRoll.css'

class PianoRoll extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render () {
    const { resolution, bars } = this.props
    return (
      <div className="piano-roll">
        <div>
          {Range(8, -1).map(i => <OctaveKeys key={i} number={i} />)}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          {Range(8, -1).map(i => <OctaveGraph key={i} bars={bars} resolution={resolution} />)}
        </div>
      </div>
    )
  }
}

PianoRoll.propTypes = {
  resolution: PropTypes.number.isRequired,
  bars: PropTypes.number.isRequired
}

export default PianoRoll

