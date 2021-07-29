import axios from "axios";
import { Order, ResponseData, Server } from "../shared/interface";
import { ItemDictionaryENG } from "../resources/itemNamesENG";
import { asyncWriteFile, forEachAsync } from "../shared/tools";
/** universalis
 * Sends and https request for up to 101 given items
 *
 * @param {number[]} itemIDs
 * @param {Server} server
 * @return {*}  {Promise<(ResponseData)[]>}
 */
export let requestItemsUniversalis = async (itemIDs: number[], server: Server): Promise<ResponseData[]> => {
    const response = await axios({
        method: "get",
        url: "https://universalis.app/api/" + server + "/" + itemIDs.join(","),
        responseType: "json",
    });
    // await asyncWriteFile("./export/answer.json", JSON.stringify(response.data));
    return await forEachAsync(response.data.items, async (item: any) => {
        let orders: Order[] = await forEachAsync(item.listings, async (order: Order) => {
            return {
                lastReviewTime: order.lastReviewTime,
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
            throw new Error("Error while trying to read the ");
        }

        let responseItem = {
            id: item.itemID,
            date: new Date(item.lastUploadTime).toString(),
            name: ItemDictionaryENG[item.itemID.toString()],
            minPriceNQ: item.minPriceNQ,
            maxPriceNQ: item.maxPriceNQ,
            minPriceHQ: item.minPriceHQ,
            maxPriceHQ: item.maxPriceHQ,
            amountNQListings: amountNQOrders,
            amountHQListing: amountHQOrders,
            orders: orders,
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
