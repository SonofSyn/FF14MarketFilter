import axios from "axios";
import { Order, ResponseData, Server } from "../shared/interface";
import { ItemDictionaryENG } from "../resources/itemNamesENG";
import { asyncWriteFile, forEachAsync } from "../shared/tools";
/**
 * Sends and https request for up to 101 given items
 *
 * @param {number[]} itemIDs
 * @param {Server} server
 * @return {*}  {Promise<(ResponseData)[]>}
 */
export let requestItems = async (itemIDs: number[], server: Server): Promise<ResponseData[]> => {
    const response = await axios({
        method: "get",
        url: "https://universalis.app/api/" + server + "/" + itemIDs.join(","),
        responseType: "json",
    });
    return await forEachAsync(response.data.items, async (item: any) => {
        let orders: Order[] = await forEachAsync(
            item.listings,
            async (listing: {
                lastReviewTime: number;
                pricePerUnit: number;
                total: number;
                quantity: number;
                hq: boolean;
                retainerName: string;
            }) => {
                return {
                    lastReviewTime: listing.lastReviewTime,
                    pricePerUnit: listing.pricePerUnit,
                    totalPrice: listing.total,
                    quantity: listing.quantity,
                    hq: listing.hq,
                    retainerName: listing.retainerName,
                };
            }
        );

        let amountNQListings = 0;
        let amountHQListing = 0;
        try {
            amountNQListings = item.stackSizeHistogramNQ["1"];
            amountHQListing = item.stackSizeHistogramHQ["1"];
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
            amountNQListings: amountNQListings,
            amountHQListing: amountHQListing,
            orders: orders,
        };

        return responseItem;
    });
};
