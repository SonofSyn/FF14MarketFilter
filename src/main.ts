import axios from "axios";
import fs from "fs";
import { ItemNames } from "./itemNames";
import { MarketableItems } from "./marketableItem";
import { forEachAsync } from "./tools";
import { promisify } from 'util'
const sleep = promisify(setTimeout)

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

let requestItem = async (itemIDs: number[], minPriceLimit: number) => {
    const response = await axios({
        method: "get",
        url: "https://universalis.app/api/Shiva/" + itemIDs.join(","),
        responseType: "json",
    });
    return (await forEachAsync(response.data.items, async (item: any) => {
        if (minPriceLimit !== 0) {
            if (item.minPriceHQ !== undefined) {
                if (item.minPriceHQ <= minPriceLimit)
                    return undefined;
            }

        }
        let responseItem: ResponseData | undefined = undefined
        try {
            responseItem = {
                id: item.itemID,
                datum: (new Date(item.lastUploadTime)).toString(),
                name: ItemNames[item.itemID.toString()],
                minPriceNQ: item.minPriceNQ,
                maxPriceNQ: item.maxPriceNQ,
                minPriceHQ: item.minPriceHQ,
                maxPriceHQ: item.maxPriceHQ,
                amountNQListings: item.stackSizeHistogramNQ["1"],
                amountHQListing: item.stackSizeHistogramHQ["1"],
                // Listings: listing
            };
        } catch (e) { }
        return responseItem;
    })).filter(item => item !== undefined);
};

let requestMarketableItems = async (minPriceLimit: number = 0, timeout: number = 6000, parallelAmount: number = 2) => {
    let back: any[] = []
    let packages = await splitMarketableItems(101)
    console.log(packages.length)
    let totalAmount = 0
    await forEachAsync(packages, async (itemPackage, ix) => {
        await sleep(timeout)
        console.log("Run " + ix)
        let data = await requestItem(itemPackage, minPriceLimit)
        if (data !== undefined) {
            totalAmount = totalAmount + data.length
            back.push(data)
        }
    }, parallelAmount)
    console.log(totalAmount)
    fs.writeFile("./data/response.json", JSON.stringify(back), () => { });
};


let splitMarketableItems = async (packLength: number) => {
    let back: number[][] = []
    let temp: number[] = []
    await forEachAsync(MarketableItems, async (item) => {
        if (temp.length === packLength) {
            back.push(temp)
            temp = []
        }
        temp.push(item)
    })
    if (temp.length > 0) back.push(temp)
    return back
}


(async () => {
    await requestMarketableItems(80000);
    // console.log(new Date(1626610282649))
})();