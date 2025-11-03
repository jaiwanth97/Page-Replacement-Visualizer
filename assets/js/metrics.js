// Metrics helper for real-time statistics beyond hits/faults
window.Metrics = {
    compute(state) {
        if (!state.simulationData) return {
            totalSteps: 0, completedSteps: 0, remainingSteps: 0,
            avgStepMs: state.animationSpeed || 0, etaMs: 0,
            efficiency: 0
        };
        const totalSteps = state.simulationData.steps.length - 1; // exclude START
        const completedSteps = Math.max(0, Math.min(state.currentStep, totalSteps));
        const remainingSteps = Math.max(0, totalSteps - completedSteps);
        const avgStepMs = state.animationSpeed || 0;
        const etaMs = remainingSteps * avgStepMs;
        const step = state.simulationData.steps[state.currentStep] || { pageHits: 0, pageFaults: 0 };
        const total = (step.pageHits || 0) + (step.pageFaults || 0);
        const efficiency = total > 0 ? (step.pageHits / total) : 0;
        return { totalSteps, completedSteps, remainingSteps, avgStepMs, etaMs, efficiency };
    },
    formatMs(ms) {
        if (ms <= 0) return '0 ms';
        if (ms < 1000) return `${ms} ms`;
        const s = Math.round(ms / 100) / 10;
        return `${s}s`;
    }
};


