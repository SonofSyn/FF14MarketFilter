import axios from "axios";
import fs from "fs";
import { ItemDictionary } from "./resources/itemNames";
import { MarketableItemIDs } from "./resources/marketableItemIDs";
import { forEachAsync } from "./tools";
import { promisify } from "util";
const asyncWriteFile = promisify(fs.writeFile);
const sleep = promisify(setTimeout);

interface Listing {
    lastReviewTime: number;
    pricePerUnit: number;
    totalPrice: number;
    quantity: number;
    hq: boolean;
    retainerName: string;
}

interface ResponseData {
    id: string;
    datum: string;
    name: string;
    minPriceNQ: number;
    maxPriceNQ: number;
    minPriceHQ: number;
    maxPriceHQ: number;
    amountNQListings: number;
    amountHQListing: number;
    // Listings: Listing[]
}

let requestItems = async (itemIDs: number[], priceMinimum: number, server: string = "Shiva") => {
    const response = await axios({
        method: "get",
        url: "https://universalis.app/api/" + server + "/" + itemIDs.join(","),
        responseType: "json",
    });
    return (
        await forEachAsync(response.data.items, async (item: any) => {
            if (priceMinimum !== 0) {
                if (item.minPriceHQ !== undefined) {
                    if (item.minPriceHQ <= priceMinimum) return undefined;
                }
            }
            let responseItem: ResponseData | undefined = undefined;
            try {
                responseItem = {
                    id: item.itemID,
                    datum: new Date(item.lastUploadTime).toString(),
                    name: ItemDictionary[item.itemID.toString()],
                    minPriceNQ: item.minPriceNQ,
                    maxPriceNQ: item.maxPriceNQ,
                    minPriceHQ: item.minPriceHQ,
                    maxPriceHQ: item.maxPriceHQ,
                    amountNQListings: item.stackSizeHistogramNQ["1"],
                    amountHQListing: item.stackSizeHistogramHQ["1"],
                    // Listings: listing
                };
            } catch (e) {
                throw new Error("Error while loading Data");
            }
            return responseItem;
        })
    ).filter((item) => item !== undefined);
};

let collectMarketData = async (priceMinimum: number = 0, timeout: number = 3000, parallelRequestAmount: number = 1) => {
    let marketItemData: any[] = [];
    let idFragments = await splitIntoFragments(101);
    console.log(idFragments.length);
    let totalAmount = 0;
    await forEachAsync(
        idFragments,
        async (ids, ix) => {
            await sleep(timeout);
            console.log("Run " + ix);
            let items = await requestItems(ids, priceMinimum);
            if (items !== undefined) {
                totalAmount = totalAmount + items.length;
                marketItemData.push(items);
            }
        },
        parallelRequestAmount
    );
    console.log(totalAmount);
    await asyncWriteFile("./data/response.json", JSON.stringify(marketItemData));
};

let splitIntoFragments = async (fragmentSize: number) => {
    let allFragments: number[][] = [];
    let tempFragments: number[] = [];
    await forEachAsync(MarketableItemIDs, async (item) => {
        if (tempFragments.length === fragmentSize) {
            allFragments.push(tempFragments);
            tempFragments = [];
        }
        tempFragments.push(item);
    });
    if (tempFragments.length > 0) allFragments.push(tempFragments);
    return allFragments;
};

(async () => {
    await collectMarketData(80000);
    // console.log(new Date(1626610282649))
})();
