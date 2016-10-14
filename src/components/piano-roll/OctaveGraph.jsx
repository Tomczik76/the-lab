import React, { PropTypes } from 'react'
import { Range } from 'immutable'
import './OctaveGraph.css'

const blackNotes = [1, 3, 5, 8, 10]

const OctaveGraph = ({ resolution, bars }) =>
  <div style={{ display: 'flex', flexGrow: 1 }}>
    {Range().take(resolution * bars).map(i =>
      <div
        className="octave-graph"
        key={`pianoRoll_${i}`}
        style={(i + 1) % resolution ? {} : { borderWidth: '0 2px 0 0', borderColor: '#797979' }}
      >
        {
          Range().take(12).map(j =>
            <div
              className="octave-graph-row"
              key={`pianoRoll_${i}_${j}`}
              style={{
                backgroundColor: blackNotes.indexOf(j) === -1 ? '#e8e8e8' : '#d4d4d4',
                borderBottom: j === 6 || j === 11 ? '1px' : '0',
                borderStyle: 'solid'
              }}
            />
          )
        }
      </div>
    )}
  </div>


OctaveGraph.propTypes = {
  bars: PropTypes.number.isRequired,
  resolution: PropTypes.number.isRequired
}

export default OctaveGraph
