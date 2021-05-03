import React, { useEffect, useState } from 'react';
import './styles.css';
import {inicio, 
    canvasClicked, 
    canvasMousedDown,
    renderFigure,
    selectCurve,
    excludeCurve, 
    curvesEvaluationChanged,
    showCurvesChanged,
    showEdgesChanged,
    showPointsChanged } from './canvasControl';
import Control from './Control';

function App() {
    const [currAction, setCurrAction] = useState<string>("add-slope");
    useEffect(() => {
        if (currAction === "chose-slope") {
            selectCurve(null);
            renderFigure();
        }
        if (currAction === "exclude-slope") {
            excludeCurve((param:string)=>setCurrAction(param))
        }

        for (const button of Array.from(document.querySelectorAll('.controller-button'))) {
            button.classList.remove('selected');
        }

        const selectedButton = document.getElementById(currAction);
        selectedButton?.classList.add('selected');
    }, [currAction])
    function loadPage(){
        setCurrAction("add-slope"); 
        inicio()
    }
    return (
        <div id="app" className="flex">
            <canvas id="canvas-panel"
                onClick={(e) => canvasClicked(e,currAction,(param:string)=>setCurrAction(param))}
                onMouseDown={(e) => canvasMousedDown(e,currAction)} height={window.innerHeight}
            >
            </canvas>
            <Control
                onLoad={() => loadPage()}
                newCurve={() => setCurrAction("add-slope")}
                selectCurve={() => setCurrAction("chose-slope")}
                deleteCurve={() => setCurrAction("exclude-slope")}
                addPoint={() => setCurrAction("new-points")}
                movePoint={() => setCurrAction("move-points")}
                deletePoint={() => setCurrAction("exclude-points")}
                onCurvesEvaluationChange={(e:any)=>showCurvesChanged(e)}
                onShowCurvesChange={(e:any)=>showCurvesChanged(e)}
                onShowEdgesChange={(e:any)=>showEdgesChanged(e)}
                onShowPointsChange={(e:any)=>showPointsChanged(e)}
            />
        </div>
    );
}

export default App;
