// Canvas drawing and sizing logic
window.Animation = (function(){
    function resizeCanvas(state) {
        const container = state.canvas.parentElement;
        state.canvas.width = container.clientWidth - 40;
        state.canvas.height = 500;
        if (state.simulationData) {
            drawStep(state, state.currentStep);
        } else {
            drawInitialState(state);
        }
    }

    function drawInitialState(state) {
        const ctx = state.ctx;
        ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);
        ctx.fillStyle = THEME.brand;
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Initialize Simulation to Begin', state.canvas.width / 2, state.canvas.height / 2);
        ctx.font = '16px Arial';
        ctx.fillStyle = '#666';
        ctx.fillText('Configure parameters and click "Initialize Simulation"', state.canvas.width / 2, state.canvas.height / 2 + 40);
    }

    function drawStep(state, stepIndex) {
        if (!state.simulationData || stepIndex >= state.simulationData.steps.length) return;
        const step = state.simulationData.steps[stepIndex];
        const ctx = state.ctx;
        ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);

        const frameWidth = 100;
        const frameHeight = 80;
        const frameSpacing = 20;
        const startX = 50;
        const startY = 200; // aligned with user's update

        // Title
        ctx.fillStyle = THEME.text;
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Step ${stepIndex}: ${step.message}`, 20, 40);

        // Current page
        if (step.page !== null) {
            ctx.fillStyle = step.isHit ? THEME.hit : THEME.fault;
            ctx.font = 'bold 18px Arial';
            ctx.fillText(`Current Page Reference: ${step.page}`, 20, 80);
            ctx.font = 'bold 16px Arial';
            ctx.fillText(`Action: ${step.action}`, 20, 110);
        }

        // Frames
        ctx.font = 'bold 14px Arial';
        ctx.fillStyle = THEME.text;
        ctx.fillText('Memory Frames:', startX, startY - 30);
        for (let i = 0; i < state.simulationData.numFrames; i++) {
            const x = startX + i * (frameWidth + frameSpacing);
            const y = startY;
            let frameColor = '#e9e2d9';
            let textColor = '#8c8c8c';
            if (i < step.frames.length) {
                const pageInFrame = step.frames[i];
                if (step.page === pageInFrame) {
                    frameColor = step.isHit ? THEME.hit : THEME.brand;
                    textColor = 'white';
                } else if (step.replacedPage === pageInFrame && step.prevFrames && step.prevFrames.includes(pageInFrame)) {
                    frameColor = THEME.replace;
                    textColor = 'white';
                } else {
                    frameColor = '#64748b';
                    textColor = 'white';
                }
            }
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 3;
            ctx.fillStyle = frameColor;
            ctx.fillRect(x, y, frameWidth, frameHeight);
            ctx.strokeRect(x, y, frameWidth, frameHeight);
            ctx.fillStyle = '#666';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`Frame ${i}`, x + frameWidth / 2, y - 10);
            if (i < step.frames.length) {
                ctx.fillStyle = textColor;
                ctx.font = 'bold 32px Arial';
                ctx.fillText(step.frames[i].toString(), x + frameWidth / 2, y + frameHeight / 2 + 12);
            } else {
                ctx.fillStyle = textColor;
                ctx.font = 'bold 20px Arial';
                ctx.fillText('EMPTY', x + frameWidth / 2, y + frameHeight / 2 + 8);
            }
        }

        // Stats summary in-canvas
        const statsY = startY + frameHeight + 80;
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = THEME.text;
        ctx.textAlign = 'left';
        ctx.fillText(`Page Faults: ${step.pageFaults}`, startX, statsY);
        ctx.fillText(`Page Hits: ${step.pageHits}`, startX + 200, statsY);
        const hitRatio = step.pageHits + step.pageFaults > 0 ? ((step.pageHits / (step.pageHits + step.pageFaults)) * 100).toFixed(2) : 0;
        ctx.fillText(`Hit Ratio: ${hitRatio}%`, startX + 380, statsY);

        // Replacement indicator overlay
        if (stepIndex > 0 && step.replacedPage !== null) {
            ctx.fillStyle = 'rgba(245, 158, 11, 0.20)';
            ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);
            ctx.fillStyle = THEME.fault;
            ctx.font = 'bold 18px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`⚠️ Page ${step.replacedPage} was replaced by Page ${step.page}`, state.canvas.width / 2, statsY + 50);
        }
    }

    return { resizeCanvas, drawInitialState, drawStep };
})();


