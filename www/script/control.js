var usersocket = io ()

let initRotation = {
  x: 0,
  y: 0,
  z: 0,
}
let enableMouseMove = true;
let rotation = { x: 0, y: 0, z: 0 }

document.querySelector('#permission-btn').addEventListener('click', (event) => {
  window.DeviceOrientationEvent.requestPermission()
  enableMouseMove = true
})
document.querySelector('#stop-btn').addEventListener('click', (event) => {
  enableMouseMove = false
})
document.querySelector('#correct-btn').addEventListener('click', (event) => {
  initRotation = rotation
})
document.querySelector('#input-field').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    if (event.target.value) {
      // 发送内容
      usersocket.emit('control', {
        type: 'typeString',
        payload: {
          value: event.target.value
        }
      })
      event.target.value = ''
    } else {
      // 发送回车键
      usersocket.emit('control', {
        type: 'keyTap',
        payload: {
          key: 'enter'
        }
      })
    }
  } else if (event.key === 'Backspace' && !event.target.value) {
    usersocket.emit('control', {
      type: 'keyTap',
      payload: {
        key: 'backspace'
      }
    })
  }
})

let startPos = null

document.querySelector('.touch-vertical-scrollbar').addEventListener('touchmove', (event) => {
  if (!startPos) {
    startPos = {
      x: event.changedTouches[0].screenX,
      y: event.changedTouches[0].screenY
    }
    return
  }
  let dy = event.changedTouches[0].screenY - startPos.y
  usersocket.emit('control', {
    type: 'scrollMouse',
    payload: {
      x: 0,
      y: dy
    }
  })

  startPos = {
    x: event.changedTouches[0].screenX,
    y: event.changedTouches[0].screenY
  }
})

document.querySelector('.touch-vertical-scrollbar').addEventListener('touchmove', (event) => {
  if (!startPos) {
    startPos = {
      x: event.changedTouches[0].screenX,
      y: event.changedTouches[0].screenY
    }
    return
  }
  let dx = event.changedTouches[0].screenX - startPos.x
  usersocket.emit('control', {
    type: 'scrollMouse',
    payload: {
      x: dx,
      y: 0
    }
  })

  startPos = {
    x: event.changedTouches[0].screenX,
    y: event.changedTouches[0].screenY
  }
})

document.addEventListener('touchend', () => {
  startPos = null
})

document.querySelector('.touch-pad').addEventListener('touchstart', (event) => {
  if (event.touches.length === 2) {
    usersocket.emit('control', {
      type: 'mouseClick',
      payload: {
        button: 'right',
        double: false
      }
    })
    return;
  }
  usersocket.emit('control', {
    type: 'mouseToggle',
    payload: {
      down: 'down',
      button: 'left'
    }
  })
})
document.querySelector('.touch-pad').addEventListener('touchend', (event) => {
  usersocket.emit('control', {
    type: 'mouseToggle',
    payload: {
      down: 'up',
      button: 'left'
    }
  })
})

window.addEventListener('deviceorientation', function(evt){
  if (!enableMouseMove) return;
  rotation = { x: evt.beta, y: evt.gamma, z: 360 - evt.alpha }
  // z 轴对应横向，x 轴对应竖向
  const x = (rotation.z + 360 - initRotation.z) % 360
  const y = rotation.x - initRotation.x

  document.getElementById("info").innerHTML = "z轴旋转 alpha: 　" + 360 - evt.alpha + "<br>"
        + "y轴旋转 gamma: 　" + evt.gamma + "<br>"
        + "x轴旋转 beta: 　" + evt.beta + `<br>`
        + `x: ${Math.round(x)}, y: ${Math.round(y)} <br>`
  usersocket.emit('control', {
    type: 'moveMouse',
    payload: { x, y }
  })
})


