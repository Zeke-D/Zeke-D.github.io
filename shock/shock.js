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
  cursorPosition.x = event.clientX;
  cursorPosition.y = event.clientY;

  let center = {x: mainCanvas.clientWidth / 2, y: mainCanvas.clientHeight / 2};
  const isInRange = length(sub(normalizePosition(mainCanvas, cursorPosition), closestCorner)) <= 150
                 && dot(sub(center, closestCorner), sub(cursorPosition, closestCorner)) > 0

  if (currentState === InteractionStates.MousingAround && isInRange) {
    currentState = InteractionStates.Hovering
  }
  else if (currentState === InteractionStates.Hovering && !isInRange) {
    currentState = InteractionStates.MousingAround
  }
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

function setClosestCorner(cursorPos, corners) {
    closestCorner = corners[0]
    for (let corner of corners) {
      if (length(sub(corner, cursorPos)) < length(sub(closestCorner, cursorPos))) {
        closestCorner = corner;
      }
    }
}

function draw() {
  const {width, height} = mainCanvas;
  mainContext.clearRect(0, 0, width, height)
  mainContext.fillStyle = 'orange';
  const bookRect = {x: width / 4, y: height / 4, width: width/2, height: height/2}
  mainContext.fillRect(bookRect.x, bookRect.y, bookRect.width, bookRect.height);

  // draw cursor
  const cursorPos = normalizePosition(mainCanvas, cursorPosition);
  const cursor = { width: 10, height: 10, color: "white"}

  let drawPoint = (pos, color) => {
    mainContext.fillStyle=color;
    mainContext.fillRect(
      pos.x - cursor.width / 2,
      pos.y - cursor.height / 2,
      cursor.width,
      cursor.height)
  }
  const corners = getCornersOfRect(bookRect)
  // only grabbable corners are top-left / bottom right
  const grabbableCorners = [corners[0], corners[corners.length - 1]]
  
  // find the closest corner
  if (!closestCorner || 
    currentState === InteractionStates.MousingAround && currentAnimationProgress <= 0) {
    setClosestCorner(cursorPos, grabbableCorners)
  }
  
  let currentFrameTime = +(new Date())
  let prog = (currentAnimationProgress / animationDuration)
  let foldPos = add(closestCorner, mul(sub(cursorPos, closestCorner), Math.max(.01, Math.min(prog, .99))))
  let cornerToCursor = sub(foldPos, closestCorner)
  // animate
  if (currentState === InteractionStates.Hovering && currentAnimationProgress < animationDuration) {
    currentAnimationProgress += currentFrameTime - lastFrameTime
  }
  else if (currentState === InteractionStates.MousingAround && currentAnimationProgress > 0) {
    currentAnimationProgress -= currentFrameTime - lastFrameTime
  }
  
  
  let halfwayPoint = add(closestCorner, mul(cornerToCursor, .5));

  // find orthogonal vector
  let orthogVec = norm({x: cornerToCursor.y, y: -cornerToCursor.x})
  let halfwayLine = { origin: halfwayPoint, basis: orthogVec}

  let wrapInd = (ind, len) => (len + ind % len) % len
  let closestInd = corners.findIndex(corner => corner.x === closestCorner.x && corner.y === closestCorner.y) 
  let degree1Corners = [ // corners with 1 degree of separation from closest corner
    corners[wrapInd(closestInd - 1, corners.length)],
    corners[wrapInd(closestInd + 1, corners.length)]
  ]
  let degree1Intersections = degree1Corners
    .map(corner => {
      return {
        corner: corner,
        intersectionPoint: calculateIntersection(
          halfwayLine.origin, add(halfwayLine.origin, halfwayLine.basis),
          closestCorner, corner)
      }
    })
    .filter(cornerInter => {
      return cornerInter.intersectionPoint 
    })
    .map(cornerInter => {
      let point = cornerInter.intersectionPoint
      if (!isAlongSegment(point, cornerInter.corner, closestCorner)) {
        point = cornerInter.corner
      }
      return point;
    })
  
  let finalPathCorners = corners;
  if (
  currentState === InteractionStates.MousingAround && currentAnimationProgress > 0 || 
  [InteractionStates.ClickedDown, InteractionStates.Hovering].includes(currentState)) {
    if (degree1Intersections.length == 2) {
      finalPathCorners = [
        ...corners.slice(0, closestInd),
        ...degree1Intersections,
        ...corners.slice(closestInd + 1)
      ];
    }
  }
  // draw paper shape
  let paper = new Path2D();
  paper.moveTo(finalPathCorners[0].x, finalPathCorners[0].y)
  for (let corner of finalPathCorners.slice(1)) {
    paper.lineTo(corner.x, corner.y)
  }
  paper.closePath()
  mainContext.fillStyle="#e5e4b9";
  mainContext.fill(paper)
  
  // draw folded corner shape
  if (
  currentState === InteractionStates.MousingAround && currentAnimationProgress > 0 || 
  [InteractionStates.ClickedDown, InteractionStates.Hovering].includes(currentState)) {
    let fold = new Path2D();
    fold.moveTo(foldPos.x, foldPos.y);
    for (let {x, y} of degree1Intersections) {
      fold.lineTo(x, y)
    }
    fold.closePath()
    mainContext.fillStyle="#666548";
    mainContext.fill(fold)
  }
  
  drawPoint(cursorPos, cursor.color)

  // advance to next frame
  lastFrameTime = currentFrameTime
  requestAnimationFrame(draw)
}

function isAlongSegment(point, start, end) {
  const epsilon = 1e-10;
  if (Math.abs(dot(norm(sub(point, start)), norm(sub(end, start)))) < 1 - epsilon) {
    return false;
  }
  // help found here:
  // https://lucidar.me/en/mathematics/check-if-a-point-belongs-on-a-line-segment
  let K_start_point = dot(sub(end, start), sub(point, start))
  let K_start_end = dot(sub(end, start), sub(end, start))
  return 0 <= K_start_point && K_start_point <= K_start_end;
}

function calculateIntersection(p1, p2, p3, p4) {
    // modified from https://dirask.com/posts/JavaScript-calculate-intersection-point-of-two-lines-for-given-4-points-VjvnAj
    var c2x = p3.x - p4.x; // (x3 - x4)
  	var c3x = p1.x - p2.x; // (x1 - x2)
  	var c2y = p3.y - p4.y; // (y3 - y4)
  	var c3y = p1.y - p2.y; // (y1 - y2)
  
  	// down part of intersection point formula
  	var d  = c3x * c2y - c3y * c2x;
  
    // the lines are parallel, intersection doesnt make sense
    const epsilon = 1e-10;
  	if (Math.abs(d) <= epsilon) {
      return undefined;
    }
  
  	// upper part of intersection point formula
  	var u1 = p1.x * p2.y - p1.y * p2.x; // (x1 * y2 - y1 * x2)
  	var u4 = p3.x * p4.y - p3.y * p4.x; // (x3 * y4 - y3 * x4)
  
  	// intersection point formula
  	var px = (u1 * c2x - c3x * u4) / d;
  	var py = (u1 * c2y - c3y * u4) / d;

  	var p = { x: px, y: py };
  
  	return p;
}

function intersectionOf(lineA, lineB) {
  let eps = 1e-10
  // if they are parallel, there is no intersection point
  if (dot(lineA.basis, lineB.basis) > 1 - eps ) {
    return undefined
  }

  // my math is probably wrong, let's find out
  let ux_over_uy = lineB.basis.x / lineB.basis.y
  let t = (lineB.origin.x + ux_over_uy*(lineA.origin.y - lineB.origin.y)) 
        / (lineA.basis.x - ux_over_uy*lineA.basis.y);
  return add(lineA.origin, mul(lineA.basis, t))
}

// returns 2D dot product
function dot(vecA, vecB) {
  return vecA.x * vecB.x + vecA.y * vecB.y
}

function norm(vecA) {
  return mul(vecA, 1 / length(vecA))
}

function length(vec) {
  return Math.sqrt(dot(vec, vec))
}

function add(vecA, vecB) {
  return {x: vecA.x + vecB.x, y: vecA.y + vecB.y}
}

function sub(vecA, vecB) {
  return add(vecA, mul(vecB, -1))
}

function mul(vec, scalar) {
  return {x: vec.x * scalar, y: vec.y * scalar}
}

// returns array of positions of top-left to bottom-right corners of given rect
// as a path
function getCornersOfRect(rect) {
  return [
    {x: rect.x, y: rect.y},
    {x: rect.x + rect.width, y: rect.y},
    {x: rect.x + rect.width, y: rect.y + rect.height},
    {x: rect.x, y: rect.y + rect.height},
  ]
}
