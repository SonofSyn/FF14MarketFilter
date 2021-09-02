import { requestItemImageXIVapi, requestItemsUniversalis, requestItemXIVapi } from "./client";
import { ItemExtrasDictionary, ResponseData, Server } from "../shared/interface";
import { splitIntoPackages, forEachAsync, sleep, asyncWriteFile } from "../shared/tools";
import { requestItemNameXIVapi } from "../requests/client";
import { ItemDictionary } from "../shared/interface";

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
    parallelRequestAmount: number = 1,
    maxPackageSize: number = 101
): Promise<ResponseData[][]> => {
    let itemData: ResponseData[][] = [];
    // 101 is the max package size which can be requested by http request
    let idPackages = await splitIntoPackages(maxPackageSize, ids);
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
                await asyncWriteFile("./export/test123.json", JSON.stringify(itemData), { flag: "a" });
                itemData.push(data);
            }
        },
        parallelRequestAmount
    );
    console.log(totalAmount);
    return itemData;
};

/**
 * Collect all german Itemnames for given itemids
 *
 * @param {number[]} itemIDs
 * @param {number} timeout
 * @param {number} [parallelRequestAmount=3]
 * @return {*}  {Promise<ItemDictionary>}
 */
export let collectItemNamesDE = async (
    itemIDs: number[],
    timeout: number,
    writePath: string = "./export/error/itemNamesDE1.json",
    parallelRequestAmount: number = 3
): Promise<ItemDictionary> => {
    let back: ItemDictionary = {};
    console.log(itemIDs.length);
    await forEachAsync(
        itemIDs,
        async (id, ix) => {
            console.log("Run " + ix);
            await sleep(timeout);
            try {
                let translation = await requestItemNameXIVapi(id);
                back[translation.id + ""] = translation.name;
            } catch (e) {
                console.log("Error");
                await asyncWriteFile(writePath, JSON.stringify(back));
            }
        },
        parallelRequestAmount
    );
    return back;
};

/**
 * Collect all german Itemnames for given itemids
 *
 * @param {number[]} itemIDs
 * @param {number} timeout
 * @param {number} [parallelRequestAmount=3]
 * @return {*}  {Promise<ItemDictionary>}
 */
export let collectItemExtras = async (
    itemIDs: number[],
    timeout: number,
    parallelRequestAmount: number = 3,
    writePath: string = "./export/error/itemExtras.json"
): Promise<ItemExtrasDictionary> => {
    let back: ItemExtrasDictionary = {};
    await forEachAsync(
        itemIDs,
        async (id, ix) => {
            console.log("Run " + ix);
            await sleep(timeout);
            try {
                let items = await requestItemXIVapi(id);
                back[items.id + ""] = {
                    name: items.name,
                    icon: items.icon,
                    level: items.level,
                    crafter: items.crafter,
                };
            } catch (e) {
                console.log("Error");
                await asyncWriteFile(writePath, JSON.stringify(back));
            }
        },
        parallelRequestAmount
    );
    return back;
};

export let collectItemImages = async (
    imgPath: { path: string; name: string }[],
    timeout: number,
    parallelRequestAmount: number = 3
): Promise<void> => {
    await forEachAsync(
        imgPath,
        async (data, ix) => {
            console.log("Run " + ix);
            await sleep(timeout);
            try {
                let item = await requestItemImageXIVapi(data.path);
                await asyncWriteFile("./export/images/" + data.name + ".png", item);
            } catch (e) {
                console.log("Error");
            }
        },
        parallelRequestAmount
    );
};
