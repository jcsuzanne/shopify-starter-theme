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
        let idx;

        for (let i = 0; i < fns.length; i++) {
            if (fns[i].index === index) {
                idx = i;
                break;
            }
        }

        fns.splice(idx, 1);

        if (fns.length === 0) {
            cancelAnimationFrame(_raf);
        }
    };
}

export function cancelRAF() {
    cancelAnimationFrame(_raf);
}