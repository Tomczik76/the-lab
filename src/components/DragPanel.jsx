import React, { PropTypes } from 'react'
import { Observable } from '@reactivex/rxjs'

const styles = {
  position: 'absolute',
  backgroundColor: '#e8e8e8',
  padding: '0 0 0 7px',
  borderColor: 'black',
  borderWidth: '2px',
  borderStyle: 'solid',
  borderRadius: '5px',
  boxShadow: 'rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.188235) 0px 6px 20px 0px',
  display: 'flex'
}

const titleBar = {
  width: '100%',
  padding: '5px 0',
  fontWeight: 'bold',
  textAlign: 'center',
  textShadow: 'rgb(179, 178, 178) 1px 2px 1px',
  cursor: 'move'
}

const bottomDrag = {
  height: '7px',
  cursor: 'ns-resize'
}
const rightDrag = {
  width: '7px',
  cursor: 'ew-resize',
  flexGrow: 1
}

const bottomRightDrag = {
  width: '7px',
  height: '7px',
  cursor: 'nwse-resize'
}
const onDrag = (evt, move) => {
  const x = evt.clientX - evt.target.parentElement.parentElement.offsetLeft
  const y = evt.clientY - evt.target.parentElement.parentElement.offsetTop
  Observable.fromEvent(document, 'mousemove')
    .takeUntil(Observable.fromEvent(document, 'mouseup'))
    .subscribe(e => move(e.clientX - x, e.clientY - y))
}

const onResizePanel = (evt, orientation, height, width, resize) => {
  const x = evt.clientX
  const y = evt.clientY
  Observable.fromEvent(document, 'mousemove')
    .takeUntil(Observable.fromEvent(document, 'mouseup'))
    .subscribe(e =>
      resize(
        orientation === 'ns' ? width : width + (e.clientX - x),
        orientation === 'ew' ? height : height + (e.clientY - y)
      )
    )
}

const DragPanel = ({ title, x, y, children, width, height, onMove, onResize, innerBorder }) =>
  <div style={Object.assign({left: x, top: y }, styles)}>
    <div style={{ flexGrow: 1 }}>
      <div style={titleBar} onMouseDown={e => onDrag(e, onMove)}>
        {title}
      </div>
      <div
        style={
          Object.assign({ overflow: 'auto' },
          width ? { width: `${width}px` } : null,
          height ? { height: `${height}px` } : null,
          innerBorder ? { border: '1px solid' } : null)
        }
      >
        {children}
      </div>
      <div style={bottomDrag} onMouseDown={e => onResizePanel(e, 'ns', height, width, onResize)} />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={rightDrag} onMouseDown={e => onResizePanel(e, 'ew', height, width, onResize)} />
      <div style={bottomRightDrag} onMouseDown={e => onResizePanel(e, 'nwse', height, width, onResize)} />
    </div>
  </div>

DragPanel.propTypes = {
  title: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  children: PropTypes.instanceOf(Object),
  onMove: PropTypes.func,
  onResize: PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number,
  innerBorder: PropTypes.bool
}

export default DragPanel
