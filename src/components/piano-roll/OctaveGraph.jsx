import React, { PropTypes } from 'react'
import { Range } from 'immutable'
import shallowCompare from 'react/lib/shallowCompare'

import './OctaveGraph.css'

const blackNotes = [1, 3, 5, 8, 10]

const onClickCell = () => {

}

class OctaveGraph extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render () {
    const { resolution, bars } = this.props
    return (
      <div style={{ display: 'flex', flexGrow: 1 }}>
        {Range(0, resolution * bars).map(i =>
          <div
            className="octave-graph"
            key={i}
            style={(i + 1) % resolution ? null : { borderWidth: '0 2px 0 0', borderColor: '#797979' }}
          >
            {
              Range(0, 12).map(j =>
                <div
                  className="octave-graph-row"
                  key={(j * 100) + i}
                  style={{
                    backgroundColor: blackNotes.indexOf(j) === -1 ? '#e8e8e8' : '#d4d4d4',
                    borderBottom: j === 6 || j === 11 ? '1px' : '0',
                    borderStyle: 'solid'
                  }}
                  onMouseDown={onClickCell}
                />
              )
            }
          </div>
        )}
      </div>
    )
  }
}

OctaveGraph.propTypes = {
  bars: PropTypes.number.isRequired,
  resolution: PropTypes.number.isRequired
}

export default OctaveGraph
