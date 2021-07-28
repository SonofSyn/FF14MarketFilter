import { promisify } from "util";
import fs from "fs";
export const asyncWriteFile = promisify(fs.writeFile);
export const asyncReadFile = promisify(fs.readFile);
export const sleep = promisify(setTimeout);
/**
 * Async ForEach Loop
 *
 * @export
 * @template A
 * @template B
 * @param {A[]} data
 * @param {(a: A, ix: number) => Promise<B>} fnc
 * @param {number} [maxParallel=5]
 * @return {*}  {Promise<B[]>}
 */
export async function forEachAsync<A, B>(
    data: A[],
    fnc: (a: A, ix: number) => Promise<B>,
    maxParallel: number = 5
): Promise<B[]> {
    let parr = data.length < maxParallel ? data.length : maxParallel;
    let workers: Promise<void>[] = [];
    let back: B[] = [];
    let next = 0;
    for (let i = 0; i < parr; i++) {
        workers.push(
            (async () => {
                while (next < data.length) {
                    let ix = next;
                    let item = data[ix];
                    next++;
                    back.push(await fnc(item, ix));
                }
            })()
        );
    }
    await Promise.all(workers);
    return back;
}

/**
 *  Splits all given ids into a certain package size
 *
 * @param {number} packageSize
 * @return {*}
 */
export let splitIntoPackages = async (packageSize: number, ids: number[]): Promise<number[][]> => {
    let allPackages: number[][] = [];
    let tempPackages: number[] = [];
    await forEachAsync(ids, async (item) => {
        if (tempPackages.length === packageSize) {
            allPackages.push(tempPackages);
            tempPackages = [];
        }
        tempPackages.push(item);
    });
    if (tempPackages.length > 0) allPackages.push(tempPackages);
    return allPackages;
};
