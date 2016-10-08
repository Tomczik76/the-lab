import React from 'react'

const container = {
  width: '60px',
  height: '152px',
  borderRight: '1px',
  borderStyle: 'solid',
  borderTop: '0',
  borderBottom: '0',
  borderLeft: '0'
}
const octave = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  position: 'relative',
  overflow: 'hidden'
}

const blackKey = {
  textAlign: 'right',
  paddingRight: '2px',
  color: '#fff',
  fontSize: '10px',
  flexGrow: 1,
  backgroundColor: '#000000'
}

const whiteKey = {
  textAlign: 'right',
  paddingRight: '8px',
  fontSize: '10px',
  flexGrow: 1,
  backgroundColor: '#ffffff'
}

const spacer = {
  height: '1px',
  backgroundColor: '#000'
}

const cSharp = Object.assign({ top: '80%' }, blackKey)
const dSharp = Object.assign({ top: '65.5%' }, blackKey)
const fSharp = Object.assign({ top: '37.5%' }, blackKey)
const gSharp = Object.assign({ top: '23%' }, blackKey)
const aSharp = Object.assign({ top: '8.5%' }, blackKey)

export default props =>
  <div style={container}>
    <div style={octave}>
      <div style={whiteKey} >B</div>

      <div style={aSharp} >A#</div>

      <div style={whiteKey} >A</div>

      <div style={gSharp} >G#</div>

      <div style={whiteKey} >G</div>

      <div style={fSharp} >F#</div>

      <div style={whiteKey} >F</div>
      <div style={spacer} />

      <div style={whiteKey} >E</div>

      <div style={dSharp} >D#</div>

      <div style={whiteKey}>D</div>

      <div style={cSharp}>C#</div>

      <div style={whiteKey}>C</div>
    </div>
  </div>

