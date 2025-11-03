// Page replacement algorithms grouped under window.Algorithms
(function(){
    function simulateFIFO(pages, numFrames) {
        const steps = [];
        const frames = [];
        let queue = [];
        let pageFaults = 0;
        let pageHits = 0;

        steps.push({ page: null, frames: [], action: 'START', message: 'Starting FIFO Algorithm', pageFaults: 0, pageHits: 0, replacedPage: null, isHit: false });

        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            const prevFrames = [...frames];
            let replacedPage = null;
            let isHit = false;

            if (frames.includes(page)) {
                pageHits++;
                isHit = true;
                steps.push({ page, frames: [...frames], prevFrames, action: 'HIT', message: `Page ${page} found in memory (HIT)`, pageFaults, pageHits, replacedPage: null, isHit: true });
            } else {
                pageFaults++;
                if (frames.length < numFrames) {
                    frames.push(page);
                    queue.push(page);
                    steps.push({ page, frames: [...frames], prevFrames, action: 'FAULT', message: `Page ${page} loaded into empty frame ${frames.length - 1} (FAULT)`, pageFaults, pageHits, replacedPage: null, isHit: false });
                } else {
                    replacedPage = queue.shift();
                    const replaceIndex = frames.indexOf(replacedPage);
                    frames[replaceIndex] = page;
                    queue.push(page);
                    steps.push({ page, frames: [...frames], prevFrames, action: 'FAULT', message: `Page ${page} replaces page ${replacedPage} in frame ${replaceIndex} (FAULT)`, pageFaults, pageHits, replacedPage, isHit: false });
                }
            }
        }

        return { steps, totalFaults: pageFaults, totalHits: pageHits, totalReferences: pages.length };
    }

    function simulateLRU(pages, numFrames) {
        const steps = [];
        const frames = [];
        const recentUsage = new Map();
        let pageFaults = 0;
        let pageHits = 0;

        steps.push({ page: null, frames: [], action: 'START', message: 'Starting LRU Algorithm', pageFaults: 0, pageHits: 0, replacedPage: null, isHit: false });

        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            const prevFrames = [...frames];
            let replacedPage = null;

            if (frames.includes(page)) {
                pageHits++;
                recentUsage.set(page, i);
                steps.push({ page, frames: [...frames], prevFrames, action: 'HIT', message: `Page ${page} found in memory (HIT) - Updated usage time`, pageFaults, pageHits, replacedPage: null, isHit: true });
            } else {
                pageFaults++;
                if (frames.length < numFrames) {
                    frames.push(page);
                    recentUsage.set(page, i);
                    steps.push({ page, frames: [...frames], prevFrames, action: 'FAULT', message: `Page ${page} loaded into empty frame ${frames.length - 1} (FAULT)`, pageFaults, pageHits, replacedPage: null, isHit: false });
                } else {
                    let lruPage = frames[0];
                    let lruTime = recentUsage.get(lruPage);
                    for (const frame of frames) {
                        const time = recentUsage.get(frame);
                        if (time < lruTime) { lruTime = time; lruPage = frame; }
                    }
                    replacedPage = lruPage;
                    const replaceIndex = frames.indexOf(lruPage);
                    frames[replaceIndex] = page;
                    recentUsage.set(page, i);
                    steps.push({ page, frames: [...frames], prevFrames, action: 'FAULT', message: `Page ${page} replaces LRU page ${replacedPage} in frame ${replaceIndex} (FAULT)`, pageFaults, pageHits, replacedPage, isHit: false });
                }
            }
        }

        return { steps, totalFaults: pageFaults, totalHits: pageHits, totalReferences: pages.length };
    }

    function simulateOptimal(pages, numFrames) {
        const steps = [];
        const frames = [];
        let pageFaults = 0;
        let pageHits = 0;

        steps.push({ page: null, frames: [], action: 'START', message: 'Starting Optimal Algorithm', pageFaults: 0, pageHits: 0, replacedPage: null, isHit: false });

        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            const prevFrames = [...frames];
            let replacedPage = null;

            if (frames.includes(page)) {
                pageHits++;
                steps.push({ page, frames: [...frames], prevFrames, action: 'HIT', message: `Page ${page} found in memory (HIT)`, pageFaults, pageHits, replacedPage: null, isHit: true });
            } else {
                pageFaults++;
                if (frames.length < numFrames) {
                    frames.push(page);
                    steps.push({ page, frames: [...frames], prevFrames, action: 'FAULT', message: `Page ${page} loaded into empty frame ${frames.length - 1} (FAULT)`, pageFaults, pageHits, replacedPage: null, isHit: false });
                } else {
                    let farthestIndex = -1;
                    let pageToReplace = frames[0];
                    for (const frame of frames) {
                        let nextUse = pages.length;
                        for (let j = i + 1; j < pages.length; j++) {
                            if (pages[j] === frame) { nextUse = j; break; }
                        }
                        if (nextUse > farthestIndex) { farthestIndex = nextUse; pageToReplace = frame; }
                    }
                    replacedPage = pageToReplace;
                    const replaceIndex = frames.indexOf(pageToReplace);
                    frames[replaceIndex] = page;
                    steps.push({ page, frames: [...frames], prevFrames, action: 'FAULT', message: `Page ${page} replaces optimal page ${replacedPage} in frame ${replaceIndex} (FAULT)`, pageFaults, pageHits, replacedPage, isHit: false });
                }
            }
        }

        return { steps, totalFaults: pageFaults, totalHits: pageHits, totalReferences: pages.length };
    }

    function simulateClock(pages, numFrames) {
        const steps = [];
        const frames = [];
        const referenceBits = [];
        let pointer = 0;
        let pageFaults = 0;
        let pageHits = 0;

        steps.push({ page: null, frames: [], action: 'START', message: 'Starting Clock (Second Chance) Algorithm', pageFaults: 0, pageHits: 0, replacedPage: null, isHit: false });

        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            const prevFrames = [...frames];
            let replacedPage = null;

            const pageIndex = frames.indexOf(page);
            if (pageIndex !== -1) {
                pageHits++;
                referenceBits[pageIndex] = 1;
                steps.push({ page, frames: [...frames], prevFrames, action: 'HIT', message: `Page ${page} found in memory (HIT) - Reference bit set to 1`, pageFaults, pageHits, replacedPage: null, isHit: true });
            } else {
                pageFaults++;
                if (frames.length < numFrames) {
                    frames.push(page);
                    referenceBits.push(1);
                    steps.push({ page, frames: [...frames], prevFrames, action: 'FAULT', message: `Page ${page} loaded into empty frame ${frames.length - 1} (FAULT)`, pageFaults, pageHits, replacedPage: null, isHit: false });
                } else {
                    while (true) {
                        if (referenceBits[pointer] === 0) {
                            replacedPage = frames[pointer];
                            frames[pointer] = page;
                            referenceBits[pointer] = 1;
                            const replaceIndex = pointer;
                            pointer = (pointer + 1) % numFrames;
                            steps.push({ page, frames: [...frames], prevFrames, action: 'FAULT', message: `Page ${page} replaces page ${replacedPage} (ref bit=0) in frame ${replaceIndex} (FAULT)`, pageFaults, pageHits, replacedPage, isHit: false });
                            break;
                        } else {
                            referenceBits[pointer] = 0;
                            pointer = (pointer + 1) % numFrames;
                        }
                    }
                }
            }
        }

        return { steps, totalFaults: pageFaults, totalHits: pageHits, totalReferences: pages.length };
    }

    window.Algorithms = { simulateFIFO, simulateLRU, simulateOptimal, simulateClock };
})();


