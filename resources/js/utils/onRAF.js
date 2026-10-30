// Utils from @raphaelameaume

let _raf;
let fns = [];
let COUNT = 0;

let time, deltaTime, lastTime, excessTime;
let fps = 30;
let msPerFrame = 1000 / fps;
let frames = 0;

function loop() {
    _raf = requestAnimationFrame(loop);

    time = performance.now();
    deltaTime = time - lastTime;

	if(deltaTime < msPerFrame) return;

	excessTime = deltaTime % msPerFrame;
    lastTime = time - excessTime;

    for (let i = 0; i < fns.length; i++) {
        fns[i].fn({ time, deltaTime });
    }

	frames++;
}

export function onRAF(fn, { fire = false } = {}) {
    if (fire) {
        fn();
    }

    if (fns.length === 0) {
        time = performance.now();
        lastTime = time;
        deltaTime = 0;

        loop();
    }

    let index = COUNT++;
    fns.push({ index, fn });
	
    return () => {
        const idx = fns.findIndex((item) => item.index === index);

        // Already removed: splice(-1, 1) would drop the last callback instead
        if (idx === -1) return;

        fns.splice(idx, 1);

        if (fns.length === 0) {
            cancelAnimationFrame(_raf);
        }
    };
}

export function cancelRAF() {
    cancelAnimationFrame(_raf);
}