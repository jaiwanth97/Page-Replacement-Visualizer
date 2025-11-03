// Global simulation state shared across modules
window.SimState = {
    canvas: null,
    ctx: null,
    simulationData: null,
    currentStep: 0,
    isPlaying: false,
    animationInterval: null,
    animationSpeed: 1000,
    allowAutoScroll: false
};

document.addEventListener('DOMContentLoaded', () => {
    const state = window.SimState;
    state.canvas = document.getElementById('visualizationCanvas');
    state.ctx = state.canvas.getContext('2d');

    Animation.resizeCanvas(state);
    window.addEventListener('resize', () => Animation.resizeCanvas(state));

    UI.attachEventListeners(state);
    Animation.drawInitialState(state);
    UI.updateAlgorithmInfo();
});


