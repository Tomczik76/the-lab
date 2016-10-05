import React, { PropTypes } from 'react'
import { Observable } from 'rxjs/Rx';

const styles = {
  position: 'absolute',
  backgroundColor: '#808080',
  padding: '0 5px 5px 5px',
  borderColor: 'black',
  borderWidth: '2px',
  borderStyle: 'solid',
  borderRadius: '5px'
}

const titleBar = {
  width: '100%',
  padding: '5px 0',
  fontWeight: 'bold',
  textAlign: 'center',
  textShadow: '2px 2px #616161'
}

const onMouseDown = (evt, onMove) => {
  const x = evt.clientX - evt.target.parentElement.offsetLeft
  const y = evt.clientY - evt.target.parentElement.offsetTop
  Observable.fromEvent(document, 'mousemove')
    .takeUntil(Observable.fromEvent(document, 'mouseup'))
    .subscribe(e => {
      onMove(e.clientX - x, e.clientY - y)
    })
}

const DragPanel = ({ title, x, y, children, onMove }) =>
  <div style={Object.assign({}, styles, { left: x, top: y })}>
    <div style={titleBar} onMouseDown={e => onMouseDown(e, onMove)}>
      {title}
    </div>
    {children}
  </div>

DragPanel.propTypes = {
  title: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  children: PropTypes.instanceOf(Array),
  onMove: PropTypes.func
}

export default DragPanel