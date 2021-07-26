export async function forEachAsync<A, B>(data: A[], fnc: (a: A, ix: number) => Promise<B>, maxParallel: number = 5): Promise<B[]> {
    let parr = data.length < maxParallel ? data.length : maxParallel;
    let workers: Promise<void>[] = [];
    let back: B[] = [];
    let next = 0;
    for (let i = 0; i < parr; i++) {
        workers.push((async () => {
            while (next < data.length) {
                let ix = next;
                let item = data[ix];
                next++;
                back.push(await fnc(item, ix))
            }
        })());
    };
    await Promise.all(workers);
    return back;
};