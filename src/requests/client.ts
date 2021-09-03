import axios from "axios";
import { ItemExtrasDictionary, Order, ResponseData, Server } from "../shared/interface";
import { ItemDictionaryGER } from "../resources/itemNamesGER";
import { asyncReadFile, asyncWriteFile, forEachAsync } from "../shared/tools";
import { extraData } from "../resources/extraItems";
/** universalis
 * Sends and https request for up to 101 given items
 *
 * @param {number[]} itemIDs
 * @param {Server} server
 * @return {*}  {Promise<(ResponseData)[]>}
 */
export let requestItemsUniversalis = async (
    itemIDs: number[],
    server: Server,
): Promise<ResponseData[]> => {
    const response = await axios({
        method: "get",
        url: "https://universalis.app/api/" + server + "/" + itemIDs.join(","),
        responseType: "json",
    });
    // await asyncWriteFile("./export/answer.json", JSON.stringify(response.data));
    return await forEachAsync(response.data.items, async (item: any) => {
        let orders: Order[] = await forEachAsync(item.listings, async (order: Order) => {
            return {
                lastReviewTime: new Date(order.lastReviewTime).toString(),
                pricePerUnit: order.pricePerUnit,
                total: order.total,
                quantity: order.quantity,
                hq: order.hq,
                retainerName: order.retainerName,
            };
        });

        let amountNQOrders = 0;
        let amountHQOrders = 0;
        try {
            amountNQOrders = item.stackSizeHistogramNQ["1"];
            amountHQOrders = item.stackSizeHistogramHQ["1"];
        } catch (e) {
            console.log("Error while trying to read the Stacksize");
        }

        let responseItem = {
            id: item.itemID,
            date: new Date(item.lastUploadTime).toString(),
            name: ItemDictionaryGER[item.itemID.toString()],
            minPriceNQ: item.minPriceNQ,
            maxPriceNQ: item.maxPriceNQ,
            minPriceHQ: item.minPriceHQ,
            maxPriceHQ: item.maxPriceHQ,
            amountNQListings: amountNQOrders,
            amountHQListing: amountHQOrders,
            orders: orders,
            itemLevel: extraData[item.itemID].level,
            crafter: extraData[item.itemID].crafter,
        };

        return responseItem;
    });
};

/** xiv
 * Sends and https request for german name of given id
 *
 * @param {number[]} itemIDs
 * @param {Server} server
 * @return {*}  {Promise<(ResponseData)[]>}
 */
export let requestItemNameXIVapi = async (itemID: number): Promise<{ name: string; id: number }> => {
    const response = await axios({
        method: "get",
        url: "https://xivapi.com/item/" + itemID,
        responseType: "json",
    });
    // await asyncWriteFile("./export/answerxiv.json", JSON.stringify(response.data));
    return { name: response.data.Name_de, id: itemID };
};

/** xiv
 * Sends and https request for german name of given id
 *
 * @param {number[]} itemIDs
 * @param {Server} server
 * @return {*}  {Promise<(ResponseData)[]>}
 */
export let requestItemXIVapi = async (
    itemID: number
): Promise<{ id: number; name: string; icon: string; level: number; crafter: string }> => {
    const response = await axios({
        method: "get",
        url: "https://xivapi.com/item/" + itemID,
        responseType: "json",
    });
    // await asyncWriteFile("./export/answerxiv.json", JSON.stringify(response.data));
    let crafter = "";
    try {
        crafter = response.data.ClassJobRepair.Name;
    } catch (e) {
        console.log("Error No Repair");
    }
    return {
        id: itemID,
        name: response.data.Name_de,
        icon: response.data.IconHD,
        level: response.data.LevelItem,
        crafter: crafter,
    };
};

export let requestItemImageXIVapi = async (link: string) => {
    const response = await axios({
        method: "get",
        url: "https://xivapi.com" + link,
        responseType: "arraybuffer",
    });
    return Buffer.from(response.data, "base64");
};
