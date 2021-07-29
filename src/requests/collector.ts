import { requestItemsUniversalis } from "./client";
import { ResponseData, Server } from "../shared/interface";
import { splitIntoPackages, forEachAsync, sleep } from "../shared/tools";
/**
 * Requests all item data from server by sending multiple small request of 101 ids (max allowed) with a certain timeout between each request
 *
 * @param {Server} server
 * @param {number[]} ids
 * @param {number} [timeout=3000]
 * @param {number} [parallelRequestAmount=1]
 * @return {*}
 */
export let collectItemData = async (
    server: Server,
    ids: number[],
    timeout: number = 3000,
    parallelRequestAmount: number = 1
): Promise<ResponseData[][]> => {
    let itemData: ResponseData[][] = [];
    // 101 is the max package size which can be requested by http request
    let idPackages = await splitIntoPackages(101, ids);
    console.log(idPackages.length);
    let totalAmount = 0;
    await forEachAsync(
        idPackages,
        async (ids, ix) => {
            await sleep(timeout);
            console.log("Run " + ix);
            let items = await requestItemsUniversalis(ids, server);
            if (items !== undefined) {
                totalAmount = totalAmount + items.length;
                let data: ResponseData[] = [];
                items.forEach((item) => {
                    if (item !== undefined) {
                        data.push(item);
                        // console.log(item);
                    }
                });
                itemData.push(data);
            }
        },
        parallelRequestAmount
    );
    console.log(totalAmount);
    return itemData;
};

// /**
//  * Requests all item data from server by sending multiple small request of 101 ids (max allowed) with a certain timeout between each request
//  *
//  * @param {Server} server
//  * @param {number[]} ids
//  * @param {number} [timeout=3000]
//  * @param {number} [parallelRequestAmount=1]
//  * @return {*}
//  */
//  export let collectItemNameData = async (
//     server: Server,
//     ids: number[],
//     timeout: number = 3000,
//     parallelRequestAmount: number = 1
// ): Promise<ResponseData[][]> => {
//     let itemData: ResponseData[][] = [];
//     // 101 is the max package size which can be requested by http request
//     let idPackages = await splitIntoPackages(101, ids);
//     console.log(idPackages.length);
//     let totalAmount = 0;
//     await forEachAsync(
//         idPackages,
//         async (ids, ix) => {
//             await sleep(timeout);
//             console.log("Run " + ix);
//             let items = await requestItemsUniversalis(ids, server);
//             if (items !== undefined) {
//                 totalAmount = totalAmount + items.length;
//                 let data: ResponseData[] = [];
//                 items.forEach((item) => {
//                     if (item !== undefined) {
//                         data.push(item);
//                         // console.log(item);
//                     }
//                 });
//                 itemData.push(data);
//             }
//         },
//         parallelRequestAmount
//     );
//     console.log(totalAmount);
//     return itemData;
// };
