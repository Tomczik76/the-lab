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

export default ({ number }) =>
  <div style={container}>
    <div style={octave}>
      <div style={whiteKey} >B {number}</div>
      <div style={aSharp} >A# {number}</div>
      <div style={whiteKey} >A {number}</div>
      <div style={gSharp} >G# {number}</div>
      <div style={whiteKey} >G {number}</div>
      <div style={fSharp} >F# {number}</div>
      <div style={whiteKey} >F {number}</div>
      <div style={spacer} />
      <div style={whiteKey} >E {number}</div>
      <div style={dSharp} >D# {number}</div>
      <div style={whiteKey}>D {number}</div>
      <div style={cSharp}>C# {number}</div>
      <div style={whiteKey}>C {number}</div>
      <div style={spacer} />
    </div>
  </div>

