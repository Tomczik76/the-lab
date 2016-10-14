import React, { PropTypes } from 'react'
import './OctaveKeys.css'

const OctaveKeys = ({ number }) =>
  <div className="octave-keys">
    <div className="octave-keys-octave">
      <div className="octave-keys-white-key" >B {number}</div>
      <div className="octave-keys-black-key octave-keys-a-sharp">A# {number}</div>
      <div className="octave-keys-white-key" >A {number}</div>
      <div className="octave-keys-black-key octave-keys-g-sharp" >G# {number}</div>
      <div className="octave-keys-white-key" >G {number}</div>
      <div className="octave-keys-black-key octave-keys-f-sharp" >F# {number}</div>
      <div className="octave-keys-white-key" >F {number}</div>
      <div className="octave-keys-spacer" />
      <div className="octave-keys-white-key" >E {number}</div>
      <div className="octave-keys-black-key octave-keys-d-sharp" >D# {number}</div>
      <div className="octave-keys-white-key">D {number}</div>
      <div className="octave-keys-black-key octave-keys-c-sharp">C# {number}</div>
      <div className="octave-keys-white-key">C {number}</div>
      <div className="octave-keys-spacer" />
    </div>
  </div>

OctaveKeys.propTypes = {
  number: PropTypes.number.isRequired
}

export default OctaveKeys
