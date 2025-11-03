// UI bindings, timeline, stats and controls
window.UI = (function(){
    function attachEventListeners(state) {
        document.getElementById('initBtn').addEventListener('click', () => initializeSimulation(state));
        document.getElementById('playBtn').addEventListener('click', () => play(state));
        document.getElementById('pauseBtn').addEventListener('click', () => pause(state));
        document.getElementById('stepBackBtn').addEventListener('click', () => stepBackward(state));
        document.getElementById('stepForwardBtn').addEventListener('click', () => stepForward(state));
        document.getElementById('resetBtn').addEventListener('click', () => reset(state));
        document.getElementById('exportBtn').addEventListener('click', () => exportScreenshot(state));
        document.getElementById('animationSpeed').addEventListener('change', () => updateAnimationSpeed(state));
        document.getElementById('algorithm').addEventListener('change', updateAlgorithmInfo);
    }

    function initializeSimulation(state) {
        const algorithm = document.getElementById('algorithm').value;
        const numFrames = parseInt(document.getElementById('numFrames').value);
        const referenceStringInput = document.getElementById('referenceString').value;

        if (!referenceStringInput.trim()) { alert('Please enter a page reference string!'); return; }
        if (numFrames < 1 || numFrames > 10) { alert('Number of frames must be between 1 and 10!'); return; }

        const referenceString = referenceStringInput.split(',').map(s => s.trim()).filter(Boolean).map(Number);
        if (referenceString.length === 0 || referenceString.some(isNaN)) { alert('Invalid reference string format!'); return; }

        switch (algorithm) {
            case 'FIFO':
                state.simulationData = Algorithms.simulateFIFO(referenceString, numFrames);
                break;
            case 'LRU':
                state.simulationData = Algorithms.simulateLRU(referenceString, numFrames);
                break;
            case 'OPTIMAL':
                state.simulationData = Algorithms.simulateOptimal(referenceString, numFrames);
                break;
            case 'CLOCK':
                state.simulationData = Algorithms.simulateClock(referenceString, numFrames);
                break;
        }
        state.simulationData.algorithm = algorithm;
        state.simulationData.numFrames = numFrames;
        state.currentStep = 0;

        updateStatistics(state);
        updateAlgorithmInfo();
        buildTimeline(state);
        Animation.drawStep(state, 0);
        enableControls();
        updateCurrentStepInfo(state);
    }

    function play(state) {
        if (!state.simulationData) return;
        state.isPlaying = true;
        state.allowAutoScroll = true;
        document.getElementById('playBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = false;
        state.animationInterval = setInterval(() => {
            if (state.currentStep < state.simulationData.steps.length - 1) {
                state.currentStep++;
                Animation.drawStep(state, state.currentStep);
                updateStatistics(state);
                updateCurrentStepInfo(state);
                highlightTimelineStep(state, state.currentStep);
            } else {
                pause(state);
            }
        }, state.animationSpeed);
    }

    function pause(state) {
        state.isPlaying = false;
        state.allowAutoScroll = false;
        document.getElementById('playBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        if (state.animationInterval) {
            clearInterval(state.animationInterval);
            state.animationInterval = null;
        }
    }

    function stepForward(state) {
        if (!state.simulationData) return;
        if (state.currentStep < state.simulationData.steps.length - 1) {
            state.currentStep++;
            Animation.drawStep(state, state.currentStep);
            updateStatistics(state);
            updateCurrentStepInfo(state);
            highlightTimelineStep(state, state.currentStep);
        }
    }

    function stepBackward(state) {
        if (!state.simulationData) return;
        if (state.currentStep > 0) {
            state.currentStep--;
            Animation.drawStep(state, state.currentStep);
            updateStatistics(state);
            updateCurrentStepInfo(state);
            highlightTimelineStep(state, state.currentStep);
        }
    }

    function reset(state) {
        pause(state);
        state.currentStep = 0;
        if (state.simulationData) {
            Animation.drawStep(state, 0);
            updateStatistics(state);
            updateCurrentStepInfo(state);
            highlightTimelineStep(state, 0);
        }
    }

    function updateAnimationSpeed(state) {
        state.animationSpeed = parseInt(document.getElementById('animationSpeed').value);
        if (state.isPlaying) { pause(state); play(state); }
    }

    function updateStatistics(state) {
        if (!state.simulationData) return;
        const step = state.simulationData.steps[state.currentStep];
        document.getElementById('statAlgorithm').textContent = state.simulationData.algorithm;
        document.getElementById('statTotalRefs').textContent = state.simulationData.totalReferences;
        document.getElementById('statCurrentStep').textContent = `${state.currentStep} / ${state.simulationData.steps.length - 1}`;
        document.getElementById('statPageFaults').textContent = step.pageFaults;
        document.getElementById('statPageHits').textContent = step.pageHits;
        const total = step.pageFaults + step.pageHits;
        const hitRatio = total > 0 ? ((step.pageHits / total) * 100).toFixed(2) : 0;
        const faultRatio = total > 0 ? ((step.pageFaults / total) * 100).toFixed(2) : 0;
        document.getElementById('statHitRatio').textContent = `${hitRatio}%`;
        document.getElementById('statFaultRatio').textContent = `${faultRatio}%`;

        // Extra metrics
        const m = Metrics.compute(state);
        document.getElementById('statCompletionSteps').textContent = `${m.completedSteps}/${m.totalSteps}`;
        document.getElementById('statAvgStepMs').textContent = `${m.avgStepMs} ms`;
        document.getElementById('statETA').textContent = Metrics.formatMs(m.etaMs);
        document.getElementById('statEfficiency').textContent = `${Math.round(m.efficiency * 100)}%`;
    }

    function updateCurrentStepInfo(state) {
        if (!state.simulationData) return;
        const step = state.simulationData.steps[state.currentStep];
        const infoDiv = document.getElementById('currentStepInfo');
        let actionEmoji = '▶️';
        if (step.action === 'HIT') actionEmoji = '✅';
        if (step.action === 'FAULT') actionEmoji = '❌';
        if (step.action === 'START') actionEmoji = '🚀';
        infoDiv.innerHTML = `
            <h3>${actionEmoji} Step ${state.currentStep} of ${state.simulationData.steps.length - 1}</h3>
            <p>${step.message}</p>
        `;
    }

    function updateAlgorithmInfo() {
        const algorithm = document.getElementById('algorithm').value;
        const infoDiv = document.getElementById('algorithmInfo');
        const descriptions = {
            'FIFO': 'First-In-First-Out (FIFO) maintains a queue of pages in memory and replaces the oldest page when a new page needs to be loaded. Simple but can suffer Belady\'s Anomaly.',
            'LRU': 'Least Recently Used (LRU) replaces the page that has not been used for the longest time. Good practical performance, needs usage tracking.',
            'OPTIMAL': 'Optimal replaces the page that will not be used for the longest time in the future. It is theoretical and used as a benchmark.',
            'CLOCK': 'Clock (Second Chance) uses a reference bit per page and a circular pointer, approximating LRU efficiently.'
        };
        infoDiv.textContent = descriptions[algorithm];
    }

    function buildTimeline(state) {
        if (!state.simulationData) return;
        const timeline = document.getElementById('timeline');
        timeline.innerHTML = '';
        state.simulationData.steps.forEach((s, index) => {
            const stepDiv = document.createElement('div');
            stepDiv.className = 'timeline-step';
            if (s.action === 'HIT') stepDiv.classList.add('hit');
            if (s.action === 'FAULT') stepDiv.classList.add('fault');
            if (index === state.currentStep) stepDiv.classList.add('active');
            stepDiv.innerHTML = `
                <div class="timeline-page">${s.page !== null ? s.page : 'S'}</div>
                <div class="timeline-label">${index === 0 ? 'Start' : index}</div>
            `;
            stepDiv.addEventListener('click', () => {
                state.currentStep = index;
                Animation.drawStep(state, state.currentStep);
                updateStatistics(state);
                updateCurrentStepInfo(state);
                highlightTimelineStep(state, state.currentStep);
            });
            timeline.appendChild(stepDiv);
        });
    }

    function highlightTimelineStep(state, stepIndex) {
        const timelineSteps = document.querySelectorAll('.timeline-step');
        const container = document.getElementById('timeline');
        timelineSteps.forEach((el, idx) => {
            if (idx === stepIndex) el.classList.add('active'); else el.classList.remove('active');
        });
        if (state.allowAutoScroll && timelineSteps[stepIndex] && container) {
            const activeEl = timelineSteps[stepIndex];
            const elLeft = activeEl.offsetLeft;
            const elRight = elLeft + activeEl.offsetWidth;
            const viewLeft = container.scrollLeft;
            const viewRight = viewLeft + container.clientWidth;
            if (elLeft < viewLeft || elRight > viewRight) {
                const targetLeft = elLeft - (container.clientWidth / 2) + (activeEl.offsetWidth / 2);
                container.scrollTo({ left: Math.max(0, targetLeft), behavior: 'auto' });
            }
        }
    }

    function enableControls() {
        document.getElementById('playBtn').disabled = false;
        document.getElementById('stepBackBtn').disabled = false;
        document.getElementById('stepForwardBtn').disabled = false;
        document.getElementById('resetBtn').disabled = false;
        document.getElementById('exportBtn').disabled = false;
    }

    function exportScreenshot(state) {
        if (!state.canvas) return;
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = state.canvas.width;
        exportCanvas.height = state.canvas.height;
        const exportCtx = exportCanvas.getContext('2d');
        exportCtx.fillStyle = 'white';
        exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
        exportCtx.drawImage(state.canvas, 0, 0);
        exportCtx.fillStyle = THEME.text;
        exportCtx.font = '12px Arial';
        exportCtx.fillText(`Algorithm: ${state.simulationData.algorithm} | Step: ${state.currentStep}`, 10, exportCanvas.height - 10);
        exportCtx.fillText(`Generated: ${new Date().toLocaleString()}`, 10, exportCanvas.height - 30);
        const link = document.createElement('a');
        link.download = `page_replacement_${state.simulationData.algorithm}_step${state.currentStep}_${Date.now()}.png`;
        link.href = exportCanvas.toDataURL();
        link.click();
        alert('Screenshot exported successfully!');
    }

    return { attachEventListeners, initializeSimulation, play, pause, stepForward, stepBackward, reset, updateAnimationSpeed, updateStatistics, updateCurrentStepInfo, updateAlgorithmInfo, buildTimeline, highlightTimelineStep, enableControls, exportScreenshot };
})();


