import React, { useEffect } from 'react';

interface IControlProps {
    onLoad: Function
    newCurve: Function;
    selectCurve: Function;
    deleteCurve: Function;
    addPoint: Function;
    movePoint: Function;
    deletePoint: Function;
    onCurvesEvaluationChange: Function;
    onShowPointsChange: Function;
    onShowEdgesChange: Function;
    onShowCurvesChange: Function;
}

const Control = (props: IControlProps) => {
    useEffect(() => {
        props.onLoad()
    }, [])
    return (
        <div id="control-panel">
            <div className="controllers-container">
                <div className="controller" id="curves-controller">
                    <div className="controller-buttons">
                        <button className="controller-button flex" id="add-slope"
                            onClick={() => props.newCurve()}>
                            <h3>Criar curva</h3>
                        </button>
                        <button className="controller-button flex" id="chose-slope"
                            onClick={() => props.selectCurve()}>
                            <h3>Selecionar curva</h3>
                        </button>
                    </div>
                </div>
                <div className="controller" id="control-points-controller">
                    <h2 className="controller-title">Edição das curvas</h2>
                    <div className="controller-buttons">
                        <button className="controller-button flex" id="new-points"
                            onClick={() => props.addPoint()}>
                            <h3>Adicionar pontos na curva</h3>
                        </button>
                        <button className="controller-button flex" id="move-points"
                            onClick={() => props.movePoint()}>
                            <h3>Mover pontos da curva</h3>
                        </button>
                        <button className="controller-button flex" id="exclude-points"
                            onClick={() => props.deletePoint()}>
                            <h3>Remover pontos da curva</h3>
                        </button>
                        <button className="controller-button danger-controller-button flex" id="exclude-slope"
                            onClick={() => props.deleteCurve()}>
                            <h3>Apagar curva</h3>
                        </button>
                    </div>
                </div>
                <div className="controller" id="visualization-controller">
                    <div className="element-appearance-controller">
                        <div className="appearance-controller-container flex">
                            <h3>Número de avaliações</h3>
                            <input id="number-evaluation-curves" required type="number" min="1"
                            onChange={(e)=>props.onCurvesEvaluationChange(e)}></input>
                        </div>
                    </div>
                    <div className="element-appearance-controller">
                        <div className="appearance-controller-container flex">
                            <h4>Curvas</h4>
                            <input type="checkbox" id="show-curves"
                            onChange={(e)=>props.onShowCurvesChange(e)}></input>
                        </div>
                        <div className="appearance-controller-container flex">
                            <h4>Pontos</h4>
                            <input type="checkbox" id="show-points"
                            onChange={(e)=>props.onShowPointsChange(e)}></input>
                        </div>
                        <div className="appearance-controller-container flex">
                            <h4>Arestas</h4>
                            <input type="checkbox" id="show-edges"
                            onChange={(e)=>props.onShowEdgesChange(e)}></input>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Control;