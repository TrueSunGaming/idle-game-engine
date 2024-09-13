export function setDeltaInterval(fn: (delta: number) => void, milliseconds: number): number {
    let last: number = Date.now();
    
    return setInterval(() => {
        const delta: number = (Date.now() - last) / 1000;
        last = Date.now();

        fn(delta);
    }, milliseconds);
}