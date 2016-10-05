import React, { PropTypes } from 'react'
import { Observable } from '@reactivex/rxjs'

const styles = {
  position: 'absolute',
  backgroundColor: '#d4d4d4',
  padding: '0 5px 5px 5px',
  borderColor: 'black',
  borderWidth: '2px',
  borderStyle: 'solid',
  borderRadius: '5px',
  boxShadow: 'rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.188235) 0px 6px 20px 0px'
}

const titleBar = {
  width: '100%',
  padding: '5px 0',
  fontWeight: 'bold',
  textAlign: 'center',
  textShadow: 'rgb(179, 178, 178) 1px 2px 1px',
  cursor: 'move'
}

const onMouseDown = (evt, onMove) => {
  const x = evt.clientX - evt.target.parentElement.offsetLeft
  const y = evt.clientY - evt.target.parentElement.offsetTop
  Observable.fromEvent(document, 'mousemove')
    .takeUntil(Observable.fromEvent(document, 'mouseup'))
    .subscribe(e => onMove(e.clientX - x, e.clientY - y))
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