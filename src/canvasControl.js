let renderingSettings;
let curves;
let currCurve;

let canvasScreen;
let canvasContext;

export function inicio() {
    setupVisual({
        showCurves: true,
        showPoints: true,
        showControlPolygons: true,
        curvesEvaluation: 200,
        appearance: {
            curves: {
                color: '#009DFF',
                thickness: 4
            },
            controlPoints: {
                color: '#004F80',
                thickness: 10
            },
            controlPolygons: {
                color: '#73828C',
                thickness: 2
            }
        }
    });
    canvasScreen = document.getElementById('canvas-panel');
    canvasScreen.width = window.innerWidth * 0.6
    canvasContext = canvasScreen.getContext('2d');
    curves = [];
    selectCurve(null);
};

function setupVisual(standardRenderingSettings) {
    renderingSettings = standardRenderingSettings;

    const curvesEvaluation = document.getElementById('number-evaluation-curves');
    const showCurves = document.getElementById('show-curves');
    const showPoints = document.getElementById('show-points');
    const showEdges = document.getElementById('show-edges');

    curvesEvaluation.value = renderingSettings.curvesEvaluation;
    showCurves.checked = renderingSettings.showCurves;
    showPoints.checked = renderingSettings.showPoints;
    showEdges.checked = renderingSettings.showControlPolygons;
}

export function canvasClicked(event, action, setAction) {
    const clickCoordinates = getClickPosition(event);
    if (action === "chose-slope") {
        const curve = getCurve(clickCoordinates);
        selectCurve(curve);
    }
    if (action === "add-slope") {
        const curve = {
            controlPoints: [clickCoordinates]
        };
        curves.push(curve);
        selectCurve(curve);
        setAction("new-points");
    }
    if (action === "new-points") {
        currCurve === null || currCurve === void 0 ? void 0 : currCurve.controlPoints.push(clickCoordinates);
    }
    if (action === "exclude-points") {
        const selectedControlPoint = getControlPoint(clickCoordinates);
        currCurve.controlPoints = currCurve.controlPoints.filter(controlPoint => controlPoint !== selectedControlPoint);
        if (currCurve.controlPoints.length === 0) {
            curves = curves.filter(curve => curve !== currCurve);
            selectCurve(null);
            if (curves.length > 0) {
                setAction("chose-slope");
            }
            else {
                setAction("add-slope");
            }
        }
    }
    renderFigure();
}

function getClickPosition(event) {
    return {
        x: event.clientX - canvasScreen.getBoundingClientRect().left,
        y: event.clientY - canvasScreen.getBoundingClientRect().top
    };
}

function getCurve(selectedPoint) {
    return curves.find(curve => {
        return curve.curvePoints.find(point => {
            const vector = {
                x: (selectedPoint.x - point.x),
                y: (selectedPoint.y - point.y)
            };
            if ((Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2))) <= renderingSettings.appearance.curves.thickness) {
                return true;
            }
            return false;
        });
    });
}

export function selectCurve(curve) {
    const controllerButtons = document.querySelector('#control-points-controller .controller-buttons');
    if (curve) {
        currCurve = curve;
        controllerButtons.classList.remove('hidden-element');
    }
    else {
        currCurve = null;
        controllerButtons.classList.add('hidden-element');
    }
}

export function canvasMousedDown(event, action) {
    if (action === "move-points") {
        const clickCoordinates = getClickPosition(event);
        let selectedControlPoint = getControlPoint(clickCoordinates);
        if (selectedControlPoint) {
            let isFrameRendering = false;
            let optimizedrenderFigure = function () {
                if (isFrameRendering) {
                    return;
                }
                isFrameRendering = true;
                requestAnimationFrame(function () {
                    renderFigure();
                    isFrameRendering = false;
                });
            };
            let mouseUpped = () => {
                canvasScreen.removeEventListener('mouseup', mouseUpped);
                canvasScreen.removeEventListener('mousemove', mouseMoved);
                renderFigure();
            };
            let mouseMoved = (mouseMoveEvent) => {
                const draggingCoordinates = getClickPosition(mouseMoveEvent);
                selectedControlPoint.x = draggingCoordinates.x;
                selectedControlPoint.y = draggingCoordinates.y;
                optimizedrenderFigure();
            };
            canvasScreen.addEventListener('mouseup', mouseUpped);
            canvasScreen.addEventListener('mousemove', mouseMoved);
        }
    }
}

function getControlPoint(selectedPoint) {
    return currCurve.controlPoints.find(point => {
        const vector = {
            x: (selectedPoint.x - point.x),
            y: (selectedPoint.y - point.y)
        };
        if ((Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2))) <= renderingSettings.appearance.controlPoints.thickness) {
            return true;
        }
        return false;
    });
}

export function renderFigure() {
    canvasContext.clearRect(0, 0, canvasScreen.width, canvasScreen.height);
    curves.map((curve) => {
        if (renderingSettings.showControlPolygons) {
            genLines(curve.controlPoints, currCurve === curve ? renderingSettings.appearance.controlPolygons : {
                color: '#D5DADD',
                thickness: renderingSettings.appearance.controlPolygons.thickness
            });
        }
        if (renderingSettings.showCurves) {
            genCurve(curve, currCurve === curve ? renderingSettings.appearance.curves : {
                color: '#D5DADD',
                thickness: renderingSettings.appearance.curves.thickness
            });
        }
        if (renderingSettings.showPoints) {
            curve.controlPoints.map(controlPoint => {
                genPoint(controlPoint, currCurve === curve ? renderingSettings.appearance.controlPoints : {
                    color: '#D5DADD',
                    thickness: renderingSettings.appearance.controlPoints.thickness
                });
            })
        }
    })
}

function genPoint(point, appearance) {
    canvasContext.strokeStyle = appearance.color;
    canvasContext.fillStyle = appearance.color;
    canvasContext.beginPath();
    canvasContext.arc(point.x, point.y, (appearance.thickness / 2), 0, 2 * Math.PI, true);
    canvasContext.fill();
}

function genLines(points, appearance) {
    if (!points && points.length < 2) {
        return;
    }

    for (const [startPoint, endPoint] of genIteratorList(points)) {
        canvasContext.lineWidth = appearance.thickness;
        canvasContext.strokeStyle = appearance.color;
        canvasContext.beginPath();
        canvasContext.moveTo(startPoint.x, startPoint.y);
        canvasContext.lineTo(endPoint.x, endPoint.y);
        canvasContext.stroke();
    }
}

function genIteratorList(points) {
    const iterator = points[Symbol.iterator]();
    let currentResult = iterator.next();
    let nextResult = iterator.next();
    let iterList = [];
    while (!nextResult.done) {
        iterList.push([currentResult.value, nextResult.value]);
        currentResult = nextResult;
        nextResult = iterator.next();
    }
    return iterList
}

function genCurve(curve, appearance) {
    const curvePoints = [];
    for (let evaluationsPerformed = 0; evaluationsPerformed <= renderingSettings.curvesEvaluation; evaluationsPerformed++) {
        curvePoints.push(calculateCasteljau(curve.controlPoints, evaluationsPerformed));
    }
    curve.curvePoints = curvePoints;
    genLines(curvePoints, appearance);
}

export function curvesEvaluationChanged(event) {
    if (event.target.value > 0) {
        renderingSettings.curvesEvaluation = event.target.value;
    }
    else {
        renderingSettings.curvesEvaluation = 200;
        event.target.value = renderingSettings.curvesEvaluation;
    }
    renderFigure();
}

export function showCurvesChanged(event) {
    renderingSettings.showCurves = event.target.checked;
    renderFigure();
}

export function showPointsChanged(event) {
    renderingSettings.showPoints = event.target.checked;
    renderFigure();
}

export function showEdgesChanged(event) {
    renderingSettings.showControlPolygons = event.target.checked;
    renderFigure();
}

function calculateCasteljau(controlPoints, currentEvaluation) {
    if (controlPoints && controlPoints.length === 1) {
        return controlPoints[0];
    }
    const points = [];
    for (const [startPoint, endPoint] of genIteratorList(controlPoints)) {
        const currentEvaluationRatio = currentEvaluation / renderingSettings.curvesEvaluation;
        const point = {
            x: (startPoint.x * (1 - currentEvaluationRatio)) + (endPoint.x * currentEvaluationRatio),
            y: (startPoint.y * (1 - currentEvaluationRatio)) + (endPoint.y * currentEvaluationRatio)
        };
        points.push(point);
    }
    return calculateCasteljau(points, currentEvaluation);
}

export function excludeCurve(setCurrAction) {
    curves = curves.filter(curve => curve !== currCurve);
    selectCurve(null);
    if (curves.length > 0) {
        setCurrAction("chose-slope");
    }
    else {
        setCurrAction("add-slope");
    }
    renderFigure();
}