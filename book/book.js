let mainCanvas, mainContext;
let cursorPosition = {x: -100, y: -100};
let closestCorner, currentState;
let lastFrameTime;
"use strict";

let currentAnimationProgress = 0
let animationDuration = 300

let counter = 0
const InteractionStates = {
  MousingAround: counter++,
  Hovering:      counter++,
  ClickedDown:   counter++,
  Released:      counter++,
  Length:        counter,
}
counter = 0


window.onload = _ => {
  
  currentState = InteractionStates.MousingAround;
  lastFrameTime = +(new Date())

  mainCanvas = document.getElementById('main-canvas');
  fixDpi(mainCanvas);
  mainContext = mainCanvas.getContext('2d');
  
  requestAnimationFrame(draw)
 
}

document.addEventListener("mousemove", event => {
  cursorPosition = normalizePosition(mainCanvas, { x: event.clientX, y: event.clientY });
})

// TODO maybe prevent state switching while state is "released"
document.addEventListener("mousedown", _ => {
  currentState = InteractionStates.ClickedDown
})

document.addEventListener("mouseup", _ => {
    currentState = InteractionStates.MousingAround
})


function fixDpi(canvas) {
  const dpi = window.devicePixelRatio;
  canvas.setAttribute("width", canvas.clientWidth * dpi)
  canvas.setAttribute("height", canvas.clientHeight * dpi)
}

window.onresize = _ => {
  fixDpi(mainCanvas)
}

// returns the coordinates of an absolute document position normalized
// to be relative to a given DOM el's position
function normalizePosition(domEl, pos) {
  let rect = domEl.getBoundingClientRect()
  return {
    x: pos.x - rect.left,
    y: pos.y - rect.top
  }
}

function draw() {
  const { width, height } = mainCanvas;
  mainContext.clearRect(0, 0, width, height) // empty current canvas

  
  let drawPoint = (pos, color) => {
    mainContext.fillStyle=color;
    mainContext.fillRect( pos.x - cursor.width / 2, pos.y - cursor.height / 2, cursor.width, cursor.height)
  }
  
  const bookRect = {x: width / 4, y: height / 4, width: width/2, height: height/2}

  let currentFrameTime = +(new Date())

    
  // draw cursor
  const cursor = { width: 10, height: 10, color: "white"}
  drawPoint(cursorPosition, cursor.color)

  // advance to next frame
  lastFrameTime = currentFrameTime
  requestAnimationFrame(draw)
}


